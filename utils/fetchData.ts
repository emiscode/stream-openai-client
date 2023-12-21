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
  console.log("fetching audio...");
  // Perform a POST request to
  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get the base64 string from the response
  const base64String = await response.text();

  // Convert the base64 string to a data URL
  const audioSrc = "data:audio/mpeg;base64," + base64String;

  // Create an Audio object and play the audio
  const audio = new Audio(audioSrc);
  audio.play();
};

export const fetchDataAudio = async (
  api: string,
  prompt: string,
  stream: boolean,
  dataRef: React.MutableRefObject<string>,
  callback: React.Dispatch<React.SetStateAction<number>>
) => {
  console.log("fetching data audio...");

  // Perform a POST request to
  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  console.log("data", data);

  data.forEach((item: {}) => {
    if (Object(item).type === "text") {
      console.log("streaming text");

      Object(item).content.forEach((item: string, index: number) => {
        setTimeout(() => {
          dataRef.current += item;
          callback(Date.now()); // trigger a re-render
        }, index * 320);
      });
    } else {
      console.log("streaming audio...");
      // Get the base64 string from the response
      const base64String = Object(item).content;

      // Convert the base64 string to a data URL
      const audioSrc = "data:audio/mpeg;base64," + base64String;

      // Create an Audio object and play the audio
      const audio = new Audio(audioSrc);
      audio.play();
    }
  });
};
