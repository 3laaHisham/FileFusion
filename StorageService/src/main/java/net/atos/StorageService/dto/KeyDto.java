package net.atos.StorageService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class KeyDto {
    @NotBlank
    private String objectKey;
}
