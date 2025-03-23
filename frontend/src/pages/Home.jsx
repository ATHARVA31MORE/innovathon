import React, { useState } from 'react';
import Outputs from './Outputs';
import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground";
import CarouselStats from "../components/CarouselStats";
import Markdown from 'react-markdown'


function Home() {
  const [file1, setFile1] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [fraudData, setFraudData] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [fraudulentTransactions, setFraudulentTransactions] = useState(0);
  const [fraudPercentage, setFraudPercentage] = useState(0);
  const [airesp, setairesp] = useState('Get started')

  function validateCSV(file) {
    if (!file) return false;
    const validMimeType = file.type === 'text/csv';
    const validExtension = file.name.toLowerCase().endsWith('.csv');

    if (!validMimeType && !validExtension) {
      alert(`Invalid file: ${file.name}. Please upload a CSV file.`);
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    const formdata = new FormData();
    if (!file1) {
      return alert('Please upload a CSV file');
    }
    if (!validateCSV(file1)) {
      return alert('CSV file required');
    }

    formdata.append('file1', file1);

    const r1 = await fetch('/api/upload', {
      method: 'POST',
      body: formdata,
    });
    const data = await r1.json();
    setFraudData(data.data);

    console.log(data.data);
    

    if (data.data && data.data.predictions) {
      const predictions = data.data.predictions;
      setTotalTransactions(predictions.length);
      const fraudCount = predictions.filter((p) => p.predicted_isFraud === 1).length;
      setFraudulentTransactions(fraudCount);
      setFraudPercentage(((fraudCount / predictions.length) * 100).toFixed(1));
    }
    setSubmitted(true);
  }

  async function handleAI() {
    
    const r1 = await fetch('/api/airesp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        fraudData : fraudData
      }),
    });
    const data = await r1.json();

    console.log(data);
    setairesp(data?.response)

  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground />
      
      {/* Content Container - add relative positioning and z-index */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* File Upload Section */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Upload Balance Sheet</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="file"
              onChange={(e) => setFile1(e.target.files[0])}
              className="border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
            />
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </motion.div>

        {/* Carousel Statistics Section */}
        {submitted && (
          <CarouselStats 
            totalTransactions={totalTransactions}
            fraudulentTransactions={fraudulentTransactions}
            fraudPercentage={fraudPercentage}
          />
        )}

        {/* Chart Output Section */}
        <div className="w-full max-w-4xl mt-8">
          <Outputs fraudData={fraudData} setairesp={setairesp} />
        </div>

        {/* AI Response Section */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-3xl text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold">AI Response</h3>
          <div className="bg-gray-700 text-white p-4 rounded-md mt-2">
            <Markdown>
            {airesp}
              </Markdown> 
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default Home;