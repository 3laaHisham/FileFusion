package net.atos.WorkspaceService.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagsDTO {
    private List<String> tags;
}
