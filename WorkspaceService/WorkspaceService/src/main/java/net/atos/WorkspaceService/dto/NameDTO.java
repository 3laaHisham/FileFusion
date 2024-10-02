package net.atos.WorkspaceService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NameDTO {

    @NotBlank(message = "Workspace name is required")
    private String name;
}
