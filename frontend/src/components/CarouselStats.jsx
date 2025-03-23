import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

function CarouselStats({ totalTransactions, fraudulentTransactions, fraudPercentage }) {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with middle item focused
  const [stats, setStats] = useState([
    {
      id: 0,
      label: "Total Transactions",
      value: totalTransactions
    },
    {
      id: 1,
      label: "Fraudulent Transactions",
      value: fraudulentTransactions
    },
    {
      id: 2,
      label: "Fraud Percentage",
      value: fraudPercentage + "%"
    }
  ]);

  // Update stats when props change
  useEffect(() => {
    setStats([
      {
        id: 0,
        label: "Total Transactions",
        value: totalTransactions
      },
      {
        id: 1,
        label: "Fraudulent Transactions",
        value: fraudulentTransactions
      },
      {
        id: 2,
        label: "Fraud Percentage",
        value: fraudPercentage + "%"
      }
    ]);
  }, [totalTransactions, fraudulentTransactions, fraudPercentage]);

  const rotateRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    setStats(prevStats => {
      const newStats = [...prevStats];
      const first = newStats.shift();
      newStats.push(first);
      return newStats;
    });
  };

  const rotateLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
    setStats(prevStats => {
      const newStats = [...prevStats];
      const last = newStats.pop();
      newStats.unshift(last);
      return newStats;
    });
  };

  return (
    <div className="w-full max-w-3xl mt-8 px-4">
      <div className="relative flex justify-center items-center h-64">
        {/* Left arrow */}
        <button 
          onClick={rotateLeft}
          className="absolute left-0 z-20 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Stats cards */}
        <div className="flex justify-center items-center w-full">
          <AnimatePresence>
            {stats.map((stat, index) => {
              // 0 = left, 1 = center, 2 = right
              const position = (index - 1) % 3;
              
              return (
                <motion.div
                  key={stat.id}
                  className={`absolute bg-gray-800 rounded-full shadow-lg overflow-hidden
                    ${index === 1 ? 'z-10' : 'z-0'}`}
                  initial={{ 
                    x: position * 180,  // Spread out horizontally
                    scale: index === 1 ? 1 : 0.8,
                    opacity: index === 1 ? 1 : 0.6,
                    filter: index === 1 ? 'blur(0px)' : 'blur(2px)'
                  }}
                  animate={{ 
                    x: position * 180,
                    scale: index === 1 ? 1 : 0.8,
                    opacity: index === 1 ? 1 : 0.6,
                    filter: index === 1 ? 'blur(0px)' : 'blur(2px)'
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                  style={{ width: '160px', height: '160px' }}
                >
                  <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
                    <p className={`text-3xl font-bold ${index === 1 ? 'text-orange-500' : 'text-gray-300'}`}>
                      {stat.value}
                    </p>
                    <h4 className={`mt-2 ${index === 1 ? 'text-white' : 'text-gray-400'}`}>
                      {stat.label}
                    </h4>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right arrow */}
        <button 
          onClick={rotateRight}
          className="absolute right-0 z-20 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CarouselStats;