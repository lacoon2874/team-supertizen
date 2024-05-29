package sueprtizen.smartclothing.domain.clothing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;
import sueprtizen.smartclothing.domain.clothing.entity.ClothingStyle;

@Repository
public interface ClothingStyleRepository extends JpaRepository<ClothingStyle, Integer>{

    void deleteAllByClothing(Clothing clothing);
}
