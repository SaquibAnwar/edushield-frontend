import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { ModalProps } from '../../../types/components';

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  width = 'sm',
  height,
  closable = true,
  maskClosable = true,
  footer,
  loading = false,
  centered: _centered = true,
  destroyOnClose = false,
  children,
  className,
  testId,
}) => {
  const handleClose = (_event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (!maskClosable && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  const getMaxWidth = () => {
    if (typeof width === 'string') {
      switch (width) {
        case 'xs':
        case 'sm':
        case 'md':
        case 'lg':
        case 'xl':
          return width;
        default:
          return 'sm';
      }
    }
    return false;
  };

  const getDialogStyle = () => {
    const style: React.CSSProperties = {};
    
    if (typeof width === 'number') {
      style.width = width;
      style.maxWidth = width;
    }
    
    if (height) {
      style.height = typeof height === 'number' ? height : height;
      style.maxHeight = typeof height === 'number' ? height : height;
    }
    
    return style;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={getMaxWidth()}
      fullWidth
      className={className}
      data-testid={testId}
      PaperProps={{
        style: getDialogStyle(),
      }}
      scroll="paper"
      keepMounted={!destroyOnClose}
    >
      {loading && (
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: 'absolute',
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {closable && (
            <IconButton
              aria-label="close"
              onClick={() => onClose()}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      
      <DialogContent
        dividers
        sx={{
          p: 3,
          ...(height && {
            height: typeof height === 'number' ? height - 120 : 'calc(100% - 120px)',
            overflow: 'auto',
          }),
        }}
      >
        {children}
      </DialogContent>
      
      {footer && (
        <DialogActions sx={{ p: 2, pt: 1 }}>
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;