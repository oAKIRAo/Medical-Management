package ma.api_gateway.Proxy;

import ma.api_gateway.dto.MedecinDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/medecins")
public class MedecinProxyController {
    private final RestTemplate restTemplate;
    private final String medecinUrl="http://localhost:8081/api/medecins";

    public MedecinProxyController() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }
    @GetMapping("/")
    public ResponseEntity<List<MedecinDTO>> getMedecin() {
        MedecinDTO[] medecins = restTemplate.getForObject(medecinUrl + "/", MedecinDTO[].class);
        assert medecins != null;
        List<MedecinDTO> medecinsList = Arrays.asList(medecins);
        return ResponseEntity.ok(medecinsList);
    }
    @PostMapping("/add")
    public ResponseEntity<?> addmedecin(@RequestBody Object medecin) {
        return restTemplate.postForEntity(medecinUrl+ "/add", medecin, Object.class);
    }
    @DeleteMapping("delete/{id}")
    public void deletemedecin(@PathVariable Long id) {
        restTemplate.delete(medecinUrl+ "/delete/{id}" , id);
    }
    @PatchMapping("/update/{id}")
    public ResponseEntity<MedecinDTO> updateMedecin(@PathVariable Long id, @RequestBody MedecinDTO medecin) {
        MedecinDTO updated = restTemplate.patchForObject(medecinUrl+ "/update/{id}", medecin ,MedecinDTO.class, id);
        return ResponseEntity.ok(updated);
    }
}
