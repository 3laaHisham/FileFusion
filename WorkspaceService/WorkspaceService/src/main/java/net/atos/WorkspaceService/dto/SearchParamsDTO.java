package net.atos.WorkspaceService.dto;

import lombok.Data;
import net.atos.WorkspaceService.enums.FileType;

import java.util.Date;

@Data
public class SearchParamsDTO {
    private String q;
    private FileType fileType;
    private Date startDate;
    private Date endDate;
    private Boolean isStarred;
    private int page;
    private int size;
}
