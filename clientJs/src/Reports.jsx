/* eslint-disable no-unused-vars */
import { Grid2 } from '@mui/material';
import reports_data from './assets/reports_data.json'
import ITable from './components/ITable';
function Reports() {
    function createData(report_id, room, computer_id, components, date_submitted, submittee, building, comment){
        return {report_id, room, computer_id, components, date_submitted, submittee, building, comment}
    }
    
    const rows = reports_data.rows.map((rd) => createData( 
        rd.report_id, 
        rd.room, 
        rd.computer_id,
        rd.components,
        rd.date_submitted,
        rd.submittee,
        rd.building,
        rd.comment
    ))
    const headCells = [
        {
            id: "reports_id",
            numeric: false,
            disablePadding: true,
            label: "Report ID",
        },
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
            label: "Room - Bd",
        },
        {
            id: "components",
            numeric: false,
            disablePadding: false,
            label: "Components",
        },
        {
            id: "date_submitted",
            numeric: false,
            disablePadding: true,
            label: "Date Submitted",
        },
        {
            id: "submittee",
            numeric: false,
            disablePadding: true,
            label: "Submittee",
        },

    ]
    return <div>
        <ITable headCells={headCells} rows={rows} type='reportTable'/>

    </div>;
}

export default Reports;