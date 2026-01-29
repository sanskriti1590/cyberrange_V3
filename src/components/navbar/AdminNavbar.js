import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useEffect, useState } from "react";
import { Icons } from "../icons";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import jwtDecode from "jwt-decode";
import { UserProfileApi } from "../../APIConfig/CtfConfig";
import { useDispatch, useSelector } from "react-redux";
import { toggleValue } from "../../RTK/features/CtfPopUp";
import { toggleValue1 } from "../../RTK/features/ScenarioPopup";

const AdminNavbar = () => {

    const [admin, setAdmin] = useState("");
    const [users, setUser] = useState("");
    const [show, setShow] = useState(false);

    const [show3, setShow3] = useState(false);
    const value = useSelector((state) => state.ctfBoolean.value);
    const value1 = useSelector((state) => state.scenarioBoolean.value);


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
 
    const location = useLocation();
    const currentPath = location?.pathname.split("/", 3).join("/");
    const highlighter = (path) => (currentPath === path ? "active" : "inactive");

   
    const apiFunction = async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            user = jwtDecode(token);
            if (user?.user_id) {
                const userDetails = await UserProfileApi(user?.user_id);
                userDetails?.data && setUser(userDetails?.data);
                setAdmin(user?.is_admin);
            }
        }

    };

    const navBarLink = [

        {
            name: "Categories",
            linkName: "categories",
            to: "/",
            classHighLighter: "/categories",
            startIcon: <Icons.categories style={{ fontSize: "24px" }} />,
            status: "categories",
            options: [
                {
                    name: "Solo Categories",
                    linkName: "/admin/soloCatgories",
                    to: "/admin/soloCatgories",
                    classHighLighter: "/admin/soloCatgories",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Squad Categories",
                    linkName: "/admin/squadCategories",
                    to: "/admin/squadCategories",
                    classHighLighter: "/admin/squadCategories",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Web Scenario Categories",
                    linkName: "/admin/webScenarioCategories",
                    to: "/admin/webScenarioCategories",
                    classHighLighter: "/admin/webScenarioCategories",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
            ],
        },

        {
            name: "Challenges",
            linkName: "/admin/challenges",
            to: "/admin/challenges",
            classHighLighter: "/admin/challenges",
            startIcon: <Icons.BiHive style={{ fontSize: "24px" }} />,
            status: "normal",
        },

        {
            name: "Approval",
            linkName: "Approval",
            to: "/",
            classHighLighter: "/Approval",
            startIcon: <Icons.mapping style={{ fontSize: "24px" }} />,
            status: "Approval",
            options: [
                {
                    name: "Solo Mapping",
                    linkName: "/admin/soloRequests",
                    to: "/admin/soloRequests",
                    classHighLighter: "/admin/soloRequests",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Squad Approved",
                    linkName: "/admin/squadRequests",
                    to: "/admin/squadRequests",
                    classHighLighter: "/admin/squadRequests",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Cyberdrill Approved",
                    linkName: "/admin/corporateRequests",
                    to: "/admin/corporateRequests",
                    classHighLighter: "/admin/corporateRequests",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Web Scenario Approved",
                    linkName: "/admin/webScenarioRequests",
                    to: "/admin/webScenarioRequests",
                    classHighLighter: "/admin/webScenarioRequests",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
            ],
        },
        {
            name: "Update",
            linkName: "Upadate",
            to: "/",
            classHighLighter: "/Update",
            startIcon: <Icons.update style={{ fontSize: "24px" }} />,
            status: "Update",
            options: [

                {
                name: "Update CyberDrill",
                linkName: "/admin/cyberdrill",
                to: "/admin/cyberdrill",
                classHighLighter: "/admin/cyberdrill",
                startIcon: <SportsEsportsOutlinedIcon />,
                },

                {
                    name: "Update Squad",
                    linkName: "/admin/allSquads",
                    to: "/admin/allSquads",
                    classHighLighter: "/admin/allSquads",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Update Solo",
                    linkName: "/admin/allSolo",
                    to: "/admin/allSolo",
                    classHighLighter: "/admin/allSolo",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },
                {
                    name: "Update Web Scenarios",
                    linkName: "/admin/webScenarioUpdate",
                    to: "/admin/webScenarioUpdate",
                    classHighLighter: "/admin/webScenarioUpdate",
                    startIcon: <SportsEsportsOutlinedIcon />,
                },

            ],
        },

        {
            name: "Users",
            linkName: "/admin/users",
            to: "/admin/users",
            classHighLighter: "/admin/users",
            startIcon: <Icons.users style={{ fontSize: "24px" }} />,
            status: "normal",
        },
        {
            name: "Web Scenarios",
            linkName: "/admin/webScenariosCreate",
            to: "/admin/webScenariosCreate",
            classHighLighter: "/admin/webScenariosCreate",
            startIcon: <SportsEsportsOutlinedIcon style={{ fontSize: "24px" }} />,
            status: "normal",
        },
        {
            name: "MITRE ATT&CK Automation",
            linkName: "mitreAttackAutomation",
            to: "/mitreAttackAutomation",
            classHighLighter: "/mitreAttackAutomation",
            startIcon: <Icons.SiGnubash style={{ fontSize: "24px" }} />,
            status: "normal",
        },

    ];
    return (
        navBarLink?.map((data, index) => {
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

            // navigator for the multiple scenario cases
            if (data.status === "Approval") {
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
            // multiple uses for the ctf
            if (data.status === "categories") {
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
            if (data.status === "Update") {
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

        })
    );

};

export default AdminNavbar;