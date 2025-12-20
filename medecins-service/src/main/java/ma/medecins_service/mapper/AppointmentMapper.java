package ma.medecins_service.mapper;


import ma.medecins_service.Model.Appointment;
import ma.medecins_service.Model.Medecin;
import ma.medecins_service.dto.AppointmentDTO;
import ma.medecins_service.dto.PatientDTO;

public class AppointmentMapper {


    public static AppointmentDTO toDTO(Appointment appointment, PatientDTO patient) {
        if (appointment == null) return null;

        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setDate(appointment.getDate());
        dto.setHeure(appointment.getHeure());
        dto.setPatientId(appointment.getPatientId());
        dto.setMedecinId(appointment.getMedecin().getId());
        dto.setMedecinNom(appointment.getMedecin().getLastname());

        if (patient != null) {
            dto.setPatientFirstName(patient.getFirstName());
            dto.setPatientLastName(patient.getLastName());
            dto.setPatientCin(patient.getCin());
            dto.setPatientPhone(patient.getPhoneNumber());
        }

        return dto;
    }

    
    public static Appointment toEntity(AppointmentDTO dto, Medecin medecin) {
        if (dto == null) return null;

        Appointment appointment = new Appointment();
        appointment.setId(dto.getId());
        appointment.setDate(dto.getDate());
        appointment.setHeure(dto.getHeure());
        appointment.setPatientId(dto.getPatientId());
        appointment.setMedecin(medecin);

        return appointment;
    }
}

