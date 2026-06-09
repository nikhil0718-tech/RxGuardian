import React from "react";

import {

    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer

} from "recharts";

const COLORS = [
  "#0BA5A4",
  "#EF4444",
  "#F59E0B"
];

const AdherencePieChart = ({

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
        bg-transparent shadow-none p-0
        ">

            <h2 className="
            text-2xl
            font-bold
            text-blue-700
            mb-6
            ">

                Medicine Status Analytics

            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <PieChart>

                    <Pie

                        data={data}

                        cx="50%"

                        cy="50%"

                        outerRadius={100}

                        fill="#8884d8"

                        dataKey="value"

                        label
                    >

                        {

                            data.map((entry, index) => (

                                <Cell

                                    key={index}

                                    fill={
                                        COLORS[index]
                                    }
                                />
                            ))
                        }

                    </Pie>

                    <Tooltip />

                </PieChart>

            </ResponsiveContainer>

        </div>
    );
};

export default AdherencePieChart;