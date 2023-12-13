
import { useState } from "react"

const History = () => {
    // ========== Init state ==========
    const [mealData, setMealData] = useState([
        {time: "8:30 AM", ration: "100", eaten: "60", boan: false},
        {time: "12:30 PM", ration: "100", eaten: "60", boan: true},
        {time: "16:30 PM", ration: "100", eaten: "60", boan: false},
        {time: "20:30 PM", ration: "100", eaten: "60", boan: false},
    ])


    // ========== Handle functions ==========

    return (
        <div className="max-w-3xl mx-auto px-5 sm:px-10 h-full pt-6 ">

            <div>
                <label htmlFor="history" className="form-label">Chọn ngày: </label>
                <input type="date" id="history" className="form-input w-60" />
            </div>

            <div className=" pb-8">
                {
                    mealData.map((data, index) => (
                        <div key={index} className="px-4 pt-3 pb-2 border border-1 border-border rounded-xl overflow-hidden mb-5">
                            <h1 className="text-lg font-semibold mb-2">
                            Lần {index + 1}
                            {data.boan && <span className="text-red-500 text-sm font-medium ml-2">(Bỏ ăn)</span>}
                            </h1>

                            <p>Thời gian:
                                <span className="text-base font-medium text-text ml-1">{data.time}</span>
                            </p>
                            <p>Khối lượng:
                                <span className="text-base font-medium text-text ml-1">{data.ration} gram</span>
                            </p>
                            <p>Đã ăn:
                                <span className="text-base font-medium text-text ml-1">{data.eaten} gram</span>
                            </p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default History