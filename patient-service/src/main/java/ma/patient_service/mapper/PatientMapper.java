package ma.patient_service.mapper;


import ma.patient_service.Model.Patient;
import ma.patient_service.dto.PatientDTO;

public class PatientMapper {

    public static PatientDTO toDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setCin(patient.getCin());
        dto.setPhoneNumber(patient.getPhoneNumber());
        return dto;
    }

    public static Patient toEntity(PatientDTO dto) {
        Patient patient = new Patient();
        patient.setId(dto.getId());
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setCin(dto.getCin());
        patient.setPhoneNumber(dto.getPhoneNumber());
        return patient;
    }
}
