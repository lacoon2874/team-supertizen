package sueprtizen.smartclothing.domain.clothing.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity

public class Clothing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int clothingId;

    @OneToMany(mappedBy = "clothing", fetch = FetchType.EAGER)
    private List<UserClothing> userClothing;

    @ManyToOne
    @JoinColumn(name = "clothing_detail_id")
    private ClothingDetail clothingDetail;

    @OneToMany(mappedBy = "clothing", fetch = FetchType.EAGER)
    private List<ClothingStyle> clothingStyleList;

    @Column
    private int ownerId;

    @Column
    private String nowAt;

    @Column(name = "RFID_uid")
    private String rfidUid;

    @Column
    private LocalDateTime washedAt;

    @Column
    private LocalDateTime locationModifiedAt;

    @Column
    private int polluted;

    @Column
    private int wornCount;

    @Column
    private String category;

    public void updateClothing(List<ClothingStyle> clothingStyleList, String category) {
        this.clothingStyleList = clothingStyleList;
        this.category = category;
    }

    @Builder
    public Clothing(String rfidUid, ClothingDetail detail,Integer ownerId){
        this.rfidUid=rfidUid;
        this.clothingDetail=detail;
        this.category=detail.getCategory();
        this.nowAt="옷장";
        this.washedAt=LocalDateTime.now();
        this.ownerId=ownerId;
        this.locationModifiedAt=LocalDateTime.now();
    }

    public void updateNowAt(String machine) {
        this.nowAt = machine;
        locationModifiedAt = LocalDateTime.now();
    }

    public void updateWashedAt() {
        this.washedAt = LocalDateTime.now();
    }


}
