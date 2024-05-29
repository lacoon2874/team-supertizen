package sueprtizen.smartclothing.domain.clothing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class Texture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int textureId;

    @Column(nullable = false)
    private String textureName;

    @OneToMany(mappedBy = "texture")
    private List<ClothingTexture> clothingTextures = new ArrayList<>();

}
