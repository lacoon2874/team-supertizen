package sueprtizen.smartclothing.domain.clothing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sueprtizen.smartclothing.domain.clothing.entity.Texture;

import java.util.Optional;

public interface TextureRepository extends JpaRepository<Texture, Integer> {
    Optional<Texture> findByTextureName(String TextureName);
}
