package ma.api_gateway.Proxy;
import ma.api_gateway.dto.AppointmentDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentProxyController {

    private final RestTemplate restTemplate;
    private final String appointmentServiceUrl = "http://localhost:8081/api/appointments";

    public AppointmentProxyController() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    // Create appointment
    @PostMapping("/create")
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO dto) {
        return restTemplate.postForEntity(appointmentServiceUrl + "/create", dto, AppointmentDTO.class);
    }

    // Get all appointments
    @GetMapping("/")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        AppointmentDTO[] appointments = restTemplate.getForObject(appointmentServiceUrl + "/", AppointmentDTO[].class);
        assert appointments != null;
        List<AppointmentDTO> appointmentList = Arrays.asList(appointments);
        return ResponseEntity.ok(appointmentList);
    }

    // Update appointment
    @PatchMapping("/update/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentDTO dto) {

        AppointmentDTO updated = restTemplate.patchForObject(
                appointmentServiceUrl + "/update/" + id,
                dto,
                AppointmentDTO.class
        );
        return ResponseEntity.ok(updated);
    }

    // Delete appointment
    @DeleteMapping("/delete/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        restTemplate.delete(appointmentServiceUrl + "/delete/" + id);
    }
}

