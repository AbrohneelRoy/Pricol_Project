import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import styles from './Projects.module.css';
import logoImage from './image.png';
import {useNavigate} from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select';

const Projects = () => {

  const [filteredProjectsData, setFilteredProjectsData] = useState([]);


  const columns = [
    'Project PIF', 'Project Name', 'Emp Code', 'Human Resources','Tool Name', 'Tool Serial Name',
     'Customer', 'Phase','Software SOP Actual Date',
    'Software SOP Planned Date', 'D & D Efforts Actual (PHs)', 'D & D Efforts Planned (PHs)',
    'D & D Amount Actual (in thousands)', 'D & D Amount Planned (in thousands)',
    'SOP Actual End Date', 'SOP Planned End Date'
  ];
  const [selectedColumns, setSelectedColumns] = useState([
    'Project PIF', 'Project Name', 'Emp Code', 'Human Resources','Tool Name', 'Tool Serial Name',
     'Customer', 'Phase', 'Software SOP Actual Date',
    'Software SOP Planned Date', 'D & D Efforts Actual (PHs)', 'D & D Efforts Planned (PHs)',
    'D & D Amount Actual (in thousands)', 'D & D Amount Planned (in thousands)',
    'SOP Actual End Date', 'SOP Planned End Date'
  ]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExtendedFields, setShowExtendedFields] = useState(); 
  const containerRef = useRef(null);
  const [newProject, setNewProject] = useState({
    projectPIF: '',
    projectName: '',
    toolName: '',
    toolSerialName: '',
    empCode: '',
    humanResources: '',
    customer: '',
    phase: '',
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

  const [phaseOptions, setPhaseOptions] = useState([]);
  const [pnameOptions, setPnameOptions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    'Project PIF': [],
    'ProjectName': [],
    'Emp Code': [],
    'Human Resources': [],
    'Tool Name': [],
    'Tool Serial Name': [],
    'Customer': [],
    'Phase': []
  });

  
 

  
  
  const handleCancelButtonClick = () => {
    setShowAddForm(false);
    window.location.reload();
  };
  
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedProjects(filteredProjects.map((project) => project['sno']));
    } else {
      setSelectedProjects([]);
    }
  };
  const filteredProjects = projects.filter((project) =>
    project.projectPIF.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.toolSerialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.humanResources.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.softwareSOPActualDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.softwareSOPPlannedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.ddeffortsActual.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.ddeffortsPlanned.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.ddAmountActual.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.ddAmountPlanned.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.sopActualEndDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.sopPlannedEndDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

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
        phase: '',
        softwareSOPActualDate: '',
        softwareSOPPlannedDate: '',
        ddeffortsActual: '',
        ddeffortsPlanned: '',
        ddAmountActual: '',
        ddAmountPlanned: '',
        sopActualEndDate: '',
        sopPlannedEndDate: ''
      });
      fetchProjects();
    } catch (error) {
      window.alert('Error adding project.');
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

  
  const handleDeleteProjects = async () => {
    try {
      if (selectedProjects.length === projects.length) {
        await axios.delete('http://192.168.202.228:8080/projects/truncate');
      } 
      else {
        await Promise.all(
          selectedProjects.map(async (projectId) => {
            await axios.delete(`http://192.168.202.228:8080/projects/${projectId}`);
          })
        );
      }
  
      setProjects([]);
      setSelectedProjects([]);
      setSelectAll(false);
      fetchProjects();
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
      window.scrollTo({ top: 0, left: 0});
      setNewProject(response.data);
      setShowAddForm(true); 
    } catch (error) {
      console.error('Error fetching project for modification:', error);
    }
  };
  

  const handleToggleExtendedFields = () => {
    setShowExtendedFields(!showExtendedFields);
  };
  const handleColumnCheckboxChange = (column) => {
    setSelectedColumns(prevSelectedColumns => 
      prevSelectedColumns.includes(column)
        ? prevSelectedColumns.filter(col => col !== column)
        : [...prevSelectedColumns, column]
    );
  };
  

  const handleGenerateExcel = () => {
    if (selectedProjects.length === 0) {
      alert('Please select at least one project to generate the Excel file.');
      return;
    }
  
    if (selectedColumns.length === 0) {
      alert('Please select at least one column to generate the Excel file.');
      return;
    }
  
    // Filter the selected projects
    const selectedData = projects.filter(project => selectedProjects.includes(project['sno']));
  
    // Map the data to the desired format, including only selected columns
    const dataToExport = selectedData.map(project => {
      const filteredProject = {};
      selectedColumns.forEach(column => {
        switch (column) {
          case 'Emp Code':
            filteredProject['Emp Code'] = project.empCode;
            break;
          case 'Human Resources':
            filteredProject['Human Resources'] = project.humanResources;
            break;
          case 'Project PIF':
            filteredProject['Project PIF'] = project.projectPIF;
            break;
          case 'Project Name':
            filteredProject['Project Name'] = project.projectName;
            break;
          case 'Tool Name':
            filteredProject['Tool Name'] = project.toolName;
            break;
          case 'Tool Serial Name':
            filteredProject['Tool Serial Name'] = project.toolSerialName;
            break;
          case 'Customer':
            filteredProject['Customer'] = project.customer;
            break;
          case 'Phase':
            filteredProject['Phase'] = project.phase;
            break;
          case 'Software SOP Actual Date':
            filteredProject['Software SOP Actual Date'] = project.softwareSOPActualDate;
            break;
          case 'Software SOP Planned Date':
            filteredProject['Software SOP Planned Date'] = project.softwareSOPPlannedDate;
            break;
          case 'D & D Efforts Actual (PHs)':
            filteredProject['D & D Efforts Actual (PHs)'] = project.ddeffortsActual;
            break;
          case 'D & D Efforts Planned (PHs)':
            filteredProject['D & D Efforts Planned (PHs)'] = project.ddeffortsPlanned;
            break;
          case 'D & D Amount Actual (in thousands)':
            filteredProject['D & D Amount Actual (in thousands)'] = project.ddAmountActual;
            break;
          case 'D & D Amount Planned (in thousands)':
            filteredProject['D & D Amount Planned (in thousands)'] = project.ddAmountPlanned;
            break;
          case 'SOP Actual End Date':
            filteredProject['SOP Actual End Date'] = project.sopActualEndDate;
            break;
          case 'SOP Planned End Date':
            filteredProject['SOP Planned End Date'] = project.sopPlannedEndDate;
            break;
          default:
            break;
        }
      });
      return filteredProject;
    });
  
    // Create a new workbook and add the data to a sheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
    // Apply header styles
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "D3D3D3" } } // Light grey background
      };
    }
  
    // Set column widths dynamically based on the selected columns
    const colWidths = selectedColumns.map(() => ({ wch: 30 }));
    worksheet['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  
    // Generate the Excel file and trigger the download
    XLSX.writeFile(workbook, 'Projects.xlsx');
  };

  const handleGeneratePDF = () => {
    if (selectedProjects.length === 0) {
      alert('Please select at least one project to generate the PDF file.');
      return;
    }
  
    if (selectedColumns.length === 0) {
      alert('Please select at least one column to generate the PDF file.');
      return;
    }
  
    // Filter the selected projects
    const selectedData = projects.filter(project => selectedProjects.includes(project['sno']));
  
    // Map the data to the desired format, including only selected columns
    const dataToExport = selectedData.map(project => {
      const filteredProject = [];
      selectedColumns.forEach(column => {
        switch (column) {
          case 'Emp Code':
            filteredProject.push(project.empCode);
            break;
          case 'Human Resources':
            filteredProject.push(project.humanResources);
            break;
          case 'Project PIF':
            filteredProject.push(project.projectPIF);
            break;
          case 'Project Name':
            filteredProject.push(project.projectName);
            break;
          case 'Tool Name':
            filteredProject.push(project.toolName);
            break;
          case 'Tool Serial Name':
            filteredProject.push(project.toolSerialName);
            break;
          case 'Customer':
            filteredProject.push(project.customer);
            break;
          case 'Phase':
            filteredProject.push(project.phase);
            break;
          case 'Software SOP Actual Date':
            filteredProject.push(project.softwareSOPActualDate);
            break;
          case 'Software SOP Planned Date':
            filteredProject.push(project.softwareSOPPlannedDate);
            break;
          case 'D & D Efforts Actual (PHs)':
            filteredProject.push(project.ddeffortsActual);
            break;
          case 'D & D Efforts Planned (PHs)':
            filteredProject.push(project.ddeffortsPlanned);
            break;
          case 'D & D Amount Actual (in thousands)':
            filteredProject.push(project.ddAmountActual);
            break;
          case 'D & D Amount Planned (in thousands)':
            filteredProject.push(project.ddAmountPlanned);
            break;
          case 'SOP Actual End Date':
            filteredProject.push(project.sopActualEndDate);
            break;
          case 'SOP Planned End Date':
            filteredProject.push(project.sopPlannedEndDate);
            break;
          default:
            break;
        }
      });
      return filteredProject;
    });
  
    const doc = new jsPDF('landscape');
  
    // Add a title to the PDF
    doc.text('Projects Report', 14, 10);
  
    // Add table to PDF
    doc.autoTable({
      head: [selectedColumns],
      body: dataToExport,
      startY: 20,
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [211, 211, 211], // Light grey background for headers
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      columnStyles: {
        // Adjust column widths
        0: { cellWidth: 'auto' },
      },
    });
  
    // Save the PDF
    doc.save('Projects.pdf');
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  
  const handleSearchButtonClick = () => {
    setSearchTerm(searchInput);
  };

  const scrollToHighlightedText = useCallback(() => {
    if (containerRef.current && searchTerm) {
      const highlightedElement = containerRef.current.querySelector(`.${styles.highlight}`);
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'center' });
      }
    }
  }, [searchTerm]);
  
  
  
  const highlightText = (text, term) => {
    if (!term) return text;
    
    const regex = new RegExp(`\\b(${term.trim()})\\b`, 'gi');
    return text.split(regex).map((part, index) => (
      regex.test(part) ? <span key={index} className={styles['highlight']}>{part}</span> : part
    ));
  };
  
  
  useEffect(() => {
    scrollToHighlightedText();
  }, [searchTerm, scrollToHighlightedText]);
  
  const handleAddButtonClick = () => {
    // Scroll to the top left
    window.scrollTo({ top: 0, left: 0});
  
    // Toggle the add form visibility
    setShowAddForm(!showAddForm);
  };


  const fetchPhaseOptions = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/distinct-phase');
      const options = response.data.map(phase => ({ value: phase, label: phase }));
      setPhaseOptions(options);
    } catch (error) {
      console.error('Error fetching phase options:', error);
    }
  };
  const fetchPnameOptions = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/distinct-pname');
      const options = response.data.map(projectName => ({ value: projectName, label: projectName }));
      setPnameOptions(options);
    } catch (error) {
      console.error('Error fetching pname options:', error);
    }
  };

    // Handle filter change for Phase and ProjectName
    const handleFilterChange = (columnName, selectedOptions) => {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        [columnName]: selectedOptions ? selectedOptions.map(option => option.value.toLowerCase()) : []
      }));
    };
  
    // Apply filters based on selected Phase and ProjectName
    const applyFilters = () => {
      let filteredData = [...projects]; // Assuming projects is your initial data source
    
      // Filter by Phase
      const phaseFilterValues = selectedFilters['Phase'];
      if (phaseFilterValues && phaseFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['phase']; // Get the value of the "Phase" column
          return projectValue && phaseFilterValues.includes(projectValue.toLowerCase());
        });
      }
  
      // Filter by ProjectName
      const pnameFilterValues = selectedFilters['ProjectName'];
      if (pnameFilterValues && pnameFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['projectName']; // Get the value of the "ProjectName" column
          return projectValue && pnameFilterValues.includes(projectValue.toLowerCase());
        });
      }
  
      // Update state with filtered data
      setFilteredProjectsData(filteredData);
    };
  
    useEffect(() => {
      fetchPhaseOptions();
      fetchPnameOptions();
      // Fetch other options if needed
    }, []);
  
    useEffect(() => {
      // Apply filters whenever selectedFilters change
      applyFilters();
    });

  
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
      {showExtendedFields && (
        <div className={styles['column-selector']}>
          {columns.map(column => (
            <div key={column}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column)}
                  onChange={() => handleColumnCheckboxChange(column)}
                />
                {column}
              </label>
            </div>
          ))}
        </div>
      )}
      <div className={styles['projects-mainContent']}>
      <div className={styles['nav-wrapper']}>
      <ul className={styles['nav-navList']}>
        <li>
          <button className={styles['nav-navButton']} onClick={() => navigate('/dashboard')}>
            Back to Home
          </button>
        </li>
        <li>
          <button className={styles['nav-navButton']} onClick={handleAddButtonClick}>
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
        <div className={styles['projects-content']} ref={containerRef}>
          <div className={styles['projects-controls']}>
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={handleSearchInputChange}
              className={styles['projects-search']}
            />
            <button onClick={handleSearchButtonClick} className={styles['projects-search-button']}>
              Search
            </button>
            
            <div className={styles['multi-select-container']}>
              <div key="ProjectName" className={styles['multi-select-dropdown']}>
                <label>Project Name</label>
                <Select
                  isMulti
                  options={pnameOptions}
                  onChange={selectedOptions => handleFilterChange('ProjectName', selectedOptions)}
                />
              </div>
              <div key="Phase" className={styles['multi-select-dropdown']}>
                <label>Phase</label>
                <Select
                  isMulti
                  options={phaseOptions}
                  onChange={selectedOptions => handleFilterChange('Phase', selectedOptions)}
                />
              </div>
            </div>
          </div>
          {showAddForm && (
            <div className={styles['projects-form']}>
              <h2>{newProject['sno'] ? 'Modify Data' : 'Add New Data'}</h2>
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
                name="customer"
                placeholder="Customer"
                value={newProject.customer}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="phase"
                placeholder="Phase"
                value={newProject.phase}
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
              <button className={styles['projects-button']}  onClick={handleCancelButtonClick}>
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
                {columns.map(column => (
                  selectedColumns.includes(column) && <th key={column}>{column}</th>
                ))}
                {selectedColumns.includes('Project PIF')}
                {selectedColumns.includes('Project Name')}
                {selectedColumns.includes('Tool Name')}
                {selectedColumns.includes('Tool Serial Name')}
                {selectedColumns.includes('Emp Code')}
                {selectedColumns.includes('Human Resources')}
                {selectedColumns.includes('Customer')}  
                {selectedColumns.includes('Phase')}
                {selectedColumns.includes('Software SOP Actual Date')}
                {selectedColumns.includes('Software SOP Planned Date')}
                {selectedColumns.includes('D & D Efforts Actual (PHs)')}
                {selectedColumns.includes('D & D Efforts Planned (PHs)')}
                {selectedColumns.includes('D & D Amount Actual (in thousands)')}
                {selectedColumns.includes('D & D Amount Planned (in thousands)')}
                {selectedColumns.includes('SOP Actual End Date')}
                {selectedColumns.includes('SOP Planned End Date')}
              </tr>
            </thead>
            <tbody>
              {filteredProjectsData.map((project) => (
                <tr key={project['sno']}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project['sno'])}
                      onChange={(event) => handleCheckboxChange(event, project['sno'])}
                    />
                  </td>
                  {selectedColumns.includes('Project PIF') && <td>{highlightText(project.projectPIF, searchTerm)}</td>}
                  {selectedColumns.includes('Project Name') && <td>{highlightText(project.projectName, searchTerm)}</td>}
                  {selectedColumns.includes('Tool Name') && <td>{highlightText(project.toolName, searchTerm)}</td>}
                  {selectedColumns.includes('Tool Serial Name') && <td>{highlightText(project.toolSerialName, searchTerm)}</td>}
                  {selectedColumns.includes('Emp Code') && <td>{highlightText(project.empCode, searchTerm)}</td>}
                  {selectedColumns.includes('Human Resources') && <td>{highlightText(project.humanResources, searchTerm)}</td>}
                  {selectedColumns.includes('Customer') && <td>{highlightText(project.customer, searchTerm)}</td>}
                  {selectedColumns.includes('Phase') && <td>{highlightText(project.phase, searchTerm)}</td>}
                  {selectedColumns.includes('Software SOP Actual Date') && <td>{highlightText(project.softwareSOPActualDate, searchTerm)}</td>}
                  {selectedColumns.includes('Software SOP Planned Date') && <td>{highlightText(project.softwareSOPPlannedDate, searchTerm)}</td>}
                  {selectedColumns.includes('D & D Efforts Actual (PHs)') && <td>{highlightText(project.ddeffortsActual, searchTerm)}</td>}
                  {selectedColumns.includes('D & D Efforts Planned (PHs)') && <td>{highlightText(project.ddeffortsPlanned, searchTerm)}</td>}
                  {selectedColumns.includes('D & D Amount Actual (in thousands)') && <td>{highlightText(project.ddAmountActual, searchTerm)}</td>}
                  {selectedColumns.includes('D & D Amount Planned (in thousands)') && <td>{highlightText(project.ddAmountPlanned, searchTerm)}</td>}
                  {selectedColumns.includes('SOP Actual End Date') && <td>{highlightText(project.sopActualEndDate, searchTerm)}</td>}
                  {selectedColumns.includes('SOP Planned End Date') && <td>{highlightText(project.sopPlannedEndDate, searchTerm)}</td>}
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
