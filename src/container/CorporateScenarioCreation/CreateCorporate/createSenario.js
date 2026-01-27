// import React, {useEffect, useState} from "react";
// import {Stack,} from "@mui/material";
// import CreateCorporate from ".";
// import Question from "./question";
// import RoadMap from "./RoadMap";
//
//
// const ScenarioForm = () => {
//   const [toggle, setToggle] = useState(0)
//   const [form, setForm] = useState({})
//   useEffect(() => {
//     console.log('form', form)
//   }, [form])
//   return (
//     <Stack>
//       {
//         toggle === 0 ?
//           <CreateCorporate
//             setToggle={setToggle}
//             setForm={setForm}
//           />
//           :
//           toggle === 1 ?
//             <RoadMap setToggle={setToggle}/>
//             :
//             <Question setToggle={setToggle}/>
//       }
//     </Stack>
//   )
// }
//
// export default ScenarioForm;