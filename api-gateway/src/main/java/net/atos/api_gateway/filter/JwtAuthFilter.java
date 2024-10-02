package net.atos.api_gateway.filter;

import io.jsonwebtoken.Claims;
import net.atos.api_gateway.util.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public abstract class JwtAuthFilter implements GatewayFilter {

    @Autowired
    private JwtService jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        Optional<String> token = request.getCookies().getOrDefault("Authorization", List.of())
                    .stream()
                    .findFirst()
                    .map(HttpCookie::getValue);

        if(token.isEmpty())
            return this.onError(exchange, chain,"Authorization missing", HttpStatus.UNAUTHORIZED);

        try {

            if (!jwtUtil.isTokenValid(token.get()))
                return this.onError(exchange, chain,"Token invalid", HttpStatus.UNAUTHORIZED);

            this.populateRequestWithHeaders(exchange, token.get());

            return chain.filter(exchange);
        } catch (Exception e) {
            return this.onError(exchange, chain,"Auth header invalid", HttpStatus.UNAUTHORIZED);
        }
    }

    abstract Mono<Void> onError(ServerWebExchange exchange, GatewayFilterChain chain, String err, HttpStatus httpStatus);

    private void populateRequestWithHeaders(ServerWebExchange exchange, String token) {
        Claims claims = jwtUtil.extractAllClaims(token);

        exchange.getRequest()
                .mutate()
                .header("User-National-Id",String.valueOf(claims.get("nationalId")))
                .header("User-Role", String.valueOf(claims.get("role")))
                .build();
    }
}