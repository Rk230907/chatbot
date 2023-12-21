import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import PropTypes from "prop-types";

const ReviewComponent = ({ steps }) => {
  return (
    <div style={{ width: "100%" }}>
      <h3>Summary</h3>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{steps.name.value}</td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>{steps.gender.value}</td>
          </tr>
          <tr>
            <td>Age</td>
            <td>{steps.age.value}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ReviewComponent.propTypes = {
  steps: PropTypes.object,
};

const SimpleForm = () => {
  const [key, setKey] = useState(Math.random()); // Unique key for ChatBot instance

  const steps = [
    {
      id: "1",
      message: "What is your name?",
      trigger: "name",
    },
    {
      id: "name",
      user: true,
      trigger: "3",
    },
    {
      id: "3",
      message: "Hi {previousValue}! What is your gender?",
      trigger: "gender",
    },
    {
      id: "gender",
      options: [
        { value: "male", label: "Male", trigger: "5" },
        { value: "female", label: "Female", trigger: "5" },
      ],
    },
    {
      id: "5",
      message: "How old are you?",
      trigger: "age",
    },
    {
      id: "age",
      user: true,
      trigger: "7",
      validator: (value) => {
        if (isNaN(value)) {
          return "value must be a number";
        } else if (value < 0) {
          return "value must be positive";
        } else if (value > 120) {
          return `${value}? Come on!`;
        }
        return true;
      },
    },
    {
      id: "7",
      message: "Great! Check out your summary",
      trigger: "review",
    },
    {
      id: "review",
      component: <ReviewComponent />,
      asMessage: true,
      trigger: "update",
    },
    {
      id: "update",
      message: "Would you like to update some field?",
      trigger: "update-question",
    },
    {
      id: "update-question",
      options: [
        { value: "yes", label: "Yes", trigger: "update-yes" },
        { value: "no", label: "No", trigger: "end-message" },
      ],
    },
    {
      id: "update-yes",
      message: "What field would you like to update?",
      trigger: "update-fields",
    },
    {
      id: "update-fields",
      options: [
        { value: "name", label: "Name", trigger: "update-name" },
        { value: "gender", label: "Gender", trigger: "update-gender" },
        { value: "age", label: "Age", trigger: "update-age" },
      ],
    },
    {
      id: "update-name",
      update: "name",
      trigger: "7",
    },
    {
      id: "update-gender",
      update: "gender",
      trigger: "7",
    },
    {
      id: "update-age",
      update: "age",
      trigger: "7",
    },
    {
      id: "end-message",
      message: "Thanks! Your data was submitted successfully!",
      end: true,
    },
  ];

  return <ChatBot steps={steps} key={key} />;
};

export default SimpleForm;
