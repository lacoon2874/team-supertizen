package sueprtizen.smartclothing.domain.location.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class SiDo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int siDoId;

    @Column(nullable = false)
    private String siDoName;

    @OneToMany(mappedBy = "siDo")
    private List<SiGunGu> siGunGus = new ArrayList<>();
}
