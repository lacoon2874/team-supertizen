package sueprtizen.smartclothing.socket.machine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;

import java.util.List;

@Repository
public interface WasherRepository extends JpaRepository<Clothing, Integer> {

    List<Clothing> findAllByNowAt(String location);

    List<Clothing> findTop2ByNowAt(String location);
}
