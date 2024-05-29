package sueprtizen.smartclothing.domain.clothing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class ClothingDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false)
    private int clothingDetailId;

    @Column(nullable = false)
    private String clothingImgPath;

    @Column(nullable = false)
    private String color;

    @OneToMany(mappedBy = "clothingDetail" ,fetch = FetchType.EAGER)
    @Column(nullable = false)
    private List<ClothingTexture> clothingTextures = new ArrayList<>();

    @Column
    private String rfidUid;

    @Column(nullable = false)
    private String category;

}
