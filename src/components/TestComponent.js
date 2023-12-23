import React from "react";

const TestComponent = ({ apiResponse }) => {
  const content = apiResponse ? (
    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
  ) : (
    <p>No data found.</p>
  );

  return (
    <div>
      <h2>API Response</h2>
      {content}
    </div>
  );
};

export default TestComponent;
