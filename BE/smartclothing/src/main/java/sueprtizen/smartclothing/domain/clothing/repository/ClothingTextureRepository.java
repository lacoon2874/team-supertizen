package sueprtizen.smartclothing.domain.clothing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sueprtizen.smartclothing.domain.clothing.entity.ClothingDetail;
import sueprtizen.smartclothing.domain.clothing.entity.ClothingTexture;

public interface ClothingTextureRepository extends JpaRepository<ClothingTexture, Integer> {

    void deleteAllByClothingDetail(ClothingDetail clothingDetail);
}
