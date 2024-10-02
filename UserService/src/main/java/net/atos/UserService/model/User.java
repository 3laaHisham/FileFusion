package net.atos.UserService.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import net.atos.UserService.enums.Role;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email_unq", columnList = "email", unique = true)
})
public class User {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "UUIDv7Generator")
    @GenericGenerator(name = "UUIDv7Generator", strategy = "net.atos.UserService.util.UUIDv7Generator")
    private UUID id;

    @Column(nullable = false, unique = true, length = 45)
    @Email
    @NotBlank
    private String email;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(nullable = false, unique = true, length = 14)
    @Pattern(regexp = "\\d{14}")
    private String nationalId;

    @Column(nullable = false, length = 64)
    @Size(min = 6)
    @JsonIgnore
    private String password;

    @Column(nullable = false, length = 20)
    private String firstName;

    @Column(nullable = false, length = 20)
    private String lastName;

    @Column(nullable = false, length = 20)
    private Role role; // HERE OR IN DETAILS?

    @Column(nullable = false)
    private boolean deleted = false;

    @CreationTimestamp
    @Column(updatable = false)
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}