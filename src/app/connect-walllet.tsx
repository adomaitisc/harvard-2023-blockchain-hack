"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Connex from "@vechain/connex";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const connex = new Connex({
  node: "https://testnet.veblocks.net/",
  network: "test",
  signer: "sync2",
});
export function ConnectWallet() {
  const [address, setAddress] = useState("");
  const [registering, setRegistering] = useState(false);

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
      .then(async (tx) => {
        setAddress(tx.annex.signer);
        const data = await signIn("credentials", {
          address: tx.annex.signer,
          redirect: false,
        });
        // @ts-ignore
        if (!data.ok) {
          setRegistering(true);
        }
      });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = e.currentTarget.fname.value;
    const address = e.currentTarget.address.value;

    const res = await fetch("/api/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, address }),
    });

    const body = await res.json();
    console.log(body);

    if (body.address) {
      await signIn("credentials", {
        address: body.address,
      });
    }
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
    <div className="absolute inset-0 flex flex-col justify-center bg-black/10 backdrop-blur-md">
      <div className=" bg-white h-96 rounded-3xl p-8 w-full flex flex-col max-w-xs items-center gap-6 mx-auto">
        {registering ? (
          <form onSubmit={onSubmit}>
            <h2 className="font-semibold text-xl text-center">
              Register your account
            </h2>
            <Input id="address" disabled value={address} />
            <Input id="fname" type="text" placeholder="Enter your name" />
            <Button>Start Earning</Button>
          </form>
        ) : (
          <>
            <h2 className="font-semibold text-xl text-center">
              Get where you need to
              <br />
              and earn for that
            </h2>
            <Image
              src="/media/location.svg"
              width={200}
              height={200}
              alt="location"
            />
            <Button onClick={() => requestWallet()}>
              Connect your Sync2 Wallet
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
