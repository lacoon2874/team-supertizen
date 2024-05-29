package sueprtizen.smartclothing.domain.clothing.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class ClothingTexture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long TextureConnectionId;

    @ManyToOne
    @JoinColumn(name = "texture_id", nullable = false)
    private Texture texture;

    @ManyToOne
    @JoinColumn(name = "clothing_detail_id", nullable = false)
    private ClothingDetail clothingDetail;

    @Builder
    public ClothingTexture(Texture texture, ClothingDetail clothingDetail) {
        this.texture = texture;
        this.clothingDetail = clothingDetail;
    }
}
