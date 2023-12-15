
import { useState, useEffect } from "react";
import { auth, db } from "../functions/firebase";
import { ref, onValue, set, off } from 'firebase/database';

import Gaude from "../components/Gaude/Gaude"

const Home = () => {
    const [foodData, setFoodData] = useState(0)
    const [weightData, setWeightData] = useState(0)
    const [soundData, setSoundData] = useState(0)
    const [requestData, setRequestData] = useState("")

    useEffect(() => {
        const user = auth.currentUser;
        const espId = user.displayName; // Lấy mã ESP

        const food = ref(db, `${espId}/remaining_food`);
        onValue(food, (snapshot) => { setFoodData(snapshot.val()) });

        const weight = ref(db, `${espId}/weight`);
        onValue(weight, (snapshot) => { setWeightData(snapshot.val()) });

        const sound = ref(db, `${espId}/sound`);
        onValue(sound, (snapshot) => { setSoundData(snapshot.val()) });

        const request = ref(db, `${espId}/request`);
        onValue(request, (snapshot) => { setRequestData(snapshot.val()) });

        return () => {
            off(food); // Remove event listeners để tránh memory leaks khi component unmount
            off(weight);
            off(sound);
            off(request);
        };
    }, []);

    const updateValues = () => {
        const user = auth.currentUser;
        const espId = user.displayName; // Lấy mã ESP

        if (weight != '') {
            set(ref(db, `${espId}/weight`), parseFloat(weightData));
        }
        if (sound != '') {
            set(ref(db, `${espId}/sound`), parseFloat(soundData));
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

                <form className="mt-6 mb-12" onSubmit={updateValues}>
                    <label htmlFor="sound" className="form-label">Âm thanh:</label>
                    <select id="sound" name="sound" className="form-input" onChange={(e) => setSoundData(e.target.value)}>
                        <option value="0">Tiếng gọi hoang dã</option>
                        <option value="1">Sao em lại không nói</option>
                        <option value="2">Tìm em trong bóng damn</option>
                    </select>

                    <label htmlFor="weight" className="form-label">Khối lượng:</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        required
                        className="form-input"
                        value={weightData}
                        onChange={(e) => setWeightData(e.target.value)}
                    />

                    <button
                        onClick={updateValues}
                        className={`custom-primary-btn w-full ${requestData === 'Feed' ? 'opacity-50 bg-slate-500 hover:bg-slate-500' : ''}`}
                        disabled={requestData === 'Feed'}
                    >Cho ăn ngay lập tức</button>
                </form>

            </div>
        </div>
    )
}

export default Home