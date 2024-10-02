package net.atos.WorkspaceService.repository;

import net.atos.WorkspaceService.dto.GetPutUrlDto;
import net.atos.WorkspaceService.dto.KeyDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "storage-service", path = "/api/storage")
public interface StorageServiceClient {

//    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    ResponseEntity<String> uploadFile(@RequestPart("objectKey") String objectKey, @RequestPart("file") MultipartFile file);

    @GetMapping("/{objectKey}")
    ResponseEntity<String> downloadFile(@PathVariable String objectKey);

    @GetMapping("/{objectKey}/metadata")
    public ResponseEntity<Map<String, String>> getMetadata(@PathVariable String objectKey);

    @PostMapping(value = "/")
    public ResponseEntity<GetPutUrlDto> getSignedPutUrl(@RequestBody KeyDto keyUrlDto);
}
