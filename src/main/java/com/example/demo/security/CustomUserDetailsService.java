package com.example.demo.security;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

        @Autowired
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                logger.info("Loading user by username: {}", username);
                User user = userRepository.findByEmail(username)
                                .orElseThrow(() -> {
                                        logger.warn("User not found with email: {}", username);
                                        return new UsernameNotFoundException("User not found with email: " + username);
                                });

                logger.info("User found: {}. Stored password length: {}", user.getEmail(),
                                user.getPassword() != null ? user.getPassword().length() : 0);
                if (user.getPassword() != null) {
                        logger.info("Stored password starts with: {}",
                                        user.getPassword().length() >= 5 ? user.getPassword().substring(0, 5) : "???");
                }

                return org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .authorities(user.getRole() != null
                                                ? Collections.singletonList(
                                                                new SimpleGrantedAuthority("ROLE_" + user.getRole()
                                                                                .getName().toUpperCase()))
                                                : Collections.emptyList())
                                .build();
        }
}
