package net.atos.StorageService.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import net.atos.StorageService.util.BucketExistenceValidator;

import java.lang.annotation.*;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = BucketExistenceValidator.class)
public @interface BucketExists {

    String message() default "No bucket exists with the configured name.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}