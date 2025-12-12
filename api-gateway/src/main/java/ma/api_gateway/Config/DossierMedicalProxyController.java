package ma.api_gateway.Config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

@RestController
@RequestMapping("/patient/details")
public class DossierMedicalProxyController {

    private final RestTemplate restTemplate;
    private final String dossierServiceUrl = "http://localhost:8082/api/dossier-medical";

    public DossierMedicalProxyController() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @PostMapping("/{id}/add")
    public ResponseEntity<?> addDossier(@PathVariable Long id, @RequestBody Object dossierDto) {
        return restTemplate.postForEntity(dossierServiceUrl + "/" + id + "/add", dossierDto, Object.class);
    }

    @GetMapping("/{id}/")
    public ResponseEntity<?> getAllDossiers(@PathVariable Long id) {
        Object[] dossiers = restTemplate.getForObject(dossierServiceUrl + "/" + id + "/", Object[].class);
        return ResponseEntity.ok(dossiers);
    }

    @PatchMapping("/{idPatient}/update/{idDossier}")
    public ResponseEntity<?> updateDossier(@PathVariable Long idPatient,
                                           @PathVariable Long idDossier,
                                           @RequestBody Object dossierDto) {

        restTemplate.patchForObject(
                dossierServiceUrl + "/" + idPatient + "/update/" + idDossier,
                dossierDto,
                Object.class
        );
        return ResponseEntity.ok(dossierDto);
    }

    @DeleteMapping("/{idPatient}/delete/{idDossier}")
    public void deleteDossier(@PathVariable Long idPatient, @PathVariable Long idDossier) {
        restTemplate.delete(dossierServiceUrl + "/" + idPatient + "/delete/" + idDossier);
    }
}
