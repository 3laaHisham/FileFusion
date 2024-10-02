package net.atos.StorageService.controller;

import jakarta.validation.Valid;
import net.atos.StorageService.dto.GetPutUrlDto;
import net.atos.StorageService.dto.KeyDto;
import net.atos.StorageService.service.IStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.net.URL;
import java.util.Map;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    @Autowired
    private IStorageService storageService;

    @PostMapping(value = "/")
    public ResponseEntity<GetPutUrlDto> getSignedPutUrl(@Valid @RequestBody KeyDto keyUrlDto) {
        URL url = storageService.getSignedPutUrl(keyUrlDto.getObjectKey());

        GetPutUrlDto getPutUrlDto = GetPutUrlDto.builder()
                .url(url.toString())
                .objectKey(keyUrlDto.getObjectKey())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(getPutUrlDto);
    }

    @GetMapping("/{objectKey}")
    public ResponseEntity<String> downloadFile(@PathVariable String objectKey) throws URISyntaxException {
//        Resource resource = storageService.load(objectKey);

        URL signedUrl = storageService.getSignedUrl(objectKey);

        if (signedUrl != null) {
            return ResponseEntity.ok()
                    .body(signedUrl.toString());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{objectKey}")
    public ResponseEntity<?> deleteFile(@PathVariable String objectKey) {
        storageService.delete(objectKey);

        return ResponseEntity.ok("File deleted successfully: " + objectKey);
    }

    @GetMapping("/{objectKey}/metadata")
    public ResponseEntity<Map<String, String>> getMetadata(@PathVariable String objectKey) {
        return ResponseEntity.ok(storageService.getMetadata(objectKey));
    }
}
