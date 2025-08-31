import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Skeleton,
  Breadcrumbs,
  Link,
  Stack,
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
} from '@mui/material';
import { Grid } from '../../components/ui/Grid';
import {
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Science as ScienceIcon,
  Slideshow as PresentationIcon,
  Assessment as AssessmentIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useStudentData } from '../../hooks/useStudentData';
import { Layout } from '../../components/layout';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import type { StudentPerformance } from '../../types/user';
import { ExamType } from '../../types/user';
import type { PaginatedResponse } from '../../types/api';
import { formatDate } from '../../utils/dateUtils';
import { getExamTypeLabel, getExamTypeColor } from '../../utils/enumUtils';

interface PerformanceFilters {
  subject?: string;
  examType?: ExamType;
  dateFrom?: string;
  dateTo?: string;
}

interface SubjectStats {
  subject: string;
  totalExams: number;
  averageScore: number;
  averagePercentage: number;
  highestScore: number;
  lowestScore: number;
  trend: 'up' | 'down' | 'stable';
  recentPerformances: StudentPerformance[];
}

const getExamTypeIcon = (examType: ExamType) => {
  switch (examType) {
    case ExamType.UnitTest:
      return <QuizIcon />;
    case ExamType.MidTerm:
      return <AssessmentIcon />;
    case ExamType.Final:
      return <SchoolIcon />;
    case ExamType.Assignment:
      return <AssignmentIcon />;
    case ExamType.Laboratory:
      return <ScienceIcon />;
    case ExamType.Presentation:
      return <PresentationIcon />;
    default:
      return <GradeIcon />;
  }
};

const getGradeColor = (percentage: number): string => {
  if (percentage >= 90) return '#4caf50'; // Green
  if (percentage >= 80) return '#8bc34a'; // Light Green
  if (percentage >= 70) return '#ffeb3b'; // Yellow
  if (percentage >= 60) return '#ff9800'; // Orange
  return '#f44336'; // Red
};

const PerformanceView: React.FC = () => {
  const navigate = useNavigate();
  const { student } = useStudentData();

  const [performances, setPerformances] = useState<StudentPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PerformanceFilters>({});

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof StudentPerformance>('examDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // Get unique subjects and exam types for filters
  const availableSubjects = useMemo(() => {
    const subjects = [...new Set(performances.map(p => p.subject))];
    return subjects.sort();
  }, [performances]);

  const availableExamTypes = useMemo(() => {
    const examTypes = [...new Set(performances.map(p => p.examType))];
    return examTypes.sort((a, b) => a - b);
  }, [performances]);

  // Filter performances based on current filters
  const filteredPerformances = useMemo(() => {
    return performances.filter(performance => {
      if (filters.subject && performance.subject !== filters.subject) {
        return false;
      }
      if (filters.examType !== undefined && performance.examType !== filters.examType) {
        return false;
      }
      if (filters.dateFrom && new Date(performance.examDate) < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && new Date(performance.examDate) > new Date(filters.dateTo)) {
        return false;
      }
      return true;
    });
  }, [performances, filters]);

  // Calculate subject-wise statistics
  const subjectStats = useMemo((): SubjectStats[] => {
    const subjectMap = new Map<string, StudentPerformance[]>();

    filteredPerformances.forEach(performance => {
      if (!subjectMap.has(performance.subject)) {
        subjectMap.set(performance.subject, []);
      }
      subjectMap.get(performance.subject)!.push(performance);
    });

    return Array.from(subjectMap.entries()).map(([subject, subjectPerformances]) => {
      const sortedPerformances = subjectPerformances.sort((a, b) =>
        new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
      );

      const totalExams = subjectPerformances.length;
      const averageScore = subjectPerformances.reduce((sum, p) => sum + p.score, 0) / totalExams;
      const averagePercentage = subjectPerformances.reduce((sum, p) => sum + (p.percentage || 0), 0) / totalExams;
      const scores = subjectPerformances.map(p => p.score);
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);

      // Calculate trend based on recent performances
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (sortedPerformances.length >= 2) {
        const recent = sortedPerformances.slice(0, Math.min(3, sortedPerformances.length));
        const older = sortedPerformances.slice(Math.min(3, sortedPerformances.length));

        if (recent.length > 0 && older.length > 0) {
          const recentAvg = recent.reduce((sum, p) => sum + (p.percentage || 0), 0) / recent.length;
          const olderAvg = older.reduce((sum, p) => sum + (p.percentage || 0), 0) / older.length;

          if (recentAvg > olderAvg + 2) trend = 'up';
          else if (recentAvg < olderAvg - 2) trend = 'down';
        }
      }

      return {
        subject,
        totalExams,
        averageScore,
        averagePercentage,
        highestScore,
        lowestScore,
        trend,
        recentPerformances: sortedPerformances.slice(0, 5), // Last 5 performances
      };
    }).sort((a, b) => b.averagePercentage - a.averagePercentage);
  }, [filteredPerformances]);

  // Overall statistics
  const overallStats = useMemo(() => {
    if (filteredPerformances.length === 0) {
      return {
        totalExams: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        subjectsCount: 0,
      };
    }

    const percentages = filteredPerformances.map(p => p.percentage || 0);
    return {
      totalExams: filteredPerformances.length,
      averagePercentage: percentages.reduce((sum, p) => sum + p, 0) / percentages.length,
      highestPercentage: Math.max(...percentages),
      lowestPercentage: Math.min(...percentages),
      subjectsCount: availableSubjects.length,
    };
  }, [filteredPerformances, availableSubjects]);

  const fetchPerformances = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching performance data...');

      // Fetch all performances for the current student
      // The backend automatically filters by current user for students
      const filters: any = {
        page: 1,
        limit: 1000, // Get all performances for the student
        sortBy: 'examDate',
        sortOrder: 'desc',
      };

      // If we have a student ID, add it to the filters as a workaround
      if (student?.id) {
        filters.studentId = student.id;
      }

      const response: PaginatedResponse<StudentPerformance> = await apiService.getStudentPerformances(filters);

      console.log('Performance data received:', response);
      setPerformances(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load performance data';
      setError(errorMessage);
      console.error('Error fetching performances:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformances();
  }, [student]); // Re-fetch when student data changes

  const handleRefresh = async () => {
    await fetchPerformances();
  };

  const handleFilterChange = (field: keyof PerformanceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Table functions
  const handleRequestSort = (property: keyof StudentPerformance) => {
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

  // Sort and paginate filtered performances
  const sortedPerformances = useMemo(() => {
    const sorted = [...filteredPerformances].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      // Handle date sorting
      if (orderBy === 'examDate') {
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
  }, [filteredPerformances, orderBy, order, page, rowsPerPage]);

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
      <Box sx={{ px: 4, pt: 4, pb: 2 }}>
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
            <GradeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Performance
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box sx={{ px: 4, pb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Academic Performance
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {student ? `${student.fullName} • ${student.rollNumber}` : 'Track your academic progress, exam results, and performance metrics.'}
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

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Subject</InputLabel>
                <Select
                  value={filters.subject || ''}
                  label="Subject"
                  onChange={(e) => handleFilterChange('subject', e.target.value)}
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  {availableSubjects.map(subject => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Exam Type</InputLabel>
                <Select
                  value={filters.examType !== undefined ? filters.examType.toString() : ''}
                  label="Exam Type"
                  onChange={(e) => handleFilterChange('examType', e.target.value === '' ? undefined : Number(e.target.value) as ExamType)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {availableExamTypes.map(examType => (
                    <MenuItem key={examType} value={examType}>
                      {getExamTypeLabel(examType)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="From Date"
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="To Date"
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
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

        {filteredPerformances.length === 0 ? (
          <Alert severity="info">
            No performance data found{Object.keys(filters).some(key => filters[key as keyof PerformanceFilters]) ? ' for the selected filters' : ''}.
            {performances.length === 0 ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Your academic records will appear here once they are added by your teachers.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  Refresh Data
                </Button>
              </Box>
            ) : ''}
          </Alert>
        ) : (
          <>
            {/* Overall Statistics */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overall Statistics
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {overallStats.totalExams}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Exams
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {overallStats.averagePercentage.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: getGradeColor(overallStats.highestPercentage) }}>
                      {overallStats.highestPercentage.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Highest Score
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="text.secondary">
                      {overallStats.subjectsCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Subjects
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Subject-wise Performance */}
            <Typography variant="h6" gutterBottom>
              Subject-wise Performance
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {subjectStats.map((stats) => (
                <Grid item xs={12} md={6} lg={4} key={stats.subject}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" component="h3">
                          {stats.subject}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {stats.trend === 'up' && (
                            <Tooltip title="Improving performance">
                              <TrendingUpIcon color="success" />
                            </Tooltip>
                          )}
                          {stats.trend === 'down' && (
                            <Tooltip title="Declining performance">
                              <TrendingDownIcon color="error" />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Average Performance
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={stats.averagePercentage}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getGradeColor(stats.averagePercentage),
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 35 }}>
                            {stats.averagePercentage.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Box>

                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Exams:
                          </Typography>
                          <Typography variant="body2">
                            {stats.totalExams}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Highest:
                          </Typography>
                          <Typography variant="body2" sx={{ color: getGradeColor((stats.highestScore / (stats.recentPerformances[0]?.maxScore || 100)) * 100) }}>
                            {stats.highestScore}/{stats.recentPerformances[0]?.maxScore || 100}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Lowest:
                          </Typography>
                          <Typography variant="body2">
                            {stats.lowestScore}/{stats.recentPerformances[0]?.maxScore || 100}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Performance Data Table */}
            <Typography variant="h6" gutterBottom>
              Performance Records
            </Typography>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="performance table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'examDate'}
                        direction={orderBy === 'examDate' ? order : 'asc'}
                        onClick={() => handleRequestSort('examDate')}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'subject'}
                        direction={orderBy === 'subject' ? order : 'asc'}
                        onClick={() => handleRequestSort('subject')}
                      >
                        Subject
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'examType'}
                        direction={orderBy === 'examType' ? order : 'asc'}
                        onClick={() => handleRequestSort('examType')}
                      >
                        Exam Type
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Exam Title</TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'score'}
                        direction={orderBy === 'score' ? order : 'asc'}
                        onClick={() => handleRequestSort('score')}
                      >
                        Score
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'percentage'}
                        direction={orderBy === 'percentage' ? order : 'asc'}
                        onClick={() => handleRequestSort('percentage')}
                      >
                        Percentage
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">
                      <TableSortLabel
                        active={orderBy === 'grade'}
                        direction={orderBy === 'grade' ? order : 'asc'}
                        onClick={() => handleRequestSort('grade')}
                      >
                        Grade
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPerformances.map((performance) => (
                    <TableRow
                      key={performance.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {formatDate(performance.examDate)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: getExamTypeColor(performance.examType),
                              mr: 1,
                              width: 24,
                              height: 24,
                            }}
                          >
                            {getExamTypeIcon(performance.examType)}
                          </Avatar>
                          {performance.subject}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getExamTypeLabel(performance.examType)}
                          size="small"
                          sx={{
                            bgcolor: getExamTypeColor(performance.examType),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>{performance.examTitle || 'Exam'}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {performance.formattedScore}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{
                            color: getGradeColor(performance.percentage || 0),
                          }}
                        >
                          {performance.percentage?.toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={performance.grade}
                          size="small"
                          sx={{
                            bgcolor: getGradeColor(performance.percentage || 0),
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
                            fontStyle: performance.comments ? 'italic' : 'normal',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {performance.comments || '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedPerformances.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                          No performance records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Table Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredPerformances.length}
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

export default PerformanceView;