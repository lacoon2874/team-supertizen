package sueprtizen.smartclothing.domain.clothing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sueprtizen.smartclothing.domain.clothing.entity.ClothingDetail;

public interface ClothingDetailRepository extends JpaRepository<ClothingDetail, Integer> {
    ClothingDetail findByClothingDetailId(Integer id);

    ClothingDetail findByRfidUid(String rfid);
}
