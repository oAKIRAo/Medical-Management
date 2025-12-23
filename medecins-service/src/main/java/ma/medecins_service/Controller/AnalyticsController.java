package ma.medecins_service.Controller;

import ma.medecins_service.Service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }
    @GetMapping("/per-doctor")
    public ResponseEntity<Map<String, Long>> appointmentsPerDoctor() {
        return ResponseEntity.ok(analyticsService.getAppointmentsPerDoctor());
    }
    //total des medecins
    @GetMapping("/countM")
    public Long countMedecins() {
        return analyticsService.getMedecinCount();
    }

    //total des rendez-vous
    @GetMapping("/countA")
    public Long countAppointments() {
        return analyticsService.getTotalAppointments();
    }
}
