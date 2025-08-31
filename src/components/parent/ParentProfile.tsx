import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  ContactEmergency as EmergencyIcon,
} from '@mui/icons-material';
import type { Parent } from '../../types/user';
import { ParentType, ParentStatus } from '../../types/user';
import { getEnumDisplayName } from '../../utils/enumUtils';
import { dateConverter } from '../../utils/dateUtils';

interface ParentProfileProps {
  parent: Parent;
}

export const ParentProfile: React.FC<ParentProfileProps> = ({ parent }) => {
  const getParentTypeColor = (type: ParentType) => {
    switch (type) {
      case ParentType.PRIMARY:
        return 'primary';
      case ParentType.SECONDARY:
        return 'secondary';
      case ParentType.GUARDIAN:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: ParentStatus) => {
    switch (status) {
      case ParentStatus.ACTIVE:
        return 'success';
      case ParentStatus.INACTIVE:
        return 'default';
      case ParentStatus.SUSPENDED:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            fontSize: '2rem',
            mr: 3,
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {parent.fullName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip
              label={getEnumDisplayName('ParentType', parent.parentType)}
              color={getParentTypeColor(parent.parentType)}
              size="small"
            />
            <Chip
              label={getEnumDisplayName('ParentStatus', parent.status)}
              color={getStatusColor(parent.status)}
              size="small"
            />
            {parent.isEmergencyContact && (
              <Chip
                label="Emergency Contact"
                color="error"
                size="small"
                icon={<EmergencyIcon />}
              />
            )}
            {parent.isAuthorizedToPickup && (
              <Chip
                label="Authorized Pickup"
                color="info"
                size="small"
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Parent ID: {parent.id}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Contact Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ mr: 1 }} />
            Contact Information
          </Typography>
          <Box sx={{ ml: 4 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Email:</strong> {parent.email}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Phone:</strong> {parent.phoneNumber}
            </Typography>
            {parent.alternatePhoneNumber && (
              <Typography variant="body2" gutterBottom>
                <strong>Alternate Phone:</strong> {parent.alternatePhoneNumber}
              </Typography>
            )}
            {parent.workPhone && (
              <Typography variant="body2" gutterBottom>
                <strong>Work Phone:</strong> {parent.workPhone}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Personal Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} />
            Personal Information
          </Typography>
          <Box sx={{ ml: 4 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Date of Birth:</strong> {dateConverter.formatForDisplay(parent.dateOfBirth)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Age:</strong> {parent.age} years
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Gender:</strong> {getEnumDisplayName('Gender', parent.gender)}
            </Typography>
          </Box>
        </Box>

        {/* Address Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 1 }} />
            Address Information
          </Typography>
          <Box sx={{ ml: 4 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Address:</strong> {parent.address}
            </Typography>
            {parent.city && (
              <Typography variant="body2" gutterBottom>
                <strong>City:</strong> {parent.city}
              </Typography>
            )}
            {parent.state && (
              <Typography variant="body2" gutterBottom>
                <strong>State:</strong> {parent.state}
              </Typography>
            )}
            {parent.postalCode && (
              <Typography variant="body2" gutterBottom>
                <strong>Postal Code:</strong> {parent.postalCode}
              </Typography>
            )}
            {parent.country && (
              <Typography variant="body2" gutterBottom>
                <strong>Country:</strong> {parent.country}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Professional Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <WorkIcon sx={{ mr: 1 }} />
            Professional Information
          </Typography>
          <Box sx={{ ml: 4 }}>
            {parent.occupation ? (
              <Typography variant="body2" gutterBottom>
                <strong>Occupation:</strong> {parent.occupation}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                No occupation information
              </Typography>
            )}
            {parent.employer && (
              <Typography variant="body2" gutterBottom>
                <strong>Employer:</strong> {parent.employer}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Emergency Contact Information */}
      {(parent.emergencyContactName || parent.emergencyContactPhone) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <EmergencyIcon sx={{ mr: 1 }} />
            Emergency Contact Information
          </Typography>
          <Box sx={{ ml: 4 }}>
            {parent.emergencyContactName && (
              <Typography variant="body2" gutterBottom>
                <strong>Name:</strong> {parent.emergencyContactName}
              </Typography>
            )}
            {parent.emergencyContactPhone && (
              <Typography variant="body2" gutterBottom>
                <strong>Phone:</strong> {parent.emergencyContactPhone}
              </Typography>
            )}
            {parent.emergencyContactRelationship && (
              <Typography variant="body2" gutterBottom>
                <strong>Relationship:</strong> {parent.emergencyContactRelationship}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Statistics */}
      <Box sx={{ mt: 3 }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`${parent.childrenCount || parent.children?.length || 0} Children`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Joined ${dateConverter.formatForDisplay(parent.createdAt)}`}
            color="default"
            variant="outlined"
          />
          <Chip
            label={`Updated ${dateConverter.formatForDisplay(parent.updatedAt)}`}
            color="default"
            variant="outlined"
          />
        </Box>
      </Box>
    </Paper>
  );
};