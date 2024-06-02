package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.UserDTO;
import com.stuba.mathtrainerapi.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "role", source = "role")
    UserDTO toUserDTO(User user);

    @Mapping(target = "role", source = "role")//, defaultExpression = "java(com.stuba.mathtrainerapi.enums.Role.valueOf(userDTO.getRole()))")
    User toUser(UserDTO userDTO);
}