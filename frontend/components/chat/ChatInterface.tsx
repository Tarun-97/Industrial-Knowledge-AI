"use client";

import { useState } from "react";
import { askQuestion } from "@/services/chat";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export default function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await askQuestion(userQuestion);

      const answer = Array.isArray(response.answer)
        ? response.answer
            .filter((item: any) => item.type === "text")
            .map((item: any) => item.text)
            .join("\n")
        : typeof response.answer === "string"
          ? response.answer
          : response.answer?.text ||
            String(response.answer);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          sources: response.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while processing your question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-[700px] flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold">
            AI Copilot
          </h2>

          <p className="text-sm text-slate-500">
            Ask questions about your industrial documents
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mb-4 text-5xl">
                🤖
              </div>

              <h3 className="text-lg font-semibold">
                Welcome to your Industrial Knowledge Copilot
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Upload a document and ask questions about its contents.
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[80%]"
                  : "max-w-[85%]"
              }
            >
              <div className="mb-1 text-xs font-medium text-slate-500">
                {message.role === "user"
                  ? "You"
                  : "AI Copilot"}
              </div>

              <div
                className={
                  message.role === "user"
                    ? "rounded-2xl rounded-br-md bg-slate-900 px-4 py-3 text-white"
                    : "rounded-2xl rounded-bl-md border bg-slate-50 px-4 py-3 text-slate-800"
                }
              >
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {message.content}
                </p>
              </div>

              {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="mt-2 text-xs text-slate-500">
                    <p className="mb-1 font-medium">
                      Sources
                    </p>

                    {message.sources.map(
                      (source, sourceIndex) => (
                        <div key={sourceIndex}>
                          📄 {source}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div>
              <div className="mb-1 text-xs font-medium text-slate-500">
                AI Copilot
              </div>

              <div className="rounded-2xl rounded-bl-md border bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Thinking</span>

                  <span className="animate-pulse">
                    ...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-3">
          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
            placeholder="Ask a question about your documents..."
            className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />

          <button
            onClick={handleAsk}
            disabled={
              !question.trim() || loading
            }
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}