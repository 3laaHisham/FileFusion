package net.atos.WorkspaceService.service;

import jakarta.ws.rs.BadRequestException;
import lombok.AllArgsConstructor;
import net.atos.WorkspaceService.dto.*;
import net.atos.WorkspaceService.enums.FileType;
import net.atos.WorkspaceService.exceptions.FileNameExistsException;
import net.atos.WorkspaceService.exceptions.ParentNotExistException;
import net.atos.WorkspaceService.model.File;
import net.atos.WorkspaceService.model.DeletedFile;
import net.atos.WorkspaceService.repository.FileRepository;
import net.atos.WorkspaceService.repository.StorageServiceClient;
import net.atos.WorkspaceService.repository.UserServiceClient;
import net.atos.WorkspaceService.repository.DeletedFileRepository;
import org.bson.types.ObjectId;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class WorkspaceService {

    private FileRepository fileRepository;
    private DeletedFileRepository deletedFileRepository;
    private StorageServiceClient storageServiceClient;
    private UserServiceClient userServiceClient;

    private File getFileById(String id, String userNationalId, boolean isReadAction) {
        File file = fileRepository.findById(id).orElseThrow();

        if (isNotAuthorized(file, userNationalId, isReadAction) && userNationalId != null) // User is logged in but no access
            throw new AccessDeniedException("You are not authorized to access this file");
        if (isNotAuthorized(file, userNationalId, isReadAction) && userNationalId == null) // user is not logged in and no access
            throw new AuthenticationCredentialsNotFoundException("You need to be logged in to access this file");

        return file;
    }

    private boolean isNotAuthorized(File file, String userNationalId, boolean isReadAction) {
        return !file.getOwnerNationalId().equals(userNationalId) &&
                (!isReadAction || (!file.getIsPublic() && !file.getAllowedUsers().contains(userNationalId)));
    }


    public File createWorkspace(String name, String userNationalId) {
        File workspace = File.builder()
                .name(name)
                .ownerNationalId(userNationalId)
                .type(FileType.Folder)
                .path("~")
                .pathNames("~")
                .parentFileId("~")
                .build();

        return fileRepository.save(workspace);
    }

    public File createDirectory(String parentId, String name, String userNationalId) {
        File workspace = this.getFileById(parentId, userNationalId, false);
        if (workspace.getType() != FileType.Folder)
            throw new BadRequestException("You can only create directories in workspaces");

        File newWorkspace = File.builder()
                .name(name)
                .ownerNationalId(workspace.getOwnerNationalId())
                .path(workspace.getPath() + "/" + parentId)
                .pathNames(workspace.getPathNames() + "/" + workspace.getName())
                .type(FileType.Folder)
                .parentFileId(parentId)
                .build();
        return fileRepository.save(newWorkspace);
    }

    public GetFolderDto getWorkspaces(String userNationalId, SearchParamsDTO searchParamsDTO) {
        Slice<File> files = this.search(userNationalId, "~", searchParamsDTO);

        return GetFolderDto.builder()
                .name("My Workspaces")
                .path("~")
                .pathNames("~")
                .files(files.getContent())
                .hasNext(files.hasNext())
                .isOwner(true)
                .build();
    }

    public GetFolderDto getDirectoryContent(String parentFileId, String userNationalId, SearchParamsDTO searchParamsDTO) {
        File file = this.getFileById(parentFileId, userNationalId, true);
        if (file.getType() != FileType.Folder)
            throw new BadRequestException("You can only get content of directories");

        Slice<File> files = this.search(null, parentFileId, searchParamsDTO);

        return GetFolderDto.builder()
                .name(file.getName())
                .path(file.getPath())
                .pathNames(file.getPathNames())
                .files(files.getContent())
                .hasNext(files.hasNext())
                .isOwner(file.getOwnerNationalId().equals(userNationalId))
                .build();
    }

    public Slice<File> search(String userNationalId, String parentFileId, SearchParamsDTO searchParamsDTO) {
        File probe = File.builder()
                .parentFileId(parentFileId)
                .ownerNationalId(userNationalId)
                .name(searchParamsDTO.getQ())
                .type(searchParamsDTO.getFileType())
                .isStarred(searchParamsDTO.getIsStarred())
                .build();

        Example<File> example = createExample(probe);
        Pageable pageable = PageRequest.of(searchParamsDTO.getPage(), searchParamsDTO.getSize() == 0 ? 5 : searchParamsDTO.getSize());

        Slice<File> fileSlice = fileRepository.findAllNoCount(example, pageable);

        fileSlice = filterByDate(fileSlice, pageable, searchParamsDTO.getStartDate(), searchParamsDTO.getEndDate());

        return fileSlice;
    }

    private Example<File> createExample(File probe) {
        return Example.of(probe, ExampleMatcher.matching()
                .withIgnoreNullValues()

                .withMatcher("parentFileId", ExampleMatcher.GenericPropertyMatcher::exact)
                .withMatcher("ownerNationalId", ExampleMatcher.GenericPropertyMatcher::exact)
                .withMatcher("name", ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.CONTAINING).ignoreCase())
                .withMatcher("type", ExampleMatcher.GenericPropertyMatcher::exact)
                .withMatcher("isStarred", ExampleMatcher.GenericPropertyMatcher::exact)

                .withIgnorePaths("extension", "path", "pathNames", "url", "uploadDate", "isPublic",
                        "allowedUsers", "allowedUsersEmails", "tags", "size"));
    }

    private Slice<File> filterByDate(Slice<File> files, Pageable pageable, Date startDate, Date endDate) {
        if (startDate == null && endDate == null)
            return files;

        List<File> filterFile = files.getContent().stream().filter(file -> {
            boolean isAfterStartDate = startDate == null || file.getUploadDate().after(startDate);
            boolean isBeforeEndDate = endDate == null || file.getUploadDate().before(endDate);
            return isAfterStartDate && isBeforeEndDate;
        }).toList();

        return new SliceImpl<>(filterFile, pageable, files.hasNext());
    }

    public List<DeletedFile> getTrash(String userNationalId) {
        return deletedFileRepository.findByOwnerNationalIdAndDeletedDirectly(userNationalId);
    }

    public Boolean isOwner(String id, String userNationalId) {
        try {
            this.getFileById(id, userNationalId, false);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void updateTags(String id, List<String> tags, String userNationalId) {
        File file = this.getFileById(id, userNationalId, false);

        file.setTags(tags);
        fileRepository.save(file);
    }

    public void updateStar(String id, Boolean isStarred, String userNationalId) {
        File file = this.getFileById(id, userNationalId, false);

        file.setIsStarred(isStarred);
        fileRepository.save(file);
    }

    public void move(String id, String newParentFileId, String userNationalId) {
        File file = this.getFileById(id, userNationalId, false);
        File newParent = this.getFileById(newParentFileId, userNationalId, false);

        if (newParent.getType() != FileType.Folder)
            throw new BadRequestException("You can only move directories to directories");

        file.setParentFileId(newParentFileId);
        file.setPath(newParent.getPath() + "/" + newParentFileId);
        file.setPathNames(newParent.getPathNames() + "/" + newParent.getName());

        fileRepository.save(file);
    }

    @Transactional
    public void changeName(String id, String name, String userNationalId) {
        File file = this.getFileById(id, userNationalId, false);

        file.setName(name);
        fileRepository.save(file);

        if (file.getType() == FileType.Folder)
            changePathWithChildren(List.of(file));
    }

    @Transactional
    void changePathWithChildren(List<File> parentFiles) {
        List<String> parentFileIds = parentFiles.stream().map(File::getId).toList();
        List<File> children = fileRepository.findFilesByParentFileIdIn(parentFileIds);

        if (children.isEmpty()) // Break recursion condition. Happens when all the parents are documents
            return;

        for (File file : children) {
            File parentFile = parentFiles.stream()
                    .filter(f -> f.getId().equals(file.getParentFileId())).findAny().get();
            String pathNames = parentFile.getPathNames();
            String parentPath = pathNames.equals("~") ? "~" : pathNames.substring(0, pathNames.lastIndexOf("/"));

            String newPath = parentPath + "/" + parentFile.getName();
            file.setPathNames(newPath);
        }
        fileRepository.saveAll(children);

        changePathWithChildren(children);
    }

    // TODO: USE MongoTemplate to findAndModify in one Query resulting in half the queries
    @Transactional
    public void share(String id, UpdateAclDto updateAclDto, String userNationalId) {
        File file = this.getFileById(id, userNationalId, false);

        List<String> allowedUsersEmails = updateAclDto.getAllowedUsers();
        List<String> allowedUsersNationalIds = userServiceClient.getNationalIdsByEmail(allowedUsersEmails).getBody();

        boolean isPublic = updateAclDto.isPublic();

        if (file.getType() == FileType.Folder)
            shareWithChildren(List.of(file.getId()), isPublic, allowedUsersNationalIds, allowedUsersEmails);
        else {  // Unnecessary but good for performance, as I will avoid finding children query
            file.setAllowedUsersEmails(allowedUsersEmails);
            file.setAllowedUsers(allowedUsersNationalIds);
            file.setIsPublic(isPublic);

            fileRepository.save(file);
        }
    }

    @Transactional
    void shareWithChildren(List<String> parentFileIds, boolean isPublic, List<String> allowedUsers, List<String> allowedUsersEmails) {
        fileRepository.findAndUpdateIsPublicAndAllowedUsersByIdIn(parentFileIds, isPublic, allowedUsers, allowedUsersEmails);

        List<File> children = fileRepository.findFilesByParentFileIdIn(parentFileIds);
        if (children.isEmpty()) // Break recursion condition. Happens when all the parents are documents
            return;

        List<String> childrenIds = children.stream().map(File::getId).toList();
        shareWithChildren(childrenIds, isPublic, allowedUsers, allowedUsersEmails);
    }

    @Transactional
    public void deleteFile(String id, String userNationalId) {
        File file = this.getFileById(id, userNationalId, false);

        deleteWithChildren(List.of(file), true);
    }

    @Transactional
    void deleteWithChildren(List<File> parentFiles, boolean isDeletedDirectly) {
        List<DeletedFile> deletedParentFiles = parentFiles.stream()
                .map(f -> DeletedFile
                        .builder()
                        .file(f)
                        .isDeletedDirectly(isDeletedDirectly)
                        .deletedAt(new Date())
                        .build())
                .toList();

        fileRepository.deleteAll(parentFiles);
        deletedFileRepository.saveAll(deletedParentFiles);

        List<String> parentFileIds = parentFiles.stream().map(File::getId).toList();
        List<File> children = fileRepository.findFilesByParentFileIdIn(parentFileIds);

        if (children.isEmpty()) // Break recursion condition. Happens when all the parents are documents
            return;

        deleteWithChildren(children, false);
    }

    @Transactional
    public void deleteFilePermanent(String id, String userNationalId) {
        DeletedFile deletedFile = deletedFileRepository.findById(id).orElseThrow();

        if (isNotAuthorized(deletedFile.getFile(), userNationalId, false))
            throw new AccessDeniedException("You are not authorized to access this file");

        if (deletedFile.getFile().getType() == FileType.Folder)
            deletePermanentWithChildren(List.of(deletedFile));
        else  // Unnecessary but good for performance, as I will avoid finding children query
            deletedFileRepository.delete(deletedFile);
    }

    @Transactional
    protected void deletePermanentWithChildren(List<DeletedFile> parentFiles) {
        List<String> parentFileIds = parentFiles.stream().map(f -> f.getFile().getId()).toList();
        List<DeletedFile> children = deletedFileRepository.findByParentFileIdIn(parentFileIds);

        deletedFileRepository.deleteAll(parentFiles);

        if (children.isEmpty()) // Break recursion condition. Happens when all the parents are documents
            return;

        deletePermanentWithChildren(children);
    }

    @Transactional
    public void restoreFile(String id, String userNationalId) throws ParentNotExistException, FileNameExistsException {
        DeletedFile deletedFile = deletedFileRepository.findById(id).orElseThrow();

        if (!fileRepository.existsById(deletedFile.getFile().getParentFileId()))
            throw new ParentNotExistException("Parent directory does not exist");
        if (isNotAuthorized(deletedFile.getFile(), userNationalId, false))
            throw new AccessDeniedException("You are not authorized to access this file");

        restoreWithChildren(List.of(deletedFile));
    }

    @Transactional
    void restoreWithChildren(List<DeletedFile> parentFiles) throws ParentNotExistException, FileNameExistsException {
        List<String> parentFileIds = parentFiles.stream().map(f -> f.getFile().getId()).toList();
        List<DeletedFile> children = deletedFileRepository.findByParentFileIdIn(parentFileIds);

        List<File> files = parentFiles.stream().map(DeletedFile::getFile).toList();

        fileRepository.saveAll(files);
        deletedFileRepository.deleteAll(parentFiles);

        if (children.isEmpty()) // Break recursion condition. Happens when all the parents are documents
            return;

        restoreWithChildren(children);
    }

    public DownloadDto download(String id, String userNationalId) {
        File file = this.getFileById(id, userNationalId, true);
        if (file.getType() == FileType.Folder)
            throw new BadRequestException("You can only download documents");

        String url = storageServiceClient.downloadFile(id).getBody();

        return DownloadDto.builder()
                .name(file.getName())
                .extension(file.getExtension())
                .url(url)
                .build();
    }

    public ResponseEntity<GetPutUrlDto> getSignedPutUrl() {
        String id = ObjectId.get().toString();
        KeyDto keyDto = KeyDto.builder()
                .objectKey(id)
                .build();

        return storageServiceClient.getSignedPutUrl(keyDto);
    }

    public File createDocument(String workspaceId, CreateDocumentDTO createDocumentDTO, String userNationalId) {
        File parentWorkspace = this.getFileById(workspaceId, userNationalId, false);
        if (parentWorkspace.getType() != FileType.Folder)
            throw new BadRequestException("You can only create documents in workspaces");

        File document = File.builder()
                .id(createDocumentDTO.getId())
                .name(createDocumentDTO.getName())
                .ownerNationalId(userNationalId)
                .parentFileId(workspaceId)
                .url(createDocumentDTO.getUrl())
                .path(parentWorkspace.getPath() + "/" + workspaceId)
                .pathNames(parentWorkspace.getPathNames() + "/" + parentWorkspace.getName())
                .type(FileType.fromExtension(createDocumentDTO.getExtension()))
                .extension(createDocumentDTO.getExtension())
                .size(createDocumentDTO.getSize())
                .build();

        return fileRepository.save(document);
    }
}
