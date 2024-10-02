package net.atos.WorkspaceService.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GetNationalIdsDto {
    private List<String> emails;
}
