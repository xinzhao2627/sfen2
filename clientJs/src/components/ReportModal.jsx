/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Stack, IconButton, Grid2 } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import computers_data from '../assets/computers_data.json'
import rooms_data from '../assets/rooms_data.json'
import CircularProgress from '@mui/material/CircularProgress';
import Slide from '@mui/material/Slide';
import MonitorIcon from '@mui/icons-material/Monitor';
import { BsCpuFill } from "react-icons/bs";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MouseIcon from '@mui/icons-material/Mouse';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import AppsIcon from '@mui/icons-material/Apps';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types'
import '@fontsource/inter'; 
import '@fontsource/inter/700.css';
import '@fontsource/inter/600.css';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} {...props}/>;
});

const ReportIconButton = ({ icon: Icon, label }) => (
    <IconButton 
        sx={{
            textAlign:'center', 
            padding:0.3, 
            borderRadius:'1px', 
            border:'1px solid black', 
            width: '100%', 
            height: '100%'
        }}
        disableRipple
    >
        
        <Icon style={{height:'30px', width:'100%'}}/>
        
    </IconButton>
);

ReportIconButton.propTypes = {
    icon: PropTypes.any,
    label: PropTypes.string
}
const gridPreset = {
    xs:1,
    size:2.4,
    marginBottom:2,
    textAlign:'center',
 }

const ReportGridItem = ({ icon: Icon, label }) => (
    <Grid2 item {...gridPreset}>
        <ReportIconButton icon={Icon} label={label} />
        <Typography fontFamily={'Inter'} marginTop={0.5}>{label}</Typography>
    </Grid2>
);

ReportGridItem.propTypes = {
    icon: PropTypes.any,
    label: PropTypes.string
};

const ReportModal = () => {

    const [open, setOpen] = useState(false);
    const [building, setBuilding] = useState('');
    const [room, setRoom] = useState(null);
    const [computerId, setComputerId] = useState(null);
    const [parts, setParts] = useState([]);
    const [conditions, setConditions] = useState({});

    const getRooms = () => {
        return rooms_data
            .filter(r => r.building_code === building)
            .map(r => r.room);
    }
    const getComputers = () => {
        return computers_data.rows
            .filter(c => c.room === room && c.building_code === building)
            .map(c => c.computer_id);
    };
    const handleOpen = () => {
        
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handlePartsChange = (event) => {
        const {
            target: { value },
        } = event;
        setParts(typeof value === 'string' ? value.split(',') : value);
    };

    const handleConditionChange = (part) => (event) => {
        setConditions({
            ...conditions,
            [part]: event.target.value,
        });
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log({ building, room, computerId, parts, conditions });
        handleClose();
    };
    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Open Report Modal
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Report a Computer Issue"}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="building-label">Building</InputLabel>
                        <Select
                            labelId="building-label"
                            value={building}
                            label="Building"
                            onChange={(e) => {
                                setRoom(null);
                                setComputerId(null)
                                setBuilding(e.target.value);
                            }}
                        >
                            <MenuItem value="MB">Main Building</MenuItem>
                            <MenuItem value="ANB">Annex Building</MenuItem>
                            <MenuItem value="MND">Mendiola Building</MenuItem>
                        </Select>
                    </FormControl>
                    <Autocomplete
                        options={getRooms()}
                        value={room}
                        onChange={(event, newRoom) => {
                            setComputerId(null)
                            setRoom(newRoom)
                        }}
                        disablePortal
                        renderInput={params => 
                            <TextField
                                {...params}
                                label="Room"
                            />
                        }

                    />
                    <Autocomplete
                        options={getComputers()}
                        value={computerId}
                        onChange={(event, newComputerId) => setComputerId(newComputerId)}
                        disablePortal
                        renderInput={params => 
                            <TextField
                                {...params}
                                label="Computer ID"
                            />
                        }

                    />

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Stack>
                            <Typography variant='h4'>
                                Choose reporting area
                            </Typography>
                            <Grid2 container spacing={2}>
                                <ReportGridItem icon={BsCpuFill} label="System Unit" />
                                <ReportGridItem icon={MonitorIcon} label="Monitor" />
                                <ReportGridItem icon={AppsIcon} label="Software" />
                                <ReportGridItem icon={WifiOffIcon} label="Internet" />
                                <ReportGridItem icon={KeyboardIcon} label="Keyboard" />
                                <ReportGridItem icon={MouseIcon} label="Mouse" />
                                <ReportGridItem icon={MoreHorizIcon} label="Other" />
                            </Grid2>
                        </Stack>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary" sx={{ mt: 2 }}>
                            Submit Report
                    </Button>
                    <Button onClick={handleClose} color="secondary" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ReportModal;


// {parts.map((part) => (
//     <FormControl fullWidth sx={{ mt: 2 }} key={part}>
//         <InputLabel id={`${part}-condition-label`}>{`${part} Condition`}</InputLabel>
//         <Select
//             labelId={`${part}-condition-label`}
//             value={conditions[part] || ''}
//             label={`${part} Condition`}
//             onChange={handleConditionChange(part)}
//         >
//             <MenuItem value="Minor Issue">Minor Issue</MenuItem>
//             <MenuItem value="Major Issue">Major Issue</MenuItem>
//             <MenuItem value="Critical Issue">Critical Issue</MenuItem>
//         </Select>
//     </FormControl>
// ))}