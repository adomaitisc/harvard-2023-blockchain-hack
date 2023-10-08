"use client";
import Connex from "@vechain/connex";
import { useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";

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
    <div className="w-full flex flex-col items-center gap-2 p-8 text-xs font-mono">
      {/* Account Number */}
      <p className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-full">
        {session.user.email}
      </p>
      {/* Balance */}
      <p className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-full text-violet-600">
        Balance: {balance} VET
      </p>
    </div>
  );
}
