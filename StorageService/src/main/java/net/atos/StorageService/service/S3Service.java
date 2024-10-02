package net.atos.StorageService.service;

import io.awspring.cloud.s3.ObjectMetadata;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import net.atos.StorageService.annotation.BucketExists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;
import java.util.Map;

@Service
@Validated
public class S3Service implements IStorageService {

    @Value("${spring.cloud.aws.s3.bucket}")
    @BucketExists
    private String BUCKET_NAME;

    @Autowired
    private S3Template s3Template;

    @Override
    public void init() {

    }

    public URL getSignedPutUrl(String objectKey) {
//        ObjectMetadata metadata = ObjectMetadata.builder().contentType(contentType).build();
//        return s3Template.createSignedPutURL(BUCKET_NAME, objectKey, Duration.ofSeconds(60 * 10), metadata, contentType);
        return s3Template.createSignedPutURL(BUCKET_NAME, objectKey, Duration.ofSeconds(60 * 10));
    }

    @Override
    public Resource load(String objectKey) { return s3Template.download(BUCKET_NAME, objectKey); }

    @Override
    public URL getSignedUrl(String objectKey) { return s3Template.createSignedGetURL(BUCKET_NAME, objectKey, Duration.ofSeconds(60)); }

    @Override
    public void delete(String objectKey) { s3Template.deleteObject(BUCKET_NAME, objectKey); }

    public Map<String, String> getMetadata(String objectKey) { return s3Template.download(BUCKET_NAME, objectKey).metadata(); }
}
