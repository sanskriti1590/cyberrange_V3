import React, { useEffect, useState } from "react";
import {
    Button,
    Grid,
    Menu,
    MenuItem,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";

const ViewAllFirewalls = ({
    handleClick = () => {},     // ✅ SAFE DEFAULT
    firewalls = [],
    DelIns,
    load,
    onEdit = () => {},          // ✅ SAFE DEFAULT
}) => {
    const [but, setBut] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFirewallId, setSelectedFirewallId] = useState(null);

    useEffect(() => {
        setBut(Array.isArray(firewalls) && firewalls.length > 0);
    }, [firewalls, load]);

    const handleDelete = (id) => {
        DelIns(id);
        handleCloseMenu();
    };

    const handleEdit = (id) => {
        onEdit(id);
        handleCloseMenu();
    };

    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedFirewallId(id);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedFirewallId(null);
    };

    return (
        <Stack margin={5} gap={4}>
            <Stack gap={2}>
                <Stack gap={2} direction="row">
                    <Typography variant="h1">All Firewalls</Typography>
                    <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: "8px" }}
                        onClick={() => handleClick(8)}
                    >
                        Add Firewall
                    </Button>
                </Stack>
                <Typography variant="body1" color="#acacac !important">
                    This view displays all firewall instances you've added. You can add more or remove existing ones.
                </Typography>
            </Stack>

            <Grid container gap={2} width="100%">
                {firewalls.map((data, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={5.8}
                        lg={3.8}
                        xl={3.8}
                        mb={7}
                        bgcolor="#313131"
                        p={2}
                        borderRadius="8px"
                        key={data.id || index}
                    >
                        <Stack direction="row" justifyContent="space-between">
                            <Stack gap={2} direction="row">
                                <Typography color="#b46228 !important">
                                    IP Address:
                                </Typography>
                                <Typography color="#b46228 !important">
                                    {data.instance_ip || "N/A"}
                                </Typography>
                            </Stack>
                            <IconButton
                                onClick={(e) => handleMenuClick(e, data.id || index)}
                                sx={{ color: "white" }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Stack>

                        <Typography variant="body1">
                            {data.instance_name || "Unnamed"}
                        </Typography>

                        <Typography variant="body2" color="#ACACAC !important">
                            {data.flavor_for || "Unknown"} TEAM
                        </Typography>

                        <Typography variant="body2" color="#ACACAC !important">
                            Image: {data.image_id || "N/A"}
                        </Typography>

                        <Typography variant="body2" color="#ACACAC !important">
                            Flavor: {data.flavor_id || "N/A"}
                        </Typography>

                        <Typography variant="body2" color="#ACACAC !important">
                            Networks:{" "}
                            {Array.isArray(data.network_location)
                                ? data.network_location.join(", ")
                                : data.network_location || "N/A"}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={() => handleEdit(selectedFirewallId)}>
                    <BiEdit style={{ marginRight: 8 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => handleDelete(selectedFirewallId)}>
                    <RiDeleteBin5Line style={{ marginRight: 8 }} /> Delete
                </MenuItem>
            </Menu>

            <Button
                variant="contained"
                color="secondary"
                sx={{ width: "150px", whiteSpace: "nowrap" }}
                disabled={!but}
                onClick={() => handleClick(10)}
            >
                Submit Infra
            </Button>
        </Stack>
    );
};

ViewAllFirewalls.propTypes = {
    handleClick: PropTypes.func,      // ✅ NOT required
    firewalls: PropTypes.array,
    DelIns: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
    load: PropTypes.bool,
};

export default ViewAllFirewalls;
