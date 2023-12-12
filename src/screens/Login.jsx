
import { Link } from "react-router-dom"

const Login = () => {
    return (
        <div id="login" className="screen-container-0py bg-gradient-to-br from-[#22E1FF] via-[#1D8FE1] to-primary
                                   flex justify-center items-center">

            <div className="w-[90%] h-[90%] min-h-[90vh] flex justify-between items-center
                          bg-white rounded-2xl overflow-hidden shadow-lg
                          flex-col md:flex-row">

                <div className="w-full md:w-1/2 px-6 md:px-8 lg:px-16 flex flex-col items-center">
                    <h1 className="hidden md:block text-2xl md:text-4xl font-bold mb-5 text-primary">JoyFeed</h1>

                    <img src="/src/assets/illustration/logo.jpg"
                        alt="Login Illustration"
                        className="md:hidden w-72 max-w-[80%] ratio-1x1 object-cover"
                    />

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

                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            required
                            className="form-input"
                        />

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
                    <img src="/src/assets/illustration/logo.jpg"
                        alt="Login Illustration"
                        className="w-3/4 ratio-1x1 object-cover"
                    />
                </div>

            </div>
        </div>
    )
}

export default Login