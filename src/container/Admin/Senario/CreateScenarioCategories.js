import React from 'react';
import CreateCategories from "../common/createCategories";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";

const CreateScenarioCategories = () => {
  const breadcrumbs = [
    {
      name: 'Dashboard',
      link: "/"
    },
    {
      name: 'Categories',
      link: "/admin/squadCategories"
    }, {
      name: 'Create Category',
      link: "/admin/createSquadCategories"
    },
  ];
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <CreateCategories template='Create Squad' />
    </>
  );
};

export default CreateScenarioCategories;