package ma.patient_service.controller;

import ma.patient_service.Model.Patient;
import ma.patient_service.dto.PatientDTO;
import ma.patient_service.exception.DuplicateCinException;
import ma.patient_service.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController( PatientService patientService) {
        this.patientService = patientService;
    }
    @PostMapping("/add")
    public PatientDTO addPatient(@RequestBody PatientDTO p) {
        return patientService.savePatient(p);
    }
    @GetMapping("/")
    public List<PatientDTO> getAllPatients() {
        return patientService.getAllPatients();
    }
}
