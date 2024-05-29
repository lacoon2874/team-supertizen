package sueprtizen.smartclothing.socket.clothes.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sueprtizen.smartclothing.domain.users.entity.User;
import sueprtizen.smartclothing.socket.clothes.dto.SocketUserResponseDTO;
import sueprtizen.smartclothing.socket.clothes.repository.SocketUserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SocketUserServiceImpl implements SocketUserService {
    private final SocketUserRepository userRepository;

    @Transactional(readOnly = true)
    public List<JSONObject> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<SocketUserResponseDTO> userDtos = users.stream().map(entity -> SocketUserResponseDTO.builder()
                .userId(entity.getUserId())
                .userName(entity.getUserName())
                .image(entity.getProfileImgPath())
                .build()
        ).collect(Collectors.toList());

        List<JSONObject> jsonArray = new ArrayList<JSONObject>();
        for (SocketUserResponseDTO dto : userDtos) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("userId", dto.userId());
            jsonObject.put("userName", dto.userName());
            jsonObject.put("image", dto.image());
            jsonArray.add(jsonObject);
        }

        return jsonArray;


    }
}
