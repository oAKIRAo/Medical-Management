package ma.patient_service.service;

import ma.patient_service.Model.DossierMedical;
import ma.patient_service.Model.Patient;
import ma.patient_service.dto.DossierMedicalDTO;
import ma.patient_service.exception.DossierMedicalNotFoundException;
import ma.patient_service.exception.PatientNotFoundException;
import ma.patient_service.mapper.DossierMedicalMapper;
import ma.patient_service.mapper.PatientMapper;
import ma.patient_service.repository.DossierMedicalRepository;
import ma.patient_service.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class DossierMedicalService {
    private final DossierMedicalRepository dossierMedicalRepository;
    private final PatientRepository patientRepository;

    public DossierMedicalService(DossierMedicalRepository dossierMedicalRepository, PatientRepository patientRepository) {
        this.dossierMedicalRepository = dossierMedicalRepository;
         this.patientRepository = patientRepository;}

    //Ajouter DossierMedical
    public DossierMedicalDTO ajouterDossier(DossierMedicalDTO dto, Long idPatient) {
        DossierMedical dossierMedical = DossierMedicalMapper.toEntity(dto);
        Patient patient = patientRepository.findById(idPatient)
                .orElseThrow(() -> new PatientNotFoundException(idPatient));
        dossierMedical.setPatient(patient);
        DossierMedical saved = dossierMedicalRepository.save(dossierMedical);
        return DossierMedicalMapper.toDTO(saved);
    }
    //Lister tout DossierMedical
    public List<DossierMedicalDTO> getAllDossierMedical() {
        return dossierMedicalRepository.findAll()
                .stream()
                .map(DossierMedicalMapper::toDTO)
                .toList();
    }
    //Lister Un dossierMedical D'un Patient
    public List<DossierMedicalDTO> getAllDossierMedicalByPatient(Long idPatient) {
        Patient patient = patientRepository.findById(idPatient)
                .orElseThrow(() -> new PatientNotFoundException(idPatient));
        return  dossierMedicalRepository.findByPatientId(idPatient)
                .stream()
                .map(DossierMedicalMapper::toDTO)
                .toList();
    }
    //Modifier DossierMedical
    public DossierMedicalDTO ModifierDossier(DossierMedicalDTO dto, Long idDossier, Long idPatient) {
        Patient patient = patientRepository.findById(idPatient)
                .orElseThrow(() -> new PatientNotFoundException(idPatient));
        DossierMedical dossierMedical = dossierMedicalRepository.findById(idDossier)
                .orElseThrow(() -> new DossierMedicalNotFoundException(idDossier));
        //on verifie si le dossier appartient au patient
        if (!dossierMedical.getPatient().getId().equals(idPatient)) {
            throw new IllegalArgumentException("This dossier does not belong to the given patient");
        }
        if(dto.getLogs() != null ){dossierMedical.setLogs(dto.getLogs());}
        if(dto.getAllergies() != null ){dossierMedical.setAllergies(dto.getAllergies());}
        dossierMedical.setPatient(patient);
        DossierMedical updated = dossierMedicalRepository.save(dossierMedical);
        return DossierMedicalMapper.toDTO(updated);
    }
    //Supprimer DossierMedical
    public void DeleteDossier(Long idDossier, Long idPatient) {
        Patient patient = patientRepository.findById(idPatient)
                .orElseThrow(() -> new PatientNotFoundException(idPatient));

        DossierMedical dossier = dossierMedicalRepository.findById(idDossier)
                .orElseThrow(() -> new DossierMedicalNotFoundException(idDossier));

        if (!dossier.getPatient().getId().equals(idPatient)) {
            throw new IllegalArgumentException("Ce dossier n'appartient pas à ce patient !");
        }

        dossierMedicalRepository.delete(dossier);
    }

}
