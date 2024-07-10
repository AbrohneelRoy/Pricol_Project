package com.project.demo.model;

import jakarta.persistence.*;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer sno;
    private String projectName;
    private String projectPIF;
    private String toolName;
    private String toolSerialName;
    private String empCode;
    private String humanResources;
    private String customer;
    private String phase;
    private String softwareSOPActualDate;
    private String softwareSOPPlannedDate;
    private String ddeffortsActual;
    private String ddeffortsPlanned;
    private String ddAmountActual;
    private String ddAmountPlanned;
    private String sopActualEndDate;
    private String sopPlannedEndDate;

    public void setPhase(String phase){
        this.phase = phase;
    }

    public String getPhase(){
        return phase;
    }

    public Integer getSno() {
        return sno;
    }

    public void setSno(Integer sno) {
        this.sno = sno;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectPIF() {
        return projectPIF;
    }

    public void setProjectPIF(String projectPIF) {
        this.projectPIF = projectPIF;
    }

    public String getToolName() {
        return toolName;
    }

    public void setToolName(String toolName) {
        this.toolName = toolName;
    }

    public String getToolSerialName() {
        return toolSerialName;
    }

    public void setToolSerialName(String toolSerialName) {
        this.toolSerialName = toolSerialName;
    }

    public String getEmpCode() {
        return empCode;
    }

    public void setEmpCode(String empCode) {
        this.empCode = empCode;
    }

    public String getHumanResources() {
        return humanResources;
    }

    public void setHumanResources(String humanResources) {
        this.humanResources = humanResources;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getSoftwareSOPActualDate() {
        return softwareSOPActualDate;
    }

    public void setSoftwareSOPActualDate(String softwareSOPActualDate) {
        this.softwareSOPActualDate = softwareSOPActualDate;
    }

    public String getSoftwareSOPPlannedDate() {
        return softwareSOPPlannedDate;
    }

    public void setSoftwareSOPPlannedDate(String softwareSOPPlannedDate) {
        this.softwareSOPPlannedDate = softwareSOPPlannedDate;
    }

    public String getDdeffortsActual() {
        return ddeffortsActual;
    }

    public void setDdeffortsActual(String ddeffortsActual) {
        this.ddeffortsActual = ddeffortsActual;
    }

    public String getDdeffortsPlanned() {
        return ddeffortsPlanned;
    }

    public void setDdeffortsPlanned(String ddeffortsPlanned) {
        this.ddeffortsPlanned = ddeffortsPlanned;
    }

    public String getDdAmountActual() {
        return ddAmountActual;
    }

    public void setDdAmountActual(String ddAmountActual) {
        this.ddAmountActual = ddAmountActual;
    }

    public String getDdAmountPlanned() {
        return ddAmountPlanned;
    }

    public void setDdAmountPlanned(String ddAmountPlanned) {
        this.ddAmountPlanned = ddAmountPlanned;
    }

    public String getSopActualEndDate() {
        return sopActualEndDate;
    }

    public void setSopActualEndDate(String sopActualEndDate) {
        this.sopActualEndDate = sopActualEndDate;
    }

    public String getSopPlannedEndDate() {
        return sopPlannedEndDate;
    }

    public void setSopPlannedEndDate(String sopPlannedEndDate) {
        this.sopPlannedEndDate = sopPlannedEndDate;
    }

    // Constructors
    public Project() {
        // Default constructor
    }

    public Project(String projectName, String projectPIF, String toolName, String toolSerialName, String empCode,
            String humanResources, String customer, String softwareSOPActualDate, String softwareSOPPlannedDate,
            String ddeffortsActual, String ddeffortsPlanned, String ddAmountActual, String ddAmountPlanned,
            String sopActualEndDate, String sopPlannedEndDate, String phase) {
        this.projectName = projectName;
        this.projectPIF = projectPIF;
        this.toolName = toolName;
        this.toolSerialName = toolSerialName;
        this.empCode = empCode;
        this.humanResources = humanResources;
        this.customer = customer;
        this.softwareSOPActualDate = softwareSOPActualDate;
        this.softwareSOPPlannedDate = softwareSOPPlannedDate;
        this.ddeffortsActual = ddeffortsActual;
        this.ddeffortsPlanned = ddeffortsPlanned;
        this.ddAmountActual = ddAmountActual;
        this.ddAmountPlanned = ddAmountPlanned;
        this.sopActualEndDate = sopActualEndDate;
        this.sopPlannedEndDate = sopPlannedEndDate;
        this.phase = phase;
    }

    // toString(), equals(), hashCode() methods if needed

}
