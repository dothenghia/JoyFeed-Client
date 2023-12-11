
// Import functions
import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import db from '../firebase';


const App = () => {
    // ======= Init States
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [temperatureInput, setTemperatureInput] = useState('');
    const [humidityInput, setHumidityInput] = useState('');

    // ======= Read real-time data (Chỉ chạy một lần sau khi component mount)
    useEffect(() => {
        const temperatureRef = ref(db, 'temperature');
        const humidityRef = ref(db, 'humidity');

        // Đọc Nhiệt độ & Độ ẩm
        onValue(temperatureRef, (snapshot) => { setTemperature(snapshot.val()) });
        onValue(humidityRef, (snapshot) => { setHumidity(snapshot.val()) });

        // Cleanup function khi component unmount
        return () => {
            off(temperatureRef); // Remove event listeners để tránh memory leaks khi component unmount
            off(humidityRef);
        };
    }, []);

    // ======= Write real-time data
    const updateValues = () => {
        if (temperatureInput !== '') {
            set(ref(db, 'temperature'), parseFloat(temperatureInput));
        }
        if (humidityInput !== '') {
            set(ref(db, 'humidity'), parseFloat(humidityInput));
        }

        setTemperatureInput('');
        setHumidityInput('');
    };


    return (
        <div className='main'>
            <h1>Hello world</h1>
            <h1>Temperature : {temperature}</h1>
            <h1>Humidity : {humidity}</h1>

            <div>
                <label>New Temperature:</label>
                <input
                    type="number"
                    value={temperatureInput}
                    onChange={(e) => setTemperatureInput(e.target.value)}
                />
            </div>
            <div>
                <label>New Humidity:</label>
                <input
                    type="number"
                    value={humidityInput}
                    onChange={(e) => setHumidityInput(e.target.value)}
                />
            </div>
            <button onClick={updateValues}>Update Values</button>
        </div>
    )
}
export default App