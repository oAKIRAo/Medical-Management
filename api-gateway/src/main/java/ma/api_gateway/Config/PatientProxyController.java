package ma.api_gateway.Config;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

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
    public ResponseEntity<?> addPatient(@RequestBody Object patient) {
        return restTemplate.postForEntity(patientServiceUrl + "/add", patient, Object.class);
    }
    @GetMapping("/")
    public ResponseEntity<?> getAllPatients() {
            Object[] patients = restTemplate.getForObject(patientServiceUrl + "/", Object[].class);
            return ResponseEntity.ok(patients);
        }
    @DeleteMapping("/delete/{id}")
    public void deletePatient(@PathVariable("id") Long id) {
        restTemplate.delete(patientServiceUrl + "/delete/{id}" , id);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable("id") Long id, @RequestBody Object patient) {
        restTemplate.patchForObject(patientServiceUrl + "/update/{id}", patient, Object.class, id);
        return ResponseEntity.ok(patient);
    }
}
