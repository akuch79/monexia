import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { month:"Jan", value:200 },
  { month:"Feb", value:500 },
  { month:"Mar", value:300 },
  { month:"Apr", value:800 }
];

const Analytics = () => {

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Analytics
      </h1>

      <LineChart width={500} height={300} data={data}>

        <XAxis dataKey="month"/>
        <YAxis/>
        <Tooltip/>

        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
        />

      </LineChart>

    </div>
  );
};

export default Analytics;