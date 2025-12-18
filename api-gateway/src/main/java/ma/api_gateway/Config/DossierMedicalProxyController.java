package ma.api_gateway.Config;

import ma.api_gateway.dto.DossierMedicalDTO;
import ma.api_gateway.dto.MedecinDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

import java.util.Arrays;
import java.util.List;

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
    public ResponseEntity<DossierMedicalDTO> addDossier(@PathVariable Long id, @RequestBody DossierMedicalDTO dossierDto) {
        return restTemplate.postForEntity(dossierServiceUrl + "/" + id + "/add", dossierDto, DossierMedicalDTO.class);
    }

    @GetMapping("/{id}/")
    public ResponseEntity<List<DossierMedicalDTO>> getAllDossiers(@PathVariable Long id) {
        DossierMedicalDTO[] dossiers = restTemplate.getForObject(dossierServiceUrl + "/" + id + "/", DossierMedicalDTO[].class);
        assert dossiers != null;
        List<DossierMedicalDTO> dossiersList = Arrays.asList(dossiers);
        return ResponseEntity.ok(dossiersList);
    }

    @PatchMapping("/{idPatient}/update/{idDossier}")
    public ResponseEntity<DossierMedicalDTO> updateDossier(@PathVariable Long idPatient,
                                           @PathVariable Long idDossier,
                                           @RequestBody DossierMedicalDTO dossierDto) {

       DossierMedicalDTO updated = restTemplate.patchForObject(
                dossierServiceUrl + "/" + idPatient + "/update/" + idDossier,
                dossierDto,
                DossierMedicalDTO.class
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{idPatient}/delete/{idDossier}")
    public void deleteDossier(@PathVariable Long idPatient, @PathVariable Long idDossier) {
        restTemplate.delete(dossierServiceUrl + "/" + idPatient + "/delete/" + idDossier);
    }
}
