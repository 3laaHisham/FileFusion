package net.atos.api_gateway.filter;

import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class OptionalJwtAuthFilter extends JwtAuthFilter {
    @Override
    Mono<Void> onError(ServerWebExchange exchange, GatewayFilterChain chain, String err, HttpStatus httpStatus) {
        return chain.filter(exchange);
    }
}
