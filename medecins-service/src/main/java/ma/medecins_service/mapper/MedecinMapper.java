package ma.medecins_service.mapper;

import ma.medecins_service.Model.Medecin;
import ma.medecins_service.dto.MedecinDTO;

public class MedecinMapper {
    public static MedecinDTO toDTO(Medecin medecin) {
        MedecinDTO dto = new MedecinDTO();
        dto.setId(medecin.getId());
        dto.setFirstname(medecin.getFirstname());
        dto.setLastname(medecin.getLastname());
        dto.setMatricule(medecin.getMatricule());
        dto.setSpecialty(medecin.getSpecialty());
        return dto;
    }
     public static Medecin toEntity(MedecinDTO dto) {
        Medecin medecin = new Medecin();
        medecin.setId(dto.getId());
        medecin.setFirstname(dto.getFirstname());
        medecin.setLastname(dto.getLastname());
        medecin.setMatricule(dto.getMatricule());
        medecin.setSpecialty(dto.getSpecialty());
        return medecin;
     }
}
