package net.atos.UserService.controller;

import jakarta.validation.Valid;
import net.atos.UserService.dto.GetNationalIdsDto;
import net.atos.UserService.model.CustomUserDetails;
import net.atos.UserService.model.User;
import net.atos.UserService.util.JwtService;
import net.atos.UserService.dto.LoginDto;
import net.atos.UserService.dto.RegisterDto;
import net.atos.UserService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtGenerator;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid RegisterDto user) {
        User createdUser = userService.save(user);

        // Publish onRegistrationEvent Async to send Email to verify

        return ResponseEntity.ok().body(createdUser);

    }

//    @PostMapping("/verify")
//    public ResponseEntity<?> verify(@RequestBody int otp) {
//        // TODO: Mark Enabled if correct OTP
//
//        return ResponseEntity.status(HttpStatus.CREATED).build();
//    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto loginDto){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword())
        );

        String token = jwtGenerator.generateToken((CustomUserDetails) authentication.getPrincipal());

        ResponseCookie cookie = ResponseCookie.from("Authorization", token)
                .httpOnly(true)
                .sameSite("Lax")
//                .secure(true)
                .path("/")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Cookie set with SameSite=Lax");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken() {
        return ResponseEntity.ok().body("Token is valid");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("Authorization", "")
                .httpOnly(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("logout successful");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("User-National-Id") String nationalId) {
        return ResponseEntity.ok().body(userService.findByNationalId(nationalId));
    }

    @GetMapping("/nationalIds")
    public ResponseEntity<List<String>> getNationalIdsByEmail(@RequestParam List<String> emails) {
        return ResponseEntity.ok().body(userService.getNationalIds(emails));
    }
}
