import { useState, useEffect } from "react";
import { auth } from "../functions/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Setting = () => {
    // ========== Init state ==========
    const [emailData, setEmailData] = useState("");
    const [esp_idData, setEsp_idData] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // Thêm state cho thông báo thành công

    // ========== Run when component mounted ==========
    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            setEmailData(user.email);
            setEsp_idData(user.displayName);
        }
    }, []);

    // ========== Handle functions ==========
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        try {
            setPasswordError("");
            setConfirmPasswordError("");
            setSuccessMessage("");

            if (currentPassword.length === 0) {
                setPasswordError("Vui lòng nhập mật khẩu hiện tại.");
                return;
            }

            // Thêm xác thực mật khẩu hiện tại
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            if (password.length < 6) {
                setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
                return;
            }

            if (password !== confirmPassword) {
                setConfirmPasswordError("Xác nhận mật khẩu mới không khớp.");
                return;
            }

            await updatePassword(user, password);

            setSuccessMessage("Cập nhật mật khẩu thành công!");

        } catch (error) {
            console.error("Lỗi cập nhật mật khẩu:", error.message);
            if (error.code === "auth/invalid-credential") {
                setPasswordError("Mật khẩu hiện tại không đúng.");
            }
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

                <label htmlFor="currentPassword" className="form-label">Mật khẩu hiện tại</label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                    className="form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />


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
