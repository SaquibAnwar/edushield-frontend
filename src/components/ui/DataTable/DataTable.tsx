import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    Paper,
    Checkbox,
    IconButton,
    Collapse,
    Box,
    Typography,
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
} from '@mui/icons-material';
import { LoadingSpinner } from '../LoadingSpinner';
import type { DataTableProps, Column } from '../../../types/components';

interface DataTableState {
    orderBy: string;
    order: 'asc' | 'desc';
    page: number;
    rowsPerPage: number;
    searchTerm: string;
    filters: Record<string, any>;
    expandedRows: Set<string>;
}

function DataTable<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    rowKey,
    pagination,
    selection,
    onRowClick,
    onSort,
    onFilter: _onFilter,
    expandable,
    scroll,
    size = 'middle',
    bordered = true,
    showHeader = true,
    sticky = false,
    className,
    testId,
}: DataTableProps<T>) {
    const [state, setState] = React.useState<DataTableState>({
        orderBy: '',
        order: 'asc',
        page: 0,
        rowsPerPage: 10,
        searchTerm: '',
        filters: {},
        expandedRows: new Set(),
    });

    const handleSort = (property: string) => {
        const isAsc = state.orderBy === property && state.order === 'asc';
        const newOrder = isAsc ? 'desc' : 'asc';

        setState(prev => ({
            ...prev,
            order: newOrder,
            orderBy: property,
        }));

        if (onSort) {
            onSort(property, newOrder);
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setState(prev => ({ ...prev, page: newPage }));

        if (pagination?.onChange) {
            pagination.onChange(newPage + 1, state.rowsPerPage);
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setState(prev => ({ ...prev, rowsPerPage: newRowsPerPage, page: 0 }));

        if (pagination?.onChange) {
            pagination.onChange(1, newRowsPerPage);
        }
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selection) return;

        if (event.target.checked) {
            const newSelected = data?.map((_item, index) => String(index)) || [];
            selection.onChange(newSelected, data || []);
        } else {
            selection.onChange([], []);
        }
    };

    const handleRowSelect = (_event: React.ChangeEvent<HTMLInputElement>, _item: T, index: number) => {
        if (!selection) return;

        const selectedIndex = selection.selectedRowKeys.indexOf(String(index));
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selection.selectedRowKeys, String(index));
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selection.selectedRowKeys.slice(1));
        } else if (selectedIndex === selection.selectedRowKeys.length - 1) {
            newSelected = newSelected.concat(selection.selectedRowKeys.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selection.selectedRowKeys.slice(0, selectedIndex),
                selection.selectedRowKeys.slice(selectedIndex + 1),
            );
        }

        const selectedRows = newSelected.map(key => data?.[parseInt(key)]).filter(Boolean);
        selection.onChange(newSelected, selectedRows);
    };

    const handleExpandRow = (index: number) => {
        const key = String(index);
        const newExpanded = new Set(state.expandedRows);

        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }

        setState(prev => ({ ...prev, expandedRows: newExpanded }));

        if (expandable?.onExpand) {
            expandable.onExpand(!state.expandedRows.has(key), data?.[index]);
        }
    };

    const isSelected = (index: number) => {
        return selection?.selectedRowKeys.indexOf(String(index)) !== -1;
    };

    const getRowKey = (item: T, index: number): string => {
        if (rowKey) {
            if (typeof rowKey === 'function') {
                return rowKey(item, index);
            }
            return String(item[rowKey]);
        }
        // Fallback to id property or index
        return item.id ? String(item.id) : String(index);
    };

    const renderCellContent = (column: Column<T>, item: T, index: number) => {
        if (column.render) {
            return column.render(item[column.key as keyof T], item, index);
        }

        const value = column.dataIndex ? item[column.dataIndex] : item[column.key as keyof T];

        if (value === null || value === undefined) {
            return '-';
        }

        return String(value);
    };

    const getTableSize = () => {
        switch (size) {
            case 'small':
                return 'small';
            case 'large':
                return 'medium';
            default:
                return 'small';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <LoadingSpinner tip="Loading data..." />
            </Box>
        );
    }

    const numSelected = selection?.selectedRowKeys.length || 0;
    const rowCount = data?.length || 0;

    return (
        <Box className={className} data-testid={testId}>
            <Paper variant={bordered ? 'outlined' : 'elevation'}>
                <TableContainer sx={{ maxHeight: scroll?.y, maxWidth: scroll?.x }}>
                    <Table
                        stickyHeader={sticky}
                        size={getTableSize()}
                        aria-label="data table"
                    >
                        {showHeader && (
                            <TableHead>
                                <TableRow>
                                    {selection && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                                checked={rowCount > 0 && numSelected === rowCount}
                                                onChange={handleSelectAllClick}
                                                inputProps={{
                                                    'aria-label': 'select all items',
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                    {expandable && <TableCell />}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={String(column.key)}
                                            align={column.align || 'left'}
                                            style={{ width: column.width }}
                                            sortDirection={state.orderBy === column.key ? state.order : false}
                                        >
                                            {column.sortable ? (
                                                <TableSortLabel
                                                    active={state.orderBy === column.key}
                                                    direction={state.orderBy === column.key ? state.order : 'asc'}
                                                    onClick={() => handleSort(String(column.key))}
                                                >
                                                    {column.title}
                                                </TableSortLabel>
                                            ) : (
                                                column.title
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                        )}
                        <TableBody>
                            {!data || data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            columns.length +
                                            (selection ? 1 : 0) +
                                            (expandable ? 1 : 0)
                                        }
                                        align="center"
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            No data available
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.map((item, index) => {
                                    const isItemSelected = isSelected(index);
                                    const isExpanded = state.expandedRows.has(String(index));

                                    return (
                                        <React.Fragment key={getRowKey(item, index)}>
                                            <TableRow
                                                hover={!!onRowClick}
                                                onClick={() => onRowClick?.(item, index)}
                                                role={onRowClick ? 'button' : undefined}
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                selected={isItemSelected}
                                                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                            >
                                                {selection && (
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleRowSelect(event, item, index)}
                                                            disabled={selection.getCheckboxProps?.(item)?.disabled}
                                                            inputProps={{
                                                                'aria-labelledby': `enhanced-table-checkbox-${index}`,
                                                            }}
                                                        />
                                                    </TableCell>
                                                )}
                                                {expandable && (
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleExpandRow(index);
                                                            }}
                                                        >
                                                            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                        </IconButton>
                                                    </TableCell>
                                                )}
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={String(column.key)}
                                                        align={column.align || 'left'}
                                                    >
                                                        {renderCellContent(column, item, index)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                            {expandable && (
                                                <TableRow>
                                                    <TableCell
                                                        style={{ paddingBottom: 0, paddingTop: 0 }}
                                                        colSpan={
                                                            columns.length +
                                                            (selection ? 1 : 0) +
                                                            (expandable ? 1 : 0)
                                                        }
                                                    >
                                                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                            <Box margin={1}>
                                                                {expandable.expandedRowRender(item, index)}
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {pagination && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={pagination.total}
                        rowsPerPage={pagination.pageSize}
                        page={pagination.current - 1}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        showFirstButton
                        showLastButton
                    />
                )}
            </Paper>
        </Box>
    );
}

export default DataTable;