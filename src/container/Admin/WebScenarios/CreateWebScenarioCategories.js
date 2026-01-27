import React from 'react';
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import CreateCategories from "../common/createCategories";

const CreateWebScenarioCategories = () => {
    const breadcrumbs = [
        {
            name: 'Dashboard',
            link: "/"
        },
        {
            name: 'Categories',
            link: "/admin/webScenarioCategories"
        }, {
            name: 'Create Category',
            link: "/admin/createWebScenarioCategories"
        },
    ];
    return (
        <>
            <BreadCrumbs breadcrumbs={breadcrumbs} />
            <CreateCategories template='Create Web Scenario' />
        </>
    );
};

export default CreateWebScenarioCategories;