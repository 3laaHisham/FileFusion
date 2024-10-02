package net.atos.WorkspaceService.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "deleted_workspaces")
@Data
@Builder
@CompoundIndex(name = "OwnerNationalId_isDeletedDirectly_idx", def = "{'file.ownerNationalId': 1, 'isDeletedDirectly': 1}")
@CompoundIndex(name = "parentFileId_idx", def = "{'file.parentFileId': 1}")
public class DeletedFile {
    @Id
    private String id;

    @NotBlank
    private File file;

    @NotBlank
    private boolean isDeletedDirectly; // If not, I wouldn't show it in the trash

    @Builder.Default
    private Date deletedAt = new Date();
}
