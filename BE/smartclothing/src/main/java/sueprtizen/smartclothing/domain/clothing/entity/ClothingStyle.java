package sueprtizen.smartclothing.domain.clothing.entity;

import jakarta.persistence.*;
import lombok.*;


@NoArgsConstructor
@Getter
@Entity
public class ClothingStyle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "style_connection_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "style_id")
    private Style style;

    @ManyToOne
    @JoinColumn(name = "clothing_id")
    private Clothing clothing;

    @Builder
    public ClothingStyle(Style style, Clothing clothing) {
        this.style = style;
        this.clothing = clothing;
    }

}
