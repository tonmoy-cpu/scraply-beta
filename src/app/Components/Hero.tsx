"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import hero from "../../assets/hero-banner.png";
import { IonIcon } from "@ionic/react";
import { play } from "ionicons/icons";
import animationData from "../../assets/animation.json";
import Lottie from "lottie-react";
import axios from "axios";
import logo from "../../assets/gemini-color.png";

const solutions = [
  "Recycling Solution",
  "Disposible Solution",
  "Facility Locator",
];

const solutionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Error Boundary Component
class ChatErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600 p-3">Error in chatbox. Please refresh.</div>;
    }
    return this.props.children;
  }
}

const HeroSection: React.FC = () => {
  const [currentSolution, setCurrentSolution] = useState(solutions[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Cycle through solutions
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = solutions.indexOf(currentSolution);
      const nextIndex = (currentIndex + 1) % solutions.length;
      setCurrentSolution(solutions[nextIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSolution]);

  // Close chatbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!userInput.trim()) {
      return;
    }

    const newMessage: ChatMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: userInput,
      });
      
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.data.reply || "Sorry, I couldn't generate a response.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "Sorry, something went wrong. Try again later.";
      
      if (error.response?.status === 404) {
        errorMessage = "Chat service unavailable. Please check if the backend server is running.";
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <section className="section hero" id="home" aria-label="hero">
      <div className="container mx-auto px-4">
        <div className="hero-content text-center">
          <h1 className="h1 hero-title text-center md:text-start font-bold mb-6">
            Your technology partner for Innovative and Impactful
            <br />
            <motion.span
              className="text-go-green pt-2"
              variants={solutionVariants}
              initial="initial"
              animate="animate"
              key={currentSolution}
            >
              E-Waste {""}
              {currentSolution}
            </motion.span>
          </h1>

          <p className="text-black mb-8 text-center md:text-start">
            Scraply: Transforming E-Waste Management. Find E-waste facilities effortlessly
            with our platform. Your key to responsible recycling and sustainability.
          </p>

          <div className="flex flex-row md:flex-row items-center justify-center md:justify-start sm:space-y-0 md:space-x-4 mb-10">
            <Link href="/recycle" className="btn btn-primary mr-4">
              Start Recycling
            </Link>
            <Link href="/price-prediction" className="btn btn-secondary mr-4">
              Predict Price
            </Link>
            <Link href="/e-facilities" className="btn btn-primary mr-4">
              Locate Facility
            </Link>
            <Link href="#" className="flex items-center text-primary">
              <div className="btn-icon mr-2">
                <IonIcon
                  icon={play}
                  aria-hidden="true"
                  role="img"
                  className="md hydrated"
                />
              </div>
              <span className="font-semibold ml-4">How it works</span>
            </Link>
          </div>
        </div>

        <div className="hero-banner has-before img-holder mx-auto mb-16">
          <Lottie animationData={animationData} />
        </div>

        {/* Chat with Gemini Button */}
        <button
          className="aiChat fixed bottom-10 right-7 bg-go-green text-white rounded-full p-4 shadow-md cursor-pointer z-50 hover:bg-cyan-400 transition-colors"
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Open chat with Gemini"
        >
          <Image
            src={logo}
            alt="Chat with Gemini"
            width={50}
            height={50}
            className="w-10 h-10"
            unoptimized
          />
        </button>

        {/* Chatbox Dropdown */}
        {isChatOpen && (
          <ChatErrorBoundary>
            <motion.div
              ref={chatBoxRef}
              className="fixed bottom-60 right-5 w-[90vw] max-w-[400px] sm:w-[400px] bg-white rounded-xl shadow-lg z-50 flex flex-col max-h-[70vh] sm:max-h-[500px]"
              style={{ border: "2px solid var(--go-green)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              aria-label="Chat with Gemini dialog"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-go-green to-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Image
                    src={logo}
                    alt="Gemini logo"
                    width={40}
                    height={40}
                    className="w-8 h-8"
                    unoptimized
                  />
                  <h3 className="text-sm font-semibold">Chat with Gemini</h3>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-black hover:text-gray-200 text-lg"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 rounded-lg">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">Start chatting...</p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-3 p-3 rounded-lg text-sm max-w-[85%] shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-white text-gray-800 border border-gray-200 mr-auto"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="text-gray-500 text-sm text-center">Typing...</div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask something..."
                    className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-go-green disabled:opacity-50"
                    disabled={isLoading}
                    aria-label="Chat input"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-700 text-white p-2 rounded-lg text-sm font-semibold hover:bg-blue-300 disabled:opacity-50 transition-colors"
                    disabled={isLoading}
                    aria-label="Send message"
                  >
                    Send
                  </button>
                </div>
              </div>
            </motion.div>
          </ChatErrorBoundary>
        )}
      </div>
    </section>
  );
};

export default HeroSection;