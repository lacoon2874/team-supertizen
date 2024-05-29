package sueprtizen.smartclothing.domain.clothing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class Style {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int styleId;

    @Column(nullable = false)
    private String styleName;

    @OneToMany(mappedBy = "style")
    private List<ClothingStyle> clothingStyles = new ArrayList<>();

}
