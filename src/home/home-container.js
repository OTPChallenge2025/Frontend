import React, { useEffect, useRef } from "react";
import "./home-container.css";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import backgroundImg from "../commons/images/BackgroundOTP.jpg";
import HomeForm_Login from "./components/home-form_login";
import * as API_HOME from "./api/home-api";
import { useState } from "react";

export default function HomeContainer() {
  const [OTP, setOTP] = useState("| - - - - - - - - - - - - |");
  const [selectLogin, setSelectLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginOrLogoutPage, setLoginOrLogoutPage] = useState(<div></div>);

  //Timer:
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    return minutes + " : " + seconds;
  };

  // Set how many seconds untill new OTP:
  const [countdown, setCountdown] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const timerId = useRef();
  const [disableGenerateOTP, setDisableGenerateOTP] = useState(false);

  useEffect(() => {
    timerId.current = setInterval(() => {
      // Send every countdown:
      if (
        localStorage.getItem("encryptedOTP") === "| - - - - - - - - - - - - |"
      ) {
        // Reset timer:
        setCountdown(1);
      } else {
        sendCurrentTime(countdown);
      }

      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId.current);
  }, [countdown]);

  useEffect(() => {
    // Reload the page only if 0;
    if (countdown <= 0) {
      clearInterval(timerId.current);
      setDisableGenerateOTP(false);
      localStorage.setItem("encryptedOTP", "| - - - - - - - - - - - - |");
      localStorage.setItem("decryptedOTP", "| - - - - - - - - - - - - |");
      sendCurrentTime(0);
    }
  }, [countdown]);

  // Enctyption and Dectyption:
  function encrypt(text, key) {
    var crypto = require("crypto");
    var alg = "des-ede-cbc";

    var buf = Buffer.from(key, "utf-8");
    var iv = Buffer.from("QUJDREVGR0g=", "base64");

    var cipher = crypto.createCipheriv(alg, key, iv);
    var encoded = cipher.update(text, "ascii", "base64");
    encoded += cipher.final("base64");

    return encoded;
  }

  function decrypt(encryptedText, key) {
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

  const handleGenerateOTP = () => {
    console.log("The OTP has been received.");
    generateOTP();
  };

  const generateOTP = () => {
    return API_HOME.generateOTP((result, status) => {
      //The OTP was received in encrypted form:
      if (result !== null && (status === 200 || status === 201)) {
        var secretKey = "rktlqtuixakparuo";
        localStorage.setItem("secretKey", secretKey);

        //Decrypt:
        var decryptedOTP = decrypt(result, secretKey);
        localStorage.setItem("decryptedOTP", decryptedOTP);

        //Save OTP both here and in local storage: (the encrypted in local storage)
        setOTP(decryptedOTP);
        localStorage.setItem("encryptedOTP", result);

        //Now I start the timer:
        setCountdown(seconds);
        setDisableGenerateOTP(true);
      }
    });
  };

  const sendCurrentTime = (countdown) => {
    return API_HOME.sendCurrentTime(countdown, (result, status) => {
      if (status === 200 || status === 201) {
        console.log(result);
      }
    });
  };

  const plusSeconds = () => {
    console.log(seconds);
    setSeconds((prevSeconds) => {
      if (prevSeconds < 100) {
        return prevSeconds + 1;
      }
      return prevSeconds;
    });
  };

  const minusSeconds = () => {
    setSeconds((prevSeconds) => {
      if (prevSeconds > 30) {
        return prevSeconds - 1;
      }
      return prevSeconds;
    });
  };

  const toggleFormLogin = () => {
    setSelectLogin(!selectLogin);
  };

  //Logout:
  const userLogout = () => {
    localStorage.setItem("loggedIn", false);
    setLoggedIn(false);

    //Erase OTP:
    setOTP("| - - - - - - - - - - - - |");
    localStorage.setItem("encryptedOTP", "| - - - - - - - - - - - - |");
    localStorage.setItem("decryptedOTP", "| - - - - - - - - - - - - |");
  };

  useEffect(() => {
    //Not logged in:
    if (
      localStorage.getItem("loggedIn") === "false" ||
      localStorage.getItem("loggedIn") === null
    ) {
      setLoginOrLogoutPage(
        <div className="home-loginPage">
          {/* Generate OTP: */}
          <div className="home-buttons">
            <Button
              className="home-generateOTPButton"
              type={"submit"}
              onClick={() => handleGenerateOTP()}
              disabled={disableGenerateOTP}
            >
              Generate OTP
            </Button>

            <Button
              className="home-loginButton"
              onClick={toggleFormLogin}
              disabled={!disableGenerateOTP}
            >
              {" "}
              Login
            </Button>
          </div>

          <div className="home-OTPGenerated">
            <div>OTP generated:</div>
            <div className="home-OTP">
              {localStorage.getItem("decryptedOTP")}
            </div>
          </div>

          <div className="home-OTPtimer">
            <div>Current OTP time (from 30s to 100s): {seconds}s</div>
            <div style={{ display: "flex" }}>
              <div>Change time here:</div>
              <Button
                className="home-plusAndMinus"
                onClick={plusSeconds}
                disabled={disableGenerateOTP}
              >
                +
              </Button>
              <Button
                className="home-plusAndMinus"
                onClick={minusSeconds}
                disabled={disableGenerateOTP}
              >
                -
              </Button>
            </div>
            <div>Timer (until OTP resets):</div>
            <div>{formatTime(countdown)}</div>
          </div>
        </div>
      );
    } else {
      //Logged in:
      setLoginOrLogoutPage(
        <div className="home-logoutPage">
          <div className="home-logoutP">Welcome to your account!</div>

          <Button className="home-logoutButton" onClick={() => userLogout()}>
            Logout
          </Button>
        </div>
      );
    }
  }, [loggedIn, OTP, countdown, disableGenerateOTP, seconds]);

  return (
    <div className="home">
      {/*Title:*/}
      <div className="home-title">BTCodeCrafters - OTP Generation</div>

      <img
        style={{
          position: "absolute",
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100vh",
          opacity: "0.7",
          zIndex: "-1",
        }}
      ></img>

      {/* Component based on if you are logged in or not: */}
      {loginOrLogoutPage}

      {/* For the login modal: */}
      <Modal isOpen={selectLogin} toggle={toggleFormLogin} size="lg">
        <ModalHeader className="home-modalHeader" toggle={toggleFormLogin}>
          <div>Login:</div>
        </ModalHeader>

        <ModalBody className="home-modalBody">
          <HomeForm_Login reloadHandler={() => toggleFormLogin()} />
        </ModalBody>
      </Modal>
    </div>
  );
}
