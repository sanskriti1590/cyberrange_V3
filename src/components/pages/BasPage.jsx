import * as React from "react";
import { Backdrop, CircularProgress, Collapse, Stack, Tab, Tabs, Typography, } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useSelector } from "react-redux";
import axios from "axios";

import BreadCrumbs from "../navbar/BreadCrumb";
import ThreatChainCard from "../cards/ThreatChainCard";
import ExecutionCard from "../cards/ExecutionCard";
import { APP_CONFIG } from "../../lib/config";
import SearchBar from "../ui/SearchBar";
import { Box } from "@mui/system";

const BasPage = () => {
    const { loading: globalLoading } = useSelector((state) => state.user);

    const [value, setValue] = React.useState(0); // 0: Attack Lib, 1: Reports
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const limit = 10;

    // Refs to avoid stale closure
    const pageRef = React.useRef(1);
    const loadingRef = React.useRef(loading);
    const hasMoreRef = React.useRef(hasMore);
    const valueRef = React.useRef(value);
    const searchRef = React.useRef(searchQuery);

    React.useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);
    React.useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);
    React.useEffect(() => {
        valueRef.current = value;
    }, [value]);
    React.useEffect(() => {
        searchRef.current = searchQuery;
    }, [searchQuery]);

    const removeDuplicates = (array, key) => {
        const seen = new Set();
        return array.filter((item) => {
            const k = item[key] || item.id || item.attack_id;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        });
    };

    const fetchData = React.useCallback(
        async (tabIndex, pageNumber = 1, append = false) => {
            if (loadingRef.current) return;
            setLoading(true);

            try {
                let res;
                if (tabIndex === 0) {
                    const offset = (pageNumber - 1) * limit;
                    res = await axios.get(`${process.env.REACT_APP_API_PATH}/bas/chains`, {
                        params: {
                            limit,
                            offset,
                            name: searchRef.current || undefined,
                        },
                    });
                    const fetched = res.data.data || [];
                    const unique = removeDuplicates(fetched, "id");

                    setData((prev) => {
                        const combined = append ? [...prev, ...unique] : unique;
                        const deduped = removeDuplicates(combined, "id");
                        setHasMore(fetched.length === limit);
                        return deduped;
                    });
                } else {
                    res = await axios.get(`${process.env.REACT_APP_API_PATH}/bas/executions`);
                    const fetched = res.data.data || [];
                    setData(removeDuplicates(fetched, "id"));
                    setHasMore(false);
                }
            } catch (err) {
                console.error("FetchChains error:", err);
                if (!append) setData([]);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        [limit]
    );



    const handleChange = (e, newValue) => {
        setValue(newValue);
        valueRef.current = newValue;

        // Clear search input and update ref immediately
        setSearchQuery("");
        searchRef.current = "";

        pageRef.current = 1;
        setPage(1);
        setHasMore(true);
        setData([]);
        fetchData(newValue, 1, false);
    };

    const scrollTimeoutRef = React.useRef(null);
    const handleScroll = React.useCallback(() => {
        if (scrollTimeoutRef.current) return;

        scrollTimeoutRef.current = setTimeout(() => {
            scrollTimeoutRef.current = null;
            if (valueRef.current !== 0) return;
            if (loadingRef.current || !hasMoreRef.current) return;

            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const windowHeight =
                window.innerHeight || document.documentElement.clientHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight + 150 >= fullHeight) {
                const next = ++pageRef.current;
                setPage(next);
                fetchData(0, next, true);
            }
        }, 200);
    }, [fetchData]);

    // Debounced search
    React.useEffect(() => {
        const handle = setTimeout(() => {
            pageRef.current = 1;
            setPage(1);
            setHasMore(true);
            setData([]);
            fetchData(0, 1, false);
        }, 500);
        return () => clearTimeout(handle);
    }, [searchQuery, fetchData]);

    // Initial load and scroll listener
    React.useEffect(() => {
        fetchData(0, 1, false);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [fetchData, handleScroll]);

    return (
        <Stack>
            <BreadCrumbs breadcrumbs={[{ name: "Dashboard", link: "/" }, { name: "BAS" }]} />
            <Box style={{ width: "100%", padding: 25 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h2"> All {value === 0 ? 'Library' : 'Reports'}</Typography>
                    <SearchBar
                        value={searchQuery}
                        placeholder="Search chains…"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Stack>

                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 2 }}
                >
                    <Tab label="Attack Library" />
                    <Tab label="Reports" />
                </Tabs>

                <TransitionGroup>
                    {data.length > 0 ? (data.map((item, idx) => {
                        const key = `${value === 0 ? "threat" : "exec"}-${idx}-${item.id ||
                            item.attack_id}`;
                        return (
                            <Collapse in key={key} sx={{ mb: 2 }}>
                                {value === 0 ? (
                                    <ThreatChainCard item={item} loading={loading} />
                                ) : (
                                    <ExecutionCard item={item} loading={loading} />
                                )}
                            </Collapse>
                        );
                    })) : ((!loading && page === 1) && (
                        <Typography variant="h3" align="center" sx={{ mt: 4 }}>
                            {/*No result found*/}
                        </Typography>
                    )
                    )}

                </TransitionGroup>

                {loading && value === 0 && (
                    <Stack alignItems="center" sx={{ py: 2 }}>
                        <CircularProgress />
                    </Stack>
                )}
            </Box>
        </Stack>
    );
};

export default BasPage;
