import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Checkbox, ListItemText} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultipleSelect({networks, setRouter, router}) {
    const theme = useTheme();
    //console.log('network from rouer',networks)
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {target: {value},} = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        setRouter({...router, 'network_name': value});
    };

    return (
        <div>
            <FormControl sx={{width: "100%"}}>
                <InputLabel id="demo-multiple-name-label">Network</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Netwo"/>}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    style={{backgroundColor: "background.secondary"}}
                    sx={{
                        color: "white",
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#acacac',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#acacac',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#acacac',
                        },
                        '.MuiSvgIcon-root ': {
                            fill: "#acacac !important",
                        }
                    }}
                >
                    {networks?.map((name, index) => (
                        <MenuItem key={index}
                                  value={name.network_name}
                                  style={{backgroundColor: "background.secondary"}}>
                            <Checkbox checked={personName.indexOf(name.network_name) > -1}/>
                            <ListItemText primary={name.network_name}/>
                        </MenuItem>

                    ))}
                </Select>
            </FormControl>
        </div>
    );
}


///////////
