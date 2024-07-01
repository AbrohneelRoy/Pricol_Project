import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import styles from './Projects.module.css';
import logoImage from './image.png';

const Projects = () => {
  const username = localStorage.getItem('username');
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    projectPIF: '',
    projectName: '',
    toolName: '',
    toolSerialName: '',
    empCode: '',
    humanResources: '',
    customer: ''
  });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const handleAddProject = async () => {
    if (!newProject.projectName) {
      window.alert('Project Name is required.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.202.228:8080/projects', newProject);
      setProjects([...projects, response.data.project]);
      setShowAddForm(false);
      setNewProject({
        projectPIF: '',
        projectName: '',
        toolName: '',
        toolSerialName: '',
        empCode: '',
        humanResources: '',
        customer: ''
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        window.alert('Project with the same name already exists.');
      } else {
        window.alert('Error adding project.');
      }
      console.error('Error adding project:', error);
    }
  };

  const handleCheckboxChange = (event, projectName) => {
    if (event.target.checked) {
      setSelectedProjects([...selectedProjects, projectName]);
    } else {
      setSelectedProjects(selectedProjects.filter((name) => name !== projectName));
    }
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedProjects(filteredProjects.map((project) => project.projectName));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleDeleteProjects = async () => {
    try {
      await Promise.all(
        selectedProjects.map((projectName) =>
          axios.delete(`http://192.168.202.228:8080/projects/name/${projectName}`)
        )
      );
      setProjects(projects.filter((project) => !selectedProjects.includes(project.projectName)));
      setSelectedProjects([]);
      setSelectAll(false);
      fetchProjects(); // Reload the projects after deletion
    } catch (error) {
      console.error('Error deleting projects:', error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles['projects-container']}>
      <header className={styles['projects-header']}>
        <div className={styles['projects-topBar']}>
          <div className={styles['projects-logo']}>
            <img src={logoImage} alt="Logo" className={styles['projects-logoImg']} />
          </div>
          <div className={styles['projects-userInfo']}>{username}</div>
        </div>
      </header>
      <div className={styles['projects-mainContent']}>
        <Navbar />
        <div className={styles['projects-content']}>
          <div className={styles['projects-controls']}>
            <button className={styles['projects-button']} onClick={() => setShowAddForm(!showAddForm)}>Add</button>
            <button className={styles['projects-button']}>Modify</button>
            <button className={styles['projects-button']} onClick={handleDeleteProjects}>Delete</button>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles['projects-search']}
            />
          </div>
          {showAddForm && (
            <div className={styles['projects-form']}>
              <h2>Add New Project</h2>
              <input
                type="text"
                name="projectPIF"
                placeholder="Project PIF"
                value={newProject.projectPIF}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                value={newProject.projectName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="toolName"
                placeholder="Tool Name"
                value={newProject.toolName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="toolSerialName"
                placeholder="Tool Serial Name"
                value={newProject.toolSerialName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="empCode"
                placeholder="Emp Code"
                value={newProject.empCode}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="humanResources"
                placeholder="Human Resources"
                value={newProject.humanResources}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="customer"
                placeholder="Customer"
                value={newProject.customer}
                onChange={handleInputChange}
              />
              <button className={styles['projects-button']} onClick={handleAddProject}>Submit</button>
            </div>
          )}
          <table className={styles['projects-table']}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Project PIF</th>
                <th>Project Name</th>
                <th>Tool Name</th>
                <th>Tool Serial Name</th>
                <th>Emp Code</th>
                <th>Human Resources</th>
                <th>Customer</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.projectPIF}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.projectName)}
                      onChange={(event) => handleCheckboxChange(event, project.projectName)}
                    />
                  </td>
                  <td>{project.projectPIF}</td>
                  <td>{project.projectName}</td>
                  <td>{project.toolName}</td>
                  <td>{project.toolSerialName}</td>
                  <td>{project.empCode}</td>
                  <td>{project.humanResources}</td>
                  <td>{project.customer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
