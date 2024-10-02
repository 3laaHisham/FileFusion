package net.atos.WorkspaceService.controller;

import jakarta.validation.Valid;
import net.atos.WorkspaceService.dto.*;
import net.atos.WorkspaceService.exceptions.FileNameExistsException;
import net.atos.WorkspaceService.exceptions.ParentNotExistException;
import net.atos.WorkspaceService.model.File;
import net.atos.WorkspaceService.model.DeletedFile;
import net.atos.WorkspaceService.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    @PostMapping("/")
    public ResponseEntity<File> createWorkspace(@RequestHeader("User-National-Id") String userNationalId,
                                                @Valid @RequestBody NameDTO nameDto) throws FileNameExistsException {
        File createdWorkspace = workspaceService.createWorkspace(nameDto.getName(), userNationalId);
        return ResponseEntity.ok(createdWorkspace);
    }

    @GetMapping("/")
    public ResponseEntity<GetFolderDto> getWorkspacesBy(@RequestHeader(value = "User-National-Id") String userNationalId,
                                                        SearchParamsDTO searchDTO) {
        GetFolderDto getFolderDto = workspaceService.getWorkspaces(userNationalId, searchDTO);

        return ResponseEntity.ok(getFolderDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetFolderDto> getFolderContentById(@RequestHeader(value = "User-National-Id", required = false) String userNationalId,
                                                             @PathVariable String id,
                                                             SearchParamsDTO searchDTO) {
        GetFolderDto getFolderDto = workspaceService.getDirectoryContent(id, userNationalId, searchDTO);

        return ResponseEntity.ok(getFolderDto);
    }

    @GetMapping("/trash")
    public ResponseEntity<List<DeletedFile>> getTrash(@RequestHeader(value = "User-National-Id") String userNationalId) {
        List<DeletedFile> trash = workspaceService.getTrash(userNationalId);

        return ResponseEntity.ok(trash);
    }

    @GetMapping("/{id}/isOwner")
    public ResponseEntity<Boolean> isOwner(@RequestHeader(value = "User-National-Id", required = false) String userNationalId, @PathVariable String id) {
        return ResponseEntity.ok(workspaceService.isOwner(id, userNationalId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<File>> search(@RequestHeader("User-National-Id") String userNationalId,
                                                       SearchParamsDTO searchDTO) {
        return ResponseEntity.ok(workspaceService.search(userNationalId, null, searchDTO).getContent());
    }

    @PutMapping("/{id}/name")
    public ResponseEntity<?> changeName(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id, @RequestBody NameDTO nameDto) {
        workspaceService.changeName(id, nameDto.getName(), userNationalId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/share")
    public ResponseEntity<File> share(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id, @RequestBody UpdateAclDto updateAclDto) {
        workspaceService.share(id, updateAclDto, userNationalId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/move")
    public ResponseEntity<File> move(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id, @RequestBody MoveDTO moveDto) {
        workspaceService.move(id, moveDto.getNewParentFileId(), userNationalId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/tags")
    public ResponseEntity<File> updateTags(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id, @RequestBody TagsDTO tagsDto) {
        workspaceService.updateTags(id, tagsDto.getTags(), userNationalId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/star")
    public ResponseEntity<File> star(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id, @RequestBody StarDTO starDto) {
        workspaceService.updateStar(id, starDto.getIsStarred(), userNationalId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<Void> restoreFile(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id) throws ParentNotExistException, FileNameExistsException {
        workspaceService.restoreFile(id, userNationalId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id) {
        workspaceService.deleteFile(id, userNationalId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deleteFilePermanent(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id) {
        workspaceService.deleteFilePermanent(id, userNationalId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/directories")
    public ResponseEntity<File> createDirectory(@RequestHeader("User-National-Id") String userNationalId, @PathVariable String id, @RequestBody NameDTO nameDto)
            throws NotFoundException, FileNameExistsException {
        File directory = workspaceService.createDirectory(id, nameDto.getName(), userNationalId);

        return ResponseEntity.ok(directory);
    }

    @PostMapping("/signed-put-url")
    public ResponseEntity<GetPutUrlDto> createDocument(@RequestHeader("User-National-Id") String userNationalId) {
        return workspaceService.getSignedPutUrl();
    }

    @PostMapping(value = "/{workspaceId}/documents")
    public ResponseEntity<File> createDocument(@RequestHeader("User-National-Id") String userNationalId,
                                               @PathVariable String workspaceId,
                                               @Valid @RequestBody CreateDocumentDTO createDocumentDTO) {

        return ResponseEntity.ok().body(workspaceService.createDocument(workspaceId, createDocumentDTO, userNationalId));
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<DownloadDto> downloadDocument(@RequestHeader(value = "User-National-Id", required = false) String userNationalId, @PathVariable String id) {
        return ResponseEntity.ok().body(workspaceService.download(id, userNationalId));
    }
}
