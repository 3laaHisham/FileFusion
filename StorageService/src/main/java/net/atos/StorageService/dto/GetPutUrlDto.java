package net.atos.StorageService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetPutUrlDto {
    @NotBlank
    private String url;
    @NotBlank
    private String objectKey;
}
