package com.project.demo.service;

import com.project.demo.model.Project;
import com.project.demo.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Optional<Project> getProjectBySno(Integer sno) {
        return projectRepository.findById(sno);
    }

    @Transactional
    public void deleteProjectBySno(Integer sno) {
        projectRepository.deleteById(sno);
    }

    @Transactional
    public Project updateProject(Integer sno, Project newProjectData) {
        Optional<Project> optionalProject = projectRepository.findById(sno);

        if (optionalProject.isPresent()) {
            Project existingProject = optionalProject.get();

            // Update the fields with the new values
            existingProject.setProjectName(newProjectData.getProjectName());
            existingProject.setProjectPIF(newProjectData.getProjectPIF());
            existingProject.setToolName(newProjectData.getToolName());
            existingProject.setToolSerialName(newProjectData.getToolSerialName());
            existingProject.setEmpCode(newProjectData.getEmpCode());
            existingProject.setHumanResources(newProjectData.getHumanResources());
            existingProject.setCustomer(newProjectData.getCustomer());
            existingProject.setSoftwareSOPActualDate(newProjectData.getSoftwareSOPActualDate());
            existingProject.setSoftwareSOPPlannedDate(newProjectData.getSoftwareSOPPlannedDate());
            existingProject.setDdeffortsActual(newProjectData.getDdeffortsActual());
            existingProject.setDdeffortsPlanned(newProjectData.getDdeffortsPlanned());
            existingProject.setDdAmountActual(newProjectData.getDdAmountActual());
            existingProject.setDdAmountPlanned(newProjectData.getDdAmountPlanned());
            existingProject.setSopActualEndDate(newProjectData.getSopActualEndDate());
            existingProject.setSopPlannedEndDate(newProjectData.getSopPlannedEndDate());

            return projectRepository.save(existingProject);
        } else {
            throw new EntityNotFoundException("Project not found with S.no: " + sno);
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
