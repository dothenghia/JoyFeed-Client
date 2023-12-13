
import { Link } from "react-router-dom"

const Register = () => {
    return (
        <div id="login" className="screen-container-0py bg-gradient-to-br from-[#22E1FF] via-[#1D8FE1] to-primary flex justify-center items-center">

            <div className="w-[90%] h-fit md:h-[90%] md:min-h-[90vh] flex justify-between items-center bg-white rounded-2xl overflow-hidden shadow-lg flex-col md:flex-row">

                <div className="hidden md:flex w-1/2 py-8 justify-center items-center self-center border-r-2">
                    <img src="/src/assets/illustration/register.png"
                        alt="Register Illustration"
                        className="w-3/4 ratio-1x1 object-cover"
                    />
                </div>


                <div className="w-full md:w-1/2 py-6 md:py-0 px-6 md:px-8 lg:px-16 flex flex-col items-center">
                    <h2 className="block text-2xl font-semibold mb-5 text-primary">Đăng ký tài khoản</h2>

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

                        <label htmlFor="esp" className="form-label">Mã máy ESP</label>
                        <input
                            type="text"
                            id="esp"
                            name="esp"
                            placeholder="Nhập mã máy"
                            required
                            className="form-input"
                        />

                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            required
                            className="form-input"
                        />

                        <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            required
                            className="form-input"
                        />

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