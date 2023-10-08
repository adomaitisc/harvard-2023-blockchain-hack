"use client";
import Connex from "@vechain/connex";
import { useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";
import { signOut } from "next-auth/react";

const connex = new Connex({
  node: "https://testnet.veblocks.net/",
  network: "test",
  signer: "sync2",
});

export function Header({ session }: { session: any }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      const acc = connex.thor.account(session.user.email);
      const accInfo = await acc.get();
      setBalance(new BigNumber(accInfo.balance).dividedBy(1e18).toNumber());
    })();
  });

  return (
    <div className="w-full flex flex-col items-center gap-2 p-8 text-xs font-mono flex-1">
      {/* Account Number */}
      <div className="flex items-center gap-2">
        <p className="px-2 py-1 bg-white border border-zinc-200 rounded-full shadow-sm">
          {session.user.email}
        </p>
        <p
          onClick={() => signOut()}
          className="cursor-pointer bg-white border border-zinc-200 rounded-full px-2 py-1 font-medium hover:bg-red-400 duration-200 shadow-sm"
        >
          Sign Out
        </p>
      </div>
      {/* Balance */}
      <p className="px-2 py-1 bg-white border border-zinc-200 rounded-full text-violet-600 shadow-sm">
        Balance: {balance} VET
      </p>
    </div>
  );
}
