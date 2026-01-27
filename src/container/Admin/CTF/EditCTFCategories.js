import React, { useEffect, useState } from 'react';
import BreadCrumbs from '../../../components/navbar/BreadCrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { getCTFCategory } from "../../../APIConfig/adminConfig";
import CreateCategories from "../common/createCategories";

const EditCTFCategories = (props) => {

  const [CTFCategoryData, setCTFCategoryData] = useState(null)
  const { categoryId } = useParams();
  const navigate = useNavigate()
  const breadcrumbs = [
    {
      name: 'Dashboard',
      link: '/'
    },
    {
      name: 'Categories',
      link: '/admin/soloCatgories'
    }, {
      name: 'Edit Category',
      link: `/admin/createSoloCategories/${categoryId}`
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await getCTFCategory(categoryId);
        response.data && setCTFCategoryData(response.data);
      } catch (error) {
        console.log('error', error)
      }
    })();
  }, [categoryId]);


  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      {CTFCategoryData && <CreateCategories template='Edit Solo' data={CTFCategoryData} categoryId={categoryId} />}
    </>
  );
};

export default EditCTFCategories;