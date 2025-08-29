import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Alert, Button } from '@mui/material';
import { StudentFormTest } from '../components/ui/Forms/StudentForm/StudentFormTest';
import FacultyFormTest from '../components/ui/Forms/FacultyForm/FacultyFormTest';
import ParentFormTest from '../components/ui/Forms/ParentForm/ParentFormTest';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TestForms: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // const addTestResult = (result: string) => {
  //   setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  // };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        EduShield Forms Testing Suite
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        This page tests all the updated forms to ensure they meet backend requirements.
        All tasks from the implementation plan have been completed and are ready for testing.
      </Typography>

      {testResults.length > 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={clearResults}>
              Clear
            </Button>
          }
        >
          <Typography variant="h6">Test Results:</Typography>
          {testResults.map((result, index) => (
            <Typography key={index} variant="body2" component="div">
              {result}
            </Typography>
          ))}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="form test tabs">
          <Tab label="Student Form" id="form-tab-0" aria-controls="form-tabpanel-0" />
          <Tab label="Faculty Form" id="form-tab-1" aria-controls="form-tabpanel-1" />
          <Tab label="Parent Form" id="form-tab-2" aria-controls="form-tabpanel-2" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <StudentFormTest />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <FacultyFormTest />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <ParentFormTest />
      </TabPanel>
    </Box>
  );
};

export default TestForms;