import * as React from "react";

export const EmailTemplate = ({ email, code }) => (
  <div>
    <h1>Welcome, {email}!</h1>
    <p>
      Your verification code is <strong>{code}</strong>.
    </p>
  </div>
);
