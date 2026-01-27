import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import "./index.css";
import jwtDecode from "jwt-decode";
import { useJwt } from "react-jwt";
import { toggleValue2 } from "../../RTK/features/Left";
import { useDispatch, useSelector } from "react-redux";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Icons } from "../icons";
import UserNavBar from "./UserNavbar";
import AdminNavbar from "./AdminNavbar";
import logo from "../../assests/rangestrom.png";
import truncateString from "../../utilities/truncateString";
import { fetchUsers } from "../../RTK/features/userDetails/userSlice";
import CircularProgress from "@mui/material/CircularProgress";

const Demo = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const { isExpired } = useJwt(token);
    const [role, setRole] = useState("user");
    const dispatch = useDispatch();
    const { loading, userss, error } = useSelector((state) => state.user);
    useEffect(() => {
        // Dispatch the fetchUsers action when the component mounts
        dispatch(fetchUsers());
    }, [dispatch]);

    const MAX_CHAR_LENGTH = 15;

    const handleRole = () => {
        setRole(!role);
    };

    const handleRoleAdmin = () => {
        setRole("admin");
        navigate("/admin/soloCatgories");
    };
    const handleRoleUser = () => {
        navigate("/");
        setRole("user");

    };

    const handleToggle2 = () => {
        dispatch(toggleValue2());
    };

    let user = null;
    useEffect(() => {
        apiFunction();
    }, []);

    const apiFunction = async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            user = jwtDecode(token);
            if (!user.is_verified) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
            }
        }
    };
    const location = useLocation();
    const currentPath = location?.pathname.split("/", 3).join("/");
    //console.log("current path",currentPath)
    const highlighter = (path) => (currentPath === path ? "active" : "inactive");

    useEffect(() => {
        if (currentPath.includes("admin")) {
            setRole("admin");
        }
        if (isExpired) {
            navigate("/login");
        }
    }, []);

    const profile = [
        {
            team: userss?.user_role,
            id: userss?.user_full_name,
        },
    ];

    // logout function
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/auth/login");
    };
    return (
        <Stack
            py={5}
            sx={{
                display: "flex",
                direction: "column",
                alignItems: "center",
                backgroundColor: "custom.main",
                position: "static",
                gap: 4,
                overflow: "scroll",
                overflowX: "hidden",
                height: "100dvh",
            }}
            className="example"
        >
            <Box
                component="img"
                src={logo}
                alt="logo"
                sx={{ width: "165px", height: "24px" }}
            />
            {loading && (<CircularProgress disableShrink />)}
            {token && !loading ? (
                <Stack
                    px={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "100%" }}
                >
                    <Stack
                        mb={3}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="start"
                        sx={{ width: "100%" }}
                    >
                        <Stack direction="row" justifyContent="center">
                            {userss && profile && !loading && (
                                <Box
                                    sx={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "100%",
                                        border: "2px solid #fff",
                                        padding: "2px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar
                                        alt={userss?.user_full_name}
                                        src={userss?.user_avatar}
                                        sx={{ height: "100%", width: "100%" }}
                                    />
                                </Box>
                            )}
                            {userss && profile ? (
                                <Link
                                    style={{ textDecoration: "none" }}
                                    to={`/playerProfile/${userss?.user_id}`}
                                    state={{ the: userss, hide: "true" }}
                                >
                                    <Stack>
                                        {profile.map((profiles, index) => (
                                            <Stack pl={1} key={index}>
                                                <Typography variant="h3">
                                                    {truncateString(profiles.id, MAX_CHAR_LENGTH)}
                                                </Typography>
                                                <Typography variant="body3">{profiles.team}</Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Link>
                            ) : (
                                <Typography>No data available</Typography>
                            )}

                        </Stack>
                        <KeyboardDoubleArrowLeftIcon
                            onClick={handleToggle2}
                            style={{ cursor: "pointer" }}
                        />
                    </Stack>
                    {userss?.is_admin ? (
                        <Stack
                            sx={{
                                backgroundColor: "#1C1F28",
                                width: "241px",
                                height: "49px",
                                justifyContent: "center",
                                padding: 1,
                                borderRadius: "10px",
                            }}
                            direction="row"
                        >
                            <Button
                                variant={role != "admin" ? "text" : "contained"}
                                color="primary"
                                disabled={false}
                                sx={{ width: "50%" }}
                                onClick={handleRoleAdmin}
                            >
                                Admin
                            </Button>
                            <Button
                                variant={role == "admin" ? "text" : "contained"}
                                color="secondary"
                                sx={{ width: "50%" }}
                                onClick={handleRoleUser}
                            >
                                User
                            </Button>
                        </Stack>
                    ) : (
                        null
                    )}
                </Stack>
            ) : !loading && (
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "100%" }}
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate("auth/login")}
                    >
                        Login
                    </Button>
                </Stack>
            )}

            {/* navigator block */}
            <Stack
                display="flex"
                direction="column"
                className="navlink-wrapper"
                sx={{
                    width: "100%",
                    gap: 2,
                }}
            >
                {/* navigator for the single click */}
                {role != "admin" ? <UserNavBar /> : <AdminNavbar />}

                <Stack
                    direction="row"
                    className="inactive"
                    style={{ cursor: "pointer" }}
                    gap={1}
                    onClick={() => window.open("https://pxp-lms1.bhumiitech.com/")}
                >
                    <Box
                        sx={{ display: "flex", direction: "row", gap: 1 }}

                    >
                        <Icons.RLMS style={{ fontSize: "24px" }} />
                        PXP (RLMS)
                    </Box>
                </Stack>
                {token && userss ? (
                    <Stack
                        direction="row"
                        className="inactive"
                        onClick={handleLogout}
                        style={{ cursor: "pointer" }}
                        gap={1}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                direction: "row",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Icons.logout style={{ fontSize: "24px" }} />
                            Logout
                        </Box>
                    </Stack>
                ) : null}
            </Stack>
        </Stack>
    );
};
export default Demo;
