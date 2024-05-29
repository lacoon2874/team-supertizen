package sueprtizen.smartclothing.domain.family.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.family.entity.Family;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Integer> {

}
