import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

function Outputs({ fraudData, setairesp }) {
  // Transform data for the chart - keeping existing functionality
  const chartData = fraudData?.predictions?.map((transaction, index) => ({
    id: index,
    amount: transaction.amount,
    isFraud: transaction.predicted_isFraud === 1, // Boolean flag
  })) || [];

  // Custom dot component for coloring points - keeping existing functionality
  const CustomDot = (props) => {
    const { cx, cy, payload } = props; // Extract transaction data
  
    if (!cx || !cy) return null; // Prevent rendering issues
  
    const handleClick = async (e) => {

      if (!payload.isFraud){
        return alert("green dot")
      }
      setairesp('AI generating')
      e.stopPropagation(); // Prevent interference from parent components
      console.log("Clicked Data:", payload); // Debugging log
  
      try {
        const response = await fetch("/api/airesp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fraudData: payload, // Send the entire transaction object
          }),
        });
  
        const result = await response.json();
        console.log("AI Response:", result.response);
        setairesp(result.response)
      } catch (error) {
        console.error("Error sending data:", error);
        alert("Failed to send data.");
      }
    };
  
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6} // Increase size for better clickability
        fill={payload.isFraud ? "#FF5252" : "#4ECDC4"}
        stroke="#2D3748"
        strokeWidth={1.5}
        onClick={handleClick} // Ensure event is attached
        style={{ cursor: "pointer" }} // Show pointer cursor
      />
    );
  };
  

  // Custom tooltip with improved styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-sm font-semibold mb-1">Transaction ID: {data.id}</p>
          <p className="text-sm">
            Amount: <span className="font-bold">${Number(data.amount).toFixed(2)}</span>
          </p>
          <p className="text-sm mt-1">
            Status:{" "}
            <span className={`font-bold ${data.isFraud ? "text-red-400" : "text-teal-400"}`}>
              {data.isFraud ? "Fraudulent" : "Legitimate"}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-6 text-center text-white">
        Transaction Analysis
      </h2>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" opacity={0.3} />
            <XAxis 
              dataKey="id"
              stroke="#A0AEC0"
              label={{ 
                value: "Transaction ID", 
                position: "bottom", 
                fill: "#A0AEC0",
                fontSize: 14,
                dy: 15
              }} 
              tick={{ fill: "#A0AEC0" }}
            />
            <YAxis 
              stroke="#A0AEC0"
              label={{ 
                value: "Amount", 
                angle: -90, 
                position: "insideLeft",
                fill: "#A0AEC0",
                fontSize: 14,
                dx: -15
              }}
              tick={{ fill: "#A0AEC0" }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: 20,
                color: "#E2E8F0"
              }}
              formatter={(value) => <span className="text-gray-300">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="amount"
              name="Transaction Amount"
              stroke="#9F7AEA" // Purple color for line
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 8, strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Upload data to view transaction analysis</p>
        </div>
      )}
      
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-400 mr-2"></div>
          <span className="text-sm text-gray-300">Fraudulent</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-teal-400 mr-2"></div>
          <span className="text-sm text-gray-300">Legitimate</span>
        </div>
      </div>
    </motion.div>
  );
}

export default Outputs;