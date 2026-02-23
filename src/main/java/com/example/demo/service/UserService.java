package com.example.demo.service;

import com.example.demo.annotation.Loggable;
import com.example.demo.dto.UserDTO;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> findAll() {
        return userMapper.toDTOs(userRepository.findAll());
    }

    public Optional<UserDTO> findById(Long id) {
        return userRepository.findById(id).map(userMapper::toDTO);
    }

    @Loggable(model = "Usuario", accion = "GUARDAR")
    public UserDTO save(UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        return userMapper.toDTO(userRepository.save(user));
    }

    @Loggable(model = "Usuario", accion = "ELIMINAR")
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<UserDTO> findByEmail(String email) {
        return userRepository.findByEmail(email).map(userMapper::toDTO);
    }

    public long countByRoleId(Long roleId) {
        return userRepository.countByRoleId(roleId);
    }

    // Keep the entity version for internal use (like Auth) if needed,
    // but better to have separate methods if they return User (entity)
    public Optional<User> findEntityByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
