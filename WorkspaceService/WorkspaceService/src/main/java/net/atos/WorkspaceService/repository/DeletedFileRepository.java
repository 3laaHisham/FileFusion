package net.atos.WorkspaceService.repository;

import net.atos.WorkspaceService.model.DeletedFile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface DeletedFileRepository extends MongoRepository<DeletedFile, String> {
    @Query("{ 'file.parentFileId': { $in: ?0 } }")
    List<DeletedFile> findByParentFileIdIn(List<String> parentFileIds);

    @Query("{ 'file.ownerNationalId': ?0, 'isDeletedDirectly': true }")
    List<DeletedFile> findByOwnerNationalIdAndDeletedDirectly(String userNationalId);
}
