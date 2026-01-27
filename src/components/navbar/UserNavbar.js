import { Link, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import * as React from "react";
import { useEffect, useState } from "react";
import { Icons } from "../icons";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import jwtDecode from "jwt-decode";
import { UserProfileApi } from "../../APIConfig/CtfConfig";
import { useJwt } from "react-jwt";
import { useDispatch, useSelector } from "react-redux";
import { toggleValue } from "../../RTK/features/CtfPopUp";
import { toggleValue1 } from "../../RTK/features/ScenarioPopup";
import { toggleValue3 } from "../../RTK/features/CorporatePopup";
import { toggleValue2 } from "../../RTK/features/Left";
import { toggleValue4 } from "../../RTK/features/WebScenarioPopup";

const UserNavBar = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState("");
    const [users, setUser] = useState("");
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const token = localStorage.getItem("access_token");
    const { isExpired } = useJwt(token);
    const value = useSelector((state) => state.ctfBoolean.value);
    const value1 = useSelector((state) => state.scenarioBoolean.value);
    const value4 = useSelector((state) => state.webscenarioBoolean.value);
    const value3 = useSelector((state) => state.corporateBoolean.value);
    const value2 = useSelector((state) => state.LeftBoolean.value);
    const [role, setRole] = useState(true);
    const [dashboard, setDashboard] = useState("nav");
    const dispatch = useDispatch();
    let user = null;
    useEffect(() => {
        apiFunction();
    }, []);

    const handleToggle = () => {
        dispatch(toggleValue());
    };

    const handleToggle1 = () => {
        dispatch(toggleValue1());
    };
    const handleToggle4 = () => {
        dispatch(toggleValue4());
    };
    const handleToggle2 = () => {
        dispatch(toggleValue2());
    };

    const handleToggle3 = () => {
        dispatch(toggleValue3());
    };

    const location = useLocation();
    const currentPath = location?.pathname.split("/", 3).join("/");
    const highlighter = (path) => (currentPath === path ? "active" : "inactive");

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const apiFunction = async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            user = jwtDecode(token);
            const userDetails = await UserProfileApi(user?.user_id);
            if (userDetails?.data) {
                setUser(userDetails?.data);
                setAdmin(user?.is_admin);
            }


        }
    };

    const navBarLink = [
        {
            name: "Dashboard",
            linkName: "dashboard",
            to: "/",
            classHighLighter: "/",
            startIcon: <Icons.dashboard style={{ fontSize: "24px" }} />,
            status: "normal",
        },
        {
            name: "Corporate",
            linkName: "scenarios",
            to: "/",
            classHighLighter: "/scenarios",
            startIcon: <Icons.corporate style={{ fontSize: "24px" }} />,
            status: "corporate",
            options: [
                {
                    name: "Categories",
                    linkName: "/corporate/category",
                    to: "/corporate/category",
                    classHighLighter: "/corporate/category",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Create ",
                    linkName: "/createCorporate",
                    to: "/createCorporate",
                    classHighLighter: "/createCorporate",
                    startIcon: <SportsEsportsOutlinedIcon />,

                },
                {
                    name: "Active Corporate",
                    linkName: "/activeGameScenario/corporate",
                    to: "/activeGameScenario/corporate",
                    classHighLighter: "/activeGameScenario/corporate",
                    startIcon: <SportsEsportsOutlinedIcon />,

                },
            ],
        },
        {
            name: "Solo",
            linkName: "ctf-arena",
            to: "/",
            classHighLighter: "/ctf-arena",
            startIcon: <Icons.CTF style={{ fontSize: "24px" }} />,
            status: "ctf",
            options: [
                {
                    name: "Categories",
                    linkName: "/categories/soloCategory",
                    to: "/categories/soloCategory",
                    classHighLighter: "/categories/soloCategory",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Create Solo Game",
                    linkName: "/createSolo",
                    to: "/createSolo",
                    classHighLighter: "/createSolo",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Active Solo Games",
                    linkName: "/activeGameScenario/solo",
                    to: "/activeGameScenario/solo",
                    classHighLighter: "/activeGameScenario/solo",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
            ],
        },
        {
            name: "Winning Walls",
            linkName: "winningWalls",
            to: "/winningWall",
            classHighLighter: "/winningWall",
            startIcon: <Icons.winningWall style={{ fontSize: "24px" }} />,
            status: "normal",
        },
        {
            name: "Squad",
            linkName: "scenarios",
            to: "/",
            classHighLighter: "/scenarios",
            startIcon: <Icons.scenario style={{ fontSize: "24px" }} />,
            status: "scenario",
            options: [
                {
                    name: "Categories",
                    linkName: "/squad/scenarioCategory",
                    to: "/squad/scenarioCategory",
                    classHighLighter: "/squad/scenarioCategory",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Create ",
                    linkName: "/squad/createSquad",
                    to: "/squad/createSquad",
                    classHighLighter: "/squad/createSquad",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Active Squad",
                    linkName: "/activeGameScenario/squad",
                    to: "/activeGameScenario/squad",
                    classHighLighter: "/activeGameScenario/squad",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
            ],
        },
        {
            name: "Web Scenarios",
            linkName: "webScenarios",
            to: "/",
            classHighLighter: "Web-Scenarios",
            startIcon: <SportsEsportsOutlinedIcon />,
            status: "webScenarios",
            options: [
                {
                    name: "Categories",
                    // linkName: "/squad/scenarioCategory",
                    linkName: "/webScenarios/categories",
                    to: "/webScenarios/categories",
                    classHighLighter: "/webScenarios/categories",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                //   {
                //     name: "Create Scenario",
                //     linkName: "/createCorporate",
                //     to: "/createCorporate",
                //     classHighLighter: "/createCorporate",
                //     startIcon: <SportsEsportsOutlinedIcon />,
                //   },
                {
                    name: "Active Web Scenario",
                    linkName: "/webScenarios/active",
                    to: "/webScenarios/active",
                    classHighLighter: "/webScenarios/active",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
            ],
        },
        {
            name: "MITRE ATT&CK Automation",
            linkName: "mitreAttackAutomation",
            to: "/mitreAttackAutomation",
            classHighLighter: "/mitreAttackAutomation",
            startIcon: <Icons.SiGnubash style={{ fontSize: "24px" }} />,
            status: "normal",
        },
        // {
        //     name: "Admin",
        //     startIcon: <VerifiedOutlinedIcon />,
        //     status: "admin",
        //     options: [
        //         {
        //             name: "Create Category ctf",
        //             linkName: "/admin",
        //             to: "/admin",
        //             classHighLighter: "/admin",
        //             startIcon: <SportsEsportsOutlinedIcon />,
        //         },
        //         {
        //             name: "Mapping ctf",
        //             linkName: "/admin/mapping",
        //             to: "/admin/mapping",
        //             classHighLighter: "/admin/mapping",
        //             startIcon: <SportsEsportsOutlinedIcon />,
        //         },
        //         {
        //             name: 'Update',
        //             linkName: '/admin/ctfUpdate',
        //             to: '/admin/ctfUpdate',
        //             classHighLighter: '/admin/ctfUpdate',
        //             startIcon: <SportsEsportsOutlinedIcon />,
        //         },
        //         {
        //             name: "Create Category Scenario",
        //             linkName: '/admin/create_scenario_category',
        //             to: '/admin/create_scenario_category',
        //             classHighLighter: '/admin/create_scenario_category',
        //             startIcon: <SportsEsportsOutlinedIcon />,
        //         },
        //         {
        //             name: "Scenario Approved",
        //             linkName: '/admin/scenarioApproval',
        //             to: '/admin/scenarioApproval',
        //             classHighLighter: '/admin/scenarioApproval',
        //             startIcon: <SportsEsportsOutlinedIcon />,
        //         },
        //         {
        //             name: "User Details",
        //             linkName: '/admin/userlist',
        //             to: '/admin/userlist',
        //             classHighLighter: '/admin/userlist',
        //             startIcon: <SportsEsportsOutlinedIcon />,
        //         },
        //     ],
        // },
        // {
        //     name: "Schedule",
        //     linkName: "Schedule",
        //     to: "/nderConstructionpage",
        //     classHighLighter: "/team",
        //     startIcon: <GroupsOutlinedIcon />,
        //     status: "normal",
        // },
    ];
    return navBarLink?.map((data, index) => {
        if (data.status === "normal") {
            return (
                <Link
                    key={index}
                    to={data.to}
                    name={data.linkName}
                    className={highlighter(data.classHighLighter)}
                >
                    <Box sx={{ display: "flex", direction: "row", gap: 1 }}>
                        {data.startIcon}
                        {data.name}
                    </Box>
                </Link>
            );
        }
        if (data.status === "corporate") {
            return (
                <Stack key={index}>
                    <Stack
                        className="inactive"
                        style={{ cursor: "pointer", justifyContent: "space-between" }}
                        onClick={handleToggle3}
                        direction="row"
                    >
                        <Box sx={{ display: "flex", direction: "row", gap: 1 }}>
                            {data.startIcon}
                            {data.name}
                        </Box>
                        {value3 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Stack>
                    <Stack style={{ display: value3 ? "flex" : "none", gap: 4 }}>
                        {data.options.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    name={item.linkName}
                                    className={highlighter(item.classHighLighter)}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            direction: "row",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            padding: "0 16px",
                                        }}
                                    >
                                        {item.name}
                                        <KeyboardArrowRightIcon sx={{ fontSize: "24px" }} />
                                    </Box>
                                </Link>
                            );
                        })}
                    </Stack>
                </Stack>
            );
        }

        // navigator for the multiple scenario cases
        if (data.status === "scenario") {
            return (
                <Stack key={index}>
                    <Stack
                        className="inactive"
                        style={{ cursor: "pointer", justifyContent: "space-between" }}
                        onClick={handleToggle1}
                        direction="row"
                    >
                        <Box sx={{ display: "flex", direction: "row", gap: 1 }}>
                            {data.startIcon}
                            {data.name}
                        </Box>
                        {value1 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Stack>
                    <Stack style={{ display: value1 ? "flex" : "none", gap: 4 }}>
                        {data.options.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    name={item.linkName}
                                    className={highlighter(item.classHighLighter)}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            direction: "row",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            padding: "0 16px",
                                        }}
                                    >
                                        {item.name}
                                        <KeyboardArrowRightIcon sx={{ fontSize: "24px" }} />
                                    </Box>
                                </Link>
                            );
                        })}
                    </Stack>
                </Stack>
            );
        }


        // navigator for Web-Scenarios
        if (data.status === "webScenarios") {
            return (
                <Stack key={index}>
                    <Stack
                        className="inactive"
                        style={{ cursor: "pointer", justifyContent: "space-between" }}
                        onClick={handleToggle4}
                        direction="row"
                    >
                        <Box sx={{ display: "flex", direction: "row", gap: 1 }}>
                            {data.startIcon}
                            {data.name}
                        </Box>
                        {value4 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Stack>
                    <Stack style={{ display: value4 ? "flex" : "none", gap: 4 }}>
                        {data.options.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    name={item.linkName}
                                    className={highlighter(item.classHighLighter)}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            direction: "row",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            padding: "0 16px",
                                        }}
                                    >
                                        {item.name}
                                        <KeyboardArrowRightIcon sx={{ fontSize: "24px" }} />
                                    </Box>
                                </Link>
                            );
                        })}
                    </Stack>
                </Stack>
            );
        }
        // multiple uses for the ctf
        if (data.status === "ctf") {
            return (
                <Stack key={index}>
                    <Stack
                        className="inactive"
                        style={{ cursor: "pointer", justifyContent: "space-between" }}
                        onClick={handleToggle}
                        direction="row"
                    >
                        <Box sx={{ display: "flex", direction: "row", gap: 1 }}>
                            {data.startIcon}
                            {data.name}
                        </Box>
                        {value ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Stack>
                    <Stack style={{ display: value ? "flex" : "none", gap: 4 }}>
                        {data.options.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    name={item.linkName}
                                    className={highlighter(item.classHighLighter)}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            direction: "row",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            padding: "0 16px",
                                        }}
                                    >
                                        {item.name}
                                        <KeyboardArrowRightIcon sx={{ fontSize: "24px" }} />
                                    </Box>
                                </Link>
                            );
                        })}
                    </Stack>
                </Stack>
            );
        }
        // navigator for the admin multiple task
        if (data.status === "admin" && admin) {
            return (
                <Stack key={index}>
                    <Stack
                        className="inactive"
                        style={{ cursor: "pointer", justifyContent: "space-between" }}
                        onClick={() => setShow3(!show3)}
                        direction="row"
                    >
                        <Box sx={{ display: "flex", direction: "row", gap: 1 }}>
                            {data.startIcon}
                            {data.name}
                        </Box>
                        {show ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Stack>
                    <Stack style={{ display: show3 ? "flex" : "none", gap: 4 }}>
                        {data.options.map((item, index) => {
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    name={item.linkName}
                                    className={highlighter(item.classHighLighter)}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            direction: "row",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            padding: "0 16px",
                                        }}
                                    >
                                        {item.name}
                                        <KeyboardArrowRightIcon sx={{ fontSize: "24px" }} />
                                    </Box>
                                </Link>
                            );
                        })}
                    </Stack>
                </Stack>
            );
        }
    });
};

export default UserNavBar;
