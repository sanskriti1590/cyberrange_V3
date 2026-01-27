import { TextField } from "@mui/material"
import './style.css';

export const CustomTextfield = (props) => {
    return (
        <>
            <TextField
                size="small"
                sx={{
                    '& label': {
                        color: '#fff',
                        display: 'none'
                    },
                    '& .Mui-focused': {
                        color: '#fff',
                    },
                    '&:hover fieldset': {
                        border: '2px solid #12464C !important',
                        borderRadius: 1,
                    },
                    '& legend': { display: 'none' },
                    '& fieldset': { top: 0 },
                }}
                fullWidth
                type={props.type}
                id="outlined-basic"
                label={props.label}
                variant="outlined"
                name={props.name}
                onChange={props.onChange}
                value={props.value}
                inputProps={{ style: { color: "white" } }}
            />
        </>
    )
}