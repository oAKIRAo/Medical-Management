package ma.patient_service.controller;

import ma.patient_service.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/countP")
    public Long countPatients() {
        return analyticsService.getTotalPatients();
    }
    @GetMapping("/countD")
    public Long countDocs() {
        return analyticsService.getTotalDossiers();
    }
}
