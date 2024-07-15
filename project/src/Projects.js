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
  const [showFilters, setShowFilters] = useState(false); 


  const columns = [
    'Project PIF', 'Project Name', 'Emp Code', 'Human Resources','Tool Name', 'Tool Serial Name',
     'Customer', 
     'Phase/Stage','SW Start Date','SW End Date', 'SW Initial Test Start Date', 'SW Initial Test End Date', 'SW DV Start Date', 'SW DV End Date', 'SW Customer Release Date', 'SW Windchill Release Date',
      'D & D Efforts Actual (PHs)', 'D & D Efforts Planned (PHs)',    'D & D Amount Actual (in thousands)', 'D & D Amount Planned (in thousands)',    'SOP Actual End Date', 'SOP Planned End Date'
  ];
  const [selectedColumns, setSelectedColumns] = useState([
    'Project PIF', 'Project Name', 'Emp Code', 'Human Resources','Tool Name', 'Tool Serial Name',
     'Customer', 'Phase/Stage', 'SW Start Date',
    'SW End Date', 'SW Initial Test Start Date', 'SW Initial Test End Date', 'SW DV Start Date', 'SW DV End Date', 'SW Customer Release Date', 'SW Windchill Release Date', 'D & D Efforts Actual (PHs)', 'D & D Efforts Planned (PHs)',
    'D & D Amount Actual (in thousands)', 'D & D Amount Planned (in thousands)',
    'SOP Actual End Date', 'SOP Planned End Date'
  ]);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExtendedFields, setShowExtendedFields] = useState(true); 
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
    sitstartdate: '',
    sitenddate: '',
    swdvstartdate: '',
    swdvenddate: '',
    swcustomerrel: '',
    swwindchillrel: '',
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
  const [pifOptions, setPifOptions] = useState([]);
  const [ecodeOptions, setEcodeOptions] = useState([]);
  const [hrOptions, setHrOptions] = useState([]);
  const [tnameOptions, setTnameOptions] = useState([]);
  const [TsnameOptions, setTsnameOptions] = useState([]);
  const [cusOptions, setCusOptions] = useState([]);
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

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/login');
      const loggedInUser = localStorage.getItem('username');
  
      const currentUser = response.data.find(user => user.username === loggedInUser);
  
      if (currentUser) {
        setUsername(currentUser.username);
        setRole(currentUser.role);
      } else {
        console.error('User not found in API response');
      }
  
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
 
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
    fetchUserInfo();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedProjects(filteredProjectsData.map((project) => project['sno']));
    } else {
      setSelectedProjects([]);
    }
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
        phase: '',
        softwareSOPActualDate: '',
        softwareSOPPlannedDate: '',
        sitstartdate: '',
        sitenddate: '',
        swdvstartdate: '',
        swdvenddate: '',
        swcustomerrel: '',
        swwindchillrel: '',
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
    window.location.reload();

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
      // Fetch the selected project for modification
      const response = await axios.get(`http://192.168.202.228:8080/projects/${selectedProjects[0]}`);
      window.scrollTo({ top: 0, left: 0 });
      setNewProject(response.data);
      setShowAddForm(true);
    } catch (error) {
      console.error('Error fetching project for modification:', error);
    }
  };

  const handleUpdateProject = async () => {
    try {
      // Send a PUT request to update the project
      await axios.put(`http://192.168.202.228:8080/projects/${newProject.sno}`, newProject);
      console.log('Project updated successfully.');
  
      // Update the local state to reflect the changes
      setProjects(prevProjects => prevProjects.map(project =>
        project.sno === newProject.sno ? newProject : project
      ));
      setShowAddForm(false);
      setNewProject({});
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleSubmit = async () => {
    if (newProject.sno) {
      // Update the existing project
      await handleUpdateProject();
    } else {
      // Add a new project
      await handleAddProject();
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
    let dataToExport;
  
    if (selectedProjects.length === 0) {
      dataToExport = filteredProjectsData.map(project => {
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
            case 'Phase/Stage':
              filteredProject['Phase/Stage'] = project.phase;
              break;
            case 'SW Start Date':
              filteredProject['SW Start Date'] = project.softwareSOPActualDate;
              break;
            case 'SW End Date':
              filteredProject['SW End Date'] = project.softwareSOPPlannedDate;
              break;
            case 'SW Initial Test Start Date':
              filteredProject['SW Initial Test Start Date'] = project.sitstartdate;
              break;
            case 'SW Initial Test End Date':
              filteredProject['SW Initial Test End Date'] = project.sitenddate;
              break;
            case 'SW DV Start Date':
              filteredProject['SW DV Start Date'] = project.swdvstartdate;
              break;
            case 'SW DV End Date':
              filteredProject['SW DV End Date'] = project.swdvenddate;
              break;
            case 'SW Customer Release Date':
              filteredProject['SW Customer Release Date'] = project.swcustomerrel;
              break;
            case 'SW Windchill Release Date':
              filteredProject['SW Windchill Release Date'] = project.swwindchillrel;
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
    } else {
      const selectedData = projects.filter(project => selectedProjects.includes(project['sno']));
      dataToExport = selectedData.map(project => {
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
            case 'Phase/Stage':
              filteredProject['Phase/Stage'] = project.phase;
              break;
            case 'SW Start Date':
              filteredProject['SW Start Date'] = project.softwareSOPActualDate;
              break;
            case 'SW End Date':
              filteredProject['SW End Date'] = project.softwareSOPPlannedDate;
              break;
            case 'SW Initial Test Start Date':
              filteredProject['SW Initial Test Start Date'] = project.sitstartdate;
              break;
            case 'SW Initial Test End Date':
              filteredProject['SW Initial Test End Date'] = project.sitenddate;
              break;
            case 'SW DV Start Date':
              filteredProject['SW DV Start Date'] = project.swdvstartdate;
              break;
            case 'SW DV End Date':
              filteredProject['SW DV End Date'] = project.swdvenddate;
              break;
            case 'SW Customer Release Date':
              filteredProject['SW Customer Release Date'] = project.swcustomerrel;
              break;
            case 'SW Windchill Release Date':
              filteredProject['SW Windchill Release Date'] = project.swwindchillrel;
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
    }
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "D3D3D3" } }
      };
    }
  
    const colWidths = selectedColumns.map(() => ({ wch: 25 }));
    worksheet['!cols'] = colWidths;
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  
    XLSX.writeFile(workbook, 'Projects.xlsx');
  };

  const handleGeneratePDF = () => {
    const abbreviations = [
      { full: 'SW Initial Test Start Date', short: 'SIT\nStart' },
      { full: 'SW Initial Test End Date', short: 'SIT\nEnd' },
      { full: 'SW DV Start Date', short: 'SW\nDV Start' },
      { full: 'SW DV End Date', short: 'SW\nDV End' },
      { full: 'SW Customer Release Date', short: 'SW\nCRD' },
      { full: 'SW Windchill Release Date', short: 'SW\nWRD' },
      { full: 'D & D Efforts Actual (PHs)', short: 'D&D\nEA' },
      { full: 'D & D Efforts Planned (PHs)', short: 'D&D\nEP' },
      { full: 'D & D Amount Actual (in thousands)', short: 'D&D\nAA' },
      { full: 'D & D Amount Planned (in thousands)', short: 'D&D\nAP' },
      { full: 'SOP Actual End Date', short: 'SOP\nAED' },
      { full: 'SOP Planned End Date', short: 'SOP\nPED' },
      { full: 'Project Name', short: 'P. Name' },
      { full: 'Tool Name', short: 'T. Name' },
      { full: 'Tool Serial Name', short: 'TS. Name' },
      { full: 'SOP Actual End Date', short: 'SOP\nAED' },
      { full: 'SOP Planned End Date', short: 'SOP\nPED' },
      { full: 'Project PIF', short: 'P. PIF' },
      { full: 'Customer', short: 'Cus' },
      { full: 'SW Start Date', short: 'SW SD' },
      { full: 'SW End Date', short: 'SW ED' },
      { full: 'Phase/Stage', short: 'Phase/\nStage' },
      { full: 'Human Resources', short: 'Hr' }
    ];
  
    const getShortColumnName = (column) => {
      const abbreviation = abbreviations.find(abbr => abbr.full === column);
      return abbreviation ? abbreviation.short : column;
    };
  
    let dataToExport;
  
    if (selectedProjects.length === 0) {
      dataToExport = filteredProjectsData.map(project => {
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
            case 'Phase/Stage':
              filteredProject.push(project.phase);
              break;
            case 'SW Start Date':
              filteredProject.push(project.softwareSOPActualDate);
              break;
            case 'SW End Date':
              filteredProject.push(project.softwareSOPPlannedDate);
              break;
            case 'SW Initial Test Start Date':
              filteredProject.push(project.sitstartdate);
              break;
            case 'SW Initial Test End Date':
              filteredProject.push(project.sitenddate);
              break;
            case 'SW DV Start Date':
              filteredProject.push(project.swdvstartdate);
              break;
            case 'SW DV End Date':
              filteredProject.push(project.swdvenddate);
              break;
            case 'SW Customer Release Date':
              filteredProject.push(project.swcustomerrel);
              break;
            case 'SW Windchill Release Date':
              filteredProject.push(project.swwindchillrel);
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
    } else {
      const selectedData = projects.filter(project => selectedProjects.includes(project['sno']));
      dataToExport = selectedData.map(project => {
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
            case 'Phase/Stage':
              filteredProject.push(project.phase);
              break;
            case 'SW Start Date':
              filteredProject.push(project.softwareSOPActualDate);
              break;
            case 'SW End Date':
              filteredProject.push(project.softwareSOPPlannedDate);
              break;
            case 'SW Initial Test Start Date':
              filteredProject.push(project.sitstartdate);
              break;
            case 'SW Initial Test End Date':
              filteredProject.push(project.sitenddate);
              break;
            case 'SW DV Start Date':
              filteredProject.push(project.swdvstartdate);
              break;
            case 'SW DV End Date':
              filteredProject.push(project.swdvenddate);
              break;
            case 'SW Customer Release Date':
              filteredProject.push(project.swcustomerrel);
              break;
            case 'SW Windchill Release Date':
              filteredProject.push(project.swwindchillrel);
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
    }
  
    const doc = new jsPDF('landscape');
  
    doc.setFontSize(12);
    doc.text('Projects Report', 14, 10);
  
    doc.setFontSize(8);
    const abbreviationLines = [];
    let line = '';
    abbreviations.forEach((abbr, index) => {
      const abbrText = `${abbr.short.replace('\n', ' ')}: ${abbr.full}`;
      if (index % 5 === 0 && index !== 0) {
        abbreviationLines.push(line);
        line = abbrText;
      } else {
        line += (line ? ', ' : '') + abbrText;
      }
    });
    if (line) {
      abbreviationLines.push(line);
    }
    abbreviationLines.forEach((line, i) => {
      doc.text(line, 14, 15 + (i * 5));
    });
  
    const shortColumns = selectedColumns.length > 14 ? selectedColumns.map(getShortColumnName) : selectedColumns;
  
    doc.autoTable({
      head: [shortColumns],
      body: dataToExport,
      startY: 25 + (abbreviationLines.length * 5),
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
      },
    });
  
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
    window.scrollTo({ top: 0, left: 0});
  
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
  const fetchPifOptions = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/distinct-pif');
      const options = response.data.map(projectPIF => ({ value: projectPIF, label: projectPIF }));
      setPifOptions(options);
    } catch (error) {
      console.error('Error fetching pname options:', error);
    }
  };
  const fetchTnameOptions = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/distinct-tname');
      const options = response.data.map(toolName => ({ value: toolName, label: toolName }));
      setTnameOptions(options);
    } catch (error) {
      console.error('Error fetching pname options:', error);
    }
  };
  const fetchTSnameOptions = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/distinct-tsname');
      const options = response.data.map(toolSerialName => ({ value: toolSerialName, label: toolSerialName }));
      setTsnameOptions(options);
    } catch (error) {
      console.error('Error fetching pname options:', error);
    }
  };
  const fetchEcodeOptions = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/distinct-ecode');
      const options = response.data.map(empCode => ({ value: empCode, label: empCode }));
      setEcodeOptions(options);
    } catch (error) {
      console.error('Error fetching pname options:', error);
    }
  };
  const fetchHrOptions = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/distinct-hr');
      const options = response.data.map(humanResources => ({ value: humanResources, label: humanResources }));
      setHrOptions(options);
    } catch (error) {
      console.error('Error fetching pname options:', error);
    }
  };
  const fetchCusOptions = async () => {
    try {
      const response = await axios.get('http://192.168.202.228:8080/projects/distinct-cus');
      const options = response.data.map(customer => ({ value: customer, label: customer }));
      setCusOptions(options);
    } catch (error) {
      console.error('Error fetching pname options:', error);
    }
  };

    const handleFilterChange = (columnName, selectedOptions) => {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        [columnName]: selectedOptions ? selectedOptions.map(option => option.value.toLowerCase()) : []
      }));
    };
  
    const applyFilters = () => {
      let filteredData = [...projects]; 
    
      const phaseFilterValues = selectedFilters['Phase'];
      if (phaseFilterValues && phaseFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['phase']; 
          return projectValue && phaseFilterValues.includes(projectValue.toLowerCase());
        });
      }
  
      const pnameFilterValues = selectedFilters['ProjectName'];
      if (pnameFilterValues && pnameFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['projectName'];
          return projectValue && pnameFilterValues.includes(projectValue.toLowerCase());
        });
      }
      const pifFilterValues = selectedFilters['Project PIF'];
      if (pifFilterValues && pifFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['projectPIF'];
          return projectValue && pifFilterValues.includes(projectValue.toLowerCase());
        });
      }
      const tnameFilterValues = selectedFilters['Tool Name'];
      if (tnameFilterValues && tnameFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['toolName']; 
          return projectValue && tnameFilterValues.includes(projectValue.toLowerCase());
        });
      }
      const tsnameFilterValues = selectedFilters['Tool Serial Name'];
      if (tsnameFilterValues && tsnameFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['toolSerialName']; 
          return projectValue && tsnameFilterValues.includes(projectValue.toLowerCase());
        });
      }
      const ecodeFilterValues = selectedFilters['Emp Code'];
      if (ecodeFilterValues && ecodeFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['empCode']; 
          return projectValue && ecodeFilterValues.includes(projectValue.toLowerCase());
        });
      }
      const hrFilterValues = selectedFilters['Human Resources'];
      if (hrFilterValues && hrFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['humanResources'];
          return projectValue && hrFilterValues.includes(projectValue.toLowerCase());
        });
      }
      const cusFilterValues = selectedFilters['Customer'];
      if (cusFilterValues && cusFilterValues.length > 0) {
        filteredData = filteredData.filter(project => {
          const projectValue = project['customer']; 
          return projectValue && cusFilterValues.includes(projectValue.toLowerCase());
        });
      }
  
      setFilteredProjectsData(filteredData);
    };
  
    useEffect(() => {
      fetchPhaseOptions();
      fetchPnameOptions();
      fetchPifOptions();
      fetchTnameOptions();
      fetchTSnameOptions();
      fetchEcodeOptions();
      fetchHrOptions();
      fetchCusOptions();
    }, []);
  
    useEffect(() => {
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
          {role === 'admin' &&
            <button className={styles['nav-navButton']} onClick={handleDeleteProjects} disabled={selectedProjects.length === 0}>
            Delete
            </button>
          }
        </li>
        <li>
          <button className={styles['nav-navButton']} onClick={handleToggleExtendedFields}>
            Column Filter
          </button>
        </li>
        <li>
            <button className={styles['nav-navButton']} onClick={() => setShowFilters(!showFilters)}>
              Data Filter
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
          {role === 'admin' &&
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
            {showFilters && (
              <div className={styles['multi-select-container']}>
                <div key="Project PIF" className={styles['multi-select-dropdown']}>
                  <label>Project PIF</label>
                  <Select
                    isMulti
                    options={pifOptions}
                    onChange={selectedOptions => handleFilterChange('Project PIF', selectedOptions)}
                  />
                </div>
                <div key="ProjectName" className={styles['multi-select-dropdown']}>
                  <label>Project Name</label>
                  <Select
                    isMulti
                    options={pnameOptions}
                    onChange={selectedOptions => handleFilterChange('ProjectName', selectedOptions)}
                  />
                </div>
                <div key="Emp Code" className={styles['multi-select-dropdown']}>
                  <label>Emp Code</label>
                  <Select
                    isMulti
                    options={ecodeOptions}
                    onChange={selectedOptions => handleFilterChange('Emp Code', selectedOptions)}
                  />
                </div>
                <div key="Human Resources" className={styles['multi-select-dropdown']}>
                  <label>Human Resources</label>
                  <Select
                    isMulti
                    options={hrOptions}
                    onChange={selectedOptions => handleFilterChange('Human Resources', selectedOptions)}
                  />
                </div>
                <div key="Tool Name" className={styles['multi-select-dropdown']}>
                  <label>Tool Name</label>
                  <Select
                    isMulti
                    options={tnameOptions}
                    onChange={selectedOptions => handleFilterChange('Tool Name', selectedOptions)}
                  />
                </div>
                <div key="Tool Serial Name" className={styles['multi-select-dropdown']}>
                  <label>Tool Serial Name</label>
                  <Select
                    isMulti
                    options={TsnameOptions}
                    onChange={selectedOptions => handleFilterChange('Tool Serial Name', selectedOptions)}
                  />
                </div>
                <div key="Customer" className={styles['multi-select-dropdown']}>
                  <label>Customer</label>
                  <Select
                    isMulti
                    options={cusOptions}
                    onChange={selectedOptions => handleFilterChange('Customer', selectedOptions)}
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
            )}
          </div>
          {showAddForm && (
            <div className={styles['projects-form']}>
              <h2>{newProject['sno'] ? 'Modify Data' : 'Add New Data'}</h2>
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
                name="projectName"
                placeholder="Project Name"
                value={newProject.projectName}
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
                name="phase"
                placeholder="Phase/Stage"
                value={newProject.phase}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="softwareSOPActualDate"
                placeholder="SW Start Date (dd/mm/yyyy)"
                value={newProject.softwareSOPActualDate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="softwareSOPPlannedDate"
                placeholder="SW End Date (dd/mm/yyyy)"
                value={newProject.softwareSOPPlannedDate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="sitstartdate"
                placeholder="SW Initial Test Start Date (dd/mm/yyyy)"
                value={newProject.sitstartdate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="sitenddate"
                placeholder="SW Initial Test End Date (dd/mm/yyyy)"
                value={newProject.sitenddate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="swdvstartdate"
                placeholder="SW DV Start Date (dd/mm/yyyy)"
                value={newProject.swdvstartdate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="swdvenddate"
                placeholder="SW DV End Date (dd/mm/yyyy)"
                value={newProject.swdvenddate}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="swcustomerrel"
                placeholder="SW Customer Release Date (dd/mm/yyyy)"
                value={newProject.swcustomerrel}
                onChange={handleInputChange}
                className={styles['projects-input']}
              />
              <input
                type="text"
                name="swwindchillrel"
                placeholder="SW Windchill Release Date (dd/mm/yyyy)"
                value={newProject.swwindchillrel}
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
              <button type="submit" className={styles['projects-button']} onClick={handleSubmit}>
                {newProject['sno'] ? 'Modify Data' : 'Add New Data'}
              </button>

              <button type="button" className={styles['projects-button']} onClick={handleCancelButtonClick}>
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
                {selectedColumns.includes('Emp Code')}
                {selectedColumns.includes('Human Resources')}
                {selectedColumns.includes('Tool Name')}
                {selectedColumns.includes('Tool Serial Name')}
                {selectedColumns.includes('Customer')}  
                {selectedColumns.includes('Phase/Stage')}
                {selectedColumns.includes('SW Start Date')}
                {selectedColumns.includes('SW End Date')}
                {selectedColumns.includes('SW Initial Test Start Date')}
                {selectedColumns.includes('SW Initial Test End Date')}
                {selectedColumns.includes('SW DV Start Date')}
                {selectedColumns.includes('SW DV End Date')}
                {selectedColumns.includes('SW Customer Release Date')}
                {selectedColumns.includes('SW Windchill Release Date')}
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
                  {selectedColumns.includes('Emp Code') && <td>{highlightText(project.empCode, searchTerm)}</td>}
                  {selectedColumns.includes('Human Resources') && <td>{highlightText(project.humanResources, searchTerm)}</td>}
                  {selectedColumns.includes('Tool Name') && <td>{highlightText(project.toolName, searchTerm)}</td>}
                  {selectedColumns.includes('Tool Serial Name') && <td>{highlightText(project.toolSerialName, searchTerm)}</td>}
                  {selectedColumns.includes('Customer') && <td>{highlightText(project.customer, searchTerm)}</td>}
                  {selectedColumns.includes('Phase/Stage') && <td>{highlightText(project.phase, searchTerm)}</td>}
                  {selectedColumns.includes('SW Start Date') && <td>{highlightText(project.softwareSOPActualDate, searchTerm)}</td>}
                  {selectedColumns.includes('SW End Date') && <td>{highlightText(project.softwareSOPPlannedDate, searchTerm)}</td>}
                  {selectedColumns.includes('SW Initial Test Start Date') && <td>{highlightText(project.sitstartdate, searchTerm)}</td>}
                  {selectedColumns.includes('SW Initial Test End Date') && <td>{highlightText(project.sitenddate, searchTerm)}</td>}
                  {selectedColumns.includes('SW DV Start Date') && <td>{highlightText(project.swdvstartdate, searchTerm)}</td>}
                  {selectedColumns.includes('SW DV End Date') && <td>{highlightText(project.swdvenddate, searchTerm)}</td>}
                  {selectedColumns.includes('SW Customer Release Date') && <td>{highlightText(project.swcustomerrel, searchTerm)}</td>}
                  {selectedColumns.includes('SW Windchill Release Date') && <td>{highlightText(project.swwindchillrel, searchTerm)}</td>}
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
