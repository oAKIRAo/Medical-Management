package ma.medecins_service.Controller;


import ma.medecins_service.dto.AppointmentDTO;
import ma.medecins_service.Service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Créer un rendez-vous
    @PostMapping("/create")
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO dto) {
        AppointmentDTO response = appointmentService.createAppointment(dto);
        return ResponseEntity.ok(response);
    }

    // Lister tous les rendez-vous
    @GetMapping("/")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        List<AppointmentDTO> list = appointmentService.getAllAppointments();
        return ResponseEntity.ok(list);
    }

    // Supprimer un rendez-vous
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Rendez-vous supprimé avec succès");
    }
    //Modifier un rendez-vous
    @PatchMapping("/update/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentDTO appointmentDTO) {
        AppointmentDTO updated = appointmentService.updateAppointment(id, appointmentDTO);
        return ResponseEntity.ok(updated);
    }
}
