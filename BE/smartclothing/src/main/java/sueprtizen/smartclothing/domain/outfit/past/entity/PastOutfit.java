package sueprtizen.smartclothing.domain.outfit.past.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import sueprtizen.smartclothing.domain.calendar.entity.Schedule;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;

@NoArgsConstructor
@Getter
@Entity
public class PastOutfit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pastOutfitId;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "clothing_id", nullable = false)
    private Clothing clothing;


    @Builder
    public PastOutfit(Schedule schedule, Clothing clothing) {
        this.schedule = schedule;
        this.clothing = clothing;
    }
}
