package ma.patient_service.controller;

import ma.patient_service.dto.DossierMedicalDTO;
import ma.patient_service.service.DossierMedicalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dossier-medical")
public class DossierMedicalController {
    private final DossierMedicalService dossierMedicalService;

    public DossierMedicalController(DossierMedicalService dossierMedicalService) {
        this.dossierMedicalService = dossierMedicalService;
    }

    @PostMapping("{id}/add")
    public ResponseEntity<DossierMedicalDTO> add(@PathVariable Long id, @RequestBody DossierMedicalDTO dossierMedicalDTO) {
        DossierMedicalDTO saved = dossierMedicalService.ajouterDossier(dossierMedicalDTO, id);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("{id}/")
    public ResponseEntity<List<DossierMedicalDTO>> getAllByid(@PathVariable Long id) {
        return ResponseEntity.ok(dossierMedicalService.getAllDossierMedicalByPatient(id));
    }

    @PatchMapping("{idPatient}/update/{idDossier}")
    public ResponseEntity<DossierMedicalDTO> Update(@PathVariable Long idPatient,@PathVariable Long idDossier,@RequestBody DossierMedicalDTO dossierMedicalDTO) {
        DossierMedicalDTO updated = dossierMedicalService.ModifierDossier(dossierMedicalDTO,idDossier,idPatient);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("{idPatient}/delete/{idDossier}")
    public void delete(@PathVariable Long idPatient,@PathVariable Long idDossier) {
        dossierMedicalService.DeleteDossier(idDossier, idPatient);
    }
}
