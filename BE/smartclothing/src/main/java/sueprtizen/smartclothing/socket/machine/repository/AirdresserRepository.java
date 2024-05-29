package sueprtizen.smartclothing.socket.machine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sueprtizen.smartclothing.domain.calendar.entity.Schedule;

import java.time.LocalDate;
import java.util.List;

public interface AirdresserRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findAllByDateIsAfter(LocalDate today);

    List<Schedule> findTop2ByDateIsAfter(LocalDate today);
}
