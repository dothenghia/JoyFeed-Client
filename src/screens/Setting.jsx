import { useState, useEffect } from "react";
import { auth } from "../functions/firebase";
import { updatePassword } from 'firebase/auth';

const Setting = () => {
    const [emailData, setEmailData] = useState("");
    const [esp_idData, setEsp_idData] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // Thêm state cho thông báo thành công

    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            setEmailData(user.email);
            setEsp_idData(user.displayName);
        }
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        try {
            setPasswordError("");
            setConfirmPasswordError("");
            setSuccessMessage(""); // Reset thông báo thành công

            if (password.length < 6) {
                setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
                return;
            }

            if (password !== confirmPassword) {
                setConfirmPasswordError("Xác nhận mật khẩu không khớp.");
                return;
            }

            const user = auth.currentUser;
            await updatePassword(user, password);

            // Nếu muốn thông báo cập nhật mật khẩu thành công, bạn có thể thêm state và hiển thị một thông báo.
            setSuccessMessage("Cập nhật mật khẩu thành công!");

        } catch (error) {
            console.error("Lỗi cập nhật mật khẩu:", error.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-5 sm:px-10 h-full pt-6">
            <h1 className="text-center text-xl font-semibold text-title">Thông tin cá nhân</h1>

            <div>
                <label htmlFor="email" className="form-label">Email <span>(Không thể thay đổi)</span></label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập địa chỉ email"
                    required
                    className="form-input"
                    value={emailData}
                    disabled
                />

                <label htmlFor="espId" className="form-label">Mã ESP <span>(Không thể thay đổi)</span></label>
                <input
                    type="number"
                    id="espId"
                    name="espId"
                    required
                    className="form-input"
                    value={esp_idData}
                    disabled
                />
            </div>

            <div className="divider"></div>

            <h1 className="text-center text-xl font-semibold text-title">Đổi mật khẩu</h1>

            <form onSubmit={handleUpdatePassword}>
                <label htmlFor="password" className="form-label">Mật khẩu mới</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Nhập mật khẩu mới"
                    required
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p className="text-red-500">{passwordError}</p>}

                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPasswordError && <p className="text-red-500">{confirmPasswordError}</p>}

                {successMessage && <p className="text-green-500">{successMessage}</p>}
                <div className="flex justify-end pb-8">
                    <button type="submit" className="custom-primary-btn">Lưu mật khẩu</button>
                </div>
            </form>


        </div>
    );
};

export default Setting;
