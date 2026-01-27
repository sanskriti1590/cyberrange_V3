import React, { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { useNavigate } from "react-router-dom";
import WinningWall from "../../../components/winningWall/WinningWall";
import { useDispatch, useSelector } from "react-redux";
import { CTFCategoriesDataGet } from "../../../RTK/admin/CTF/CTFCategoriesSlice";
import SearchBar from "../../../components/ui/SearchBar";

const CTFCategories = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");

  const [filteredCTFCategoriesData, setFilteredCTFCategoriesData] = useState(
    []
  );

  const { CTFCategoriesData } = useSelector((state) => state.CTFCategories);

  const breadcrumbs = [
    // {
    //   name: "Dashboard",
    //   link: "/",
    // },
    {
      name: "Categories",
      link: "/admin/soloCatgories",
    },
  ];

  const searchInputHandler = (value) => {
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredCTFCategoriesData([]);
    } else {
      const filteredData = CTFCategoriesData.filter((item) =>
        item?.ctf_category_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCTFCategoriesData(filteredData);
    }
  };

  useEffect(() => {
    dispatch(CTFCategoriesDataGet());
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
            Solo Categories
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
              onClick={() => navigate("/admin/createSoloCategories")}
            >
              Create Category
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack px={2} py={4}>
        {searchValue && filteredCTFCategoriesData.length === 0 ? (
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Typography variant="h4">No Results Found</Typography>
          </Stack>
        ) : (
          <WinningWall
            template="CTFCategories"
            data={searchValue ? filteredCTFCategoriesData : CTFCategoriesData}
            height="62vh"
          />
        )}
      </Stack>
    </>
  );
};

export default CTFCategories;
