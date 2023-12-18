
import registerillustration from '../assets/illustration/register.png'
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ref, set } from "firebase/database";
import { auth, db } from "../functions/firebase"
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged, updateEmail } from "firebase/auth"

const Register = () => {
    // ========== Init state ==========
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [espId, setEspId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState(null);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // ========== Run when component mounted ==========
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                navigate('/home'); // Redirect to home page if user logged in
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);


    // ========== Handle functions ==========
    const handleSignUp = async (event) => {
        event.preventDefault();

        setPasswordError("");
        setConfirmPasswordError("");

        if (password.length < 6) {
            setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send email verification
            // await sendEmailVerification(user);

            // Update user profile
            await updateProfile(user, {
                email: email,
                displayName: espId,
            });

            // Create realtime database for user
            const newRealtimeUser = {
                uid: user.uid,
                email: email,
                esp_id: espId,
                feed_gram: [], // Hẹn lượng thức ăn
                feed_time: [], // Hẹn giờ cho ăn
                n_feed: 0, // Số bữa ăn
                remaining_food: 0, // Lượng Thức ăn còn lại
                request: "Default", // "Default" -> Bình thường | "Feed" -> Cho ăn ngay lập tức
                weight: 0, // Khẩu phần cho ăn lập tức
                sound: "0" // Âm thanh cho ăn lập tức
            }

            // Update realtime database
            set(ref(db, `${espId}`), newRealtimeUser) // Lấy ESP_ID làm key
                .then(() => {
                    console.log("Tạo tài khoản thành công!");
                })
                .catch((error) => {
                    console.error("Lỗi khi lưu trữ dữ liệu:", error);
                });

            setUser(user);
            navigate('/home'); // Redirect to home page
        } catch (error) {
            console.error('Lỗi trong quá trình đăng ký:', error.message);
        }
    };

    return (
        <div id="login" className="screen-container-0py bg-gradient-to-br from-[#22E1FF] via-[#1D8FE1] to-primary flex justify-center items-center">

            <div className="w-[90%] h-fit md:h-[90%] md:min-h-[90vh] flex justify-between items-center bg-white rounded-2xl overflow-hidden shadow-lg flex-col md:flex-row">

                <div className="hidden md:flex w-1/2 py-8 justify-center items-center self-center border-r-2">
                    <img src={registerillustration}
                        alt="Register Illustration"
                        className="w-3/4 ratio-1x1 object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 py-6 md:py-0 px-6 md:px-8 lg:px-16 flex flex-col items-center">
                    <h2 className="block text-2xl font-semibold mb-5 text-primary">Đăng ký tài khoản</h2>

                    <form className="w-full" onSubmit={handleSignUp}>
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

                        <label htmlFor="esp" className="form-label">Mã máy ESP</label>
                        <input
                            type="number"
                            id="esp"
                            name="esp"
                            placeholder="Nhập mã máy"
                            required
                            className="form-input"
                            value={espId}
                            onChange={(e) => setEspId(e.target.value)}
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
                        {passwordError && <p className="text-red-500">{passwordError}</p>}

                        <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            required
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPasswordError && <p className="text-red-500">{confirmPasswordError}</p>}

                        <button type="submit" className="custom-primary-btn w-full mt-4">
                            Đăng ký
                        </button>
                    </form>

                    <div className="mt-6 flex justify-center items-center">
                        <p className="text-base font-medium text-text">Bạn đã có tài khoản?</p>
                        <Link to="/login" className="text-base font-medium text-primary ml-2">
                            Đăng nhập
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Register
