import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Projects.module.css';
import logoImage from './image.png';
import {useNavigate} from 'react-router-dom';



const Employee = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExtendedFields, setShowExtendedFields] = useState(true); // Initially show extended fields
  const [newProject, setNewProject] = useState({
    projectPIF: '',
    projectName: '',
    toolName: '',
    toolSerialName: '',
    empCode: '',
    humanResources: '',
    customer: '',
    softwareSOPActualDate: '',
    softwareSOPPlannedDate: '',
    ddeffortsActual: '',
    ddeffortsPlanned: '',
    ddAmountActual: '',
    ddAmountPlanned: '',
    sopActualEndDate: '',
    sopPlannedEndDate: ''
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

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const handleAddProject = async () => {
    const isEmpty = Object.values(newProject).every(x => x === '');
    if (isEmpty) {
      window.alert('At least one field is required.');
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
        customer: '',
        softwareSOPActualDate: '',
        softwareSOPPlannedDate: '',
        ddeffortsActual: '',
        ddeffortsPlanned: '',
        ddAmountActual: '',
        ddAmountPlanned: '',
        sopActualEndDate: '',
        sopPlannedEndDate: ''
      });
      fetchProjects(); // Reload projects after adding
    } catch (error) {
      if (error.response && error.response.status === 400) {
        window.alert('Project with the same name already exists.');
      } else {
        window.alert('Error adding project.');
      }
      console.error('Error adding project:', error);
    }
  };

  const handleCheckboxChange = (event, projectId) => {
    if (event.target.checked) {
      setSelectedProjects([...selectedProjects, projectId]);
    } else {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    }
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedProjects(filteredProjects.map((project) => project['sno']));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleDeleteProjects = async () => {
    try {
      await Promise.all(
        selectedProjects.map(async (projectId) => {
          await axios.delete(`http://192.168.202.228:8080/projects/${projectId}`);
        })
      );
      setProjects(projects.filter((project) => !selectedProjects.includes(project['sno'])));
      setSelectedProjects([]);
      setSelectAll(false);
      fetchProjects(); // Reload projects after deletion
    } catch (error) {
      console.error('Error deleting projects:', error);
    }
  };

  const handleModifyProject = async () => {
    if (selectedProjects.length !== 1) {
      window.alert('Please select exactly one project to modify.');
      return;
    }

    try {
      const response = await axios.get(`http://192.168.202.228:8080/projects/${selectedProjects[0]}`);
      setNewProject(response.data);
      setShowAddForm(true);
    } catch (error) {
      console.error('Error fetching project for modification:', error);
    }
  };

  const handleToggleExtendedFields = () => {
    setShowExtendedFields(!showExtendedFields);
  };

  const handleGenerateExcel = () => {
    // Implement logic to generate Excel file
    console.log('Generating Excel...');
  };

  const handleGeneratePDF = () => {
    // Implement logic to generate PDF file
    console.log('Generating PDF...');
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
      <div className={styles['nav-wrapper']}>
      <ul className={styles['nav-navList']}>
        <li>
          <button className={styles['nav-navButton']} onClick={() => navigate('/dashboard')}>
            Back to Home
          </button>
        </li>
        <li>
          <button className={styles['nav-navButton']} onClick={() => setShowAddForm(!showAddForm)}>
            Add
          </button>
        </li>
        <li>
          <button className={styles['nav-navButton']} onClick={handleModifyProject} disabled={selectedProjects.length !== 1}>
            Modify
          </button>
        </li>
        <li>
          {username === 'Admin' &&
            <button className={styles['nav-navButton']} onClick={handleDeleteProjects} disabled={selectedProjects.length === 0}>
            Delete
          </button>
            }
        </li>
        <li>
          <button className={styles['nav-navButton']} onClick={handleToggleExtendedFields}>
            {showExtendedFields ? 'Hide Details' : 'Show Details'}
          </button>
        </li>
        <li>
          <button className={styles['nav-navButton']} onClick={handleGenerateExcel}>
            Generate Excel
          </button>
        </li>
        <li>
          <button className={styles['nav-navButton']} onClick={handleGeneratePDF}>
            Generate Pdf
          </button>
        </li>
        <li>
            { username === 'Admin' &&
          <button className={styles['nav-navButton']} onClick={() => navigate('/register')}>
            Register
          </button>
            }
        </li>
        <li>
          <button className={styles['nav-navButton']} onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </ul>
    </div>
        
        <div className={styles['projects-content']}>
          <div className={styles['projects-controls']}>
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
              <h2>{newProject['sno'] ? 'Modify Data' : 'Add New Data'}</h2>
              <input
                type="text"
                name="empCode"
                placeholder="Emp Code"
                value={newProject.empCode}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="humanResources"
                placeholder="Human Resources"
                value={newProject.humanResources}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                value={newProject.projectName}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="projectPIF"
                placeholder="Project PIF"
                value={newProject.projectPIF}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="toolName"
                placeholder="Tool Name"
                value={newProject.toolName}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="toolSerialName"
                placeholder="Tool Serial Name"
                value={newProject.toolSerialName}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="customer"
                placeholder="Customer"
                value={newProject.customer}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="softwareSOPActualDate"
                placeholder="Software SOP Actual Date (dd/mm/yyyy)"
                value={newProject.softwareSOPActualDate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="softwareSOPPlannedDate"
                placeholder="Software SOP Planned Date (dd/mm/yyyy)"
                value={newProject.softwareSOPPlannedDate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="ddeffortsActual"
                placeholder="D & D Efforts Actual (PHs)"
                value={newProject.ddeffortsActual}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="ddeffortsPlanned"
                placeholder="D & D Efforts Planned (PHs)"
                value={newProject.ddeffortsPlanned}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="ddAmountActual"
                placeholder="D & D Amount Actual (in thousands)"
                value={newProject.ddAmountActual}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="ddAmountPlanned"
                placeholder="D & D Amount Planned (in thousands)"
                value={newProject.ddAmountPlanned}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="sopActualEndDate"
                placeholder="SOP Actual End Date (dd/mm/yyyy)"
                value={newProject.sopActualEndDate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="sopPlannedEndDate"
                placeholder="SOP Planned End Date (dd/mm/yyyy)"
                value={newProject.sopPlannedEndDate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <button className={styles['projects-button']} onClick={handleAddProject}>
                {newProject['sno'] ? 'Modify Data' : 'Add New Data'}
              </button>
              <button className={styles['projects-button']} onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          )}
          <table className={styles['projects-table']}>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>Emp Code</th>
                <th>Human Resources</th>
                <th>Project Name</th>
                <th>Project PIF</th>
                <th>Tool Name</th>
                <th>Tool Serial Name</th>
                <th>Customer</th>
                {showExtendedFields && (
                  <>
                    <th>Software SOP Actual Date</th>
                    <th>Software SOP Planned Date</th>
                    <th>D & D Efforts Actual (PHs)</th>
                    <th>D & D Efforts Planned (PHs)</th>
                    <th>D & D Amount Actual (in thousands)</th>
                    <th>D & D Amount Planned (in thousands)</th>
                    <th>SOP Actual End Date</th>
                    <th>SOP Planned End Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project['sno']}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project['sno'])}
                      onChange={(event) => handleCheckboxChange(event, project['sno'])}
                    />
                  </td>
                  <td>{project.empCode}</td>
                  <td>{project.humanResources}</td>
                  <td>{project.projectName}</td>
                  <td>{project.projectPIF}</td>
                  <td>{project.toolName}</td>
                  <td>{project.toolSerialName}</td>
                  <td>{project.customer}</td>
                  {showExtendedFields && (
                    <>
                      <td>{project.softwareSOPActualDate}</td>
                      <td>{project.softwareSOPPlannedDate}</td>
                      <td>{project.ddeffortsActual}</td>
                      <td>{project.ddeffortsPlanned}</td>
                      <td>{project.ddAmountActual}</td>
                      <td>{project.ddAmountPlanned}</td>
                      <td>{project.sopActualEndDate}</td>
                      <td>{project.sopPlannedEndDate}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employee;
