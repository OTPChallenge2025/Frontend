import React from "react";

class ErrorPage extends React.Component {
  render() {
    return (
      <div
        style={{
          color: "red",
          textAlign: "center",
          marginTop: "20%",
          fontSize: "3vmax",
        }}
      >
        Page not found!
      </div>
    );
  }
}

export default ErrorPage;
