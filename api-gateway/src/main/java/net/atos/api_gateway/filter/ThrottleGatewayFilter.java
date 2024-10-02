package net.atos.api_gateway.filter;

import java.util.concurrent.TimeUnit;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.isomorphism.util.TokenBucket;
import org.isomorphism.util.TokenBuckets;
import reactor.core.publisher.Mono;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ServerWebExchange;


public class ThrottleGatewayFilter implements GatewayFilter {

    private static final Log log = LogFactory.getLog(ThrottleGatewayFilter.class);

    private volatile TokenBucket tokenBucket;

    int capacity;

    int refillTokens;

    int refillPeriod;

    TimeUnit refillUnit;

    private TokenBucket getTokenBucket() {
        if (tokenBucket != null) {
            return tokenBucket;
        }
        synchronized (this) {
            if (tokenBucket == null) {
                tokenBucket = TokenBuckets.builder()
                        .withCapacity(capacity)
                        .withFixedIntervalRefillStrategy(refillTokens, refillPeriod, refillUnit)
                        .build();
            }
        }
        return tokenBucket;
    }

    public int getCapacity() {
        return capacity;
    }

    public ThrottleGatewayFilter setCapacity(int capacity) {
        this.capacity = capacity;
        return this;
    }

    public int getRefillTokens() {
        return refillTokens;
    }

    public ThrottleGatewayFilter setRefillTokens(int refillTokens) {
        this.refillTokens = refillTokens;
        return this;
    }

    public int getRefillPeriod() {
        return refillPeriod;
    }

    public ThrottleGatewayFilter setRefillPeriod(int refillPeriod) {
        this.refillPeriod = refillPeriod;
        return this;
    }

    public TimeUnit getRefillUnit() {
        return refillUnit;
    }

    public ThrottleGatewayFilter setRefillUnit(TimeUnit refillUnit) {
        this.refillUnit = refillUnit;
        return this;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        TokenBucket tokenBucket = getTokenBucket();

        // TODO: get a token bucket for a key
        log.debug("TokenBucket capacity: " + tokenBucket.getCapacity());
        boolean consumed = tokenBucket.tryConsume();
        if (consumed) {
            return chain.filter(exchange);
        }
        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        return exchange.getResponse().setComplete();
    }

}