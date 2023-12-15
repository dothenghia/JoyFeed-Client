
// Import modules
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './functions/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Import screens
import Login from './screens/Login'
import Register from './screens/Register'
import Recovery from './screens/Recovery';

import Layout from './screens/Layout'
import Home from './screens/Home'
import Config from './screens/Config'
import History from './screens/History'


export default function App() {
    // ========== Init state ==========
    const [user, setUser] = useState(null);

    // ========== Run once when component mounted ==========
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });

        return () => unsubscribe();
    }, []);


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recovery" element={<Recovery />} />

                {user ? (
                    <Route path="/" element={<Layout />}>
                        <Route path="/home" index element={<Home />} />
                        <Route path="/config" element={<Config />} />
                        <Route path="/history" element={<History />} />
                        <Route path="*" index element={<Home />} />
                    </Route>
                ) : null}
                
                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}
