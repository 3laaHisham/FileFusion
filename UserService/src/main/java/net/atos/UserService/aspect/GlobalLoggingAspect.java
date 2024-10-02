package net.atos.UserService.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class GlobalLoggingAspect {

    @Pointcut("within(@org.springframework.stereotype.Service *) || within(@org.springframework.web.bind.annotation.RestController *)")
    public void applicationPackagePointcut() {
        // Pointcut for services and controllers
    }

    @Before("applicationPackagePointcut()")
    @Async
    public void logBefore(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        log.info("Method {} is about to be executed", methodName);
    }

    @AfterReturning(pointcut = "applicationPackagePointcut()", returning = "result")
    @Async
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        log.info("Method {} executed successfully with result: {}", methodName, result);
    }
}
