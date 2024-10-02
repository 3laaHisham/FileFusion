package net.atos.UserService.service;

import net.atos.UserService.dto.RegisterDto;
import net.atos.UserService.dto.UserDto;
import net.atos.UserService.model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User save(RegisterDto user);

    List<String> getNationalIds(List<String> emails);

    Object findByNationalId(String nationalId);
}
