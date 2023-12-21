"use client";

import { fetchData, fetchAudio, fetchDataAudio } from "@/utils/fetchData";
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";

export default function Home() {
  const [_render, setRender] = useState(0);
  const dataRef = useRef("");
  const [prompt, setPrompt] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [stream, setStream] = useState(false);
  const [withAudio, setWithAudio] = useState(false);

  const callFetchData = useCallback(async () => {
    const api = "http://localhost:3001/stream";
    await fetchData(api, prompt, stream, dataRef, setRender);
    setIsSubmit(false);
  }, [prompt, stream]);

  const callFetchDataAudio = useCallback(async () => {
    const api = "http://localhost:3001/stream-audio";
    await fetchDataAudio(api, prompt, stream, dataRef, setRender);
    setIsSubmit(false);
  }, [prompt, stream]);

  const callFetchAudio = useCallback(async () => {
    const api = "http://localhost:3001/audio";
    await fetchAudio(api);
    setIsSubmit(false);
  }, []);

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  const handleStreamChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStream(event.target.checked);
  };

  const handleWithAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWithAudio(event.target.checked);
  };

  const handleSubmit = (event: FormEvent) => {
    setIsSubmit(true);
    dataRef.current = "";
    event.preventDefault();

    if (withAudio) {
      console.log("with audio");
      callFetchDataAudio();
    } else {
      console.log("without audio");
      callFetchData();
    }
  };

  const handleAudio = (event: FormEvent) => {
    setIsSubmit(true);
    callFetchAudio();
  };

  return (
    <main className="flex flex-col items-center justify-between px-8 py-8 sm:px-24">
      <Image
        src="professor-finn.svg"
        alt="Professor Finn"
        width={500}
        height={300}
        className="max-w-[30%] sm:max-w-[10%]"
      />

      <h1 className="text-4xl sm:text-3xl font-bold mb-2 text-gray-600">
        Professor Finn
      </h1>
      <h2 className="text-xl sm:text-lg mb-12 text-teal-600">
        Your AI professor specialized in quantum mechanics and physics
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6">
          <label
            className="block text-gray-500 font-bold mb-1 pr-4"
            htmlFor="inline-prompt"
          >
            Prompt
          </label>
          <textarea
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-prompt"
            value={prompt}
            onChange={handlePromptChange}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              className="leading-tight h-6 w-6 mr-2"
              type="checkbox"
              id="inline-stream"
              checked={stream}
              onChange={handleStreamChange}
            />
            <label
              className="block text-gray-500 font-bold mr-2"
              htmlFor="inline-stream"
            >
              Real Time Stream
            </label>
            <input
              className="leading-tight h-6 w-6 mr-2 ml-4"
              type="checkbox"
              id="inline-with-audio"
              checked={withAudio}
              onChange={handleWithAudioChange}
            />
            <label
              className="block text-gray-500 font-bold mr-2"
              htmlFor="inline-with-audio"
            >
              With Audio
            </label>
          </div>
          <div>
            <button
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
            <button
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold ml-4 py-2 px-4 rounded"
              type="submit"
              onClick={handleAudio}
            >
              Audio Test
            </button>
          </div>
        </div>
      </form>
      {!dataRef.current && isSubmit && (
        <div className="flex justify-center items-center">
          <ClipLoader color={"#9139fd"} loading={true} size={50} />
        </div>
      )}
      {dataRef.current && (
        <div
          id="container-response"
          className="text-left w-full shadow-lg mt-12 p-8 text-gray-600 transition-all ease-in-out duration-900"
        >
          {dataRef.current}
        </div>
      )}
    </main>
  );
}
