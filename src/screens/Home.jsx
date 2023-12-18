
import { useState, useEffect } from "react";
import { auth, db } from "../functions/firebase";
import { ref, onValue, set, off } from 'firebase/database';

import Gaude from "../components/Gaude/Gaude"

const Home = () => {
    // ========== Init state ==========
    const [foodData, setFoodData] = useState(0)
    const [weightData, setWeightData] = useState(0)
    const [soundData, setSoundData] = useState("0")
    const [requestData, setRequestData] = useState("")

    // ========== Run when component mounted ==========
    useEffect(() => { // Lấy dữ liệu từ database
        const user = auth.currentUser;
        const espId = user.displayName; // Lấy mã ESP

        let food = ref(db, `${espId}/remaining_food`);
        onValue(food, (snapshot) => {
            let data = snapshot.val() || 0;
            setFoodData(data);
        });

        const weight = ref(db, `${espId}/weight`);
        onValue(weight, (snapshot) => { setWeightData(snapshot.val() || 0) });

        const sound = ref(db, `${espId}/sound`);
        onValue(sound, (snapshot) => { setSoundData(snapshot.val() || ""); });

        let request = ref(db, `${espId}/request`);
        onValue(request, (snapshot) => {
            let data = snapshot.val() || "";
            setRequestData(data);
        });

        return () => {
            off(food); // Remove event listeners để tránh memory leaks khi component unmount
            off(weight);
            off(sound);
            off(request);
        };
    }, []);

    // ========== Handle functions ==========
    const updateValues = (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const espId = user.displayName; // Lấy mã ESP

        if (weight != '') {
            set(ref(db, `${espId}/weight`), parseFloat(weightData));
        }
        if (sound != '') {
            set(ref(db, `${espId}/sound`), soundData);
        }
        set(ref(db, `${espId}/request`), 'Feed');
    }


    return (
        <div className="w-full h-full pt-6 flex flex-col justify-start items-center ">

            <div className='max-w-[20rem]'>
                <h1 className="text-xl text-center font-semibold text-title">Lượng thức ăn hiện tại</h1>

                <div className="w-full h-fit mt-6 px-6">
                    <Gaude foodData={foodData} />
                </div>

                <div className="divider"></div>

                <form className="mt-6 mb-12" onSubmit={(e) => updateValues(e)}>
                    <label htmlFor="sound" className="form-label">Âm thanh:</label>
                    <select id="sound" name="sound" className="form-input" onChange={(e) => setSoundData(e.target.value)} value={soundData}>
                        <option value="0">Sound 1</option>
                        <option value="1">Sound 2</option>
                        <option value="2">Sound 3</option>
                    </select>

                    <label htmlFor="weight" className="form-label">Khối lượng (gram):</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        required
                        className="form-input"
                        value={weightData}
                        onChange={(e) => setWeightData(e.target.value)}
                        min={0}
                        max={100}
                    />

                    <button
                        type="submit"
                        className={`custom-primary-btn w-full ${requestData === 'Feed' ? 'opacity-50 bg-slate-500 hover:bg-slate-500' : ''}`}
                        disabled={requestData == 'Feed'}
                    >Cho ăn ngay lập tức</button>
                </form>

            </div>
        </div>
    )
}

export default Home
