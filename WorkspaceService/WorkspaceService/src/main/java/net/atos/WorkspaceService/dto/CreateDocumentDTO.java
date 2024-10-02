package net.atos.WorkspaceService.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.atos.WorkspaceService.enums.FileType;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDocumentDTO {

    @NotBlank(message = "Document id is required")
    private String id;

    @NotBlank(message = "Document name is required")
    private String name;

    @NotNull(message = "Document type is required")
    private String extension;

    @NotBlank(message = "Document url is required")
    private String url;

    @NotNull(message = "Document size is required")
    private long size;
}
