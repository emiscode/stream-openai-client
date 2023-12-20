const fetchData = async (
  api: string,
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
      body: JSON.stringify({ stream }),
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

export default fetchData;