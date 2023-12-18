
import recoveryillustration from '../assets/illustration/recovery.png'
import { Link } from "react-router-dom"

const Recovery = () => {
    return (
        <div id="login" className="screen-container-0py bg-gradient-to-br from-[#22E1FF] via-[#1D8FE1] to-primary flex justify-center items-center">

            <div className="w-fit md:min-w-[500px] h-fit mx-6 flex flex-col justify-between items-center bg-white rounded-2xl overflow-hidden shadow-lg py-6 px-6">

                <h1 className="block text-2xl font-semibold mb-0 text-primary">Quên mật khẩu</h1>

                <img src={recoveryillustration}
                    alt="Login Illustration"
                    className="w-72 max-w-[80%] ratio-1x1 object-cover"
                />

                <h2 className="block w-full text-left text-base font-medium mb-2 text-text">Nhập email tài khoản để nhận mã khôi phục</h2>

                <form className="w-full">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Nhập địa chỉ email"
                        required
                        className="form-input"
                    />

                    <button type="submit" className="custom-primary-btn w-full">
                        Gửi mã khôi phục
                    </button>
                </form>

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