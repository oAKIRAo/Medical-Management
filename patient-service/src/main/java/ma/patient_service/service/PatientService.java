package ma.patient_service.service;

import ma.patient_service.Model.Patient;
import ma.patient_service.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
    @Autowired
    PatientRepository patientRepository;
    //ajouter
    public Patient savePatient(Patient p) {
        return patientRepository.save(p);
    }
    //Lister
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    //chercher un patinet numero CIN
    public Patient getPatientByCIN(String cin) {
        return patientRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }
}
