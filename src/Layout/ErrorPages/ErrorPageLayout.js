import React from 'react'
import { Outlet } from 'react-router-dom'

const ErrorPageLayout = () => {
    return (<div>
        <Outlet/>
    </div>)
}

export default ErrorPageLayout