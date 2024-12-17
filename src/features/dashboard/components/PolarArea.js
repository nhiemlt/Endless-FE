import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    RadialLinearScale,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    RadialLinearScale,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function PolarAreaChart({ ratingsByStars }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);
        mediaQuery.addEventListener('change', (e) => {
            setIsDarkMode(e.matches);
        });

        return () => {
            mediaQuery.removeEventListener('change', (e) => {
                setIsDarkMode(e.matches);
            });
        };
    }, []);

    const backgroundColors = isDarkMode
        ? [
              'rgba(255, 99, 132, 0.8)', 
              'rgba(54, 162, 235, 0.8)', 
              'rgba(255, 205, 86, 0.8)', 
              'rgba(75, 192, 192, 0.8)', 
              'rgba(153, 102, 255, 0.8)',
          ]
        : [
              'rgba(255, 99, 132, 0.2)', 
              'rgba(54, 162, 235, 0.2)', 
              'rgba(255, 205, 86, 0.2)', 
              'rgba(75, 192, 192, 0.2)', 
              'rgba(153, 102, 255, 0.2)', 
          ];

    const borderColors = isDarkMode
        ? [
              'rgba(255, 99, 132, 1)', 
              'rgba(54, 162, 235, 1)', 
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)', 
          ]
        : [
              'rgba(255, 99, 132, 1)', 
              'rgba(54, 162, 235, 1)', 
              'rgba(255, 205, 86, 1)', 
              'rgba(75, 192, 192, 1)', 
              'rgba(153, 102, 255, 1)',
          ];

    const textColor = isDarkMode ? '#fff' : '#000'; 

    const data = {
        labels: ['1 sao', '2 sao', '3 sao', '4 sao', '5 sao'],
        datasets: [
            {
                label: 'Số lượt đánh giá',
                data: ratingsByStars,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Biểu đồ Polar Area theo số lượt đánh giá',
                font: {
                    size: 16,
                    weight: 'bold',
                    color: textColor,
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    labelColor: (tooltipItem) => ({
                        borderColor: tooltipItem.dataset.borderColor,
                        backgroundColor: tooltipItem.dataset.backgroundColor,
                    }),
                },
            },
        },
        scales: {
            r: {
                grid: {
                    color: isDarkMode ? '#444' : '#ddd', 
                },
                ticks: {
                    color: textColor,
                },
            },
        },
    };

    return (
        <div>
            <div className="bg-base-100" style={{ width: '450px', height: '450px' }}>
                <PolarArea
                    data={data}
                    options={options}
                    className="w-full"
                />
            </div>
        </div>
    );
}

export default PolarAreaChart;
