import React, { useEffect, useState } from "react";
import "../index.css";
import { getAllAvatars, registerUser } from "../APIConfig/CtfConfig";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomizeInput from "../components/CustomizeInput";
import CustomizeHiddenInput from "../components/CustomizeHiddenInput";
import Dropdown from "../components/DropDown";
import rangestormlogo from "../assests/rangestormlogo.png"

export const Register = () => {
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const options = [
        { value: 'RED TEAM', label: 'RED TEAM' },
        { value: 'BLUE TEAM', label: 'BLUE TEAM' },
        { value: 'PURPLE TEAM', label: 'PURPLE TEAM' },
        { value: 'WHITE TEAM', label: 'WHITE TEAM' },
        { value: 'YELLOW TEAM', label: 'YELLOW TEAM' },
    ];

    const [sign, setSign] = useState({
        user_full_name: "",
        mobile_number: "",
        email: "",
        password: "",
        confirm_password: "",
        user_avatar: "",
        user_role: "RED TEAM",
    });

    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        getAvatars();
        setSign({ ...sign, user_avatar: avatars[0] });
    }, []);

    const handleSignInChange = (e) => {
        const { name, value } = e.target;

        if (name === 'mobile_number') {
            const input = value.replace(/\D/g, ''); // Only allow numeric input
            if (input.length <= 10) {
                setSign({ ...sign, [name]: input });
                // Validate the mobile number for exactly 10 digits
                if (input.length === 10) {
                    setIsValidPhoneNumber(true); // Valid number
                } else {
                    setIsValidPhoneNumber(false); // Invalid number
                }
            }
        } else {
            setSign({ ...sign, [name]: value.trimStart() });
        }
    };

    const handleChangeSign = async () => {
        if (!isValidPhoneNumber) {
            toast.error("Please enter a valid mobile number.");
            return;
        }
        try {
            const response = await registerUser(sign);
            navigate("/auth/login");
        } catch (error) {
            const obj = error.response.data.errors;
            for (let i in obj) {
                let str = ''
                if (i !== "non_field_errors") {
                    str = str + i.charAt(0).toUpperCase() + i.slice(1).replace(/_/g, " ") + " "
                }
                str = str + obj[i]
                toast.error(str);
            }
        }
    }



    const getAvatars = async () => {
        const response = await getAllAvatars();

        response?.data && setAvatars(response?.data?.user_avatar_list);
    };

    const handleAvatarClick = (index, avatar) => {
        setSelected(index);
        setSign({ ...sign, user_avatar: avatar });
    };

    return (
        <Stack justifyContent="space-between" direction="row" width="100%">
            <Stack
                width={{ xs: '100%', sm: '100%', md: '50%', lg: '40%', xl: '40%' }}
                display="flex"
                flexDirection="column"
                gap={2}
                p={5}
            >
                <Stack>
                    <Typography style={{ fontWeight: 'bold', color: '#F4F4F4' }} variant="h1">
                        Create Account
                    </Typography>
                    <Typography style={{ color: '#fff' }} variant="body2">
                        The account has permission to connect to the cyber range network and access the simulated systems, servers,
                        and devices within the environment.
                    </Typography>
                </Stack>
                <Box>
                    <Typography sx={{ color: '#fff', textAlign: 'left', mb: 1 }}>
                        Choose Avatar:
                    </Typography>
                    <Box
                        display="flex"
                        gap={2}
                        flexWrap="wrap"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {avatars?.map((avatar, i) => (
                            <Avatar
                                key={i}
                                src={avatar}
                                sx={{ cursor: 'pointer', border: selected === i ? '2px solid white' : '' }}
                                onClick={() => handleAvatarClick(i, avatar)}
                            />
                        ))}
                    </Box>
                </Box>
                <Stack width="100%">
                    <Dropdown
                        name="user_role"
                        value={sign.user_role}
                        options={options}
                        onChange={handleSignInChange}
                    />
                </Stack>
                <Stack>
                    <CustomizeInput
                        label="Email"
                        type="text"
                        name="email"
                        onChange={handleSignInChange}
                        value={sign.email}
                        placeholder="Enter your Email"
                    />
                </Stack>
                <Stack>
                    <CustomizeInput
                        label="Name"
                        type="text"
                        name="user_full_name"
                        onChange={handleSignInChange}
                        value={sign.user_full_name}
                        placeholder="Enter your name"
                    />
                </Stack>
                <Stack>
                    <CustomizeInput
                        label="Mobile number"
                        type="text"
                        name="mobile_number"
                        placeholder="Enter Mobile Number"
                        onChange={handleSignInChange}
                        value={sign.mobile_number}
                        error={!isValidPhoneNumber}
                        helperText={!isValidPhoneNumber ? "Invalid mobile number" : ""}
                    />
                </Stack>
                <Stack>
                    <CustomizeHiddenInput
                        label="Password"
                        type="password"
                        name="password"
                        onChange={handleSignInChange}
                        value={sign.password}
                        placeholder="Enter Password"
                    />
                </Stack>
                <Stack>
                    <CustomizeHiddenInput
                        label="Confirm Password"
                        type="password"
                        name="confirm_password"
                        onChange={handleSignInChange}
                        value={sign.confirm_password}
                        placeholder="Confirm Password"
                    />
                </Stack>
                <Button
                    sx={{ marginTop: '10px', width: '100%' }}
                    variant="contained"
                    color="secondary"
                    onClick={handleChangeSign}
                >
                    Continue
                </Button>
                <Stack sx={{ alignItems: 'center' }}>
                    <Typography
                        variant="body1"
                        mt={1}
                        sx={{ color: '#F4F4F4' }}
                    >
                        Already have an account?{' '}
                        <span
                            style={{ color: '#00FFFF', cursor: 'pointer' }}
                            onClick={() => navigate('/auth/login')}
                        >
                            Login
                        </span>
                    </Typography>
                </Stack>
            </Stack>
            <Stack
                justifyContent="center"
                alignItems="center"
                width={{ xs: '0%', sm: '0%', md: '50%', lg: '60%', xl: '60%' }} overflow="hidden" position="fixed" right={0} py={40}>
                <img
                    src={rangestormlogo}
                    alt="login-img"
                    style={{ width: "80%", height: "30vh", cursor: "default" }}
                />
            </Stack>
        </Stack>
    );
};
