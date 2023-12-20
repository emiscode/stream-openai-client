"use client";
import fetchData from "@/utils/fetchData";
import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  const [_render, setRender] = useState(0);
  const dataRef = useRef("");

  const callFetchData = useCallback(async () => {
    const api = "http://localhost:3001/stream";
    console.log("api", api);
    await fetchData(api, false, dataRef, setRender);
  }, []);

  useEffect(() => {
    callFetchData();
  }, [callFetchData]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>{dataRef.current}</div>
    </main>
  );
}
