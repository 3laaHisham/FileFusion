package net.atos.UserService.service;

import net.atos.UserService.dto.RegisterDto;
import net.atos.UserService.dto.UserDto;
import net.atos.UserService.enums.Role;
import net.atos.UserService.model.User;
import net.atos.UserService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Override
    public User save(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername()))
            throw new IllegalArgumentException("Username already exists");
        if (userRepository.existsByEmail(registerDto.getEmail()))
            throw new IllegalArgumentException("Email already exists");
        if (userRepository.existsByNationalId(registerDto.getNationalId()))
            throw new IllegalArgumentException("National Id already exists");

        User newUser = User.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(Role.USER)
                .firstName(registerDto.getFirstName())
                .lastName(registerDto.getLastName())
                .nationalId(registerDto.getNationalId())
                .build();

        return userRepository.save(newUser);
    }

    @Override
    public List<String> getNationalIds(List<String> emails) {
        return userRepository.findByEmailIn(emails)
                .stream()
                .map(User::getNationalId)
                .toList();
    }

    @Override
    public User findByNationalId(String nationalId) {
        return userRepository.findByNationalId(nationalId).orElseThrow();
    }
}
