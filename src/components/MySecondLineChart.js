import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { FaChevronDown } from "react-icons/fa"; // Import the dropdown arrow icon
import "./MySecondLineChart.css";

const MySecondLineChart = () => {
  const [data, setData] = useState([]);
  const [availableStatuses, setAvailableStatuses] = useState({});
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [titleVisibility, setTitleVisibility] = useState({}); // State to track title visibility
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(`${today} 00:00:00`);
  const [endDate, setEndDate] = useState(`${today} 23:59:59`);
  const [showWarning, setShowWarning] = useState(false);

  const [filterKey, setFilterKey] = useState("MINUTE"); // Default value

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
          text: "Activity Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Activity Date",
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
        text: "Task Activity Status",
        font: {
          size: 22,
        },
      },
    },
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, filterKey]);

  const fetchData = async () => {
    const payload = {
      serviceType: "ACTIVITY_DASHBOARD",
      startDate: `${startDate} 00:00:00`,
      endDate: `${endDate} 23:59:59`,
      filterKey: filterKey,
    };

    // if (startDate > endDate) {
    //   // Check if start date is greater than end date
    //   setShowWarning(true);
    //   return; // Exit fetchData function
    // }
    // if (startDate < endDate) {
    //     // Check if start date is greater than end date
    //     setShowWarning(true);
    //     return; // Exit fetchData function
    //   }

    // const currentDate = new Date();
    // if (startDate > currentDate || endDate > currentDate) {
    //   console.log("Here");
    //   // Check if start or end date is greater than the current date
    //   setShowWarning(true);
    //   return; // Exit fetchData function
    // }

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
      const initialTitleVisibility = {}; // Initialize title visibility
      responseData.data.response.forEach((item) => {
        if (!initialAvailableStatuses[item.taskActivityTitle]) {
          initialAvailableStatuses[item.taskActivityTitle] = new Set();
          initialSelectedStatuses[item.taskActivityTitle] = new Set();
          initialTitleVisibility[item.taskActivityTitle] = false; // Default to hidden
        }
        initialAvailableStatuses[item.taskActivityTitle].add(
          item.taskActivityStatus
        );
        if (item.taskActivityStatus === "ERROR") {
          initialSelectedStatuses[item.taskActivityTitle].add("ERROR");
        }
      });
      setAvailableStatuses(initialAvailableStatuses);
      setSelectedStatuses(initialSelectedStatuses);
      setTitleVisibility(initialTitleVisibility); // Set initial title visibility
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusChange = (activityTitle, status) => {
    const updatedStatuses = { ...selectedStatuses };
    if (updatedStatuses[activityTitle].has(status)) {
      updatedStatuses[activityTitle].delete(status);
    } else {
      updatedStatuses[activityTitle].add(status);
    }
    setSelectedStatuses(updatedStatuses);
  };

  const getAggregatedData = (activityTitle, status) => {
    const filteredData = data.filter(
      (item) =>
        item.taskActivityTitle === activityTitle &&
        item.taskActivityStatus === status
    );
    const aggregatedData = {};
    filteredData.forEach((item) => {
      const date = item.groupedDated;
      aggregatedData[date] = (aggregatedData[date] || 0) + item.count;
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
    datasets: Object.keys(selectedStatuses).flatMap((activityTitle) => {
      return Array.from(selectedStatuses[activityTitle])
        .map((status) => {
          if (selectedStatuses[activityTitle].has(status)) {
            const aggregatedData = getAggregatedData(activityTitle, status);
            return {
              label: `${activityTitle} - ${status}`,
              data: allDates.map((date) => aggregatedData[date] || 0),
              borderColor: getLineColor(activityTitle, status),
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
    <div className="chart-container">
      <Line data={chartData} options={options} height={200} />
      <div className="filter-section">
        <div className="filter-item">
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-item">
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-item">
          <label>Filter-Key:</label>
          <select
            value={filterKey}
            onChange={(e) => setFilterKey(e.target.value)}
            className="filter-input"
          >
            <option value="MINUTE">MINUTE</option>
            <option value="HOUR">HOUR</option>
          </select>
        </div>
      </div>
      <div className="status-section">
        {Object.keys(availableStatuses).map((activityTitle) => (
          <div key={activityTitle} className="status-item">
            <div
              className="status-title"
              onClick={() => toggleTitleVisibility(activityTitle)}
            >
              <span>{activityTitle}</span>
              <FaChevronDown
                className="dropdown-icon"
                style={{
                  transform: titleVisibility[activityTitle]
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
              <input
                type="checkbox"
                checked={
                  selectedStatuses[activityTitle] &&
                  Array.from(availableStatuses[activityTitle]).every((status) =>
                    selectedStatuses[activityTitle].has(status)
                  )
                }
                onChange={() =>
                  handleAllStatusesChange(
                    activityTitle,
                    Array.from(availableStatuses[activityTitle])
                  )
                }
                className="title-checkbox"
              />
            </div>
            {titleVisibility[activityTitle] && (
              <table className="status-table">
                <thead>
                  <tr>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(availableStatuses[activityTitle]).map(
                    (status) => (
                      <tr key={status}>
                        <td>
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
  );
};

export default MySecondLineChart;

function getLineColor(activityTitle, status) {
  const hash = `${activityTitle}-${status}`.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const hue = Math.abs(hash) % 360;
  const saturation = 50 + (Math.abs(hash) % 50);
  const lightness = 25 + (Math.abs(hash) % 50);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
