package net.atos.WorkspaceService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TypeDto {
    @NotBlank
    private String contentType;
}
