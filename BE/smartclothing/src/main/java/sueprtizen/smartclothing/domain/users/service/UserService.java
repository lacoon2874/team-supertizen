package sueprtizen.smartclothing.domain.users.service;

import sueprtizen.smartclothing.domain.users.dto.FamilyMembersResponseDTO;
import sueprtizen.smartclothing.domain.users.dto.UserDetailResponseDTO;
import sueprtizen.smartclothing.domain.users.dto.UserRequestDTO;
import sueprtizen.smartclothing.domain.users.dto.UserResponseDTO;

import java.util.List;

public interface UserService {

    /**
     * 로그인을 처리하고, 로그인 응답 데이터를 반환합니다.
     *
     * @param userRequestDTO - email, password
     * @return UserResponseDTO - userID
     */
    UserResponseDTO signIn(UserRequestDTO userRequestDTO);

    /**
     * 유저의 나이와 성별을 반환합니다.
     *
     * @return UserDetailResponseDTO
     */
    UserDetailResponseDTO getUserDetail(int userId);

    List<FamilyMembersResponseDTO> getFamilyMembers(int userId, boolean includeSelf);
}
