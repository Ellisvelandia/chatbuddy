import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const supriseOptions = [
    "What are your thoughts on artificial intelligence and its impact on society?",
    "How do you think we can address climate change effectively?",
    "What do you consider to be the most pressing global challenges today?",
    "How can we improve education systems worldwide?",
    "What role should technology play in healthcare?",
  ];

  const suprise = () => {
    const random = Math.floor(Math.random() * supriseOptions.length);
    setValue(supriseOptions[random]);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Please enter a question");
      return;
    }

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
      };

      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setChatHistory([
        ...chatHistory,
        { role: "user", parts: value },
        { role: "model", parts: data },
      ]);
      setValue("");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
      <div className="max-w-3xl mx-auto p-4 sm:py-8 sm:px-6">
        <section
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-violet-100"
          aria-label="Chat interface"
        >
          {/* Header */}
          <div className="border-b border-violet-100 p-3 sm:p-4">
            <p className="text-lg sm:text-xl font-medium text-violet-900 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <span>What do you want to know?</span>
              <button
                className="px-4 py-2 text-sm bg-violet-50 hover:bg-violet-100 active:bg-violet-200 
                  rounded-md transition-colors font-medium text-violet-700 
                  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                  w-full sm:w-auto"
                aria-label="Get random question"
                onClick={suprise}
                disabled={!chatHistory}
              >
                Surprise me
              </button>
            </p>
          </div>

          {/* Input area */}
          <div className="p-3 sm:p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={value}
                placeholder="Ask me anything..."
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 px-4 py-2 border border-violet-200 rounded-md 
                  text-violet-900 placeholder-violet-400
                  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                  shadow-sm bg-white/50 backdrop-blur-sm"
                aria-label="Your question"
              />
              {!error && (
                <button
                  className="px-6 py-2 bg-violet-600 text-white rounded-md 
                    hover:bg-violet-700 active:bg-violet-800 
                    transition-colors font-medium shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                    w-full sm:w-auto"
                  aria-label="Submit question"
                  onClick={getResponse}
                >
                  Ask
                </button>
              )}
              {error && (
                <button
                  className="px-6 py-2 bg-pink-600 text-white rounded-md 
                    hover:bg-pink-700 active:bg-pink-800 
                    transition-colors font-medium shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
                    w-full sm:w-auto"
                  aria-label="Clear error and input"
                  onClick={clear}
                >
                  Clear
                </button>
              )}
            </div>

            {error && (
              <p className="text-pink-600 text-sm font-medium" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Answer area */}
          <div className="border-t border-violet-100 bg-violet-50/50 p-3 sm:p-4 min-h-[200px] rounded-b-xl">
            {chatHistory.map((chatItem, index) => (
              <div
                className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-violet-100"
                aria-label="Answer section"
                key={index}
              >
                <p className="text-violet-800">
                  {chatItem.role} : {chatItem.parts}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
