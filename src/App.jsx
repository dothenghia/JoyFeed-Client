
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './screens/Login'
import Register from './screens/Register'
import Recovery from './screens/Recovery';

import Layout from './screens/Layout'
import Home from './screens/Home'
import Config from './screens/Config'
import History from './screens/History'


export default function App() {
    return (

        <BrowserRouter>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recovery" element={<Recovery />} />

                <Route path="/" element={<Layout />}>
                    <Route path="/home" index element={<Home />} />
                    <Route path="/config" element={<Config />} />
                    <Route path="/history" element={<History />} />
                    <Route path="*" index element={<Home />} />
                </Route>
                
            </Routes>

        </BrowserRouter>


    )
}
