
import { ref, onValue } from "firebase/database";
import db from "./firebase";

export default async function readData() {
    try {
        const data = await getDataFromFirebase();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error reading data:", error);
        throw error;
    }
}

async function getDataFromFirebase() {
    return new Promise((resolve, reject) => {
        let data = {};

        // Đọc Nhiệt độ
        const temperatureRef = ref(db, 'temperature');
        onValue(temperatureRef, (snapshot) => {
            data.temperature = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        });

        // Đọc Độ ẩm
        const humidityRef = ref(db, 'humidity');
        onValue(humidityRef, (snapshot) => {
            data.humidity = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}