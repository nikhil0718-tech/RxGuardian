import React from "react";

import {

    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer

} from "recharts";

const WeeklyTrendChart = () => {

    // =====================================
    // SAMPLE DATA
    // =====================================

    const data = [

        {
            day: "Mon",
            adherence: 80
        },

        {
            day: "Tue",
            adherence: 60
        },

        {
            day: "Wed",
            adherence: 90
        },

        {
            day: "Thu",
            adherence: 75
        },

        {
            day: "Fri",
            adherence: 50
        },

        {
            day: "Sat",
            adherence: 95
        },

        {
            day: "Sun",
            adherence: 85
        }
    ];

    return (

        <div className="
        bg-transparent
shadow-none
p-0
        ">

            <h2 className="
            text-2xl
            font-bold
            text-blue-700
            mb-6
            ">

                Weekly Adherence Trend

            </h2>

            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <LineChart
                    data={data}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="day"
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
 type="monotone"
 dataKey="adherence"
 stroke="#119DD8"
 strokeWidth={5}
/>

                </LineChart>

            </ResponsiveContainer>

        </div>
    );
};

export default WeeklyTrendChart;