package net.atos.WorkspaceService.dto;

import lombok.Builder;
import lombok.Data;
import net.atos.WorkspaceService.model.File;

import java.util.List;

@Data
@Builder
public class GetFolderDto {
    private String name;
    private String path;
    private String pathNames;
    private List<File> files;
    private Boolean hasNext;
    private Boolean isOwner;
}
