package net.atos.UserService.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;

    @NotEmpty
    @Email
    @Size(max = 45)
    private String email;

    @NotEmpty
    @Size(max = 20)
    private String username;

    @NotEmpty
    @Size(max = 14)
    private String NationalId;

    @NotEmpty
    @Size(max = 64)
    private String password;

    @NotEmpty
    @Size(max = 20)
    private String firstName;

    @NotEmpty
    @Size(max = 20)
    private String lastName;
}
