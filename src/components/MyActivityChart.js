import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import MySecondLineChart from "./MySecondLineChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const MyLineChart = () => {
  const [data, setData] = useState([]);
  const [availableStatuses, setAvailableStatuses] = useState({});
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const options = {
    responsive: true,
    animation: {
      duration: 1000,
    },

    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
        title: {
          display: true,
          text: "Order Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Order Date",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Order Status",
        font: {
          size: 22,
        },
      },
    },
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    const payload = {
      serviceType: "ORDER_DASHBOARD_GRAPH",
      startDate: `${startDate} 00:00:00`,
      endDate: `${endDate} 23:59:59`,
    };

    try {
      const response = await fetch(
        "https://hobsdemos.centralindia.cloudapp.azure.com/HobsReporting/RequstHandler",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      setData(responseData.data.response);

      // Initialize availableStatuses and selectedStatuses based on new data
      const initialAvailableStatuses = {};
      const initialSelectedStatuses = {};
      responseData.data.response.forEach((item) => {
        if (!initialAvailableStatuses[item.order_type]) {
          initialAvailableStatuses[item.order_type] = new Set();
          initialSelectedStatuses[item.order_type] = new Set();
        }
        initialAvailableStatuses[item.order_type].add(item.activation_status);
        initialSelectedStatuses[item.order_type].add(item.activation_status);
      });
      setAvailableStatuses(initialAvailableStatuses);
      setSelectedStatuses(initialSelectedStatuses);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusChange = (orderType, status) => {
    const updatedStatuses = { ...selectedStatuses };
    if (updatedStatuses[orderType].has(status)) {
      updatedStatuses[orderType].delete(status);
    } else {
      updatedStatuses[orderType].add(status);
    }
    setSelectedStatuses(updatedStatuses);
  };

  const getAggregatedData = (orderType, status) => {
    const filteredData = data.filter(
      (item) =>
        item.order_type === orderType && item.activation_status === status
    );
    const aggregatedData = {};
    filteredData.forEach((item) => {
      const date = item.groupedDated;
      aggregatedData[date] = (aggregatedData[date] || 0) + item.COUNT;
    });
    return aggregatedData;
  };

  const allDates = [...new Set(data.map((item) => item.groupedDated))].sort();
  const chartData = {
    labels: allDates,
    datasets: Object.keys(selectedStatuses).flatMap((orderType) => {
      return Array.from(selectedStatuses[orderType])
        .map((status) => {
          if (selectedStatuses[orderType].has(status)) {
            const aggregatedData = getAggregatedData(orderType, status);
            return {
              label: `${orderType} - ${status}`,
              data: allDates.map((date) => aggregatedData[date] || 0),
              borderColor: getLineColor(orderType, status),
              fill: false,
              tension: 0.4, // Monotone curve
            };
          }
          return null;
        })
        .filter((dataset) => dataset !== null);
    }),
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 20,
      }}
    >
      <div
        style={{
          width: "50%",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px #ccc",
          minHeight: "100vh",
          //   height: "100%",
        }}
      >
        <Line data={chartData} options={options} height={200} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "10px 0",
            gap: "20px",
          }}
        >
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {Object.keys(availableStatuses).map((orderType) => (
            <div key={orderType} style={{ flexBasis: "50%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "2px solid #ccc",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      {orderType}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(availableStatuses[orderType]).map((status) => (
                    <tr key={status}>
                      <td
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "5px",
                        }}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={
                              selectedStatuses[orderType] &&
                              selectedStatuses[orderType].has(status)
                            }
                            onChange={() =>
                              handleStatusChange(orderType, status)
                            }
                          />
                          {status}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: "50%" }}>
        <MySecondLineChart />
      </div>
    </div>
  );
};

export default MyLineChart;

function getLineColor(orderType, status) {
  // Create a hash from the combination of orderType and status
  const hash = `${orderType}-${status}`.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Use different aspects of the hash to vary hue, saturation, and lightness
  const hue = Math.abs(hash) % 360; // Hue: 0-360
  const saturation = 50 + (Math.abs(hash) % 50); // Saturation: 50-100%
  const lightness = 25 + (Math.abs(hash) % 50); // Lightness: 25-75%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

String.prototype.hashCode = function () {
  var hash = 0;
  for (var i = 0; i < this.length; i++) {
    var character = this.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
