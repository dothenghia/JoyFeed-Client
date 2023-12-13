
import Gaude from "../components/Gaude/Gaude"

const Home = () => {
    return (
        <div className="w-full h-full pt-6 flex flex-col justify-start items-center ">

            <div className='max-w-[20rem]'>
                <h1 className="text-xl text-center font-semibold text-title">Lượng thức ăn hiện tại</h1>

                <div className="w-full h-fit mt-6 px-6">
                    <Gaude foodData={80} />
                </div>

                <div className="divider"></div>

                <form className="mt-6 mb-12">
                    <label htmlFor="sound" className="form-label">Âm thanh:</label>
                    <select id="sound" name="sound" className="form-input">
                        <option value="Tiếng gọi hoang dã">Tiếng gọi hoang dã</option>
                        <option value="Sao em lại không nói">Sao em lại không nói</option>
                        <option value="Tìm em trong bóng damn">Tìm em trong bóng damn</option>
                    </select>

                    <label htmlFor="ration" className="form-label">Khối lượng:</label>
                    <input
                        type="number"
                        id="ration"
                        name="ration"
                        required
                        className="form-input"
                    />

                    <button type="submit" className="custom-primary-btn w-full">Cho ăn ngay lập tức</button>
                </form>

            </div>
        </div>
    )
}

export default Home