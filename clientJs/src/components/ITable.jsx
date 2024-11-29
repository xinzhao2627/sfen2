/* eslint-disable react/prop-types */
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
import { Box, Checkbox, Chip, Collapse, IconButton, Menu, MenuItem, Stack, TablePagination, TableSortLabel, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useMemo, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useStore from '../useStore.js';
import '@fontsource/inter/700.css';
import '@fontsource/inter/600.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from "react"; 

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



function ITableHead({numSelected, onRequestSort, onSelectAllClick, order, orderBy, rowCount, headCells, type}) {
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
                {headCells.map((hc,i) => {
                    const collapsibleHead = () => type === "reportTable" && i === 0
                        ? <TableCell 
                            key={hc.id + " - collapsible"}
                            //{hc.disablePadding ? 'none' : 'normal'}
                            sx={{fontSize:'small', fontWeight:'600', p:0, pl:1, pr:2}}
                        >
                            Details
                        </TableCell>
                        : null
                    


                    return <React.Fragment key={'Fragment' + i}>
                    {collapsibleHead()}
                    <TableCell 
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
                        </TableCell>
                    </React.Fragment>

                    })}
                <TableCell>
                    Action
                </TableCell>


            </TableRow>
        </TableHead>
    )
}


function ComputerRow ({isItemSelected, labelId, r, handleMenuClick}) {

    return <>
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
}

function ReportRow ({isItemSelected, labelId, r, handleMenuClick, handleCheckClick}) {
    const [collapseOpen, setCollapseOpen] = useState(false);

    return <>
    <TableRow
        key={`report-row-${r.report_id}`}
        hover
        onClick={(e) => handleCheckClick(e, r.report_id)}
        aria-checked={isItemSelected}
        sx={{cursor: 'pointer'}}
        role="checkbox"
    >
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
        </TableCell>
        <TableCell padding='checkbox'>
            <IconButton
                size='small'
                onClick={(e, r) => {
                    e.stopPropagation()
                    setCollapseOpen(!collapseOpen)
                }}
            >
                {collapseOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>} 
            </IconButton>
        </TableCell>

        <TableCell component={"th"} id={labelId} scope='row'>
            {r.report_id}
        </TableCell>

        <TableCell padding='none'>
            {r.computer_id}
        </TableCell>

        <TableCell padding='none'>
            {r.room + " - " + r.building}
        </TableCell>

        <TableCell padding='none' sx={{paddingRight:4}}>
            {(() => {
                const filtered = Object.entries(r.components)
                                    .filter(([k, v])=> v)
                const mapped = filtered.map(([k, v], i) => filtered.length-1 === i ? k :k+", " )
                return <>{mapped}</>
            }) ()}
        </TableCell>
        <TableCell padding='none' sx={{paddingLeft:'4px'}}>
            {r.date_submitted}
        </TableCell>
        <TableCell padding='none' sx={{paddingLeft:'4px'}}>
            {r.submittee}
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
    </TableRow>
    <TableRow
        key={'collapse-row'+r.report_id}
    >
        <TableCell sx={{paddingBottom:0, paddingTop:0}} colSpan={12}>
            <Collapse in={collapseOpen} timeout='auto' unmountOnExit>
                <Box sx={{margin:1}}>
                    <Typography variant='h6' gutterBottom component='div'>
                        Report Details
                    </Typography>
                    <Stack>
                        {Object.entries(r.components).map( ([k, v], i)=> v 
                            ? <Stack direction='row' key={`collapse-component-${r.report_id}-${i}`}>
                                <Typography>{k} : {v}</Typography>
                            </Stack>
                            : null
                        )}
                        <Stack>
                            <Typography>
                                Comment
                            </Typography>
                            <Typography>
                                {r.comment}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Collapse>
        </TableCell>
    </TableRow>
</>
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
    useEffect(() =>{
        setTableType(type)

        // TODO
        if (type === 'computerTable') setOrderBy('room')
        else if (type === 'reportTable') setOrderBy('date_submitted')

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
                    type={type}
                />
                <TableBody>
                {type==="computerTable"?visibleRows.map((r, i)=> {
                    const isItemSelected = selected.includes(r.computer_id)
                    const labelId = `Itable-checkbox-${i}`

                    return <TableRow 
                        key={`computer-row-${r.computer_id}`}
                        hover
                        // TODO, database
                        onClick={(e) => handleCheckClick(e, r.computer_id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        sx={{cursor: 'pointer'}}
                    >
                        <ComputerRow/>  
                    </TableRow>
                }) : visibleRows.map((r,i) => {
                    
                    const isItemSelected = selected.includes(r.report_id)
                    const labelId = `Itable-checkbox-${i}`

                    return <ReportRow 
                        key={'reportRow - '+i}
                        isItemSelected={isItemSelected}
                        labelId={labelId}
                        r={r}
                        handleMenuClick={handleMenuClick}
                        handleCheckClick={handleCheckClick}
                    />

                }) }
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


