package net.atos.WorkspaceService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.AccessType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoveDTO {
    private String newParentFileId;
}
