package ma.medecins_service.Feign;

import ma.medecins_service.dto.PatientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PATIENTS-SERVICE")
public interface PatientFeignClient {

    @GetMapping("/api/patients/{id}")
    PatientDTO getPatientById(@PathVariable Long id);
}
