import axios from "axios";

export const fetchData = async (
  api: string,
  prompt: string,
  stream: boolean,
  dataRef: React.MutableRefObject<string>,
  callback: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    console.log("fetching data...");
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stream, prompt }),
    });

    if (stream) {
      console.log("streaming...");
      const reader = Object(response).body.getReader();
      let chunks = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks += new TextDecoder("utf-8").decode(value);
        dataRef.current = chunks;
        callback(Date.now()); // trigger a re-render
      }
    } else {
      console.log("simulating streaming...");
      const data = await response.json();
      data.forEach((item: string, index: number) => {
        setTimeout(() => {
          dataRef.current += item;
          callback(Date.now()); // trigger a re-render
        }, index * 200);
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const fetchAudio = async (api: string) => {
  // Perform a POST request to /audio
  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get the base64 chunk from the response
  const arrayBuffer = await response.arrayBuffer();
  const base64Chunk = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  // Convert base64 to raw binary data
  const byteCharacters = atob(base64Chunk);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the byte array
  const blob = new Blob([byteArray], { type: "audio/mpeg" });

  // Create an Object URL from the Blob
  const url = URL.createObjectURL(blob);

  // Create an Audio object and play the audio
  const audio = new Audio(url);
  audio.play();
};
