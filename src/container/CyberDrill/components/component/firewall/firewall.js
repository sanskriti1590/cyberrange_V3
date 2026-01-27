import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getImageAndFlavourList } from "../../../../../APIConfig/scenarioConfig";
import { addFirewall } from "../../../../../RTK/features/Infra/firewallSlice";
import MultipleSelect from "../router/MultipleSelect";

const Firewall = ({ handleClick, networks }) => {
    const dispatch = useDispatch();
    const [image, setImage] = useState([]);
    const [flavor, setFlavor] = useState([]);
    const [but, setBut] = useState(true);

    const [Instance, setInstance] = useState({
        name: '',
        network_name: [],
        image: '',
        flavor: '',
        team: '',
        ip_address: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await getImageAndFlavourList();
            setImage(response?.data?.images || []);
            setFlavor(response?.data?.flavors || []);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const isComplete =
            Instance.name &&
            Instance.network_name.length &&
            Instance.image &&
            Instance.flavor &&
            Instance.team;
        setBut(!isComplete);
    }, [Instance]);

    const validateInput = (name, value) => {
        if (name === 'name') {
            if (!value.trim()) return 'Name cannot be empty';
            if (value.length < 4) return 'Name should be at least 4 characters long';
        }
        if (name === 'network_name' && (!value || value.length === 0)) {
            return 'Select at least one network';
        }
        if (name === 'image' && !value) return 'Select an image';
        if (name === 'flavor' && !value) return 'Select a flavor';
        if (name === 'team' && !value) return 'Select a team';
        return '';
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        const updated = { ...Instance, [name]: value };
        setInstance(updated);
        if (['name', 'image', 'flavor', 'team'].includes(name)) {
            setErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
        }
    };

    const handleInstance = () => {
        const newErrors = {
            name: validateInput('name', Instance.name),
            network_name: validateInput('network_name', Instance.network_name),
            image: validateInput('image', Instance.image),
            flavor: validateInput('flavor', Instance.flavor),
            team: validateInput('team', Instance.team),
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(err => err)) return;

        dispatch(addFirewall(Instance));
        handleClick(9, Instance, 'firewall');
    };

    return (
        <Stack margin={5} gap={4}>
            <Typography variant="h1">Add Firewall</Typography>

            {/* Instance Name */}
            <TextField
                label="Instance Name"
                name="name"
                variant="outlined"
                onChange={changeHandler}
            />
            {errors.name && <span className="error">{errors.name}</span>}

            {/* Flavor & Network */}
            <Stack direction="row" gap={2}>
                {/* Flavor Select */}
                <FormControl fullWidth>
                    <InputLabel>Select Flavor</InputLabel>
                    <Select
                        name="flavor"
                        value={Instance.flavor}
                        onChange={changeHandler}
                        label="Select Flavor"
                        sx={{
                            color: "white",
                            '.MuiOutlinedInput-notchedOutline': { borderColor: '#acacac' },
                            '.MuiSvgIcon-root': { fill: '#acacac !important' },
                        }}
                    >
                        {flavor.map((item) => (
                            <MenuItem key={item.flavor_id} value={item.flavor_id}>
                                {item.flavor_name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.flavor && <span className="error">{errors.flavor}</span>}
                </FormControl>

                {/* Network Multi-Select */}
                <MultipleSelect
                    networks={networks}
                    router={Instance}
                    setRouter={setInstance}
                />
                {errors.network_name && <span className="error">{errors.network_name}</span>}
            </Stack>

            {/* Image Select */}
            <FormControl fullWidth>
                <InputLabel>Select Image</InputLabel>
                <Select
                    name="image"
                    value={Instance.image}
                    onChange={changeHandler}
                    label="Select Image"
                    sx={{
                        color: "white",
                        '.MuiOutlinedInput-notchedOutline': { borderColor: '#acacac' },
                        '.MuiSvgIcon-root': { fill: '#acacac !important' },
                    }}
                >
                    {image.map((item) => (
                        <MenuItem key={item.image_id} value={item.image_id}>
                            {item.image_name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.image && <span className="error">{errors.image}</span>}
            </FormControl>

            {/* Team Select */}
            <FormControl fullWidth>
                <InputLabel>Select Team</InputLabel>
                <Select
                    name="team"
                    value={Instance.team}
                    onChange={changeHandler}
                    label="Select Team"
                    sx={{
                        color: "white",
                        '.MuiOutlinedInput-notchedOutline': { borderColor: '#acacac' },
                        '.MuiSvgIcon-root': { fill: '#acacac !important' },
                    }}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="RED">Red Team</MenuItem>
                    <MenuItem value="BLUE">Blue Team</MenuItem>
                    <MenuItem value="PURPLE">Purple Team</MenuItem>
                    <MenuItem value="YELLOW">Yellow Team</MenuItem>
                </Select>
                {errors.team && <span className="error">{errors.team}</span>}
            </FormControl>

            {/* IP Address */}
            <TextField
                label="IP Address (optional)"
                name="ip_address"
                variant="outlined"
                onChange={changeHandler}
            />

            {/* Submit Button */}
            <Box mb={2}>
                <Button variant="contained" color="secondary" onClick={handleInstance} disabled={but}>
                    Add FireWall
                </Button>
            </Box>
        </Stack>
    );
};

export default Firewall;
