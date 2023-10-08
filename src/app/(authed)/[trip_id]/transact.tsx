"use client";

export function Transact({
  children,
  passenger,
  driver,
}: {
  children: React.ReactNode;
  passenger: number;
  driver: number;
}) {
  async function transact() {
    const res = await fetch("/api/confirm", {
      method: "POST",
      body: JSON.stringify({
        passenger,
        driver,
      }),
    });
    const data = await res.json();
    console.log(data);
  }

  return (
    <div onClick={() => transact()} className="w-full h-full">
      {children}
    </div>
  );
}
