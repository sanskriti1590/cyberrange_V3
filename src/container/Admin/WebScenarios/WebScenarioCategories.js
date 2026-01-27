import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { Button, Stack, Typography } from "@mui/material";
import SearchBar from "../../../components/ui/SearchBar";
import WinningWall from "../../../components/winningWall/WinningWall";
import { webScenarioCategoriesDataGet } from "../../../RTK/admin/webScenarios/webScenarioCategoriesSlice";

const WebScenarioCategories = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState("");

    const [filteredWebScenarioCategoriesData, setFilteredWebScenarioCategoriesData] = useState(
        []
    );

    const { webScenarioCategoriesData } = useSelector((state) => state.webScenarioCategories);

    const breadcrumbs = [
        {
            name: "Dashboard",
            link: "/",
        },
        {
            name: "Categories",
            link: "/admin/webScenarioCategories",
        },
    ];

    const searchInputHandler = (value) => {
        setSearchValue(value);

        if (value.trim() === "") {
            setFilteredWebScenarioCategoriesData([]);
        } else {
            const filteredData = webScenarioCategoriesData.filter((item) =>
                item?.name?.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredWebScenarioCategoriesData(filteredData);
        }
    };

    useEffect(() => {
        dispatch(webScenarioCategoriesDataGet());
    }, []);

    return (
        <>
            <BreadCrumbs breadcrumbs={breadcrumbs} />
            <Stack px={2} py={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography componant="h1" variant="h1">
                        Web Scenario Categories
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={3}
                    >
                        <SearchBar
                            value={searchValue}
                            onChange={(event) =>
                                searchInputHandler(event.target.value.trimStart())
                            }
                        />
                        <Button
                            variant="contained"
                            onClick={() => navigate("/admin/createWebScenarioCategories")}
                        >
                            Create Category
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
            <Stack px={2} py={4}>
                {searchValue && filteredWebScenarioCategoriesData.length === 0 ? (
                    <Stack direction="row" justifyContent="center" alignItems="center">
                        <Typography variant="h4">No Results Found</Typography>
                    </Stack>
                ) : (
                    <WinningWall
                        template="WebScenarioUserCategories"
                        data={searchValue ? filteredWebScenarioCategoriesData : webScenarioCategoriesData}
                        height="62vh"
                    />
                )}
            </Stack>
        </>
    );
};


export default WebScenarioCategories;