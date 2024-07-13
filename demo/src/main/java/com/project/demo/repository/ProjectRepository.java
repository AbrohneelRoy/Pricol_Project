package com.project.demo.repository;

import com.project.demo.model.Project;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {

    Optional<Project> findByProjectName(String projectName);

    Optional<Project> findByProjectPIF(String projectPIF);

    @Query("SELECT p FROM Project p WHERE p.projectName = :projectName")
    Optional<Project> findProjectByProjectName(String projectName);

    @Query("SELECT COUNT(p.projectName) FROM Project p WHERE p.projectName IS NOT NULL AND p.projectName <> ''")
    long countDistinctProjectNames();

    @Query("SELECT COUNT(p.toolName) FROM Project p WHERE p.toolName IS NOT NULL AND p.toolName <> ''")
    long countDistinctToolNames();

    @Query("SELECT COUNT(p.empCode) FROM Project p WHERE p.empCode IS NOT NULL AND p.empCode <> ''")
    long countDistinctEmpCodes();

    @Query("SELECT COUNT(p.phase) FROM Project p WHERE p.phase = 'A100'")
    long countphase1();

    @Query("SELECT COUNT(p.phase) FROM Project p WHERE p.phase = 'B100'")
    long countphase2();

    @Query("SELECT COUNT(p.phase) FROM Project p WHERE p.phase = 'B200'")
    long countphase3();

    @Query("SELECT COUNT(p.phase) FROM Project p WHERE p.phase = 'C100'")
    long countphase4();

    @Query("SELECT COUNT(p.phase) FROM Project p WHERE p.phase = 'C200'")
    long countphase5();

    @Query("SELECT COUNT(p.phase) FROM Project p WHERE p.phase = 'D100'")
    long countphase6();

    @Query("SELECT COUNT(p.phase) FROM Project p WHERE p.phase = 'SOP'")
    long countphase7();

    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE project", nativeQuery = true)
    void truncateTable();

    @Query("SELECT DISTINCT p.phase FROM Project p") // Replace `columnName` with actual field names
    List<String> findDistinctColumns();

    @Query("SELECT DISTINCT p.projectName FROM Project p") // Replace `columnName` with actual field names
    List<String> findDistinctPnames();

    @Query("SELECT DISTINCT p.projectPIF FROM Project p") // Replace `columnName` with actual field names
    List<String> findDistinctPif();

    @Query("SELECT DISTINCT p.toolName FROM Project p") // Replace `columnName` with actual field names
    List<String> findDistinctTname();

    @Query("SELECT DISTINCT p.toolSerialName FROM Project p") // Replace `columnName` with actual field names
    List<String> findDistinctTSname();

    @Query("SELECT DISTINCT p.empCode FROM Project p") // Replace `columnName` with actual field names
    List<String> findDistinctEcode();

    @Query("SELECT DISTINCT p.humanResources FROM Project p") // Replace `columnName` with actual field names
    List<String> findDistinctHr();

    @Query("SELECT DISTINCT p.customer FROM Project p") // Replace `columnName` with actual field names
    List<String> findDistinctCus();

    @Query("SELECT MAX(p.sno) FROM Project p")
    Integer findMaxSno();

}
