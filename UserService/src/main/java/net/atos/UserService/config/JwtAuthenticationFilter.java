package net.atos.UserService.config;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.atos.UserService.util.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

//@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private HandlerExceptionResolver handlerExceptionResolver;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String token = getTokenFromRequest(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (jwtService.isTokenExpired(token))
            throw new ExpiredJwtException(null, null, "The JWT token has expired");

        Jwt jwt = getJwtFromToken(token);

        // REMARK: Doesn't make sense to go to db for jwt, as all tutorials do
        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                filterChain.doFilter(request, response);
                return;
            }

            JwtAuthenticationToken authToken = new JwtAuthenticationToken(
                    jwt,
                    List.of(new SimpleGrantedAuthority(jwt.getClaim("role")))
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (Exception exception) {

            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer "))
            token = authHeader.substring(7);
        else
            if (request.getCookies() != null) {
                    token = Arrays.stream(request.getCookies())
                        .filter(c -> "Authorization".equals(c.getName()))
                        .map(Cookie::getValue)
                        .findFirst()
                        .orElse(null);
        }

        return token;
    }

    private Jwt getJwtFromToken(String token) {

        String username = jwtService.extractUsername(token);
        String role = jwtService.extractClaim(token, claims -> claims.get("role")).toString();
        Instant issuedAt = jwtService.extractClaim(token, claims -> claims.getIssuedAt().toInstant());
        Instant expiration = jwtService.extractExpiration(token).toInstant();

        return Jwt.withTokenValue(token)
                .subject(username)
                .claim("role", role)
                .issuedAt(issuedAt)
                .expiresAt(expiration)
                .build();
    }
}

