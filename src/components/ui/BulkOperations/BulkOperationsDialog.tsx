import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as ActivateIcon,
  Cancel as DeactivateIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../LoadingSpinner';

export type BulkOperation = 'delete' | 'activate' | 'deactivate' | 'updateStatus';

interface BulkOperationsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedItems: any[];
  itemType: 'students' | 'faculty' | 'parents' | 'performances' | 'fees';
  onExecute: (operation: BulkOperation, data?: any) => Promise<void>;
  isExecuting?: boolean;
}

export const BulkOperationsDialog: React.FC<BulkOperationsDialogProps> = ({
  open,
  onClose,
  selectedItems,
  itemType,
  onExecute,
  isExecuting = false,
}) => {
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation>('delete');
  const [confirmationText, setConfirmationText] = useState('');
  const [updateData, setUpdateData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!isExecuting) {
      setSelectedOperation('delete');
      setConfirmationText('');
      setUpdateData({});
      setError(null);
      onClose();
    }
  };

  const handleExecute = async () => {
    try {
      setError(null);
      
      // Validate confirmation text for destructive operations
      if (selectedOperation === 'delete' && confirmationText !== 'DELETE') {
        setError('Please type "DELETE" to confirm this action');
        return;
      }

      await onExecute(selectedOperation, updateData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const getOperationIcon = (operation: BulkOperation) => {
    switch (operation) {
      case 'delete':
        return <DeleteIcon color="error" />;
      case 'activate':
        return <ActivateIcon color="success" />;
      case 'deactivate':
        return <DeactivateIcon color="warning" />;
      case 'updateStatus':
        return <EditIcon color="primary" />;
      default:
        return null;
    }
  };

  const getOperationDescription = (operation: BulkOperation) => {
    switch (operation) {
      case 'delete':
        return `Permanently delete ${selectedItems.length} ${itemType}. This action cannot be undone.`;
      case 'activate':
        return `Activate ${selectedItems.length} ${itemType}.`;
      case 'deactivate':
        return `Deactivate ${selectedItems.length} ${itemType}.`;
      case 'updateStatus':
        return `Update status for ${selectedItems.length} ${itemType}.`;
      default:
        return '';
    }
  };

  const getConfirmationRequired = (operation: BulkOperation) => {
    return operation === 'delete';
  };

  const isConfirmationValid = () => {
    if (getConfirmationRequired(selectedOperation)) {
      return confirmationText === 'DELETE';
    }
    return true;
  };

  const operations: { value: BulkOperation; label: string; color: 'error' | 'warning' | 'success' | 'primary' }[] = [
    { value: 'delete', label: 'Delete', color: 'error' },
    { value: 'activate', label: 'Activate', color: 'success' },
    { value: 'deactivate', label: 'Deactivate', color: 'warning' },
    { value: 'updateStatus', label: 'Update Status', color: 'primary' },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: 400 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <WarningIcon color="warning" />
        Bulk Operations
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Selected Items Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Items ({selectedItems.length})
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <List dense>
              {selectedItems.slice(0, 10).map((item, index) => (
                <React.Fragment key={item.id || index}>
                  <ListItem>
                    <ListItemText
                      primary={item.fullName || item.name || `${item.firstName} ${item.lastName}` || item.id}
                      secondary={
                        item.email || 
                        item.rollNumber || 
                        item.subject || 
                        item.feeType || 
                        'No additional info'
                      }
                    />
                  </ListItem>
                  {index < Math.min(selectedItems.length - 1, 9) && <Divider />}
                </React.Fragment>
              ))}
              {selectedItems.length > 10 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Chip 
                        label={`+${selectedItems.length - 10} more items`} 
                        size="small" 
                        variant="outlined" 
                      />
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Box>

        {/* Operation Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select Operation</InputLabel>
            <Select
              value={selectedOperation}
              label="Select Operation"
              onChange={(e) => setSelectedOperation(e.target.value as BulkOperation)}
              disabled={isExecuting}
            >
              {operations.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getOperationIcon(op.value)}
                    <Typography color={op.color}>
                      {op.label}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Operation Description */}
        <Alert 
          severity={selectedOperation === 'delete' ? 'error' : 'warning'} 
          sx={{ mb: 3 }}
        >
          {getOperationDescription(selectedOperation)}
        </Alert>

        {/* Status Update Fields */}
        {selectedOperation === 'updateStatus' && itemType === 'students' && (
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select
                value={updateData.status || ''}
                label="New Status"
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                disabled={isExecuting}
              >
                <MenuItem value={0}>Active</MenuItem>
                <MenuItem value={1}>Inactive</MenuItem>
                <MenuItem value={2}>Suspended</MenuItem>
                <MenuItem value={3}>Graduated</MenuItem>
                <MenuItem value={4}>Transferred</MenuItem>
                <MenuItem value={5}>Withdrawn</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Confirmation Input */}
        {getConfirmationRequired(selectedOperation) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="error" gutterBottom>
              This action is permanent and cannot be undone. Type "DELETE" to confirm:
            </Typography>
            <TextField
              fullWidth
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              error={confirmationText !== '' && confirmationText !== 'DELETE'}
              helperText={
                confirmationText !== '' && confirmationText !== 'DELETE'
                  ? 'Must type "DELETE" exactly'
                  : ''
              }
              disabled={isExecuting}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={isExecuting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleExecute}
          variant="contained"
          color={selectedOperation === 'delete' ? 'error' : 'primary'}
          disabled={!isConfirmationValid() || isExecuting}
          startIcon={
            isExecuting ? (
              <LoadingSpinner size="small" />
            ) : (
              getOperationIcon(selectedOperation)
            )
          }
        >
          {isExecuting ? 'Processing...' : `Execute ${operations.find(op => op.value === selectedOperation)?.label}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};