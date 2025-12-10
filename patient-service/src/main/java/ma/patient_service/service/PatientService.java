package ma.patient_service.service;

import ma.patient_service.exception.DuplicateCinException;
import ma.patient_service.Model.Patient;
import ma.patient_service.dto.PatientDTO;
import ma.patient_service.mapper.PatientMapper;
import ma.patient_service.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
    @Autowired
    PatientRepository patientRepository;
    //ajouter
    public PatientDTO savePatient(PatientDTO dto) {
        // on check si un patinet avec le meme cin existe deja
        if(patientRepository.existsByCin(dto.getCin()))
        {System.out.println("Duplicate CIN detected: " + dto.getCin());
            throw new DuplicateCinException(dto.getCin());
        }
        Patient patient = PatientMapper.toEntity(dto);
        Patient saved=  patientRepository.save(patient);
        return PatientMapper.toDTO(saved);
    }
    //Lister
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
}
