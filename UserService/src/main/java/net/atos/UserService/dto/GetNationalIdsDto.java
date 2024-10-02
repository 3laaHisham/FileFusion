package net.atos.UserService.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
public class GetNationalIdsDto {
    private List<String> emails;
}
