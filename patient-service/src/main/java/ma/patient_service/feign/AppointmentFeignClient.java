package ma.patient_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "MEDECINS-SERVICE")

public interface AppointmentFeignClient {

    @DeleteMapping("/api/appointments/patient/{patientId}")
    void deleteAppointmentsByPatient(@PathVariable Long patientId);
}