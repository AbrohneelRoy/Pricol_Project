package com.project.demo.repository;

import com.project.demo.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    Optional<Project> findProjectByProjectPIF(String projectPIF);
    void deleteByProjectPIF(String projectPIF);

    @Query("SELECT COUNT(DISTINCT p.projectName) FROM Project p WHERE p.projectName IS NOT NULL AND p.projectName <> ''")
    long countDistinctProjectNames();

    @Query("SELECT COUNT(DISTINCT p.toolName) FROM Project p WHERE p.toolName IS NOT NULL AND p.toolName <> ''")
    long countDistinctToolNames();

    @Query("SELECT COUNT(DISTINCT p.empCode) FROM Project p WHERE p.empCode IS NOT NULL AND p.empCode <> ''")
    long countDistinctEmpCodes();

}
