package net.atos.StorageService.util;

import io.awspring.cloud.s3.S3Template;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import net.atos.StorageService.annotation.BucketExists;

@RequiredArgsConstructor
public class BucketExistenceValidator implements ConstraintValidator<BucketExists, String> {

    private final S3Template s3Template;

    @Override
    public boolean isValid(String bucketName, ConstraintValidatorContext context) {
        return s3Template.bucketExists(bucketName);
    }

}