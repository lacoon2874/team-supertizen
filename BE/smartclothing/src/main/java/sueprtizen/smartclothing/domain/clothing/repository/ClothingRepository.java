package sueprtizen.smartclothing.domain.clothing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;

@Repository
public interface ClothingRepository extends JpaRepository<Clothing, Integer> {
    Clothing findByRfidUid(String rfid);

    Clothing findByClothingId(Integer id);

}
