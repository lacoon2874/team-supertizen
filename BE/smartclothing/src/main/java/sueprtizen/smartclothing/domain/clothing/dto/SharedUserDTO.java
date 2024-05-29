package sueprtizen.smartclothing.domain.clothing.dto;

import sueprtizen.smartclothing.domain.users.entity.User;

public record SharedUserDTO(
        int userId,
        String userName
) {
    public SharedUserDTO(User user) {
        this(user.getUserId(), user.getUserName());
    }
}
