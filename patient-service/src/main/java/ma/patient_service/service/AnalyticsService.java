package ma.patient_service.service;

import ma.patient_service.repository.DossierMedicalRepository;
import ma.patient_service.repository.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
    private final DossierMedicalRepository dossierMedicalRepository;
    private final PatientRepository patientRepository;

    public AnalyticsService(DossierMedicalRepository dossierMedicalRepository, PatientRepository patientRepository) {
        this.dossierMedicalRepository = dossierMedicalRepository;
        this.patientRepository = patientRepository;
    }
    //total des patients
    public long getTotalPatients() {
        return patientRepository.count();
    }
    //total des dossiers
    public long getTotalDossiers() {
        return dossierMedicalRepository.count();
    }
}
