import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { Navigate } from "react-router-dom";

const theme = {
  background: "#83A2FF",
  headerBgColor: "#0766AD",
  headerFontSize: "20px",
  botBubbleColor: "#ED5AB3",
  headerFontColor: "white",
  botFontColor: "white",
  userBubbleColor: "#7071E8",
  userFontColor: "white",
};

// Chatbot configuration
const config = {
  floating: true,
  headerTitle: "Chat with HOBSBOT",
  placeholder: "Type your message...",
  width: "400px",
  height: "500px",
  bubbleStyle: { fontSize: "15px" },
  inputStyle: { backgroundColor: "lightgray" },
  customStyle: { boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" },
  contentStyle: { backgroundColor: "lightblue" },
  enableSmoothScroll: true,
  hideSubmitButton: false,
};

const Review = ({ steps }) => {
  const [state, setState] = useState({
    accountId: "",
    customerId: "",
    subscriberId: "",
    orderId: "",
    productName: "",
  });

  useEffect(() => {
    setState({
      accountId: steps["account-id"]?.value || "Not provided",
      customerId: steps["customer-id"]?.value || "Not provided",
      subscriberId: steps["subscriber-id"]?.value || "Not provided",
      orderId: steps["order-id"]?.value || "Not provided",
      productName: steps["product-name"]?.value || "Not provided",
    });
  }, [steps]);

  const { accountId, customerId, subscriberId, orderId, productName } = state;

  return (
    <div style={{ width: "100%" }}>
      <h3>Summary</h3>
      <table>
        <tbody>
          <tr>
            <td>Account ID</td>
            <td>{accountId}</td>
          </tr>
          <tr>
            <td>Customer ID</td>
            <td>{customerId}</td>
          </tr>
          <tr>
            <td>Subscriber ID</td>
            <td>{subscriberId}</td>
          </tr>
          <tr>
            <td>Order ID</td>
            <td>{orderId}</td>
          </tr>
          <tr>
            <td>Product Name</td>
            <td>{productName}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Review.propTypes = {
  steps: PropTypes.object.isRequired,
};

const ChatBotComponent = () => {
  const [chatKey, setChatKey] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [redirectToTestComponent, setRedirectToTestComponent] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const submitDetails = async (steps) => {
    await delay(3000); // Wait for 3 seconds
    const payload = {
      serviceType: "test", // Hardcoded value
      accountId: steps["account-id"]?.value || "",
      customerId: steps["customer-id"]?.value || "",
      orderId: steps["order-id"]?.value || "",
      subscriberId: steps["subscriber-id"]?.value || "",
      productName: steps["product-name"]?.value || "",
    };

    try {
      const response = await fetch("https://your-api-endpoint.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      setRedirectToTestComponent(true);
    } catch (error) {
      console.error("API call failed:", error);
      setApiResponse(null);
      setRedirectToTestComponent(true);
    }
  };

  if (redirectToTestComponent) {
    return <Navigate to="/test" state={{ response: apiResponse }} />;
  }

  // const handleEnd = ({ steps, values }) => {
  //   if (values[values.length - 1] === "yes") {
  //     // submitDetails(steps);
  //   } else {
  //     setChatKey((prevChatKey) => prevChatKey + 1);
  //     setApiResponse(null);
  //     setRedirectToTestComponent(false);
  //   }
  // };

  const handleEnd = ({ steps, values }) => {
    // Your existing code...
    setChatKey((prevChatKey) => prevChatKey + 1); // Resetting chatbot
  };

  const steps = [
    {
      id: "welcome",
      message: "Hello there! What do you want me to do?",
      trigger: "options",
    },
    {
      id: "options",
      options: [
        {
          value: "orderInfo",
          label: "Order Information",
          trigger: "1",
        },
        {
          value: "somethingElse",
          label: "Something Else",
          trigger: "handleElse",
        },
      ],
    },
    // Steps for Order Information
    {
      id: "1",
      message: "Do you have an account ID?",
      trigger: "account-id-question",
    },
    {
      id: "account-id-question",
      options: [
        { value: "yes", label: "Yes", trigger: "account-id" },
        {
          value: "no",
          label: "No",
          trigger: "ask-customer-id-question",
        },
      ],
    },
    {
      id: "account-id",
      user: true,
      trigger: "ask-customer-id-question",
    },
    {
      id: "ask-customer-id-question",
      message: "Do you have a customer ID?",
      trigger: "customer-id-question",
    },
    {
      id: "customer-id-question",
      options: [
        { value: "yes", label: "Yes", trigger: "customer-id" },
        {
          value: "no",
          label: "No",
          trigger: "ask-subscriber-id-question",
        },
      ],
    },
    {
      id: "customer-id",
      user: true,
      trigger: "ask-subscriber-id-question",
    },
    {
      id: "ask-subscriber-id-question",
      message: "Do you have a subscriber ID?",
      trigger: "subscriber-id-question",
    },
    {
      id: "subscriber-id-question",
      options: [
        { value: "yes", label: "Yes", trigger: "subscriber-id" },
        { value: "no", label: "No", trigger: "ask-order-id-question" },
      ],
    },
    {
      id: "subscriber-id",
      user: true,
      trigger: "ask-order-id-question",
    },
    {
      id: "ask-order-id-question",
      message: "Do you have an order ID?",
      trigger: "order-id-question",
    },
    {
      id: "order-id-question",
      options: [
        { value: "yes", label: "Yes", trigger: "order-id" },
        {
          value: "no",
          label: "No",
          trigger: "ask-product-name-question",
        },
      ],
    },
    {
      id: "order-id",
      user: true,
      trigger: "ask-product-name-question",
    },
    {
      id: "ask-product-name-question",
      message: "Do you have the name of a product?",
      trigger: "product-name-question",
    },
    {
      id: "product-name-question",
      options: [
        { value: "yes", label: "Yes", trigger: "product-name" },
        { value: "no", label: "No", trigger: "review" },
      ],
    },
    {
      id: "product-name",
      user: true,
      trigger: "review",
    },
    // Review and confirm steps
    {
      id: "review",
      component: <Review />,
      asMessage: true,
      trigger: "confirm-details",
    },
    {
      id: "confirm-details",
      message: "Are these details correct?",
      trigger: "confirm-response",
    },
    {
      id: "confirm-response",
      options: [
        { value: "yes", label: "Yes", trigger: "submit-details" },
        { value: "no", label: "No", trigger: "end-chat" },
      ],
    },
    // End chat
    {
      id: "end-chat",
      message:
        "Thank you for using our service! Please wait while we are preparing your order Information!!",
      end: true,
    },
    // Steps for 'Something Else' option
    {
      id: "submit-details",
      message:
        "Submitting your details... Please Wait while we prepare order information...",
      trigger: ({ steps }) => {
        submitDetails(steps);
        return "submission-complete";
      },
    },
    {
      id: "submission-complete",
      message: "Your details have been submitted!",
      end: true,
    },
    {
      id: "handleElse",
      message: "This feature is under construction.",
      end: true,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        key={chatKey}
        steps={steps}
        headerTitle="HOBSBOT"
        {...config}
        handleEnd={handleEnd}
        recognitionEnable={true}
        // speechSynthesis={{ enable: true, lang: "en" }}
      />
    </ThemeProvider>
  );
};

export default ChatBotComponent;
