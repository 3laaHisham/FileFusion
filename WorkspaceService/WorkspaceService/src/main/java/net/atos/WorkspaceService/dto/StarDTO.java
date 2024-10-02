package net.atos.WorkspaceService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StarDTO {
    private Boolean isStarred;
//    private String dummy; // something weired but if I use only one field in dto, jackson complains. So I either add dummy or remove add @NoArgsConstructor
}
