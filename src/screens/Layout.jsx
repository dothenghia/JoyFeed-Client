
import { Outlet } from "react-router-dom"

import Header from "../components/Header/Header"
import Sidebar from "../components/Sidebar/Sidebar"

const Layout = () => {

    return (
        <>
            {/* ------ Header Navigation Bar ------ */}
            <Header />

            {/* ------ Child route rendering ------ */}
            <div className=" h-[calc(100vh-3rem)] flex">
                <Sidebar />
                
                <Outlet />
            </div>
        </>
    )
}

export default Layout