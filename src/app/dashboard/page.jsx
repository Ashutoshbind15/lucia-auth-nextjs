import { validateRequest } from "@/lib/auth/validator";
import { Account } from "@/models/Account";
import React from "react";

const DashboardPage = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  //   todo: add the email verified check here

  const userAccounts = await Account.find({
    user_id: user.id,
  });

  return (
    <>
      <h1>DashboardPage</h1>

      {userAccounts.map((account) => (
        <div key={account?.id}>
          <h2>{account?.provider}</h2>
          <p>{account?.email}</p>
          <p>
            {account?.isEmailVerified ? "Email verified" : "Email not verified"}
          </p>
        </div>
      ))}

      <div>
        <a href="/auth/providers/github">Link Github account</a>
      </div>

      <div>
        <a href="/auth/providers/linkedin">Link linkedIn account</a>
      </div>
    </>
  );
};

export default DashboardPage;
