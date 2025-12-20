package ma.medecins_service.Service;

import ma.medecins_service.Feign.PatientFeignClient;
import ma.medecins_service.Model.Appointment;
import ma.medecins_service.Model.Medecin;
import ma.medecins_service.dto.AppointmentDTO;
import ma.medecins_service.dto.PatientDTO;
import ma.medecins_service.mapper.AppointmentMapper;
import ma.medecins_service.repository.AppointmentRepository;
import ma.medecins_service.repository.MedecinRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final MedecinRepository medecinRepository;
    private final PatientFeignClient patientFeignClient;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              MedecinRepository medecinRepository,
                              PatientFeignClient patientFeignClient) {
        this.appointmentRepository = appointmentRepository;
        this.medecinRepository = medecinRepository;
        this.patientFeignClient = patientFeignClient;
    }
    //create appointments
    public AppointmentDTO createAppointment(AppointmentDTO dto) {

        Medecin medecin = medecinRepository.findById(dto.getMedecinId())
                .orElseThrow(() -> new RuntimeException("Médecin introuvable"));

        PatientDTO patient = patientFeignClient.getPatientById(dto.getPatientId());
        if (patient == null) {
            throw new RuntimeException("Patient introuvable");
        }
        if (dto.getPatientCin() != null && !dto.getPatientCin().equals(patient.getCin())) {
            throw new RuntimeException("Erreur : CIN du patient ne correspond pas !");
        }

        Appointment appointment = AppointmentMapper.toEntity(dto, medecin);
        Appointment saved = appointmentRepository.save(appointment);

        return AppointmentMapper.toDTO(saved, patient);
    }
    //Display all appointments
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(appointment -> {
            PatientDTO patient = patientFeignClient.getPatientById(appointment.getPatientId());
            return AppointmentMapper.toDTO(appointment, patient);
        }).collect(Collectors.toList());
    }
    // Remove an appointment
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Rendez-vous introuvable");
        }
        appointmentRepository.deleteById(id);
    }
    //Update appointment
    public AppointmentDTO updateAppointment(Long id, AppointmentDTO dto) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (dto.getDate() != null) {
            existing.setDate(dto.getDate());
        }
        if (dto.getHeure() != null) {
            existing.setHeure(dto.getHeure());
        }

        if (dto.getPatientId() != null) {
            existing.setPatientId(dto.getPatientId());
        }

        if (dto.getMedecinId() != null) {
            Medecin medecin = medecinRepository.findById(dto.getMedecinId())
                    .orElseThrow(() -> new RuntimeException("Medecin not found"));
            existing.setMedecin(medecin);
        }

        Appointment updated = appointmentRepository.save(existing);

        AppointmentDTO updatedDto = new AppointmentDTO();
        updatedDto.setId(updated.getId());
        updatedDto.setDate(updated.getDate());
        updatedDto.setHeure(updated.getHeure());
        updatedDto.setPatientId(updated.getPatientId());

        // si le patient existe on affiche ses info
        if (updated.getPatientId() != null) {
            PatientDTO patient = patientFeignClient.getPatientById(updated.getPatientId());
            updatedDto.setPatientFirstName(patient.getFirstName());
            updatedDto.setPatientLastName(patient.getLastName());
            updatedDto.setPatientPhone(patient.getPhoneNumber());
            updatedDto.setPatientCin(patient.getCin());
        }

        if (updated.getMedecin() != null) {
            updatedDto.setMedecinId(updated.getMedecin().getId());
            updatedDto.setMedecinNom(updated.getMedecin().getLastname());
        }

        return updatedDto;
    }



}

