package ma.api_gateway.Proxy;

import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsProxyController {

    private final RestTemplate restTemplate;

    private final String medecinAnalyticsUrl = "http://localhost:8081/api/analytics";
    private final String patientAnalyticsUrl = "http://localhost:8082/api/analytics";

    public AnalyticsProxyController() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @GetMapping("/cards")
    public ResponseEntity<?> getDashboardCards() {

        Long totalPatients = restTemplate.getForObject(
                patientAnalyticsUrl + "/countP", Long.class);

        Long totalDossiers = restTemplate.getForObject(
                patientAnalyticsUrl + "/countD", Long.class);

        Long totalMedecins = restTemplate.getForObject(
                medecinAnalyticsUrl + "/countM", Long.class);

        Long totalAppointments = restTemplate.getForObject(
                medecinAnalyticsUrl + "/countA", Long.class);

        Map<String, Long> response = new HashMap<>();
        response.put("patients", totalPatients);
        response.put("dossiers", totalDossiers);
        response.put("medecins", totalMedecins);
        response.put("appointments", totalAppointments);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments-per-doctor")
    public ResponseEntity<?> appointmentsPerDoctor() {

        Map result = restTemplate.getForObject(
                medecinAnalyticsUrl + "/per-doctor", Map.class);

        return ResponseEntity.ok(result);
    }
}
