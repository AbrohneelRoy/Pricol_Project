package com.project.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.demo.model.Login;
import com.project.demo.service.LoginService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping
    public Login createLogin(@RequestBody Login login) {
        return loginService.createLogin(login);
    }

    @GetMapping
    public List<Login> getAllLogins() {
        return loginService.getAllLogins();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Login> getLoginById(@PathVariable Long id) {
        return loginService.getLoginById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLogin(@PathVariable Long id) {
        if (loginService.getLoginById(id).isPresent()) {
            loginService.deleteLogin(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkLogin(@RequestBody Login login) {
        Login existingLogin = loginService.findByUsername(login.getUsername());
        if (existingLogin != null && existingLogin.getPassword().equals(login.getPassword())) {
            if ("admin".equals(existingLogin.getUsername().toLowerCase())) {
                // Provide additional information or functionality for admin
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful!");
                response.put("isAdmin", true); // Example of flag for admin status
                return ResponseEntity.ok(response);
            } else {
                // Regular user login success
                return ResponseEntity.ok(Map.of("success", true, "message", "Login successful!"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Invalid username or password"));
        }
    }
    

}
