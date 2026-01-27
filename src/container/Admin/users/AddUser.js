import React from 'react';
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import AddOrUpdateUser from "../common/AddOrUpdateUser";

const AddUser = () => {

  const breadcrumbs = [{ name: 'Users', link: '/admin/users' }, { name: 'Add User', link: '/admin/addUser' }];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <AddOrUpdateUser template='Add User' />
    </>
  );
};

export default AddUser;