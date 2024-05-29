package sueprtizen.smartclothing.domain.outfit.past.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.outfit.past.entity.PastOutfit;
import sueprtizen.smartclothing.domain.users.entity.User;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PastOutfitRepository extends JpaRepository<PastOutfit, Integer> {

    List<PastOutfit> findAllBySchedule_UserAndSchedule_Date(User user, LocalDate date);

    void deleteAllBySchedule_UserAndSchedule_Date(User user, LocalDate date);

}
