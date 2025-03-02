"use client";

import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import InputForm from "@/components/inputForm";
import Messages from "@/components/messages";
import { Message, useChat } from "ai/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");  // Final text message
  const [interimText, setInterimText] = useState("");  // Live transcription text
  const { isLoading, stop } = useChat({ api: "api/ai" });

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web Speech API is not supported");
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;  // Keep listening even if user pauses
    recognitionRef.current.interimResults = true;  // Show live results as speaking

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = inputMessage; // Start with the current message

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();  // Trim spaces around results
        if (event.results[i].isFinal) {
          // If the message doesn't end with a space, add one
          if (finalTranscript && !finalTranscript.endsWith(" ")) {
            finalTranscript += " ";
          }
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;  // Show interim (live) text
        }
      }

      setInputMessage(finalTranscript);
      setInterimText(interimTranscript);  // Show live transcription text
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);  // Set state to not listening when the recognition ends
    };

    return () => {
      recognitionRef.current?.abort(); // Clean up on component unmount
    };
  }, [inputMessage]);

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessage: Message = {
      id: `${Date.now()}`,
      content: inputMessage,
      role: "user",
    };

    addMessage(newMessage);
    setInputMessage("");
    setInterimText("");

    const isCommandRequest = /^(add account|create account|create new account|add new account|add category|create category|add new category|create new category)/i.test(inputMessage);
    const requestBody = isCommandRequest 
      ? { text: inputMessage }
      : { messages: [...messages, newMessage] };

    const endpoint = isCommandRequest ? "/api/ai/parse" : "/api/ai";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Server Response:", data); // Debugging line
        const assistantMessage: Message = {
          role: "assistant",
          content: isCommandRequest 
            ? `Processed Command: ${JSON.stringify(data)}` // Adjust based on actual response
            : data.text,
          id: `${Date.now() + 1}`,
        };

        addMessage(assistantMessage);
      } else {
        const errorData = await response.json();
        console.error("Failed to process message:", errorData.error);
        const errorMessage: Message = {
          role: "assistant",
          content: "Error processing your command. Please try again.",
          id: `${Date.now() + 2}`,
        };
        addMessage(errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "A network error occurred. Please check your connection and try again.",
        id: `${Date.now() + 3}`,
      };
      addMessage(errorMessage);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 m-4 w-80 bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="text-left font-bold text-lg">SmartFin AI Chatbot</div>
        <button onClick={onClose} className="text-red-500">
          X
        </button>
      </div>
      <div className="overflow-y-auto h-64 mt-2">
        <Messages messages={messages} isLoading={isLoading} />
      </div>
      <InputForm
        input={inputMessage + interimText}  // Display final and interim text together
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        addMessage={addMessage}
      />
      <button
        onClick={isListening ? stopListening : startListening}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center"
      >
        <FontAwesomeIcon icon={isListening ? faMicrophoneSlash : faMicrophone} className="mr-2" />
      </button>
    </div>
  );
};

export default AIPanel;
