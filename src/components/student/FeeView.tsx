import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Breadcrumbs,
  Link,
  Avatar,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  LinearProgress,
} from '@mui/material';
import { Grid } from '../../components/ui/Grid';
import {
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  DirectionsBus as TransportIcon,
  LocalLibrary as LibraryIcon,
  Category as MiscIcon,
  FilterList as FilterIcon,

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useStudentData } from '../../hooks/useStudentData';
import { Layout } from '../../components/layout';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import type { StudentFee } from '../../types/user';
import { FeeType, PaymentStatus } from '../../types/user';
import type { PaginatedResponse } from '../../types/api';
import { formatDate } from '../../utils/dateUtils';
import { getFeeTypeLabel, getPaymentStatusLabel, getFeeTypeColor, getPaymentStatusColor } from '../../utils/enumUtils';

interface FeeFilters {
  feeType?: FeeType;
  paymentStatus?: PaymentStatus;
  term?: string;
  isOverdue?: boolean;
}

interface FeeStats {
  totalFees: number;
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  overdueAmount: number;
  overdueCount: number;
  paidCount: number;
  pendingCount: number;
  partialCount: number;
}

const getFeeTypeIcon = (feeType: FeeType) => {
  switch (feeType) {
    case FeeType.Tuition:
      return <SchoolIcon />;
    case FeeType.Exam:
      return <PaymentIcon />;
    case FeeType.Transport:
      return <TransportIcon />;
    case FeeType.Library:
      return <LibraryIcon />;
    case FeeType.Misc:
      return <MiscIcon />;
    default:
      return <MoneyIcon />;
  }
};

const getPaymentStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.Paid:
      return <CheckCircleIcon />;
    case PaymentStatus.Overdue:
      return <WarningIcon />;
    case PaymentStatus.Partial:
      return <ScheduleIcon />;
    default:
      return <PaymentIcon />;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const FeeView: React.FC = () => {
  const navigate = useNavigate();
  const { student } = useStudentData();

  const [fees, setFees] = useState<StudentFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FeeFilters>({});

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof StudentFee>('dueDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Get unique terms and fee types for filters
  const availableTerms = useMemo(() => {
    const terms = [...new Set(fees.map(f => f.term))];
    return terms.sort();
  }, [fees]);

  const availableFeeTypes = useMemo(() => {
    const feeTypes = [...new Set(fees.map(f => f.feeType))];
    return feeTypes.sort((a, b) => a - b);
  }, [fees]);

  // Filter fees based on current filters
  const filteredFees = useMemo(() => {
    return fees.filter(fee => {
      if (filters.feeType !== undefined && fee.feeType !== filters.feeType) {
        return false;
      }
      if (filters.paymentStatus !== undefined && fee.paymentStatus !== filters.paymentStatus) {
        return false;
      }
      if (filters.term && fee.term !== filters.term) {
        return false;
      }
      if (filters.isOverdue !== undefined && fee.isOverdue !== filters.isOverdue) {
        return false;
      }
      return true;
    });
  }, [fees, filters]);

  // Calculate fee statistics
  const feeStats = useMemo((): FeeStats => {
    if (filteredFees.length === 0) {
      return {
        totalFees: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalDue: 0,
        overdueAmount: 0,
        overdueCount: 0,
        paidCount: 0,
        pendingCount: 0,
        partialCount: 0,
      };
    }

    return {
      totalFees: filteredFees.length,
      totalAmount: filteredFees.reduce((sum, f) => sum + f.totalAmount, 0),
      totalPaid: filteredFees.reduce((sum, f) => sum + f.amountPaid, 0),
      totalDue: filteredFees.reduce((sum, f) => sum + f.amountDue, 0),
      overdueAmount: filteredFees.filter(f => f.isOverdue).reduce((sum, f) => sum + f.amountDue, 0),
      overdueCount: filteredFees.filter(f => f.isOverdue).length,
      paidCount: filteredFees.filter(f => f.paymentStatus === PaymentStatus.Paid).length,
      pendingCount: filteredFees.filter(f => f.paymentStatus === PaymentStatus.Pending).length,
      partialCount: filteredFees.filter(f => f.paymentStatus === PaymentStatus.Partial).length,
    };
  }, [filteredFees]);

  const fetchFees = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching fee data...');

      // Fetch all fees for the current student
      // The backend automatically filters by current user for students
      const filters: any = {
        page: 1,
        limit: 1000, // Get all fees for the student
        sortBy: 'dueDate',
        sortOrder: 'asc',
      };

      // If we have a student ID, add it to the filters as a workaround
      if (student?.id) {
        filters.studentId = student.id;
      }

      const response: PaginatedResponse<StudentFee> = await apiService.getStudentFees(filters);

      console.log('Fee data received:', response);
      setFees(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load fee data';
      setError(errorMessage);
      console.error('Error fetching fees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [student]); // Re-fetch when student data changes

  const handleRefresh = async () => {
    await fetchFees();
  };

  const handleFilterChange = (field: keyof FeeFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Table functions
  const handleRequestSort = (property: keyof StudentFee) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort and paginate filtered fees
  const sortedFees = useMemo(() => {
    const sorted = [...filteredFees].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      // Handle date sorting
      if (orderBy === 'dueDate' || orderBy === 'lastPaymentDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredFees, orderBy, order, page, rowsPerPage]);

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
              <Skeleton variant="rectangular" height={300} />
              <Skeleton variant="rectangular" height={300} />
              <Skeleton variant="rectangular" height={300} />
            </Box>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 4 }}>
          <ErrorMessage
            error={error}
            showRetry={true}
            onRetry={handleRefresh}
          />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumbs */}
      <Box sx={{ p: 4, pb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/student');
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Link>
          <Typography
            sx={{ display: 'flex', alignItems: 'center' }}
            color="text.primary"
          >
            <PaymentIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Fees
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box sx={{ px: 4, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Fee Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {student ? `${student.fullName} • ${student.rollNumber}` : 'Fee Overview'}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        {!student && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Student profile not found. Showing all available fee data.
            </Typography>
          </Alert>
        )}

        {/* Overdue Alert */}
        {feeStats.overdueCount > 0 && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            icon={<WarningIcon />}
          >
            <Typography variant="body1" fontWeight="medium">
              You have {feeStats.overdueCount} overdue payment{feeStats.overdueCount > 1 ? 's' : ''} 
              totaling {formatCurrency(feeStats.overdueAmount)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please contact the administration office to arrange payment and avoid additional penalties.
            </Typography>
          </Alert>
        )}

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Fee Type</InputLabel>
                <Select
                  value={filters.feeType !== undefined ? filters.feeType.toString() : ''}
                  label="Fee Type"
                  onChange={(e) => handleFilterChange('feeType', e.target.value === '' ? undefined : Number(e.target.value) as FeeType)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {availableFeeTypes.map(feeType => (
                    <MenuItem key={feeType} value={feeType}>
                      {getFeeTypeLabel(feeType)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={filters.paymentStatus !== undefined ? filters.paymentStatus.toString() : ''}
                  label="Payment Status"
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value === '' ? undefined : Number(e.target.value) as PaymentStatus)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value={PaymentStatus.Pending}>Pending</MenuItem>
                  <MenuItem value={PaymentStatus.Partial}>Partial</MenuItem>
                  <MenuItem value={PaymentStatus.Paid}>Paid</MenuItem>
                  <MenuItem value={PaymentStatus.Overdue}>Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Term</InputLabel>
                <Select
                  value={filters.term || ''}
                  label="Term"
                  onChange={(e) => handleFilterChange('term', e.target.value)}
                >
                  <MenuItem value="">All Terms</MenuItem>
                  {availableTerms.map(term => (
                    <MenuItem key={term} value={term}>
                      {term}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Overdue Status</InputLabel>
                <Select
                  value={filters.isOverdue !== undefined ? filters.isOverdue.toString() : ''}
                  label="Overdue Status"
                  onChange={(e) => handleFilterChange('isOverdue', e.target.value === '' ? undefined : e.target.value === 'true')}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Overdue Only</MenuItem>
                  <MenuItem value="false">Not Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
                size="small"
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {filteredFees.length === 0 ? (
          <Alert severity="info">
            No fee data found{Object.keys(filters).some(key => filters[key as keyof FeeFilters] !== undefined) ? ' for the selected filters' : ''}.
            {fees.length === 0 ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your fee records will appear here once they are added by the administration.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleRefresh}
                >
                  Refresh Data
                </Button>
              </Box>
            ) : ''}
          </Alert>
        ) : (
          <>
            {/* Fee Statistics */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fee Summary
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">
                      {formatCurrency(feeStats.totalAmount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Fees
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                      {formatCurrency(feeStats.totalPaid)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amount Paid
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      color={feeStats.totalDue > 0 ? "warning.main" : "success.main"}
                    >
                      {formatCurrency(feeStats.totalDue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amount Due
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      color={feeStats.overdueAmount > 0 ? "error.main" : "success.main"}
                    >
                      {formatCurrency(feeStats.overdueAmount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overdue Amount
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Payment Progress */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Payment Progress
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={feeStats.totalAmount > 0 ? (feeStats.totalPaid / feeStats.totalAmount) * 100 : 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: feeStats.totalDue === 0 ? 'success.main' : 'warning.main',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 35 }}>
                    {feeStats.totalAmount > 0 ? ((feeStats.totalPaid / feeStats.totalAmount) * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>

              {/* Status Breakdown */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {feeStats.paidCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Paid
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="warning.main">
                      {feeStats.pendingCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="info.main">
                      {feeStats.partialCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Partial
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="error.main">
                      {feeStats.overdueCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Overdue
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Fee Data Table */}
            <Typography variant="h6" gutterBottom>
              Fee Records
            </Typography>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="fee table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'dueDate'}
                        direction={orderBy === 'dueDate' ? order : 'asc'}
                        onClick={() => handleRequestSort('dueDate')}
                      >
                        Due Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'feeType'}
                        direction={orderBy === 'feeType' ? order : 'asc'}
                        onClick={() => handleRequestSort('feeType')}
                      >
                        Fee Type
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'term'}
                        direction={orderBy === 'term' ? order : 'asc'}
                        onClick={() => handleRequestSort('term')}
                      >
                        Term
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'totalAmount'}
                        direction={orderBy === 'totalAmount' ? order : 'asc'}
                        onClick={() => handleRequestSort('totalAmount')}
                      >
                        Total Amount
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'amountPaid'}
                        direction={orderBy === 'amountPaid' ? order : 'asc'}
                        onClick={() => handleRequestSort('amountPaid')}
                      >
                        Amount Paid
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'amountDue'}
                        direction={orderBy === 'amountDue' ? order : 'asc'}
                        onClick={() => handleRequestSort('amountDue')}
                      >
                        Amount Due
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel
                        active={orderBy === 'paymentStatus'}
                        direction={orderBy === 'paymentStatus' ? order : 'asc'}
                        onClick={() => handleRequestSort('paymentStatus')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedFees.map((fee) => (
                    <TableRow
                      key={fee.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: fee.isOverdue ? 'error.light' : 'inherit',
                        '&:hover': { 
                          backgroundColor: fee.isOverdue ? 'error.main' : 'action.hover',
                          '& *': { color: fee.isOverdue ? 'white' : 'inherit' }
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {fee.isOverdue && (
                            <Tooltip title={`${fee.daysOverdue} days overdue`}>
                              <WarningIcon 
                                color="error" 
                                sx={{ mr: 1, fontSize: 20 }} 
                              />
                            </Tooltip>
                          )}
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {formatDate(fee.dueDate)}
                            </Typography>
                            {fee.isOverdue && (
                              <Typography variant="caption" color="error">
                                {fee.daysOverdue} days overdue
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: getFeeTypeColor(fee.feeType),
                              mr: 1,
                              width: 24,
                              height: 24,
                            }}
                          >
                            {getFeeTypeIcon(fee.feeType)}
                          </Avatar>
                          {getFeeTypeLabel(fee.feeType)}
                        </Box>
                      </TableCell>
                      <TableCell>{fee.term}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(fee.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          color="success.main"
                        >
                          {formatCurrency(fee.amountPaid)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={fee.amountDue > 0 ? (fee.isOverdue ? "error.main" : "warning.main") : "success.main"}
                        >
                          {formatCurrency(fee.amountDue)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={getPaymentStatusIcon(fee.paymentStatus)}
                          label={getPaymentStatusLabel(fee.paymentStatus)}
                          size="small"
                          sx={{
                            bgcolor: getPaymentStatusColor(fee.paymentStatus),
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontStyle: fee.notes ? 'italic' : 'normal',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {fee.notes || 'No notes'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={filteredFees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default FeeView;