package net.atos.WorkspaceService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KeyDto {
    @NotBlank
    private String objectKey;
}
