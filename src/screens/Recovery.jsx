
import recoveryillustration from '../assets/illustration/recovery.png'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { auth } from "../functions/firebase";
import { sendPasswordResetEmail } from 'firebase/auth';

const Recovery = () => {
    // ========== Init state ==========
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [countdown, setCountdown] = useState(120); // Thời gian đếm ngược ban đầu là 120 giây

    // ========== Handle functions ==========
    const handleRecovery = async (e) => {
        e.preventDefault();

        try {
            setError(null);
            setSuccessMessage("");

            if (!email) {
                setError("Vui lòng nhập địa chỉ email.");
                return;
            }

            // Gửi yêu cầu khôi phục mật khẩu
            await sendPasswordResetEmail(auth, email);

            setSuccessMessage("Một email chứa hướng dẫn khôi phục mật khẩu đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến của bạn.");

            // Disable nút
            setIsButtonDisabled(true);

        } catch (error) {
            setError("Lỗi khi yêu cầu khôi phục mật khẩu: " + error.message);
            // Kích hoạt lại nút khi có lỗi
            setIsButtonDisabled(false);
        }
    };

    useEffect(() => {
        let countdownTimer;

        if (isButtonDisabled) {
            // Nếu nút bị disable, sử dụng setInterval để cập nhật số đếm ngược mỗi giây
            countdownTimer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }

        // Hủy bỏ interval khi component unmount
        return () => clearInterval(countdownTimer);
    }, [isButtonDisabled]);

    useEffect(() => {
        // Khi countdown đếm về 0, kích hoạt lại nút
        if (countdown === 0) {
            setIsButtonDisabled(false);
            setCountdown(120); // Đặt lại thời gian đếm ngược
        }
    }, [countdown]);

    return (
        <div className="screen-container-0py bg-gradient-to-br from-[#22E1FF] via-[#1D8FE1] to-primary flex justify-center items-center">

            <div className="w-fit md:w-[500px] h-fit mx-6 flex flex-col justify-between items-center bg-white rounded-2xl overflow-hidden shadow-lg py-6 px-6">

                <h1 className="block text-2xl font-semibold mb-0 text-primary">Quên mật khẩu</h1>

                <img src={recoveryillustration}
                    alt="Login Illustration"
                    className="w-72 max-w-[80%] ratio-1x1 object-cover"
                />

                <h2 className="block w-full text-left text-base font-medium mb-2 text-text">Nhập email tài khoản để nhận mã khôi phục</h2>

                <form className="w-full" onSubmit={handleRecovery}>
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

                    <button
                        type="submit"
                        className={`custom-primary-btn w-full ${isButtonDisabled ? 'opacity-50 bg-slate-700 hover:bg-slate-700' : ''}`}
                        disabled={isButtonDisabled}
                    >
                        {isButtonDisabled ? `Gửi mã khôi phục (${countdown}s)` : 'Gửi mã khôi phục'}
                    </button>
                </form>

                {error && <p className="text-red-500 mt-2">{error}</p>}
                {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

                <div className="mt-6 flex justify-center items-center">
                    <p className="text-base font-medium text-text">Bạn đã nhớ ra gì đó?</p>
                    <Link to="/login" className="text-base font-medium text-primary ml-2">
                        Đăng nhập
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Recovery
