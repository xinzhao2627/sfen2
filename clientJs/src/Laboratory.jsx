/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ITable from './components/ITable';
import computers_data from './assets/computers_data.json'


function createData(computer_id, room, system_unit, monitor, status, condition, pending_reports){
    return {room, computer_id, system_unit, monitor, condition, status, pending_reports}
}
function Laboratory() {
    const headCells = [
        {
            id: "computer_id",
            numeric: false,
            disablePadding: true,
            label: "Computer ID",
        },
        {
            id: "room",
            numeric: false,
            disablePadding: true,
            label: "Room",
        },
        {
            id: "system_unit",
            numeric: false,
            disablePadding: true,
            label: "System Unit Tag",
        },
        {
            id: "monitor",
            numeric: false,
            disablePadding: true,
            label: "Monitor Tag",
        },
        {
            id: "condition",
            numeric: false,
            disablePadding: true,
            label: "Condition",
        },
        {
            id: "status",
            numeric: false,
            disablePadding: true,
            label: "Status",
        },
        {
            id: "pending_reports",
            numeric: true,
            disablePadding: false,
            label: "Pending Reports",
        },
         
    
    ]
    const rows = computers_data.rows.map((cd)=> createData(
        cd.computer_id,
        cd.room,
        cd.system_unit,
        cd.monitor,
        cd.status,
        cd.condition_id,
        40
    ))

    // console.log(headCells)
    return <ITable headCells={headCells} rows={rows} type="computerTable"/>;
}

export default Laboratory;