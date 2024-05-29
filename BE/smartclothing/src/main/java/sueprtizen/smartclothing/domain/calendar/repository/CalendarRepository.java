package sueprtizen.smartclothing.domain.calendar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.calendar.entity.Schedule;
import sueprtizen.smartclothing.domain.users.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<Schedule, Integer> {

    @Query("select s from Schedule s where s.user = :user and s.scheduleDisabled = false and s.date < :date order by s.date asc")
    List<Schedule> findAllByUserOrderByDateAsc(User user, LocalDate date);

    @Query("select s from Schedule s where s.user = :user and s.scheduleDisabled = false and s.date between :startDate and :endDate order by s.date asc")
    List<Schedule> findSchedulesByUserAndDateBetweenOrderByDateAsc(User user, LocalDate startDate, LocalDate endDate);

    @Query("select s from Schedule s where s.user = :user and s.scheduleDisabled = false and s.date = :date")
    Optional<Schedule> findScheduleByUserAndDate(User user, LocalDate date);

    @Query("select s from Schedule s where s.user = :user and s.scheduleDisabled = false and s.scheduleId = :scheduleId")
    Optional<Schedule> findScheduleByUserAndScheduleId(User user, int scheduleId);
}
