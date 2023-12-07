
// Import functions
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import db from '../firebase';


const App = () => {
    // ======= Init States
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);

    // ======= Read real-time data (Chỉ chạy một lần sau khi component mount)
    useEffect(() => {
        const temperatureRef = ref(db, 'temperature');
        const humidityRef = ref(db, 'humidity');

        // Đọc Nhiệt độ
        onValue(temperatureRef, (snapshot) => {
            setTemperature(snapshot.val());
        });

        // Đọc Độ ẩm
        onValue(humidityRef, (snapshot) => {
            setHumidity(snapshot.val());
        });

        // Cleanup function khi component unmount
        return () => {
            off(temperatureRef); // Remove event listeners để tránh memory leaks khi component unmount
            off(humidityRef);
        };
    }, []);

    return (
        <div className='main'>
            <h1>Hello world</h1>
            <h1>Temperature : {temperature}</h1>
            <h1>Humidity : {humidity}</h1>
        </div>
    )
}
export default App