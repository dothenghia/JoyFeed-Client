
import { useState, useEffect } from "react";
import { auth, db } from "../functions/firebase";
import { ref, onValue, set, off } from 'firebase/database';

const Config = () => {
    // ========== Init state ==========
    const [n_feedData, setN_feedData] = useState(0)
    const [soundData, setSoundData] = useState("0")
    const [feed_gramData, setFeed_gramData] = useState([])
    const [feed_timeData, setFeed_timeData] = useState([])
    const [turnOff, setTurnOff] = useState(true)

    // ========== Handle functions ==========
    function handleDecreaseMeal() {
        if (n_feedData === 0) return
        setN_feedData(n_feedData - 1)
        setFeed_gramData(prevData => prevData.slice(0, n_feedData - 1));
        setFeed_timeData(prevData => prevData.slice(0, n_feedData - 1));
    }
    function handleIncreaseMeal() {
        if (n_feedData === 5) return
        setN_feedData(n_feedData + 1)
    }

    function handleUpdate(e) {
        e.preventDefault();
        const user = auth.currentUser;
        const espId = user.displayName;

        set(ref(db, `${espId}/feed_gram`), feed_gramData);
        set(ref(db, `${espId}/feed_time`), feed_timeData);
        set(ref(db, `${espId}/n_feed`), n_feedData);
        set(ref(db, `${espId}/sound`), soundData);

        console.log("Đã lưu thông tin thành công!");
    }

    // ========== Run when component mounted ==========
    useEffect(() => {
        const user = auth.currentUser;
        const espId = user.displayName;

        let n_feed = ref(db, `${espId}/n_feed`);
        onValue(n_feed, (snapshot) => {
            let data = snapshot.val() || 0;
            if (data === 0) {
                setTurnOff(true);
            }
            else {
                setTurnOff(false);
            }
            setN_feedData(data);
            let newDataLength = snapshot.val();
            setFeed_gramData(prevData => prevData.slice(0, newDataLength));
            setFeed_timeData(prevData => prevData.slice(0, newDataLength));
        });

        let sound = ref(db, `${espId}/sound`);
        onValue(sound, (snapshot) => { setSoundData(snapshot.val() || ""); });

        let feed_gram = ref(db, `${espId}/feed_gram`);
        onValue(feed_gram, (snapshot) => {
            let data = snapshot.val() || [];
            setFeed_gramData(data);
        });

        let feed_time = ref(db, `${espId}/feed_time`);
        onValue(feed_time, (snapshot) => {
            let data = snapshot.val() || [];
            setFeed_timeData(data);
        });

        return () => {
            off(n_feed);
            off(sound);
            off(feed_gram);
            off(feed_time);
        };
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-5 sm:px-10 h-full pt-6">

            <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="w-fit">
                    <label htmlFor="n_feedData" className="form-label">Số bữa ăn</label>

                    <div className="flex mb-4 sm:mb-0">
                        <button className="custom-primary-fade-btn px-2" onClick={handleDecreaseMeal}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                        <input
                            type="number"
                            id="n_feedData"
                            className="form-input m-0 w-14 text-center mx-2"
                            value={n_feedData}
                            // onChange={e => setN_feedData(e.target.value)}
                            disabled
                        />
                        <button className="custom-primary-fade-btn px-2" onClick={handleIncreaseMeal}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                    </div>
                </div>

                <div className="w-fit">
                    <label htmlFor="soundData" className="form-label">Âm thanh</label>
                    <select id="soundData" className="form-input m-0" onChange={(e) => setSoundData(e.target.value)} value={soundData}>
                        <option value="0">Sound 1</option>
                        <option value="1">Sound 2</option>
                        <option value="2">Sound 3</option>
                    </select>
                </div>
            </div>

            {
                n_feedData === 0 ?
                    (
                        turnOff ?
                            (
                                <>
                                    <div className="text-center text-xl font-semibold text-title">
                                        Bạn chưa cài đặt số bữa ăn

                                    </div>
                                    <div className="flex justify-center pt-8">
                                        <button onClick={handleIncreaseMeal} className="custom-primary-btn">Bật tính năng ăn tự động</button>
                                    </div>
                                </>
                            )
                            :
                            (
                                <>
                                    <div className="text-center text-xl font-semibold text-title">
                                        Bạn muốn tắt tính năng ăn tự động?
                                    </div>
                                    <div className="flex justify-center pt-8">
                                        <button onClick={(e) => handleUpdate(e)} className="custom-primary-btn">Tắt tính năng ăn tự động</button>
                                    </div>
                                </>
                            )

                    )
                    :
                    (
                        <form onSubmit={(e) => handleUpdate(e)}>
                            <div>
                                {
                                    [...Array(n_feedData)].map((_, index) => (
                                        <div key={index} className="px-4 pt-3 pb-2 border border-1 border-border rounded-xl overflow-hidden mb-5">
                                            <h1 className="text-lg font-semibold mb-2">Lần {index + 1}</h1>

                                            <div>
                                                <label htmlFor={`feed_time_${index}`} className="form-label-inline">Thời gian: </label>
                                                <input
                                                    type="time"
                                                    id={`feed_time_${index}`}
                                                    className="form-input-inline"
                                                    onChange={(e) => setFeed_timeData([...feed_timeData.slice(0, index), e.target.value, ...feed_timeData.slice(index + 1)])}
                                                    value={feed_timeData[index] || ''}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor={`feed_gram_${index}`} className="form-label-inline">Khối lượng: </label>
                                                <input
                                                    type="number"
                                                    id={`feed_gram_${index}`}
                                                    className="form-input-inline w-28"
                                                    onChange={(e) => setFeed_gramData([...feed_gramData.slice(0, index), e.target.value, ...feed_gramData.slice(index + 1)])}
                                                    value={feed_gramData[index] || ''}
                                                    required
                                                    min={0}
                                                    max={100}
                                                />
                                                <span className="text-base font-medium text-text ml-2">gram</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="flex justify-end pb-8">
                                <button type="submit" className="custom-primary-btn">Lưu thông tin</button>
                            </div>
                        </form>
                    )
            }


        </div>
    )
}

export default Config