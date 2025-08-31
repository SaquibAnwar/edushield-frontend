import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Grade as PerformanceIcon,
  Payment as FeeIcon,
} from '@mui/icons-material';
import type { Student } from '../../types/user';
import { getEnumDisplayName } from '../../utils/enumUtils';

interface ChildSelectorProps {
  children: Student[];
  selectedChild: Student | null;
  onChildSelect: (child: Student | null) => void;
  isLoading?: boolean;
  onTabChange?: (tabIndex: number) => void;
}

export const ChildSelector: React.FC<ChildSelectorProps> = ({
  children,
  selectedChild,
  onChildSelect,
  isLoading = false,
  onTabChange,
}) => {
  const handleChange = (event: any) => {
    const childId = event.target.value;
    if (childId === '') {
      onChildSelect(null);
    } else {
      const child = children.find(c => c.id === childId);
      onChildSelect(child || null);
    }
  };

  if (children.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Children Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No children are currently assigned to your account. Please contact the school administration if this is incorrect.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Child Selector Dropdown */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Child
        </Typography>
        <FormControl fullWidth disabled={isLoading}>
          <InputLabel id="child-select-label">Choose a child to view their information</InputLabel>
          <Select
            labelId="child-select-label"
            value={selectedChild?.id || ''}
            label="Choose a child to view their information"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select a child...</em>
            </MenuItem>
            {children.map((child) => (
              <MenuItem key={child.id} value={child.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1">
                      {child.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Roll: {child.rollNumber} • Grade: {child.grade || 'N/A'} • Section: {child.section || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Selected Child Overview */}
      {selectedChild && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Child Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                mr: 3,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {selectedChild.fullName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip
                  label={`Roll: ${selectedChild.rollNumber}`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={getEnumDisplayName('StudentStatus', selectedChild.status)}
                  color={selectedChild.isEnrolled ? 'success' : 'default'}
                  size="small"
                />
                {selectedChild.grade && (
                  <Chip
                    label={`Grade: ${selectedChild.grade}`}
                    color="info"
                    size="small"
                  />
                )}
                {selectedChild.section && (
                  <Chip
                    label={`Section: ${selectedChild.section}`}
                    color="info"
                    size="small"
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> {selectedChild.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Phone:</strong> {selectedChild.phoneNumber}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Age:</strong> {selectedChild.age} years
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>
                <strong>Gender:</strong> {getEnumDisplayName('Gender', selectedChild.gender)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Enrollment Status:</strong> {selectedChild.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Assigned Faculties:</strong> {selectedChild.assignedFaculties?.length || 0}
              </Typography>
            </Box>
          </Box>

          {/* Quick Actions for Selected Child */}
          {onTabChange && (
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Quick Actions for {selectedChild.firstName}:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<PerformanceIcon />}
                  onClick={() => onTabChange(2)}
                  size="small"
                >
                  View Performance
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FeeIcon />}
                  onClick={() => onTabChange(3)}
                  size="small"
                >
                  View Fees
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};