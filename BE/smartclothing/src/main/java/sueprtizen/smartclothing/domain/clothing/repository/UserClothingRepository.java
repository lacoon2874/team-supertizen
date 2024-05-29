package sueprtizen.smartclothing.domain.clothing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;
import sueprtizen.smartclothing.domain.clothing.entity.UserClothing;
import sueprtizen.smartclothing.domain.users.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserClothingRepository extends JpaRepository<UserClothing, Integer> {

    List<UserClothing> findAllByUser(User user);

    // 나를 제외한 모든 사용자 조회
    @Query("SELECT uc.user.userId FROM UserClothing uc WHERE uc.clothing.clothingId = :clothingId AND uc.user.userId != :userId")
    Set<Integer> findSharedUsersByClothingIdAndUserId(int clothingId, int userId);


    @Query("select uc from UserClothing uc where uc.user = ?1 and uc.clothing = ?2")
    Optional<UserClothing> findUserClothingByClothing(User user, Clothing clothing);

}
