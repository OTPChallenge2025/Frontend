import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

//Endpoints:
const endpoint = {
  default: "/otpmanager",
};

//Post for login with OTP: http://localhost:5210/otpmanager/loginWithOTP:
function loginWithOTP(encryptedOTP, callback) {
  let request = new Request(
    HOST.backend_api + endpoint.default + "/loginWithOTP",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedOTP),
    }
  );

  RestApiClient.performRequest(request, callback);
}

// Sending current time for backend to know:
function sendCurrentTime(currentTime, callback) {
  let request = new Request(
    HOST.backend_api + endpoint.default + "/GetCurrentTime",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentTime),
    }
  );

  RestApiClient.performRequest(request, callback);
}

//Get for generating OTP: http://localhost:5210/otpmanager/generateOTP:
function generateOTP(callback) {
  let request = new Request(
    HOST.backend_api + endpoint.default + "/generateOTP",
    {
      method: "GET",
    }
  );

  RestApiClient.performRequest(request, callback);
}

export { loginWithOTP, generateOTP, sendCurrentTime };
