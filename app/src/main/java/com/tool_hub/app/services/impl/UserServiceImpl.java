package com.tool_hub.app.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.tool_hub.app.dtos.UserRegistrationDto;
import com.tool_hub.app.entities.Group;
import com.tool_hub.app.entities.User;
import com.tool_hub.app.exceptions.EmailExistsException;
import com.tool_hub.app.exceptions.GroupNotFoundException;
import com.tool_hub.app.exceptions.UsernameExistsException;
import com.tool_hub.app.exceptions.UsernameNotFoundException;
import com.tool_hub.app.repositories.GroupRepo;
import com.tool_hub.app.repositories.UserRepo;
import com.tool_hub.app.services.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private GroupRepo groupRepo;

    @Override
    public void registerUser(UserRegistrationDto dto) throws UsernameExistsException, EmailExistsException {
        User user = new User(dto);
        try {
            userRepo.save(user);
        } catch (DataIntegrityViolationException e) {
            // check if username or email exists and throw exception acordingly
            if (userRepo.findByUsername(dto.getUsername()).isPresent()) {
                throw new UsernameExistsException("");
            }
            if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
                throw new EmailExistsException("");
            }
        }
    }

    @Override
    public User getUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(""));
    }

    @Override
    public void updateUsersFirstLastName(UserRegistrationDto dto) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(dto.getUsername()).orElseThrow(() -> new UsernameNotFoundException(""));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        userRepo.save(user);
    }

    @Override
    public void deleteUser(String username) throws UsernameNotFoundException {
        if (!(userRepo.findByUsername(username).isPresent())) {
            throw new UsernameNotFoundException("");
        }
        userRepo.deleteByUsername(username);
    }

    @Override
    public void addUserToGroup(String username, String groupName)
            throws UsernameNotFoundException, GroupNotFoundException {
        User user = userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(""));
        Group group = groupRepo.findByName(groupName).orElseThrow(() -> new GroupNotFoundException(""));

        user.getGroups().add(group);
        userRepo.save(user);
    }

    @Override
    public void removeUserFromGroup(String username, String groupName)
            throws UsernameNotFoundException, GroupNotFoundException {
        User user = userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(""));
        user.getGroups().removeIf(group -> group.getName().equals(groupName));
    }

}
