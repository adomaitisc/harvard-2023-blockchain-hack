"use client";

import Connex from "@vechain/connex";
import { useEffect, useState } from "react";

const connex = new Connex({
  node: "https://testnet.veblocks.net/",
  network: "test",
  signer: "sync2",
});
export function ConnectWallet() {
  const [address, setAddress] = useState("");

  //   function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  //     e.preventDefault();
  //     // get data from input
  //     const address = e.currentTarget.address.value;
  //     console.log(address);
  //     getAccountBalance(address);
  //   }

  //   async function getAccountBalance(address: string) {
  //     const acc = connex.thor.account(address);
  //     const accInfo = await acc.get();
  //     const decimalValue = parseInt(accInfo.balance, 16);
  //     console.log(decimalValue);
  //   }

  async function requestWallet() {
    connex.vendor
      .sign("cert", {
        purpose: "identification",
        payload: {
          type: "text",
          content: "Hello World!",
        },
      })
      .request()
      .then((tx) => {
        // SEND POST REQUEST TO SERVER
        setAddress(tx.annex.signer);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    // <form
    //   onSubmit={onSubmit}
    //   className="p-4 bg-neutral-400 flex flex-col gap-4"
    // >
    //   <label htmlFor="address" className="flex flex-col gap-2">
    //     <span className="text-neutral-900">Wallet address</span>
    //   </label>
    //   <input id="address" type="text" />
    //   <button type="submit">Connect</button>
    // </form>
    <>
      <button onClick={() => requestWallet()}>Connect Sync2 Wallet</button>
      <p>{address}</p>
    </>
  );
}

// 0x36075a001e7979d5119cf8f3e8c47a0c2f835010
// 0x36075a001e7979d5119CF8f3E8c47A0C2F835010
