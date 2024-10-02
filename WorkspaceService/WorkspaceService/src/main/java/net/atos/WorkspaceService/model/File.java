package net.atos.WorkspaceService.model;

import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import net.atos.WorkspaceService.enums.FileType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "workspaces")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@CompoundIndex(name = "parentFileId_ownerNationalId_idx", def = "{'parentFileId' : 1, 'ownerNationalId' : 1}") // X_Y
@CompoundIndex(name = "parentFileId_type_idx", def = "{ 'parentFileId' : 1, 'type' : 1}") // X_Z
@CompoundIndex(name = "ownerNationalId_type_idx", def = "{ 'ownerNationalId' : 1, 'type' : 1}") // Y_Z
public class File {

    @Id
    private String id;

    @NotBlank(message = "Workspace name is required")
    private String name;

    @NotBlank(message = "Owner National ID is required")
    @Pattern(regexp = "\\d{14}", message = "Owner National ID must be a 14-digit number")
    private String ownerNationalId;

    @NotBlank(message = "Owner National ID is required")
    private String parentFileId;

    @NotBlank(message = "Workspace path is required")
    private String path;

    @NotBlank(message = "Workspace path names is required")
    private String pathNames;

    @NotNull(message = "Document type is required")
    private FileType type;

    @Builder.Default
    private String extension = "";

    private String url; // In case not a folder

    @Builder.Default
    private Date uploadDate = new Date();

    @Builder.Default
    private Boolean isPublic = false;

    @Builder.Default
    private List<String> allowedUsers = new ArrayList<>();
    @Builder.Default
    private List<String> allowedUsersEmails = new ArrayList<>(); // Just for show in frontend

//    @TextIndexed
    @Builder.Default
    @Size(max = 10, message = "Maximum 10 tags are allowed")
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private Boolean isStarred = false;

    @Builder.Default
    private Long size = 0L;
}
