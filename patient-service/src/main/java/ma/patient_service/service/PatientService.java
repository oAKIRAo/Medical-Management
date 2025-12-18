package ma.patient_service.service;

import ma.patient_service.exception.PatientNotFoundException;
import ma.patient_service.Model.Patient;
import ma.patient_service.dto.PatientDTO;
import ma.patient_service.mapper.PatientMapper;
import ma.patient_service.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
    private final PatientRepository  patientRepository;
    public PatientService(PatientRepository patientRepository) {this.patientRepository = patientRepository;}
    //Ajouter un patient
    public PatientDTO savePatient(PatientDTO dto) {
        Patient patient = PatientMapper.toEntity(dto);
        Patient saved=  patientRepository.save(patient);
        return PatientMapper.toDTO(saved);
    }
    //Lister tout les patients
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(PatientMapper::toDTO)
                .toList();
    }
    //chercher un patinet numero CIN
    public PatientDTO getPatientByCIN(String cin) {
        Patient patient = patientRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return PatientMapper.toDTO(patient);
    }
    //Supprimer Un patient
    public void DeletePatientById(Long id) {
        if(patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
        }
    }
    //Modifier Un Patient
    public PatientDTO updatePatient(Long id,PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));

        //si l'un des attributs na pas ete modifier on le laisse avec sa valeur sans etre oblige de la retaper

        if(dto.getFirstName() != null) {patient.setFirstName(dto.getFirstName());}
        if(dto.getLastName() != null) {patient.setLastName(dto.getLastName());}
        if(dto.getCin() != null) {patient.setCin(dto.getCin());}
        if(dto.getPhoneNumber() != null) {patient.setPhoneNumber(dto.getPhoneNumber());}
        patientRepository.save(patient);
        return PatientMapper.toDTO(patient);
    }
}
