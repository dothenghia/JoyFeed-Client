
import { PieChart } from 'react-minimal-pie-chart';

const Gaude = ({ foodData }) => {

    const getColor = () => {
        if (foodData >= 60) {
            return '#28A745'; // Màu xanh lá
        } else if (foodData >= 40) {
            return '#FFC107'; // Màu vàng
        } else {
            return '#DC3545'; // Màu đỏ
        }
    };

    return (
        <PieChart
            data={[
                { title: 'One', value: foodData, color: getColor() },
            ]}
            background='#DEE2E6'
            totalValue={100}
            lineWidth={25}
            startAngle={270}
            // rounded
            label={({ dataEntry }) => dataEntry.value + '%'}
            labelPosition={0}
            animate
            animationDuration={1000}
            animationEasing="ease-in-out"
        />

    )
}

export default Gaude