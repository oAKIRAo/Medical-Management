package ma.medecins_service.Service;

import ma.medecins_service.Model.Medecin;
import ma.medecins_service.dto.MedecinDTO;
import ma.medecins_service.exceptions.MedecinNotFound;
import ma.medecins_service.mapper.MedecinMapper;
import ma.medecins_service.repository.MedecinRepository;
import org.springframework.stereotype.Service;


import java.util.List;
@Service
public class MedecinService {

    private final MedecinRepository medecinRepository;

    public MedecinService(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }
    //Ajouter un medecin
    public MedecinDTO addMedecin(MedecinDTO dto) {
        Medecin medecin = MedecinMapper.toEntity(dto);
        Medecin saved = medecinRepository.save(medecin);
        return MedecinMapper.toDTO(saved);
    }
    //Lister
    public List<MedecinDTO> getAllMedecin() {
        return medecinRepository.findAll()
                .stream()
                .map(MedecinMapper::toDTO)
                .toList();
    }
    //Remove
    public void deleteMedecin(Long id) {
        if (!medecinRepository.existsById(id)) {
            throw new MedecinNotFound(id);
        }
        medecinRepository.deleteById(id);
    }
    //Modifier
    public MedecinDTO updateMedecin(Long id ,MedecinDTO dto) {
        Medecin medecin = medecinRepository.findById(id)
                .orElseThrow(() -> new MedecinNotFound(id));

        if(dto.getFirstname()!=null){medecin.setFirstname(dto.getFirstname());}
        if(dto.getLastname()!=null){medecin.setLastname(dto.getLastname());}
        if(dto.getMatricule()!=null){medecin.setMatricule(dto.getMatricule());}
        if(dto.getSpecialty()!=null){medecin.setSpecialty(dto.getSpecialty());}
        Medecin saved = medecinRepository.save(medecin);
        return MedecinMapper.toDTO(saved);
    }

}
