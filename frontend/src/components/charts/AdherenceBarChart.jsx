import React from "react";

import {

    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer

} from "recharts";

const AdherenceBarChart = ({

    taken,
    missed,
    pending
}) => {

    const data = [

        {
            name: "Taken",
            value: taken
        },

        {
            name: "Missed",
            value: missed
        },

        {
            name: "Pending",
            value: pending
        }
    ];

    return (

        <div className="
        bg-transparent p-0 shadow-none
        ">

            <h2 className="
            text-2xl
            font-bold
            text-blue-700
            mb-6
            ">

                Adherence Summary

            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <BarChart
                    data={data}
                >

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
 dataKey="value"
 radius={[10,10,0,0]}
 fill="#119DD8"
/>

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
};

export default AdherenceBarChart;