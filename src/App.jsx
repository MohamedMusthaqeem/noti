import React, { useState } from "react";
import OTPInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ImSpinner9 } from "react-icons/im";
import { auth } from "./components/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
const App = () => {
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [user, setUser] = useState(null);
  const verifyCaptcha = () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              onSignup;
            },
            "expired-callback": () => {
              toast.error("unsuccessful");
            },
          }
        );
      }
    } catch (error) {
      console.error("Recaptcha initialization error: ", error);
      toast.error("Failed to initialize recaptcha. Please try again.");
    }
  };
  const onSignup = async () => {
    try {
      setLoading(true);
      verifyCaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = "+" + phone;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setLoading(false);
      setShowOtp(true);
      toast.success("OTP Successfully Sent");
    } catch (error) {
      console.error("Error during phone number sign-in: ", error);
      setLoading(false);
      toast.error("Failed to send OTP. Please try again.");
    }
  };
  const onOTPVerify = () => {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <section className="bg-sky-700 flex items-center justify-center h-screen">
      <div id="recaptcha-container"></div>
      <Toaster toastOptions={{ duration: 4000 }} />
      {user ? (
        <h1 className="text center leading-normal text-white font-medium text-3xl mb-6">
          RESET PASSWORD PAGE
        </h1>
      ) : (
        <div>
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text center leading-normal text-white font-medium text-3xl mb-6">
              OTP VERIFICATION
            </h1>
            {showOtp ? (
              <>
                <label
                  htmlFor="ph"
                  className="font-bold text-white text-center "
                >
                  Enter Your OTP
                </label>
                <OTPInput
                  OTPLength={6}
                  autoFocus
                  value={otp}
                  onChange={setOtp}
                  otpType="number"
                  disabled={false}
                  className="opt-container "
                ></OTPInput>
                <button
                  className="bg-sky-400 w-full flex gap-1 items-center justify-center rounded-md p-3"
                  onClick={onOTPVerify}
                >
                  {loading && (
                    <ImSpinner9 size={15} className="animate-spin mx-1" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <label
                  htmlFor="ph"
                  className="font-bold text-white text-center "
                >
                  Enter Registered Mobile Number
                </label>
                <PhoneInput country={"in"} value={phone} onChange={setPhone} />
                <button
                  className="bg-sky-400 w-full flex gap-1 items-center justify-center rounded-md p-3"
                  onClick={onSignup}
                >
                  {loading && (
                    <ImSpinner9 size={15} className="animate-spin mx-1" />
                  )}
                  <span>Send Code via SMS</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default App;
