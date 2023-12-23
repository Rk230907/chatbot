import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot from "react-simple-chatbot";
import TestComponent from "./TestComponent";

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountId: "",
      customerId: "",
      subscriberId: "",
      orderId: "",
      productName: "",
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    this.setState({
      accountId: steps["account-id"]?.value || "Not provided",
      customerId: steps["customer-id"]?.value || "Not provided",
      subscriberId: steps["subscriber-id"]?.value || "Not provided",
      orderId: steps["order-id"]?.value || "Not provided",
      productName: steps["product-name"]?.value || "Not provided",
    });
  }

  render() {
    const {
      accountId,
      customerId,
      subscriberId,
      orderId,
      productName,
    } = this.state;
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
  }
}

Review.propTypes = {
  steps: PropTypes.object,
};

Review.defaultProps = {
  steps: undefined,
};

class ChatBotComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatKey: 0,
      apiResponse: null, // State to store API response
      displayTestComponent: false, // State to control display of TestComponent
    };
  }
  submitDetails = async (steps) => {
    const payload = {
      serviceType: "test", // Hardcoded value
      accountId: steps["account-id"]?.value || "",
      customerId: steps["customer-id"]?.value || "",
      orderId: steps["order-id"]?.value || "",
      subscriberId: steps["subscriber-id"]?.value || "", 
      productName: steps["product-name"]?.value || "",
    };

    // Replace this with your actual fetch API call
    console.log("Sending payload:", payload);

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
      return data;
    } catch (error) {
      console.error("API call failed:", error);
      return null;
    }
  };

  handleEnd = ({ steps, values }) => {
    if (values[values.length - 1] === "yes") {
      this.submitDetails(steps).then((response) => {
        this.setState({ apiResponse: response, displayTestComponent: true });
      });
    } else {
      this.setState((prevState) => ({ chatKey: prevState.chatKey + 1 }));
    }
  };

  render() {
    if (this.state.displayTestComponent) {
      return <TestComponent apiResponse={this.state.apiResponse} />;
    }
    return (
      <ChatBot
        key={this.state.chatKey}
        ref={(ref) => {
          this.chatbotRef = ref;
        }}
        steps={[
          {
            id: "welcome",
            message: "Hello there! What do you want me to do?",
            trigger: "options",
          },
          {
            id: "options",
            options: [
              { value: "orderInfo", label: "Order Information", trigger: "1" },
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
              { value: "no", label: "No", trigger: "ask-customer-id-question" },
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
              { value: "yes", label: "Yes", trigger: "end-chat" },
              { value: "no", label: "No", trigger: "end-chat" },
            ],
          },
          // End chat
          {
            id: "end-chat",
            message: "Thank you for using our service!",
            end: true,
          },
          // Steps for 'Something Else' option
          {
            id: "handleElse",
            message: "This feature is under construction.",
            end: true,
          },
        ]}
        handleEnd={this.handleEnd}
      />
    );
  }
}

export default ChatBotComponent;
