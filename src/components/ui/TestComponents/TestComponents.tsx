import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Grid } from '../Grid';
import {
  LoadingSpinner,
  ErrorMessage,
  DataTable,
  Modal,
  StudentForm,
  FacultyForm,
  ParentForm,
} from '../index';
import FacultyFormTest from '../Forms/FacultyForm/FacultyFormTest';
import ParentFormTest from '../Forms/ParentForm/ParentFormTest';
import { StudentFormTest } from '../Forms/StudentForm/StudentFormTest';
import { AdminAccessTest } from '../../admin/AdminAccessTest';
import type { Column } from '../../../types/components';
import type { StudentFormData, FacultyFormData, ParentFormData } from '../../../types/forms';

// Sample data for DataTable
const sampleStudents = [
  { id: '1', name: 'John Doe', grade: '10', section: 'A', status: 'Active' },
  { id: '2', name: 'Jane Smith', grade: '10', section: 'B', status: 'Active' },
  { id: '3', name: 'Bob Johnson', grade: '9', section: 'A', status: 'Inactive' },
];

const studentColumns: Column<any>[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'grade', title: 'Grade', sortable: true },
  { key: 'section', title: 'Section', sortable: true },
  { key: 'status', title: 'Status', sortable: true },
];

const TestComponents: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<'student' | 'faculty' | 'parent' | 'facultyTest' | 'parentTest' | 'studentTest' | null>(null);
  const [formSubmissionResult, setFormSubmissionResult] = useState<string | null>(null);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const handleErrorTest = () => {
    setShowError(!showError);
  };

  const handleFormSubmit = async (data: any, formType: string) => {
    console.log(`${formType} form submitted:`, data);
    setFormSubmissionResult(`${formType} form submitted successfully!`);
    setModalOpen(false);
    setCurrentForm(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => setFormSubmissionResult(null), 3000);
  };

  const openFormModal = (formType: 'student' | 'faculty' | 'parent' | 'facultyTest' | 'parentTest' | 'studentTest') => {
    setCurrentForm(formType);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentForm(null);
  };

  const renderCurrentForm = () => {
    switch (currentForm) {
      case 'student':
        return (
          <StudentForm
            onSubmit={(data: StudentFormData) => handleFormSubmit(data, 'Student')}
            onCancel={closeModal}
            parents={[
              { id: '1', fullName: 'John Parent' },
              { id: '2', fullName: 'Jane Parent' },
            ]}
          />
        );
      case 'faculty':
        return (
          <FacultyForm
            onSubmit={(data: FacultyFormData) => handleFormSubmit(data, 'Faculty')}
            onCancel={closeModal}
          />
        );
      case 'parent':
        return (
          <ParentForm
            onSubmit={(data: ParentFormData) => handleFormSubmit(data, 'Parent')}
            onCancel={closeModal}
          />
        );
      case 'facultyTest':
        return <FacultyFormTest />;
      case 'parentTest':
        return <ParentFormTest />;
      case 'studentTest':
        return <StudentFormTest />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        UI Components Test Page
      </Typography>
      
      {formSubmissionResult && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {formSubmissionResult}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* LoadingSpinner Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              LoadingSpinner Component
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" onClick={handleLoadingTest}>
                Test Loading (3s)
              </Button>
            </Box>
            <Box sx={{ minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {loading ? (
                <LoadingSpinner tip="Loading test data..." />
              ) : (
                <Typography color="text.secondary">Click button to test loading</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* ErrorMessage Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ErrorMessage Component
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" onClick={handleErrorTest}>
                Toggle Error Message
              </Button>
            </Box>
            <Box sx={{ minHeight: 100 }}>
              {showError ? (
                <ErrorMessage
                  error="This is a test error message"
                  showRetry
                  onRetry={() => console.log('Retry clicked')}
                />
              ) : (
                <Typography color="text.secondary">Click button to show error</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* DataTable Test */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              DataTable Component
            </Typography>
            <DataTable
              data={sampleStudents}
              columns={studentColumns}
              pagination={{
                current: 1,
                pageSize: 10,
                total: sampleStudents.length,
                onChange: (page, pageSize) => console.log('Pagination:', page, pageSize),
              }}
              onRowClick={(record) => console.log('Row clicked:', record)}
              onSort={(field, order) => console.log('Sort:', field, order)}
            />
          </Paper>
        </Grid>

        {/* Admin Access Control Test */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Admin Access Control Test
            </Typography>
            <AdminAccessTest />
          </Paper>
        </Grid>

        {/* Form Tests */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Form Components
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => openFormModal('student')}
              >
                Test Student Form
              </Button>
              <Button
                variant="contained"
                onClick={() => openFormModal('faculty')}
              >
                Test Faculty Form
              </Button>
              <Button
                variant="contained"
                onClick={() => openFormModal('parent')}
              >
                Test Parent Form
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => openFormModal('studentTest')}
              >
                Test Student Form (Updated)
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => openFormModal('facultyTest')}
              >
                Test Faculty Form (Updated)
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => openFormModal('parentTest')}
              >
                Test Parent Form (Updated)
              </Button>
            </Box>
            <Typography color="text.secondary">
              Click buttons above to test form components in modal
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal with Forms */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={`${currentForm ? currentForm.charAt(0).toUpperCase() + currentForm.slice(1) : ''} Form`}
        width="md"
      >
        {renderCurrentForm()}
      </Modal>
    </Box>
  );
};

export default TestComponents;