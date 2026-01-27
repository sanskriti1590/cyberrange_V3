import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { Button, Stack, Typography } from "@mui/material";
import WinningWall from "../../../components/winningWall/WinningWall";
import { useNavigate } from "react-router-dom";
import { scenarioCategoriesDataGet } from "../../../RTK/admin/scenario/scenarioCategoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../../../components/ui/SearchBar";

const ScenarioCategories = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");

  const [filteredScenarioCategoriesData, setFilteredScenarioCategoriesData] =
    useState([]);

  const { scenarioCategoriesData } = useSelector(
    (state) => state.scenarioCategories
  );

  const breadcrumbs = [
    {
      name: "Dashboard",
      link: "/",
    },
    {
      name: "Categories",
      link: "/admin/squadCategories",
    },
  ];

  const searchInputHandler = (value) => {
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredScenarioCategoriesData([]);
    } else {
      const filteredData = scenarioCategoriesData.filter((item) =>
        item?.scenario_category_name
          ?.toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredScenarioCategoriesData(filteredData);
    }
  };

  useEffect(() => {
    dispatch(scenarioCategoriesDataGet());
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
          <Typography variant="h2">
            Squad Categories
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
              onClick={() => navigate("/admin/createSquadCategories")}
            >
              Create Category
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack px={2} py={4}>
        {searchValue && filteredScenarioCategoriesData.length === 0 ? (
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Typography variant="h4">No Results Found</Typography>
          </Stack>
        ) : (
          <WinningWall
            template="ScenarioCategories"
            data={
              searchValue
                ? filteredScenarioCategoriesData
                : scenarioCategoriesData
            }
            height="62vh"
          />
        )}
      </Stack>
    </>
  );
};

export default ScenarioCategories;
