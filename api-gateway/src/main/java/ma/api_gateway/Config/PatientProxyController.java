package ma.api_gateway.Config;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/patients")
public class PatientProxyController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String patientServiceUrl = "http://localhost:8082/api/patients";

    @PostMapping("/add")
    public ResponseEntity<?> addPatient(@RequestBody Object patient) {
        return restTemplate.postForEntity(patientServiceUrl + "/add", patient, Object.class);
    }
    @GetMapping("/")
    public ResponseEntity<?> getAllPatients() {
            Object[] patients = restTemplate.getForObject(patientServiceUrl + "/", Object[].class);
            return ResponseEntity.ok(patients);
        }
}
