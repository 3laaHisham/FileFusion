package net.atos.WorkspaceService.repository;

import net.atos.WorkspaceService.enums.FileType;
import net.atos.WorkspaceService.model.File;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Update;

import java.util.List;

public interface FileRepository extends MyMongoRepository<File, String> {
    List<File> findFilesByParentFileIdIn(List<String> parentFileIds);

    @Update("{ '$set': { 'isPublic': ?1, 'allowedUsers': ?2, 'allowedUsersEmails': ?3 } }")
    void findAndUpdateIsPublicAndAllowedUsersByIdIn(List<String> ids, boolean isPublic, List<String> allowedUsers, List<String> allowedUsersEmails);

//    @Query("{ '$text': { '$search': ?0 } }")
//    List<File> findWithFullTextSearch(String text);
}
