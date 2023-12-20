"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [streamData, setStreamData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/stream", {
        method: "POST",
      });
      const reader = Object(response).body.getReader();
      let chunks = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks += new TextDecoder("utf-8").decode(value);
        setStreamData(chunks);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* ...rest of your code... */}
      <div>{streamData}</div>
      {/* ...rest of your code... */}
    </main>
  );
}
