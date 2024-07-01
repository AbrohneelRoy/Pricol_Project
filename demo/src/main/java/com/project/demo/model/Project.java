package com.project.demo.model;


import jakarta.persistence.*;

@Entity
public class Project {

    @Id
    private String projectName;
    private String projectPIF;
    private String toolName;
    private String toolSerialName;
    private String empCode;
    private String humanResources;
    private String customer;

    // Constructors, getters, setters
    // Ensure all fields have appropriate getters and setters
    // Constructor(s) should initialize all fields

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
}
