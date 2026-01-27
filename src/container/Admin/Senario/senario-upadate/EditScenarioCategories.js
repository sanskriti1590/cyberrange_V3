import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getScenarioCategory } from "../../../../APIConfig/adminConfig";
import BreadCrumbs from "../../../../components/navbar/BreadCrumb";
import CreateCategories from "../../common/createCategories";

const EditScenarioCategories = () => {

  const [scenarioCategoryData, setScenarioCategoryData] = useState(null)
  const { categoryId } = useParams();

  const breadcrumbs = [
    {
      name: 'Dashboard',
      link: '/'
    },
    {
      name: 'Categories',
      link: '/admin/squadCategories'
    }, {
      name: 'Edit Category',
      link: `/admin/editSquadCategories/${categoryId}`
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await getScenarioCategory(categoryId);
        setScenarioCategoryData(response.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [categoryId]);


  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      {scenarioCategoryData &&
        <CreateCategories template='Edit Squad' data={scenarioCategoryData} categoryId={categoryId} />}
    </>
  );
};

export default EditScenarioCategories;