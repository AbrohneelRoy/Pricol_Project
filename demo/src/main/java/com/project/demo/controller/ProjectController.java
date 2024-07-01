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
        if (projectService.getProjectByName(project.getProjectName()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Project name already exists"));
        }

        Project newProject = projectService.createProject(project);
        return ResponseEntity.ok(Map.of("success", true, "message", "Project created successfully", "project", newProject));
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return (List<Project>) projectService.getAllProjects();
    }

    @GetMapping("/name/{projectName}")
    public ResponseEntity<Project> getProjectByName(@PathVariable String projectName) {
        return projectService.getProjectByName(projectName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pif/{projectPIF}")
    public ResponseEntity<Project> getProjectByPIF(@PathVariable String projectPIF) {
        return projectService.getProjectByPIF(projectPIF)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/name/{projectName}")
    public ResponseEntity<Void> deleteProjectByName(@PathVariable String projectName) {
        projectService.deleteProjectByName(projectName);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/pif/{projectPIF}")
    public ResponseEntity<Void> deleteProjectByPIF(@PathVariable String projectPIF) {
        projectService.deleteProjectByPIF(projectPIF);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/name/{oldProjectName}")
public ResponseEntity<?> updateProjectName(@PathVariable String oldProjectName, @RequestBody Project newProject) {
    try {
        Project updatedProject = projectService.updateProjectName(oldProjectName, newProject);
        return ResponseEntity.ok(Map.of("success", true, "message", "Project updated successfully", "project", updatedProject));
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
    }
}


    @PutMapping("/pif/{projectPIF}")
    public ResponseEntity<?> updateProjectByPIF(@PathVariable String projectPIF, @RequestBody Project newProject) {
        ResponseEntity<?> responseEntity = projectService.updateProjectByPIF(projectPIF, newProject);
        return responseEntity;
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> countDistinctFields() {
        long projectCount = projectService.countDistinctProjectNames();
        long toolCount = projectService.countDistinctToolNames();
        long empCount = projectService.countDistinctEmpCodes();
        
        return ResponseEntity.ok(Map.of(
                "projectCount", projectCount,
                "toolCount", toolCount,
                "empCount", empCount
        ));
    }

}
