import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

function Outputs({ fraudData, setairesp }) {
  const chartData = fraudData?.predictions?.map((transaction, index) => ({
    id: index,
    amount: transaction.amount,
    isFraud: transaction.predicted_isFraud === 1,
  })) || [];

  const handleClick = async (payload) => {
    if (!payload.isFraud) {
      return alert("Green dot: This transaction is legitimate.");
    }

    setairesp("AI generating...");
    console.log("Clicked Data:", payload);

    try {
      const response = await fetch("http://127.0.0.1:9002/api/airesp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fraudData: payload }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result || !result.response) {
        throw new Error("Invalid response format");
      }

      console.log("AI Response:", result.response);
      setairesp(result.response);
    } catch (error) {
      console.error("Error sending data:", error);
      setairesp(`Error: ${error.message || "Failed to generate AI response"}. Please try again.`);
    }
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={payload.isFraud ? "#FF5252" : "#4ECDC4"}
        stroke="#2D3748"
        strokeWidth={1.5}
        onClick={() => handleClick(payload)}
        style={{ cursor: "pointer" }}
      />
    );
  };

  return (
    <motion.div className="bg-gray-800 p-6 rounded-lg shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h2 className="text-xl font-bold mb-6 text-center text-white">Transaction Analysis</h2>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" opacity={0.3} />
            <XAxis dataKey="id" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#9F7AEA" strokeWidth={3} dot={<CustomDot />} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Upload data to view transaction analysis</p>
        </div>
      )}
    </motion.div>
  );
}

export default Outputs;
