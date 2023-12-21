import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Modal from "react-modal"; // Import react-modal
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
import { FaChevronDown } from "react-icons/fa"; // Import the dropdown arrow icon
import "./MyLineChart.css"; // Import the external CSS file

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
  const [titleVisibility, setTitleVisibility] = useState({}); // State to track title visibility

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

  const [showWarning, setShowWarning] = useState(false);

  const handleCloseModal = () => {
    setShowWarning(false);
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    if (startDate > endDate) {
      // Check if start date is greater than end date
      setShowWarning(true);
      return; // Exit fetchData function
    }

    const currentDate = new Date().toISOString().split("T")[0];
    if (startDate > currentDate || endDate > currentDate) {
      // Check if start or end date is greater than the current date
      setShowWarning(true);
      return; // Exit fetchData function
    }

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

      if (responseData && responseData.data && responseData.data.response) {
        // Data is not empty
        setData(responseData.data.response);

        // Initialize availableStatuses and selectedStatuses based on new data
        const initialAvailableStatuses = {};
        const initialSelectedStatuses = {};
        const initialTitleVisibility = {};
        responseData.data.response.forEach((item) => {
          if (!initialAvailableStatuses[item.order_type]) {
            initialAvailableStatuses[item.order_type] = new Set();
            initialSelectedStatuses[item.order_type] = new Set();
            initialTitleVisibility[item.taskActivityTitle] = false; // Default to hidden
          }
          initialAvailableStatuses[item.order_type].add(item.activation_status);

          // Check if the status is "ERRORED" and set it as selected by default
          if (
            item.activation_status === "ERRORED" ||
            item.activation_status === "ERROR"
          ) {
            if (!initialSelectedStatuses[item.order_type]) {
              initialSelectedStatuses[item.order_type] = new Set();
            }
            initialSelectedStatuses[item.order_type].add(
              item.activation_status
            );
          }
        });
        setAvailableStatuses(initialAvailableStatuses);
        setSelectedStatuses(initialSelectedStatuses);
        setTitleVisibility(initialTitleVisibility);
      } else {
        // Data is empty
        setData([]); // Set data to an empty array
        // setShowWarning(true);
      }
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

  const handleAllStatusesChange = (activityTitle, statuses) => {
    const updatedStatuses = { ...selectedStatuses };
    if (
      statuses.every((status) => updatedStatuses[activityTitle].has(status))
    ) {
      statuses.forEach((status) =>
        updatedStatuses[activityTitle].delete(status)
      );
    } else {
      statuses.forEach((status) => updatedStatuses[activityTitle].add(status));
    }
    setSelectedStatuses(updatedStatuses);
  };

  const toggleTitleVisibility = (activityTitle) => {
    const updatedVisibility = { ...titleVisibility };
    updatedVisibility[activityTitle] = !updatedVisibility[activityTitle];
    setTitleVisibility(updatedVisibility);
  };

  const allDates = [...new Set(data.map((item) => item.groupedDated))];
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
    <div className="my-line-chart-container">
      {/* Warning Modal */}
      {/* Warning Modal */}
      {showWarning && (
        <div className="alert-modal">
          <div className="alert-content">
            <h2>Warning</h2>
            <p>Please select a valid date range.</p>
            <button onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}

      {/* Rest of your component */}
      <div className="chart-section">
        <Line data={chartData} options={options} height={200} />
        <div className="date-inputs">
          <div className="date-input">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-picker"
            />
          </div>
          <div className="date-input">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-picker"
            />
          </div>
        </div>
        <div className="status-filters">
          {Object.keys(availableStatuses).map((activityTitle) => (
            <div key={activityTitle} className="status-filter">
              <div
                className="filter-header"
                onClick={() => toggleTitleVisibility(activityTitle)}
              >
                <span>{activityTitle}</span>
                <FaChevronDown
                  className={`dropdown-icon ${
                    titleVisibility[activityTitle] ? "rotate" : ""
                  }`}
                />
                <input
                  type="checkbox"
                  checked={
                    selectedStatuses[activityTitle] &&
                    Array.from(availableStatuses[activityTitle]).every(
                      (status) => selectedStatuses[activityTitle].has(status)
                    )
                  }
                  onChange={() =>
                    handleAllStatusesChange(
                      activityTitle,
                      Array.from(availableStatuses[activityTitle])
                    )
                  }
                />
              </div>
              {/* Conditionally render status checkboxes */}
              {titleVisibility[activityTitle] && (
                <table className="status-table">
                  <thead>
                    <tr>
                      <th className="status-header">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(availableStatuses[activityTitle]).map(
                      (status) => (
                        <tr key={status}>
                          <td className="status-cell">
                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  selectedStatuses[activityTitle] &&
                                  selectedStatuses[activityTitle].has(status)
                                }
                                onChange={() =>
                                  handleStatusChange(activityTitle, status)
                                }
                              />
                              {status}
                            </label>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="second-chart">
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
