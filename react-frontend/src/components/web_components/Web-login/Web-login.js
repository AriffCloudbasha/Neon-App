import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { useNavigate, useLocation } from "react-router-dom";
import client from "../../../services/restClient";
import { codeGen } from "../../../utils/codegen";
import { emailRegex } from "../../../utils/regex";

const LoginPage1 = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [maskPassword, setMaskPassword] = useState(true);
  const [showForgotPassword, setForgotPassword] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [isEmail, setEmailOrStaffId] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const projectDomain = process.env.REACT_APP_PROJECT_DOMAIN;

  useEffect(() => {
    if (!sessionChecked) {
      const params = new URLSearchParams(location.search);
      if (params.get("sessionExpired") === "true") {
        props.alert({
          type: "error",
          message: "Your session has expired. Please login again.",
        });
        navigate(location.pathname, { replace: true });
      }
      setSessionChecked(true);
    }
  }, [sessionChecked, location.pathname, location.search, navigate]);

  const onEnter = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const getDeviceDetails = () => {
    const userAgent = navigator.userAgent;
    const browser = navigator.appName;
    const platform = navigator.platform;
    const ip = navigator.ip;

    return {
      device: platform,
      browser,
      userAgent,
      ip,
    };
  };

  const validate = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    if (isEmail && !emailRegex.test(email)) {
      setEmailError("Please Enter a valid Email address");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError(
        "Please enter a valid password. Must be at least 6 characters",
      );
      isValid = false;
    }

    return isValid;
  };

  const login = async () => {
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const loginEmail = isEmail ? email : `${email}@${projectDomain}`;
      const deviceDetails = getDeviceDetails();

      props
        .login({ email: loginEmail, password })
        .then(async (res) => {
          try {
            await props.verifyProfileOrCreate();
            await client.service("loginHistories").create({
              userId: res.user._id,
              ...deviceDetails,
              userAgent: navigator.userAgent,
              logoutTime: null,
            });
          } catch (historyError) {
            console.error("Failed to save login history:", historyError);
          }

          navigate("/Homepage");
          setLoading(false);
        })
        .catch((error) => {
          const message = error.message || "Invalid Login";

          if (message.includes("Account locked")) {
            props.alert({
              title: "Account Locked",
              type: "error",
              message,
            });
          } else if (message.includes("attempts remaining")) {
            props.alert({
              title: "Login Failed",
              type: "error",
              message,
            });
          } else {
            props.alert({
              title: "Login Failed",
              type: "error",
              message: "Invalid login credentials",
            });
          }

          setLoading(false);
        });
    } catch (error) {
      console.error("Error during login:", error);
      props.alert({
        title: "Error",
        type: "error",
        message: "An error occurred during login",
      });
      setLoading(false);
    }
  };

  const sendToForgotResetPage = async () => {
    setVerificationError("");

    if (!emailRegex.test(email)) {
      props.alert({
        title: "Invalid email",
        type: "error",
        message: "Please enter a valid email",
      });
      setVerificationError("user email not valid");
      return;
    }

    const userData = await client.service("users").find({ query: { email } });
    const userInviteData = await client
      .service("userInvites")
      .find({ query: { emailToInvite: email } });

    if (userData.data?.length === 0 && userInviteData.data?.length === 0) {
      props.alert({
        title: "Invalid email",
        type: "error",
        message: "Please enter a valid email",
      });
      setVerificationError("user email not found");
      return;
    }

    if (userData.data?.length > 0 && userData.data[0].isLoggedIn === false) {
      setVerificationError("user has not attempted to logged in");
      return;
    }

    setLoading(true);

    try {
      const userCPData = await client.service("userChangePassword").find({
        query: { userEmail: email, $sort: { createdAt: -1 }, $limit: 1 },
      });

      const userCP = userCPData?.data[0];

      if (!userCP) {
        const payload = {
          userEmail: email,
          server: window.location.href,
          environment: process.env.REACT_APP_ENV,
          code: codeGen(),
          status: false,
          sendEmailCounter: 0,
        };

        await client.service("userChangePassword").create(payload);
        props.alert({
          title: `Reset password email sent to ${email}.`,
          type: "warn",
          message: `Account ${email} verification (0) under process.`,
        });
        setIsSend(true);
      } else if (userCP.sendEmailCounter >= 3) {
        setVerificationError("too many tries, please contact admin");
      } else {
        const payload = {
          userEmail: email,
          server: window.location.href,
          environment: process.env.REACT_APP_ENV,
          code: codeGen(),
          status: false,
          sendEmailCounter: userCP.sendEmailCounter + 1,
        };

        await client.service("userChangePassword").patch(userCP._id, payload);
        setIsSend(true);
        props.alert({
          title: `Reset password email sent to ${email}.`,
          type: "warn",
          message: `Account ${email} verification (${payload.sendEmailCounter}) under process.`,
        });
      }
    } catch (error) {
      props.alert({
        title: "Error",
        type: "error",
        message: error.message || "Failed to send reset instructions",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = () => {
    props.alert({
      title: "Email resent",
      type: "success",
      message:
        "Successfully resend email. Please check your inbox or Junk/Span folder.",
    });
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen surface-ground p-4">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        {!isSend && (
          <>
            <div className="text-center mb-5">
              <img
                src="/lightning/android-chrome-192x192.png"
                alt="lightning"
                height={50}
                className="mb-3"
              />
              <div className="text-900 text-3xl font-medium mb-3">
                Welcome Back
              </div>
              <span className="text-600 font-medium line-height-3">
                Don&apos;t have an account?
              </span>
              <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                Create today!
              </a>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-900 font-medium mb-2"
              >
                {isEmail ? "Email" : "Staff Id"}
              </label>
              <InputText
                id="email"
                type="text"
                placeholder={isEmail ? "Email address" : "Staff Id"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classNames("w-full mb-1", {
                  "p-invalid": !!emailError,
                })}
                onKeyDown={onEnter}
              />
              <small className="p-error block mb-3">{emailError}</small>

              <label
                htmlFor="password"
                className="block text-900 font-medium mb-2"
              >
                Password
              </label>
              <span className="w-full p-input-icon-right">
                <i
                  className={`pi ${maskPassword ? "pi-eye" : "pi-eye-slash"} cursor-pointer`}
                  onMouseDown={() => setMaskPassword(false)}
                  onMouseUp={() => setMaskPassword(true)}
                  onMouseLeave={() => setMaskPassword(true)}
                  title={`${maskPassword ? "Show" : "Hide"} password`}
                />
                <InputText
                  id="password"
                  type={maskPassword ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={classNames("w-full mb-1", {
                    "p-invalid": !!passwordError,
                  })}
                  onKeyDown={onEnter}
                />
              </span>
              <small className="p-error block mb-3">{passwordError}</small>

              <div className="flex align-items-center justify-content-between mb-4">
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="rememberme"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.checked)}
                  />
                  <label htmlFor="rememberme">Remember me</label>
                </div>
                <a
                  className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot your password?
                </a>
              </div>

              {/* <div className="flex justify-content-between align-items-center mb-4">
                <a
                  className="font-medium no-underline text-blue-500 cursor-pointer"
                  onClick={() => setEmailOrStaffId((prev) => !prev)}
                >
                  Sign in with {isEmail ? "Staff Id" : "Email"}
                </a>
              </div> */}

              <Button
                label="Sign In"
                icon="pi pi-user"
                className="w-full"
                loading={loading}
                onClick={login}
              />
            </div>
          </>
        )}

        {isSend && (
          <div className="text-center">
            <div className="text-900 text-2xl font-medium mb-3">
              Check your email
            </div>
            <p className="text-600 mb-4">
              We&apos;ve sent reset instructions. Please check your inbox and
              spam folder.
            </p>
            <Button
              label="Back to login"
              className="w-full"
              onClick={() => {
                setForgotPassword(false);
                setIsSend(false);
              }}
            />
            <a
              className="font-medium no-underline text-blue-500 cursor-pointer block mt-3"
              onClick={resendEmail}
            >
              Resend email
            </a>
          </div>
        )}
      </div>

      <Dialog
        header="Forgot your password?"
        visible={showForgotPassword}
        style={{ width: "30rem" }}
        onHide={() => setForgotPassword(false)}
      >
        <div className="mb-3">
          <label
            htmlFor="forgot-email"
            className="block text-900 font-medium mb-2"
          >
            Email
          </label>
          <InputText
            id="forgot-email"
            className="w-full"
            type="text"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <small className="p-error block">{verificationError}</small>
        </div>
        <Button
          label="Send reset instructions"
          className="w-full"
          loading={loading}
          disabled={!email}
          onClick={sendToForgotResetPage}
        />
      </Dialog>
    </div>
  );
};

const mapState = (state) => {
  const { isLoggedIn } = state.auth;
  return { isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  login: (data) => dispatch.auth.login(data),
  alert: (data) => dispatch.toast.alert(data),
  verifyProfileOrCreate: (data) => dispatch.user.createProfileAfterLogin(data),
});

export default connect(mapState, mapDispatch)(LoginPage1);
