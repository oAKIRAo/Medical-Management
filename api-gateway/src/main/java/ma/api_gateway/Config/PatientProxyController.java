package ma.api_gateway.Config;
import ma.api_gateway.dto.MedecinDTO;
import ma.api_gateway.dto.PatientDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientProxyController {

    private final RestTemplate restTemplate;
    private final String patientServiceUrl = "http://localhost:8082/api/patients";
    public PatientProxyController() {
        this.restTemplate = new RestTemplate();
        //pour activer le support
        this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }
    @PostMapping("/add")
    public ResponseEntity<PatientDTO> addPatient(@RequestBody PatientDTO patient) {
        return restTemplate.postForEntity(patientServiceUrl + "/add", patient, PatientDTO.class);
    }
    @GetMapping("/")
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
            PatientDTO[] patients = restTemplate.getForObject(patientServiceUrl + "/", PatientDTO[].class);
        assert patients != null;
        List<PatientDTO> patientList = Arrays.asList(patients);
        return ResponseEntity.ok(patientList);
        }
    @DeleteMapping("/delete/{id}")
    public void deletePatient(@PathVariable("id") Long id) {
        restTemplate.delete(patientServiceUrl + "/delete/{id}" , id);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable("id") Long id, @RequestBody PatientDTO patient) {
        PatientDTO updated = restTemplate.patchForObject(patientServiceUrl + "/update/{id}", patient, PatientDTO.class, id);
        return ResponseEntity.ok(updated);
    }
}
