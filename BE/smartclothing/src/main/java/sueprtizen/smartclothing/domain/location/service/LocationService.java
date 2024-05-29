package sueprtizen.smartclothing.domain.location.service;

import sueprtizen.smartclothing.domain.location.dto.LocationKey;
import sueprtizen.smartclothing.domain.location.dto.SiDoResponseDTO;
import sueprtizen.smartclothing.domain.location.dto.SiGunGuResponseDTO;

import java.util.List;

public interface LocationService {
    SiDoResponseDTO AllSiDo();

    SiGunGuResponseDTO AllSiGunGuInSiDo(int siDoId);

    List<Integer> findAllLocationKeys();
}
