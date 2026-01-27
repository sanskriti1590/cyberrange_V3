import React from "react";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import MakeChallenge from "./make-challenge";

const MakeChallengeCTF = () => {
  const breadcrumbs = [
    {
      name: "Challenges",
      link: "/admin/challenges",
    },
    {
      name: "CTF Lists",
      link: "/admin/allSoloScenarios",
    },
    {
      name: "Make Challenge",
      link: "",
    },
  ];
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <MakeChallenge variant="ctf" />
    </>
  );
};

export default MakeChallengeCTF;
