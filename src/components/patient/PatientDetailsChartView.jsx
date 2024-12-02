import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function PatientDetailsChartView({ vitalTypes, filteredChart }) {
  return (
    <div className="vitalsigns-btm-chart">
      {vitalTypes.map((type, index) => (
        <ResponsiveContainer key={index} width="100%" height={500}>
          <LineChart
            data={filteredChart}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={type}
              name={type}
              stroke="#8884d8"
              activeDot={{ r: 6 }} // Customize active dot style
            />
          </LineChart>
        </ResponsiveContainer>
      ))}
    </div>
  );
}

export default PatientDetailsChartView;
