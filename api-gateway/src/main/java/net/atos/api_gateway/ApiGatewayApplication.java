package net.atos.api_gateway;

import net.atos.api_gateway.filter.OptionalJwtAuthFilter;
import net.atos.api_gateway.filter.RequiredJwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpMethod;

import java.util.Collection;
import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

	private final String OBJECT_ID_REGEX = "[a-fA-F0-9]{24}";

	@Autowired
	private RequiredJwtAuthFilter requiredJwtAuthFilter;
	@Autowired
	private OptionalJwtAuthFilter optionalJwtAuthFilter;

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Bean
	public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("auth-service", r -> r.path("/api/users/login", "/api/users/signup")
						.uri("lb://user-service"))

				.route("user-service", r -> r.path("/api/users/**")
						.filters(f -> f.filters(requiredJwtAuthFilter))
						.uri("lb://user-service"))

				.route("read-workspace-service", r -> r.path("/api/workspaces/",
						"/api/workspaces/{id:" + OBJECT_ID_REGEX + "}**"
								,"/api/workspaces/documents/{id:" + OBJECT_ID_REGEX + "}**")
						.and().method(HttpMethod.GET)
						.filters(f -> f.filters(optionalJwtAuthFilter))
						.uri("lb://workspace-service"))

				.route("workspace-service", r -> r.path("/api/workspaces/**")
						.filters(f -> f.filters(requiredJwtAuthFilter)
//								.circuitBreaker(config -> config.setName("mycmd"))
								)
						.uri("lb://workspace-service"))
				.build();
	}
}
