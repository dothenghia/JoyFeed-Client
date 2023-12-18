
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../functions/firebase"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const Login = () => {
    // ========== Init state ==========
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    // ========== Run when component mounted ==========
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home"); // Redirect to home page if user logged in
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // ========== Handle functions ==========
    const handleLogin = async (event) => {
        event.preventDefault();
        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate("/home"); // Redirect to home page if login success
        } 
        catch (error) {
            setError("Email hoặc mật khẩu không đúng.");
            console.error("Lỗi đăng nhập:", error.message);
        }
    };


    return (
        <div id="login" className="screen-container-0py bg-gradient-to-br from-[#22E1FF] via-[#1D8FE1] to-primary flex justify-center items-center">

            <div className="w-[90%] h-[90%] min-h-[90vh] flex justify-between items-center bg-white rounded-2xl overflow-hidden shadow-lg flex-col md:flex-row">

                <div className="w-full md:w-1/2 px-6 md:px-8 lg:px-16 flex flex-col items-center">
                    <h1 className="hidden md:block text-2xl md:text-4xl font-bold mb-5 text-primary">JoyFeed</h1>

                    <img src="/assets/illustration/logo.jpg"
                        alt="Login Illustration"
                        className="md:hidden w-72 max-w-[80%] ratio-1x1 object-cover"
                    />

                    <form className="w-full" onSubmit={handleLogin}>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Nhập địa chỉ email"
                            required
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            required
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex justify-end mb-4">
                            <Link to="/recovery" className="text-sm font-medium text-primary">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button type="submit" className="custom-primary-btn w-full">
                            Đăng nhập
                        </button>
                    </form>

                    <div className="mt-8 flex justify-center items-center">
                        <p className="text-base font-medium text-text">Bạn chưa có tài khoản?</p>
                        <Link to="/register" className="text-base font-medium text-primary ml-2">
                            Đăng ký
                        </Link>
                    </div>

                </div>

                <div className="hidden md:flex w-1/2 py-8 justify-center items-center self-center border-l-2">
                    <img src="/assets/illustration/login.jpg"
                        alt="Login Illustration"
                        className="w-3/4 ratio-1x1 object-cover"
                    />
                </div>

            </div>
        </div>
    )
}

export default Login
