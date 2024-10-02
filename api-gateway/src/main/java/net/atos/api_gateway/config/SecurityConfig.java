package net.atos.api_gateway.config;


import net.atos.api_gateway.filter.OptionalJwtAuthFilter;
import net.atos.api_gateway.filter.RequiredJwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.security.web.server.csrf.CsrfToken;
import org.springframework.security.web.server.csrf.ServerCsrfTokenRequestHandler;
import org.springframework.security.web.server.csrf.XorServerCsrfTokenRequestAttributeHandler;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    // Only god and whoever the f**k wrote this know how it works. SPRING SECURITY FOR YOU
    @Bean
    SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        CookieServerCsrfTokenRepository tokenRepository = CookieServerCsrfTokenRepository.withHttpOnlyFalse();

        XorServerCsrfTokenRequestAttributeHandler delegate = new XorServerCsrfTokenRequestAttributeHandler();
        ServerCsrfTokenRequestHandler requestHandler = delegate::handle;

        return http
                .csrf((csrf) -> csrf
                        .csrfTokenRepository(tokenRepository)
                        .csrfTokenRequestHandler(requestHandler))
                .build();
    }

    @Bean
    WebFilter csrfCookieWebFilter() {
        return (exchange, chain) -> {
            Mono<CsrfToken> csrfToken = exchange.getAttributeOrDefault(CsrfToken.class.getName(), Mono.empty());
            return csrfToken.doOnSuccess(token -> {
            }).then(chain.filter(exchange));
        };
    }

    @Bean
    public RequiredJwtAuthFilter requiredJwtAuthFilter() {
        return new RequiredJwtAuthFilter();
    }

    @Bean
    public OptionalJwtAuthFilter optionalJwtAuthFilter() {
        return new OptionalJwtAuthFilter();
    }
}
