import { Backdrop, Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import img from "../../assests/rangestrom.png";

import logo from "../../assests/rangestormlogo.png";
// import logo from "../../assests/CR4SALogo_Transperant.png";

import { userReportApi } from "../../APIConfig/version2Scenario";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ErrorHandler from "../../ErrorHandler";
import { CircularProgress } from "@material-ui/core";
import HTMLRenderer from "../../components/HtmlRendering";
import { Icons } from "../../components/icons";
import ReactToPrint from "react-to-print";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./index.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;

  // Calculate the rounded path
  const radius = 8; // Adjust this value to control roundness

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={radius} // Horizontal radius for rounded corners
        ry={radius} // Vertical radius for rounded corners
      />
    </g>
  );
};

const Report = () => {
  const componentRef = useRef();
  const { corporateId, user_id } = useParams();
  const navigate = useNavigate();
  const [load, setLoad] = useState(true);
  const [item, setReportData] = useState([]);
  const [age, setAge] = React.useState("");
  const [timeTaken, setTimeTaken] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await userReportApi(corporateId, user_id);
        if (data) {
          setReportData(data.data);
          setTimeTaken(data?.data?.[0]?.time_taken?.reverse() || []);
        }
      } catch (error) {
        ErrorHandler(error, navigate);
      } finally {
        setLoad(false); // will run regardless of success or error
      }
    };

    getData();
  }, []);
  const printableProps = {
    load, item, age, setAge, timeTaken
  }
  return (
    <Stack sx={{ alignItems: "center", justifyContent: "center", paddingY: 5 }}>
      {item.length ? <ReactToPrint
        trigger={() => <Button variant="outlined" className="no-print">Print this out!</Button>}
        content={() => componentRef.current}
        pageStyle={`
          @page { 
            margin: 0.5in; 
            size: A4;
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            background: white !important;
          }
          .no-print { 
            display: none !important; 
          }
        `}
      /> : ""}
      <PrintableComponent ref={componentRef} {...printableProps} />
    </Stack>
  );
};

const PrintableComponent = React.forwardRef(({ load, item, age, setAge, timeTaken }, ref) => {

  const handleChange = (event) => {
    setAge(event.target.name);
    paginate(event.target.value + 1);
  };



  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = item.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const timedata = timeTaken?.map((val, idx) => {
    return {
      name: `Q${idx + 1}`,
      question: val,
    };
  });

  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center", padding: 5 }}>
      {!item.length && <Typography>Data not available</Typography>}
      <Stack direction="row" gap={5}>
        {item?.length > 1 && (
          <Box sx={{ minWidth: 220 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Participants
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Participants"
                onChange={handleChange}
              >
                {item?.map((data, i) => {
                  return (
                    <MenuItem value={i} name={data?.user_full_name}>
                      {data.user_full_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}
      </Stack>

      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "800px",
          height: "100%",
          p: 6,
          gap: 5,
        }}
        ref={ref}
      >

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}
          className="no-print"
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {currentItems.map((reportData, index) => (
          <Stack
            key={index}
            sx={{
              gap: 4,
              backgroundColor: "#fff",
            }}
          >

            {/* Header Section - Unchanged */}
            <Stack
              className="header"
              direction="row"
              sx={{
                backgroundColor: "#1c1f28",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                p: 5,
                '@media print': {
                  backgroundColor: '#1c1f28 !important',
                  WebkitPrintColorAdjust: 'exact !important',
                  printColorAdjust: 'exact !important',
                  pageBreakInside: 'avoid !important',
                  breakInside: 'avoid !important',
                  pageBreakBefore: 'avoid !important',
                }
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: "10px" }} >
                <Box
                  component="img"
                  src={reportData?.user_avatar}
                  alt="image"
                  sx={{ width: "72px", height: "72px", borderRadius: "50%" }}
                />
                <Stack>
                  <p className="name" style={{ color: "#EAEAEB" }}>
                    {reportData?.user_full_name}
                  </p>
                  <p className="email" style={{ color: "#EAEAEB" }}>
                    {reportData?.email}
                  </p>
                  <Box sx={{
                    padding: '8px 8px',
                    marginTop: '16px',
                    borderRadius: '16px',
                    width: 'fit-content',
                  }} className="team">{reportData?.team} TEAM</Box>
                </Stack>
              </Stack>

              <Box className="logo" component="img" src={logo} alt="logo" sx={{ maxWidth: "200px", height: "auto", }} />
            </Stack>

            {/* Scenario Details - Unchanged */}
            <Stack>
              <Stack padding={5}>
                <p className="heading">Scenario Details</p>
                <div className="line"></div>

                <Stack
                  className="details"
                  marginTop={'16px'}
                  direction="row"
                  gap={1}
                  alignItems="center"
                  sx={{ marginY: "16px" }}
                >
                  <Box
                    component="img"
                    src={reportData?.thumbnail_url}
                    alt="image"
                    sx={{ width: "72px", height: "72px", borderRadius: "41px" }}
                  />
                  <Stack>
                    <p className="scenario-name-textHeading">{reportData?.scenario_name}</p>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        minWidth: "200px",
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap={"4px"}>
                        <Icons.dumbbell style={{ fontSize: "18px" }} />
                        <p className="icon">{reportData?.scenario_severity}</p>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={"4px"}>
                        <Icons.users style={{ fontSize: "18px" }} />
                        <p className="icon">
                          {reportData?.type == "flag_based" ? "Flag" : "Milestone"}
                        </p>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack className="description-content" sx={{ margin: "16px 0" }}>
                  <HTMLRenderer htmlContent={reportData?.description} />
                </Stack>

                <p className="heading">Insights</p>
                <div className="line"></div>
              </Stack>
            </Stack>



            {/* Pie Charts Section */}
            <Stack className="pie-charts-section" direction="row" justifyContent="space-around" alignItems="flex-start" sx={{
              width: "100%",
              px: 5,
              minHeight: '350px',
              py: 5,
              gap: 3
            }}>

              {/* Pie Chart 1 - Hint Usage */}
              <Stack sx={{
                width: '45%',
                minHeight: '320px',
                alignItems: "center",
                justifyContent: "center",
                padding: 3,
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                backgroundColor: 'white',
                border: '1px solid #f0f0f0'
              }}>
                {reportData?.series && (
                  <p className="textHeading" style={{
                    textAlign: "center",
                    marginBottom: "16px",
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#161c24'
                  }}>
                    {`Number of Hint Used ${reportData?.series[0]?.data[0]?.value} / ${reportData?.series[0]?.data[1]?.value + reportData?.series[0]?.data[0]?.value}`}
                  </p>
                )}

                <PieChart width={350} height={250}>
                  <Pie
                    data={[
                      {
                        "name": "Used Hints",
                        "value": reportData?.series?.[0]?.data?.[0]?.value || 0
                      },
                      {
                        "name": "Un-used Hints",
                        "value": reportData?.series?.[0]?.data?.[1]?.value || 0
                      }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={70}
                    paddingAngle={2}
                    // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    <Cell fill="#41D5CB" stroke="#fff" strokeWidth={2} />
                    <Cell fill="#3454c5ff" stroke="#fff" strokeWidth={2} />
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} hints`, name]}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '10px',
                      fontSize: '12px'
                    }}
                    iconSize={10}
                  />
                </PieChart>
              </Stack>

              {/* Pie Chart 2 - Score */}
              <Stack sx={{
                width: '45%',
                minHeight: '320px',
                alignItems: "center",
                justifyContent: "center",
                padding: 3,
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                backgroundColor: 'white',
                border: '1px solid #f0f0f0'
              }}>
                <p className="textHeading" style={{
                  textAlign: "center",
                  marginBottom: "16px",
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#161c24'
                }}>
                  {`Score Obtained (${reportData?.total_obtained_score}) vs Score Not Obtained (${reportData?.total_score - reportData?.total_obtained_score})`}
                </p>

                <PieChart width={400} height={250}>
                  <Pie
                    data={[
                      {
                        "name": "Obtained",
                        "value": reportData?.total_obtained_score || 0
                      },
                      {
                        "name": "Not Obtained",
                        "value": Math.max(0, (reportData?.total_score || 0) - (reportData?.total_obtained_score || 0))
                      }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={70}
                    paddingAngle={2}
                    // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    <Cell fill="#41D5CB" stroke="#fff" strokeWidth={2} />
                    <Cell fill="#3454c5ff" stroke="#fff" strokeWidth={2} />
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} points`, name]}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '10px',
                      fontSize: '12px'
                    }}
                    iconSize={10}
                  />
                </PieChart>
              </Stack>
            </Stack>

            {/* bar graph */}
            <Stack sx={{
              width: "100%", px: 5, mt: 3,
              // border: '1px solid black',
              minHeight: '400px', py: 5
            }}>
              <p className="textHeading" style={{ textAlign: "center", marginBottom: "20px" }}>
                Time spend on each question (in minutes)
              </p>
              {reportData?.time_taken && (
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <BarChart
                    width={900}
                    height={300}
                    data={reportData?.retires_array_x_value?.map((label, index) => ({
                      name: label,
                      time: reportData?.time_taken?.[index] || 0
                    }))}
                    margin={{
                      top: 20,
                      right: 30,
                      bottom: 70,
                      left: 70
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      label={{
                        // value: 'No. of Questions',
                        position: 'insideBottom', offset: -10, fontSize: 12
                      }}
                    />
                    <YAxis label={{
                      value: 'Time (minutes)',
                      angle: -90,
                      position: 'insideLeft',
                      fontSize: 12,
                      fill: "#333",
                      // dx: -10,
                      style: { textAnchor: 'middle' }
                    }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="time" fill="#41D5CB"
                      shape={<RoundedBar />}
                      name="Time consumption per question (minutes)"
                    />
                  </BarChart>
                </div>
              )}
            </Stack>

            {/* Line Chart Section - FIXED ALIGNMENT */}
            <Stack className="lineChartContainer" sx={{ width: "100%", px: 5, mt: 3 }}>
              <p className="textHeading" style={{ textAlign: "center", marginBottom: "20px" }}>
                Response Time Analysis
              </p>
              {reportData?.time_taken && (
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <LineChart
                    width={700}
                    height={300}
                    data={timedata}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 50,
                      bottom: 40,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      label={{
                        // value: "Questions",
                        position: "insideBottom",
                        offset: -10,
                        fill: "#333",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      label={{
                        value: "Time (minutes)",
                        angle: -90,
                        fill: "#333",
                        fontSize: 12,
                        dx: -25,
                        style: { textAnchor: 'middle' }


                      }}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="question"
                      stroke="#41D5CB"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      name="Response time per question (minutes)"
                    />
                  </LineChart>
                </div>
              )}
            </Stack>

            {/* Flags Information - Unchanged */}
            <Stack p={5} gap={"32px"}>
              <div>
                <p className="textHeading">Flags Information</p>
                <div className="line"></div>
              </div>
              <Stack gap={5}>
                {reportData?.question &&
                  reportData?.question?.reverse().map((item, index) => {
                    return (
                      <Stack
                        direction="row"
                        gap={3}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" gap={2}>
                          <p className="question">Q{index + 1}.</p>
                          <Stack gap={1.5}>
                            <p className="question">
                              {item?.question}
                              {item?.name}
                            </p>
                            <Stack gap={1}>
                              {typeof (item?.submitted_response == "string") && (
                                <p className="answer">
                                  Final submission:{"  "}
                                  {item?.submitted_response}
                                </p>
                              )}
                              {item?.answer && (
                                <p className="answer">
                                  Correct answer: {item?.answer}
                                </p>
                              )}
                              {typeof item?.is_achieved == "boolean" && (
                                <p className="answer">
                                  {item?.is_achieved ? "Achieved" : "Not Achieved"}
                                </p>
                              )}
                              {typeof item?.is_approved == "boolean" && (
                                <p className="answer">
                                  {item?.is_approved ? "Approved" : "Not approved"}
                                </p>
                              )}
                            </Stack>
                          </Stack>
                        </Stack>
                        <Stack
                          sx={{
                            minHeight: "68px",
                            width: "auto",
                            border: "1px solid #41D5CB",
                            borderRadius: "8px",
                            minWidth: "150px",
                            padding: 2,
                          }}
                        >
                          <Stack
                            direction="row"
                            sx={{
                              justifyContent: "space-between",
                              padding: "4px 8px 4px 8px",
                            }}
                          >
                            <p className="question">Score</p>
                            <p className="answer">
                              {item?.obtained_score}/{item?.score}
                            </p>
                          </Stack>
                          {typeof item?.retires == "number" && (
                            <Stack
                              direction="row"
                              sx={{
                                justifyContent: "space-between",
                                padding: "4px 8px 4px 8px",
                              }}
                            >
                              <p className="question">No. of attempts</p>
                              <p className="answer">{item?.retires}</p>
                            </Stack>
                          )}

                          <Stack
                            direction="row"
                            sx={{
                              justifyContent: "space-between",
                              padding: "4px 8px 4px 8px",
                            }}
                          >
                            <p className="question">Hint used</p>
                            <p className="answer">
                              {item?.hint_used ? "1" : "0"}
                            </p>
                          </Stack>

                          <Stack
                            direction="row"
                            sx={{
                              justifyContent: "space-between",
                              padding: "4px 8px 4px 8px",
                              gap: 2,
                            }}
                          >
                            <p className="question">Submitted in  </p>
                            <p className="answer">
                              {timeTaken[index]} minutes
                            </p>
                          </Stack>
                        </Stack>
                      </Stack>
                    );
                  })}
              </Stack>
            </Stack>


          </Stack>
        ))}












      </Stack>
    </Stack>
  );
});

export default Report;

//////////////////////////////////////////////////////////////////////