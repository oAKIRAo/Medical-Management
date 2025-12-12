package ma.patient_service.mapper;
import ma.patient_service.Model.DossierMedical;
import ma.patient_service.dto.DossierMedicalDTO;

public class DossierMedicalMapper {
    public static DossierMedicalDTO toDTO(DossierMedical dossierMedical) {
        DossierMedicalDTO dto = new DossierMedicalDTO();
        dto.setId(dossierMedical.getId());
        dto.setLogs(dossierMedical.getLogs());
        dto.setAllergies(dossierMedical.getAllergies());
        if(dossierMedical.getPatient() != null) {
            dto.setPatient(PatientMapper.toDTO(dossierMedical.getPatient()));
        }
        return dto;
    }
    public static DossierMedical toEntity(DossierMedicalDTO dto) {
        DossierMedical dossierMedical = new DossierMedical();
        dossierMedical.setId(dto.getId());
        dossierMedical.setLogs(dto.getLogs());
        dossierMedical.setAllergies(dto.getAllergies());
        if(dto.getPatient() != null) {
            dossierMedical.setPatient(PatientMapper.toEntity(dto.getPatient()));
        }
        return dossierMedical;
    }
}
