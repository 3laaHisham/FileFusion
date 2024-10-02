package net.atos.StorageService.dto;

public class PresignedURL {
    private String url;
    private String objectKey;

    public PresignedURL(String url, String objectKey) {
        this.url = url;
        this.objectKey = objectKey;
    }

    public String getUrl() {
        return url;
    }

    public String getObjectKey() {
        return objectKey;
    }
}
