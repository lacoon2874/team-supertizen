package sueprtizen.smartclothing.domain.outfit.recommended.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import sueprtizen.smartclothing.domain.calendar.entity.Schedule;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;

@NoArgsConstructor
@Getter
@Entity
public class RecommendedOutfit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recommendedOutfitId;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "clothing_id", nullable = false)
    private Clothing clothing;

    private int x;

    private int y;

    private int width;

    private int height;

    @Builder
    public RecommendedOutfit(Schedule schedule, Clothing clothing, int x, int y, int width, int height) {
        this.schedule = schedule;
        this.clothing = clothing;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
