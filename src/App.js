
import React, { useEffect, useState } from "react";
import axios from "axios";
import StockChart from "./component/StockChart";

import "./App.css";

const App = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.upstox.com/v2/historical-candle/intraday/NSE_EQ%7CINE090A01021/1minute"
        );
      
        const formattedData = Object.keys(response.data.data.candles).map((date) => ({
          date: response.data.data.candles[date][0],
          open: parseFloat(response.data.data.candles[date][1]),
          high: parseFloat(response.data.data.candles[date][2]),
          low: parseFloat(response.data.data.candles[date][3]),
          close: parseFloat(response.data.data.candles[date][4]),
          volume: parseInt(response.data.data.candles[date][5]),
        }));
        setChartData(formattedData.reverse()); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

   
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup

   

  }, []);

  return (
    <div className="App">
      <h1>Financial Chart with React</h1>
      {chartData.length > 0 ? (
        <StockChart data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
      
    </div>
    
  );
};

export default App;



