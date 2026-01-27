import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getWebScenarioCategory } from "../../../APIConfig/adminConfig";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import CreateCategories from "../common/createCategories";

const EditWebScenarioCategories = () => {

    const [webScenarioCategoryData, setWebScenarioCategoryData] = useState(null)
    const { categoryId } = useParams();
    const navigate = useNavigate()
    const breadcrumbs = [
        {
            name: 'Dashboard',
            link: '/'
        },
        {
            name: 'Categories',
            link: '/admin/webScenarioCategories'
        }, {
            name: 'Edit Category',
            link: `/admin/editWebScenarioCategories/${categoryId}`
        },
    ];

    useEffect(() => {
        (async () => {
            try {
                const response = await getWebScenarioCategory(categoryId);
                setWebScenarioCategoryData(response.data);
            } catch (error) {
                console.log('error', error)
            }
        })();
    }, [categoryId]);


    return (
        <>
            <BreadCrumbs breadcrumbs={breadcrumbs} />
            {webScenarioCategoryData &&
                <CreateCategories template='Edit Web Scenario' data={webScenarioCategoryData} categoryId={categoryId} />}
        </>
    );
};

export default EditWebScenarioCategories;