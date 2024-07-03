package com.project.demo.controller;

import com.project.demo.model.Project;
import com.project.demo.service.ProjectService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "http://192.168.202.76:3000")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        try {
            Project newProject = projectService.createProject(project);
            return ResponseEntity.ok(Map.of("success", true, "message", "Project created successfully", "project", newProject));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = (List<Project>) projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{sno}")
    public ResponseEntity<Project> getProjectBySno(@PathVariable Integer sno) {
        try {
            return projectService.getProjectBySno(sno)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{sno}")
    public ResponseEntity<Void> deleteProjectBySno(@PathVariable Integer sno) {
        try {
            projectService.deleteProjectBySno(sno);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{sno}")
    public ResponseEntity<?> updateProject(@PathVariable Integer sno, @RequestBody Project newProject) {
        try {
            Project updatedProject = projectService.updateProject(sno, newProject);
            return ResponseEntity.ok(Map.of("success", true, "message", "Project updated successfully", "project", updatedProject));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countDistinctFields() {
        try {
            long projectCount = projectService.countDistinctProjectNames();
            long toolCount = projectService.countDistinctToolNames();
            long empCount = projectService.countDistinctEmpCodes();

            return ResponseEntity.ok(Map.of(
                    "projectCount", projectCount,
                    "toolCount", toolCount,
                    "empCount", empCount
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
