package net.atos.StorageService.service;

import org.springframework.core.io.Resource;

import java.io.IOException;
import java.net.URL;
import java.util.Map;

public interface IStorageService {
    void init();

//    URL store(MultipartFile file, String objectKey) throws IOException;

    Resource load(String objectKey);

    URL getSignedUrl(String objectKey);

    URL getSignedPutUrl(String objectKey);

    void delete(String objectKey);

    Map<String, String> getMetadata(String objectKey);
}
