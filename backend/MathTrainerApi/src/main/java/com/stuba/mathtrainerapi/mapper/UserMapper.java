package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.UserResponse;
import com.stuba.mathtrainerapi.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    // No inbound entity mapper: account writes explicitly choose permitted fields.
    UserResponse toUserResponse(User user);
}
