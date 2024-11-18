/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types'
import palette from '../assets/palette.js'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Checkbox, Chip, Collapse, IconButton, Menu, MenuItem, TablePagination, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useMemo, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useStore from '../useStore.js';
import '@fontsource/inter/700.css';
import '@fontsource/inter/600.css';

// import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'
import '@fontsource/inter'; 
// compares the rows value, lower or higher value gets placed first or last depending on orderBy
const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

// check if ascn or desc, also a and b came from [...rows].sort()
const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}



function ITableHead({numSelected, onRequestSort, onSelectAllClick, order, orderBy, rowCount, headCells}) {
    const createSortHandler = (p) => (e) => {
        onRequestSort(e, p)
    }

    return(
        <TableHead >
            <TableRow>
                <TableCell padding='checkbox'>
                <Checkbox
                sx={{
                    '&.Mui-checked': {
                        color: palette.selected,
                    },
                    '&.MuiCheckbox-indeterminate': {
                        color: palette.selected,
                    },
                }}
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{
                    'aria-label': 'select all computers',
                }}
            />
                </TableCell>
                {headCells.map((hc) => <TableCell 
                    key={hc.id}
                    padding='none'//{hc.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === hc.id ? order : false}
                    sx={{fontSize:'small', fontWeight:'600'}}
                >
                    <TableSortLabel
                        active={orderBy === hc.id}
                        direction={orderBy === hc.id ? order : 'asc'}
                        onClick={createSortHandler(hc.id)}
                    >
                        {hc.label}
                        {orderBy === hc.id ? <Box
                            component={'span'}
                            sx={visuallyHidden}
                        >
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box> : null}
                    </TableSortLabel>
                </TableCell>)}
                <TableCell>
                    Action
                </TableCell>


            </TableRow>
        </TableHead>
    )
}

ITableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    headCells: PropTypes.array.isRequired,
}




function ITable({headCells, rows, type}) {
    const {
        order, setOrder,
        orderBy, setOrderBy,
        selected, setSelected,
        page, setPage,
        rowsPerPage, setRowsPerPage,
        anchorEl, setAnchorEl,
        menuRow, setMenuRow,
        tableType, setTableType,
    } = useStore()
    // const [order, setOrder] = useStor
    // const [orderBy, setOrderBy] = useState('room')
    // const [selected, setSelected] = useState([]);
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(10);

    // menu mini
    // const [anchorEl, setAnchorEl] = useState(null)
    // const [menuRow, setMenuRow] = useState(null)
    // console.log(headCells)
    useEffect(() =>{
        setTableType(type)

        // TODO
        if (type === 'computerTable') setOrderBy('room')
        else if (type === 'pendingTable') setOrderBy('submittee')

    }, [type, setOrderBy, setTableType])

    const handleMenuClick = (e, row) => {
        e.stopPropagation(); 
        setAnchorEl(e.currentTarget); 
        setMenuRow(row); 
      };
    
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuRow(null);
    };

    const handleMenuAction = (action) => {
        console.log(`Action: ${action} for row: ${menuRow.computer_id}`);
        handleCloseMenu(); // Close the menu after an action
    };
    
    const handleRequestSort = (e, p) => {
        const isAsc = orderBy === p && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(p)
    }
    
    const handleSelectAllClick = (e) => {
        if (e.target.checked) {
            // select all
            const newSelected = rows.map((n) => n.computer_id)
            setSelected(newSelected)
        } else {
            // unselect all
            setSelected([])
        }
    }

    const handleCheckClick = (e, id) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected = []
        /* 
        if -1, means the row is not yet selected, so select it
        if 0, means the row is selected and in first row, so unselect it by slicing at the start in the selected
        if n-1, means the row is selected and in last row, so unselect it by slicing at the end in the selected
        if > 0, means the row is selected and somewhere in the middle, so get first the prefix and the suffix and then unselect it
        */
        if (selectedIndex === -1)
            newSelected = newSelected.concat(selected, id)
        else if (selectedIndex === 0)
            newSelected = newSelected.concat(selected.slice(1))
        else if (selectedIndex === selected.length - 1)
            newSelected = newSelected.concat(selected.slice(0, -1))
        else if (selectedIndex > 0)
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            )
        setSelected(newSelected)
    }

    // turn to new or previous page
    const handleChangePage = (e, newPage) => {
        setPage(newPage)
    }

    // change the how many rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

    // checks emoty rows for the last page
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

    // chop the rows perpage each page, higher order function
    const visibleRows = useMemo(
        () =>
          [...rows]
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rows],
    );

    const computerRow = ({isItemSelected, labelId, r, handleMenuClick}) => (
        <>
            <TableCell padding='checkbox' sx={{fontSize:'small'}}>
                        <Checkbox
                            sx={{
                                '&.Mui-checked': {
                                    color: palette.selected, 
                                }
                            }}
                            checked={isItemSelected}
                            inputProps={{"aria-labelledby":labelId}}
                        />

                        <Collapse>
                            
                        </Collapse>

                        </TableCell>

                        <TableCell component={"th"} id={labelId} scope='row'>
                            {r.computer_id}
                        </TableCell>

                        <TableCell padding='none'>
                            {r.room}
                        </TableCell>

                        <TableCell padding='none'>
                            {r.system_unit}
                        </TableCell>

                        <TableCell padding='none'>
                            {r.monitor}
                        </TableCell>
                        <TableCell padding='none'>
                            <Chip
                                
                                
                                sx={{fontWeight:'600', borderWidth:'2px', borderRadius:'6px'}}
                                label={
                                    (r.condition === 0) ? "Good" : 
                                    (r.condition === 1) ? "Minor Issue" : 
                                    (r.condition === 2) ? "Major Issue" : 
                                    (r.condition === 3) ? "Bad" : "Unlisted"
                                }
                                color={
                                    (r.condition === 0) ? "success" : 
                                    (r.condition === 1) ? "warning" : 
                                    (r.condition === 2) ? "secondary" : 
                                    (r.condition === 3) ? "error" : "default"
                                }
                            />
                        </TableCell>
                        <TableCell padding='none' sx={{paddingLeft:'4px'}}>
                            <Chip
                                variant='outlined'
                                sx={{fontWeight:'600', borderWidth:'2px', borderRadius:'6px', borderColor:`${(r.status === 0) ? '#686D76 !important' : 'primary'}`}}
                                label={
                                    (r.status === 0) ? "Inactive" : "Active" 

                                }
                                color={
                                    (r.status === 0) ? "default" : "primary" 
                                }
                            />
                        </TableCell>
                        <TableCell align='left' padding='none' sx={{paddingLeft:'4%'}}>
                            {r.pending_reports}
                        </TableCell>
                        <TableCell>
                            <IconButton
                                onClick={(e) => handleMenuClick(e, r)}
                                aria-haspopup="true"
                                aria-controls='row-menu'
                                sx={{
                                    "&:focus": {
                                        outline:'none'
                                    }
                                }}
                            >
                                <MoreHorizIcon/>
                            </IconButton>
                        </TableCell>

        </>
    )

    const renderRow = useMemo(
        () => {
            if (type === 'computerTable'){
                return computerRow
            }
            console.log('hello')
            return null
        }, [type]   
    )

    return <Box sx={{border:'1px solid #DADADA'}}>
        <TableContainer sx={{backgroundColor: 'white', width:'100%',height:'500px',
            fontFamily: 'Inter, sans-serif',
            '& .MuiTableCell-root': { fontFamily: 'Inter, sans-serif' },}}>
            <Table stickyHeader>
                <ITableHead 
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                    headCells={headCells}
                />
                <TableBody>
                {visibleRows.map((r, i)=> {
                    const isItemSelected = selected.includes(r.computer_id)
                    const labelId = `Itable-checkbox-${i}`

                    return <TableRow 
                        key={`row-${r.computer_id}`}
                        hover
                        // TODO, database
                        onClick={(e) => handleCheckClick(e, r.computer_id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        sx={{cursor: 'pointer'}}
                    >
                        {renderRow({isItemSelected: isItemSelected, labelId: labelId, handleMenuClick: handleMenuClick, r: r})}   
                    </TableRow>
                })}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
        sx={{
            backgroundColor: 'white',
            '.MuiInputBase-root':{
                marginRight:'1em'
            },
            '.MuiTablePagination-displayedRows': {
                marginTop: '1em', // Adjust this value for the "1-9 of 9" text
            },
            '.MuiTablePagination-selectLabel': {
                marginTop: '1em', // Adjust this for the "Rows per page" label if needed
            }
        }}
            rowsPerPageOptions={[5,10,20,30]}
            component={'div'}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            sx={{}}
        >
            <MenuItem onClick={handleMenuAction}>Action 1</MenuItem>
        </Menu>
    </Box>;
}

ITable.propTypes = {
    headCells: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired

}
export default ITable;


