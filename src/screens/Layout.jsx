import { useState } from "react"
import { Outlet } from "react-router-dom"

import Header from "../components/Header/Header"
import Sidebar from "../components/Sidebar/Sidebar"

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <>
            {/* ------ Header Navigation Bar ------ */}
            <Header open={sidebarOpen} setOpen={setSidebarOpen} />

            {/* ------ Child route rendering ------ */}
            <div className=" h-[calc(100vh-3rem)] flex bg-bgf9">
                <Sidebar open={sidebarOpen} />

                <div className={`${sidebarOpen ? 'md:ml-[14rem]' :''} transition-all duration-700 ease-in-out`}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout