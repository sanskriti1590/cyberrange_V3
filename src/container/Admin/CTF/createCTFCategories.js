import React from 'react';
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import CreateCategories from "../common/createCategories";

const CreateCTFCategories = () => {
  const breadcrumbs = [
    {
      name: 'Dashboard',
      link: "/"
    },
    {
      name: 'Categories',
      link: "/admin/soloCatgories"
    }, {
      name: 'Create Category',
      link: "/admin/createSoloCategories"
    },
  ];
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <CreateCategories template='Create Solo' />
    </>
  );
};

export default CreateCTFCategories;