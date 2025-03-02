import React from "react";
import Button from "react-bootstrap/Button";
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from "reactstrap";
import { withRouter } from "react-router-dom";
import validate from "./validators/home-validators";
import * as API_HOME_LOGIN from "../api/home-api";

class HomeForm_Login extends React.Component {
  constructor(props) {
    super(props);

    this.toggleForm = this.toggleForm.bind(this);
    this.reloadHandler = this.props.reloadHandler;
    this.loginWithOTP = this.loginWithOTP.bind(this);
    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);

    this.state = {
      loginWithOTP: {
        encryptedOTP: "",
      },
      loginPressed: false,
      formIsValid: false,
      formControls: {
        password: {
          value: "",
          placeholder: "OTP Must be 12 characters, all uppercase letters.",
          valid: false,
          touched: false,
          validationRules: {
            isRequired: true,
            passwordValidator: true,
          },
        },
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Encryption and Decryption:
  encrypt(text, key) {
    var crypto = require("crypto");
    var alg = "des-ede-cbc";

    var buf = Buffer.from(key, "utf-8");
    var iv = Buffer.from("QUJDREVGR0g=", "base64");

    var cipher = crypto.createCipheriv(alg, key, iv);
    var encoded = cipher.update(text, "ascii", "base64");
    encoded += cipher.final("base64");

    return encoded;
  }

  decrypt(encryptedText, key) {
    var crypto = require("crypto");
    var alg = "des-ede-cbc";

    var key = Buffer.from(key, "utf-8");
    var iv = Buffer.from("QUJDREVGR0g=", "base64");

    var encrypted = new Buffer.from(encryptedText, "base64");
    var decipher = crypto.createDecipheriv(alg, key, iv);
    var decoded = decipher.update(encrypted, "binary", "ascii");
    decoded += decipher.final("ascii");

    return decoded;
  }

  toggleForm() {
    this.setState({ collapseForm: !this.state.collapseForm });
  }

  handleChange = (event) => {
    if (this.state.loginPressed == true) {
      this.state.loginPressed = false;
    }

    const name = event.target.name;
    const value = event.target.value;
    const updatedControls = this.state.formControls;
    const updatedFormElement = updatedControls[name];

    updatedFormElement.value = value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = validate(
      value,
      updatedFormElement.validationRules
    );
    updatedControls[name] = updatedFormElement;

    let formIsValid = true;
    for (let updatedFormElementName in updatedControls) {
      formIsValid =
        updatedControls[updatedFormElementName].valid && formIsValid;
    }

    this.setState({
      formControls: updatedControls,
      formIsValid: formIsValid,
    });
  };

  handleSubmit() {
    //The logged in was pressed:
    this.state.loginPressed = true;

    let loginWithOTP = {
      decryptedOTP: this.state.formControls.password.value,
      encryptedOTP: "",
    };

    //Encrypt data:
    loginWithOTP.encryptedOTP = this.encrypt(
      loginWithOTP.decryptedOTP,
      localStorage.getItem("secretKey")
    );

    this.loginWithOTP(loginWithOTP);
  }

  loginWithOTP(loginWithOTP) {
    return API_HOME_LOGIN.loginWithOTP(
      loginWithOTP.encryptedOTP,
      (result, status) => {
        if (
          result !== "OTP is incorrect." &&
          (status === 200 || status === 201)
        ) {
          this.reloadHandler();

          //Logged in:
          localStorage.setItem("loggedIn", true);

          //If logged in, erase data for OTP:
          localStorage.setItem("decryptedOTP", "| - - - - - - - - - - - - |");
          localStorage.setItem("encryptedOTP", "| - - - - - - - - - - - - |");
        }
      }
    );
  }

  render() {
    return (
      <div>
        {/*Password form:*/}
        <FormGroup
          id="password"
          style={{
            backgroundColor: "#a2c9f0",
            padding: "2%",
            borderRadius: "30px",
          }}
        >
          <Label
            for="passwordField"
            style={{ fontStyle: "italic", fontSize: "large" }}
          >
            <div>OTP:</div>
          </Label>
          <Input
            type="password"
            name="password"
            id="passwordField"
            placeholder={this.state.formControls.password.placeholder}
            onChange={this.handleChange}
            defaultValue={this.state.formControls.password.value}
            touched={this.state.formControls.password.touched ? 1 : 0}
            valid={this.state.formControls.password.valid}
            required
          />
          {this.state.formControls.password.touched &&
            !this.state.formControls.password.valid && (
              <div
                style={{ marginLeft: "3%", marginTop: "3%" }}
                className={"error-message"}
              >
                * OTP must have a valid format
              </div>
            )}
          {this.state.formControls.password.touched &&
            this.state.formControls.password.value.length == 12 &&
            this.state.loginPressed && (
              <div
                style={{ marginLeft: "3%", marginTop: "3%" }}
                className={"error-message"}
              >
                * The OTP is not correct
              </div>
            )}
        </FormGroup>

        <Row>
          <Col sm={{ size: "8", offset: 5 }}>
            <Button
              type={"submit"}
              disabled={!this.state.formIsValid}
              onClick={() => this.handleSubmit()}
              style={{ backgroundColor: "#2a2a2a", borderRadius: "30px" }}
            >
              Confirm Login
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(HomeForm_Login);
