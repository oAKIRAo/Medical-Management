package ma.medecins_service.Controller;

import ma.medecins_service.Service.MedecinService;
import ma.medecins_service.dto.MedecinDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medecins")
public class MedecinController {
    private final MedecinService medecinService;
    public MedecinController(MedecinService medecinService) {
        this.medecinService = medecinService;
    }
    @PostMapping("/add")
    public ResponseEntity<MedecinDTO> addMedecin(@RequestBody MedecinDTO m) {
            MedecinDTO saved = medecinService.addMedecin(m);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    @GetMapping("/")
    public List<MedecinDTO> getMedecins() {
        return medecinService.getAllMedecin();
    }
    @DeleteMapping("delete/{id}")
        public ResponseEntity<Void> deleteMedecin(@PathVariable Long id) {
             medecinService.deleteMedecin(id);
             return ResponseEntity.noContent().build();
        }
    @PatchMapping("/update/{id}")
    public MedecinDTO updateMedecin(@PathVariable Long id,@RequestBody MedecinDTO m) {
        return medecinService.updateMedecin(id, m);
    }

}
