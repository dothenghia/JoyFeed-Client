
import { Outlet } from "react-router-dom"

import Header from "../components/Header/Header"

const Layout = () => {

    return (
        <>
            {/* ------ Header Navigation Bar ------ */}
            <Header />

            {/* ------ Child route rendering ------ */}
            <Outlet />
        </>
    )
}

export default Layout