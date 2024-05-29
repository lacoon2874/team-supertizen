package sueprtizen.smartclothing.domain.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.location.dto.LocationKey;
import sueprtizen.smartclothing.domain.location.dto.SiGunGuDTO;
import sueprtizen.smartclothing.domain.location.entity.SiDo;
import sueprtizen.smartclothing.domain.location.entity.SiGunGu;

import java.util.List;

@Repository
public interface SiGunGuRepository extends JpaRepository<SiGunGu, Integer> {

    List<SiGunGuDTO> findAllBySiDo(SiDo sido);

    List<LocationKey> findAllByLocationKeyNotNull();
}
