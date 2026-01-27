import React from "react";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import CreateChallenge from "./make-challenge";
import MakeChallenge from "./make-challenge";

const MakeChallengeScenario = () => {
  const breadcrumbs = [
    {
      name: "Challenges",
      link: "/admin/challenges",
    },
    {
      name: "Squad Lists",
      link: "/admin/allSquads",
    },
    {
      name: "Make Challenge",
      link: "",
    },
  ];
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <MakeChallenge variant="scenario" />
    </>
  );
};

export default MakeChallengeScenario;
