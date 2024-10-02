package net.atos.WorkspaceService.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UpdateAclDto {
    private boolean isPublic;
    private List<String> allowedUsers;
}
