package com.project.demo.service;

import com.project.demo.model.Project;
import com.project.demo.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional
    public Project createProject(Project project) {
        Integer maxSno = projectRepository.findMaxSno();
        if (maxSno == null) {
            maxSno = 0;
        }
        project.setSno(maxSno + 1);
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
            existingProject.setPhase(newProjectData.getPhase());
            existingProject.setSitstartdate(newProjectData.getSitstartdate());
            existingProject.setSitenddate(newProjectData.getSitenddate());
            existingProject.setSwdvstartdate(newProjectData.getSwdvstartdate());
            existingProject.setSwdvenddate(newProjectData.getSwdvenddate());
            existingProject.setSwcustomerrel(newProjectData.getSwcustomerrel());
            existingProject.setSwwindchillrel(newProjectData.getSwwindchillrel());

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

    public long countphase1() {
        return projectRepository.countphase1();
    }

    public long countphase2() {
        return projectRepository.countphase2();
    }

    public long countphase3() {
        return projectRepository.countphase3();
    }

    public long countphase4() {
        return projectRepository.countphase4();
    }

    public long countphase5() {
        return projectRepository.countphase5();
    }

    public long countphase6() {
        return projectRepository.countphase6();
    }

    public long countphase7() {
        return projectRepository.countphase7();
    }

    @Transactional
    public void truncateProjects() {
        projectRepository.truncateTable();
    }

    public List<String> findDistinctColumns() {
        return projectRepository.findDistinctColumns(); // Implement this in your repository
    }

    public List<String> findDistinctPnames() {
        return projectRepository.findDistinctPnames(); // Implement this in your repository
    }

    public List<String> findDistinctPif() {
        return projectRepository.findDistinctPif(); // Implement this in your repository
    }

    public List<String> findDistinctTname() {
        return projectRepository.findDistinctTname(); // Implement this in your repository
    }

    public List<String> findDistinctTSname() {
        return projectRepository.findDistinctTSname(); // Implement this in your repository
    }

    public List<String> findDistinctEcode() {
        return projectRepository.findDistinctEcode(); // Implement this in your repository
    }

    public List<String> findDistinctHr() {
        return projectRepository.findDistinctHr(); // Implement this in your repository
    }

    public List<String> findDistinctCus() {
        return projectRepository.findDistinctCus(); // Implement this in your repository
    }



}
