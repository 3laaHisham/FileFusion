package net.atos.WorkspaceService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DownloadDto {
    private String name;
    private String extension;
    private String url;
}
