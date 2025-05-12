import { useEffect, useState } from "react";
import axios from "axios";
import { formatAIResponse } from "../lib/formatAIResponse";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Wand } from "lucide-react";

const AskAI = ({ prompt }) => {
  const [question, setQuestion] = useState(prompt || "");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (prompt) setQuestion(prompt);
  }, [prompt]);

  // const handleAskAI = async () => {
  //   if (!question.trim()) return;

  //   setLoading(true);
  //   setError("");
  //   setResponse("");

  //   try {
  //     const res = await axios.post(
  //       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB6pyzDTkX1WHUjaA7to_NsrDavsrxESNk",
  //       {
  //         contents: [
  //           {
  //             parts: [{ text: question }],
  //           },
  //         ],
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const text =
  //       res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  //     setResponse(text);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to get AI response. Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAskAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are an assistant that helps users with reporting and handling issues related to waterlogging, drainage problems, floods, and stormwater. 
Only answer questions related to these topics. If the question is unrelated, politely say that you can only help with flood-related and drainage issues.\n\nQuestion: ${question}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const text =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      setResponse(text);
    } catch (err) {
      console.error(err);
      setError("Failed to get AI response. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="z-10 relative bg-black text-white border p-6 rounded-xl max-w-3xl mx-auto shadow-2xl">
      <h3 className="text-xl font-semibold mb-4">
        <Wand className=" text-amber-400 h-6 w-6 inline-block mr-2" /> Ask AI
      </h3>
      <Textarea
        className="w-full p-3 border rounded-md bg-gray-900 border-gray-700"
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question here..."
      ></Textarea>
      <Button
        variant="outline"
        onClick={handleAskAI}
        className="mt-4 w-full py-3 font-medium rounded-md transition-colors max-w-xs mx-auto"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </Button>

      {response && (
        <div className="mt-6 p-4 rounded-md shadow-inner">
          <div className=" whitespace-pre-wrap">
            {formatAIResponse(response)}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 font-semibold">
          <p>{error}</p>
        </div>
      )}
    </Card>
  );
};

export default AskAI;
