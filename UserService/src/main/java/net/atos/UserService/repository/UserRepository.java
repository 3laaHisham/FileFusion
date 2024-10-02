package net.atos.UserService.repository;

import net.atos.UserService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByNationalId(String nationalId);

    List<User> findByEmailIn(List<String> emails);

    Optional<User> findByNationalId(String nationalId);
}