package sueprtizen.smartclothing.domain.location.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class SiGunGu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private int siGunGuId;

    @Column(nullable = false)
    private String siGunGuName;

    @Column(nullable = false)
    private int locationKey;

    @ManyToOne
    @JoinColumn(name = "si_do_id", nullable = false)
    private SiDo siDo;

}

