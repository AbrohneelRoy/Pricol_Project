package com.project.demo.service;

import com.project.demo.model.Project;
import com.project.demo.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Iterable<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectByName(String projectName) {
        return projectRepository.findById(projectName);
    }

    public Optional<Project> getProjectByPIF(String projectPIF) {
        return projectRepository.findProjectByProjectPIF(projectPIF);
    }

    @Transactional
    public void deleteProjectByName(String projectName) {
        projectRepository.deleteById(projectName);
    }

    @Transactional
    public void deleteProjectByPIF(String projectPIF) {
        projectRepository.deleteByProjectPIF(projectPIF);
    }

    @Transactional
    public Project updateProject(Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProjectName(String oldProjectName, Project newProject) {
        Optional<Project> existingProjectOpt = projectRepository.findById(oldProjectName);
    
        if (existingProjectOpt.isPresent()) {
            Project existingProject = existingProjectOpt.get();
            
            // Delete the existing project
            projectRepository.delete(existingProject);
    
            // Create a new project with the updated name and the same other details
            Project updatedProject = new Project();
            updatedProject.setProjectName(newProject.getProjectName());
            updatedProject.setProjectPIF(newProject.getProjectPIF());
            updatedProject.setToolName(newProject.getToolName());
            updatedProject.setToolSerialName(newProject.getToolSerialName());
            updatedProject.setEmpCode(newProject.getEmpCode());
            updatedProject.setHumanResources(newProject.getHumanResources());
            updatedProject.setCustomer(newProject.getCustomer());
    
            // Save the new project
            return projectRepository.save(updatedProject);
        } else {
            throw new EntityNotFoundException("Project not found with name: " + oldProjectName);
        }
    }
    


    @Transactional
public ResponseEntity<?> updateProjectByPIF(String projectPIF, Project newProjectData) {
    Optional<Project> optionalProject = projectRepository.findProjectByProjectPIF(projectPIF);

    if (optionalProject.isPresent()) {
        Project existingProject = optionalProject.get();

        // Delete the existing project
        projectRepository.delete(existingProject);

        // Create a new project with the updated name and the same other details
        Project updatedProject = new Project();
        updatedProject.setProjectName(newProjectData.getProjectName());
        updatedProject.setProjectPIF(newProjectData.getProjectPIF());
        updatedProject.setToolName(newProjectData.getToolName());
        updatedProject.setToolSerialName(newProjectData.getToolSerialName());
        updatedProject.setEmpCode(newProjectData.getEmpCode());
        updatedProject.setHumanResources(newProjectData.getHumanResources());
        updatedProject.setCustomer(newProjectData.getCustomer());

        // Save the new project
        try {
            Project savedProject = projectRepository.save(updatedProject);
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Project updated successfully",
                    "project", savedProject
            ));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to update project",
                    "error", e.getMessage()
            ));
        }
    } else {
        return ResponseEntity.notFound().build();
    }
}

public long countDistinctProjectNames() {
    return projectRepository.countDistinctProjectNames();
}

public long countDistinctToolNames() {
    return projectRepository.countDistinctToolNames();
}

public long countDistinctEmpCodes() {
    return projectRepository.countDistinctEmpCodes();
}

}
