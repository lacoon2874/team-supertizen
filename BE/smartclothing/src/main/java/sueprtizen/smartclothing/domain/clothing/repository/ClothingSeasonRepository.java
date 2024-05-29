package sueprtizen.smartclothing.domain.clothing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.clothing.entity.ClothingSeason;
import sueprtizen.smartclothing.domain.clothing.entity.UserClothing;

@Repository
public interface ClothingSeasonRepository extends JpaRepository<ClothingSeason, Integer>{

    void deleteAllByUserClothing(UserClothing userClothing);
}
