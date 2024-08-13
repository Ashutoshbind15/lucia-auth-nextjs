"use client";

import OtpHandler from "@/components/auth/OtpHandler";
import axios from "axios";
import { useState } from "react";

const MailVerificationPage = () => {
  const [otpValue, setOtpValue] = useState("");

  const otpSubmitHandler = async () => {
    try {
      console.log("otpSubmitHandler");
      console.log(otpValue);

      const { data } = await axios.post("/api/auth/email/verify", {
        code: otpValue,
      });

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>MailVerificationPage</h1>
      <OtpHandler
        value={otpValue}
        setValue={setOtpValue}
        onSubmit={otpSubmitHandler}
      />
    </>
  );
};

export default MailVerificationPage;
