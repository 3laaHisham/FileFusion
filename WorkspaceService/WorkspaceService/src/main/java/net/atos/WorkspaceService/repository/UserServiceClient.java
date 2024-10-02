package net.atos.WorkspaceService.repository;

import net.atos.WorkspaceService.dto.GetNationalIdsDto;
import net.atos.WorkspaceService.dto.GetPutUrlDto;
import net.atos.WorkspaceService.dto.KeyDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "user-service", path = "/api/users")
public interface UserServiceClient {

    @GetMapping("/nationalIds")
    public ResponseEntity<List<String>> getNationalIdsByEmail(@RequestParam List<String> emails);
}
