package sueprtizen.smartclothing.socket.clothes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.users.entity.User;

import java.util.List;

@Repository
public interface SocketUserRepository extends JpaRepository<User, Integer> {

    List<User> findAll();

}
