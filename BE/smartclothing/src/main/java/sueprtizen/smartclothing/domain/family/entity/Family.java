package sueprtizen.smartclothing.domain.family.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import sueprtizen.smartclothing.domain.users.entity.User;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class Family {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int familyId;

    @Column
    private int washerId;

    @Column
    private int airDresserId;

    @OneToMany(mappedBy = "family")
    private List<User> users = new ArrayList<>();
}
