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
@CrossOrigin(origins = "http://192.168.214.76:3000")
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

    @DeleteMapping("/truncate")
    public ResponseEntity<Void> truncateProjects() {
        projectService.truncateProjects();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countDistinctFields() {
        try {
            long projectCount = projectService.countDistinctProjectNames();
            long toolCount = projectService.countDistinctToolNames();
            long empCount = projectService.countDistinctEmpCodes();
            long phase1 = projectService.countphase1();
            long phase2 = projectService.countphase2();
            long phase3 = projectService.countphase3();
            long phase4 = projectService.countphase4();
            long phase5 = projectService.countphase5();
            long phase6 = projectService.countphase6();
            long phase7 = projectService.countphase7();

            return ResponseEntity.ok(Map.of(
                    "projectCount", projectCount,
                    "toolCount", toolCount,
                    "empCount", empCount,
                    "phase1", phase1,
                    "phase2", phase2,
                    "phase3", phase3, 
                    "phase4", phase4,
                    "phase5", phase5,
                    "phase6", phase6,
                    "phase7", phase7

            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/distinct-phase")
    public ResponseEntity<List<String>> getDistinctColumns() {
        List<String> distinctColumns = projectService.findDistinctColumns();
        return ResponseEntity.ok().body(distinctColumns);
    }

    @GetMapping("/distinct-pname")
    public ResponseEntity<List<String>> getDistinctPnames() {
        List<String> distinctColumns = projectService.findDistinctPnames();
        return ResponseEntity.ok().body(distinctColumns);
    }

    @GetMapping("/distinct-pif")
    public ResponseEntity<List<String>> getDistinctPif() {
        List<String> distinctColumns = projectService.findDistinctPif();
        return ResponseEntity.ok().body(distinctColumns);
    }

    @GetMapping("/distinct-tname")
    public ResponseEntity<List<String>> getDistinctTname() {
        List<String> distinctColumns = projectService.findDistinctTname();
        return ResponseEntity.ok().body(distinctColumns);
    }

    @GetMapping("/distinct-tsname")
    public ResponseEntity<List<String>> getDistinctTSname() {
        List<String> distinctColumns = projectService.findDistinctTSname();
        return ResponseEntity.ok().body(distinctColumns);
    }

    @GetMapping("/distinct-ecode")
    public ResponseEntity<List<String>> getDistinctEcode() {
        List<String> distinctColumns = projectService.findDistinctEcode();
        return ResponseEntity.ok().body(distinctColumns);
    }

    @GetMapping("/distinct-hr")  
    public ResponseEntity<List<String>> getDistinctHr() {
        List<String> distinctColumns = projectService.findDistinctHr();
        return ResponseEntity.ok().body(distinctColumns);
    }

    @GetMapping("/distinct-cus")
    public ResponseEntity<List<String>> getDistinctCus() {
        List<String> distinctColumns = projectService.findDistinctCus();
        return ResponseEntity.ok().body(distinctColumns);
    }

} 
    