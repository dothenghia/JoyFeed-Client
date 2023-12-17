
import { useState, useEffect } from "react";
import { auth, db } from "../functions/firebase";
import { ref, onValue, set, off } from 'firebase/database';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const History = () => {
    // ========== Init state ==========
    const [historyData, setHistoryData] = useState(null)
    const [dateData, setDateData] = useState(new Date());


    useEffect(() => {
        // Chuyển định dạng ngày thành 'YYYY_MM_DD'
        const year = dateData.getFullYear();
        const month = (dateData.getMonth() + 1).toString().padStart(2, '0'); // Thêm số 0 đằng trước
        const day = dateData.getDate().toString().padStart(2, '0'); // Thêm số 0 đằng trước
        const formattedDate = `${year}_${month}_${day}`

        const user = auth.currentUser;
        if (!user) { return; } // Xử lý khi người dùng chưa đăng nhập

        const espId = user.displayName;

        let history = ref(db, `history/${espId}/${formattedDate}`);

        onValue(history, (snapshot) => {
            const data = snapshot.val() || [];
            const dataArray = Object.entries(data).map(([time, values]) => ({ // Chuyển object thành array
                time,
                boan: (values.eat / values.feed <= 0.8), // Nếu ăn ít hơn 80% thì coi như bỏ ăn
                ...values
            }));
            setHistoryData(dataArray);
        });

        return () => {
            off(history);
        };
    }, [dateData]);


    return (
        <div className="max-w-3xl mx-auto px-5 sm:px-10 h-full pt-6 flex justify-center items-start">

            <div className="flex flex-col min-[980px]:flex-row justify-center items-center min-[980px]:items-start">
                <div className=" flex-1 min-[980px]:mr-10">
                    <h1 htmlFor="history" className="text-xl font-semibold text-title text-center mb-3">Chọn ngày để xem lịch sử </h1>
                    <Calendar
                        onChange={setDateData}
                        value={dateData}
                    />
                </div>

                <div className="w-[350px] flex-1 mt-6 border-t border-border pt-6 min-[980px]:border-0">
                    {
                        historyData && historyData.map((data, index) => {
                            return (
                                <div key={index} className="w-full px-4 pt-3 pb-2 border border-1 border-border rounded-xl overflow-hidden mb-5">
                                    <h1 className="text-lg font-semibold mb-2">
                                        Lần {index + 1}
                                        {data.boan && <span className="text-red-500 text-base font-semibold ml-2">(Bỏ ăn)</span>}
                                    </h1>

                                    <p>Thời gian:
                                        <span className="text-base font-medium text-text ml-1">{data.time}</span>
                                    </p>
                                    <p>Khối lượng:
                                        <span className="text-base font-medium text-text ml-1">{data.feed} gram</span>
                                    </p>
                                    <p>Đã ăn:
                                        <span className="text-base font-medium text-text ml-1">{data.eat} gram</span>
                                    </p>
                                </div>
                            )
                        })
                    }
                    {
                        historyData && historyData.length === 0 &&
                        <div className="w-full mt-0 min-[980px]:mt-28 text-center text-xl font-semibold text-title">
                            Không có dữ liệu
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default History