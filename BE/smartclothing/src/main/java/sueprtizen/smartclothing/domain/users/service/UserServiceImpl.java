package sueprtizen.smartclothing.domain.users.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sueprtizen.smartclothing.domain.users.dto.FamilyMembersResponseDTO;
import sueprtizen.smartclothing.domain.users.dto.UserDetailResponseDTO;
import sueprtizen.smartclothing.domain.users.dto.UserRequestDTO;
import sueprtizen.smartclothing.domain.users.dto.UserResponseDTO;
import sueprtizen.smartclothing.domain.users.entity.User;
import sueprtizen.smartclothing.domain.users.exception.UserErrorCode;
import sueprtizen.smartclothing.domain.users.exception.UserException;
import sueprtizen.smartclothing.domain.users.repository.UserRepository;

import java.util.List;


@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    /**
     * {@inheritDoc}
     */
    @Override
    public UserResponseDTO signIn(UserRequestDTO userRequestDTO) {
        User user = userRepository.findByEmail(userRequestDTO.email()).orElseThrow(()
                -> new UserException(UserErrorCode.NOT_FOUND_MEMBER));

        if (!user.getPassword().equals(userRequestDTO.password())) {
            throw new UserException(UserErrorCode.NOT_MATCH_PASSWORD);
        }

        return new UserResponseDTO(user.getUserId());
    }

    @Override
    public UserDetailResponseDTO getUserDetail(int userId) {
        User user = userRepository.findByUserId(userId).orElseThrow(()
                -> new UserException(UserErrorCode.NOT_FOUND_MEMBER));

        return new UserDetailResponseDTO(user.getAge(), user.getGender());
    }

    @Override
    public List<FamilyMembersResponseDTO> getFamilyMembers(int userId, boolean includeSelf) {
        User currentUser = userRepository.findByUserId(userId).orElseThrow(()
                -> new UserException(UserErrorCode.NOT_FOUND_MEMBER));

        List<FamilyMembersResponseDTO> members;
        if (includeSelf) {
            members = currentUser.getFamily().getUsers().stream()
                    .map(user -> new FamilyMembersResponseDTO(user.getUserId(), user.getUserName()))
                    .toList();
        } else {
            members = currentUser.getFamily().getUsers().stream().filter(u -> u.getUserId() != userId)
                    .map(user -> new FamilyMembersResponseDTO(user.getUserId(), user.getUserName()))
                    .toList();
        }

        return members;
    }


}
