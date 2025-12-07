package ma.patient_service.controller;

import ma.patient_service.Model.Patient;
import ma.patient_service.service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController( PatientService patientService) {
        this.patientService = patientService;
    }
    @PostMapping("/add")
    public Patient addPatient(@RequestBody Patient p) {
        return patientService.savePatient(p);
    }
    @GetMapping("/")
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }
}
