"use client";

import React, { useState } from "react";
import { X, Send } from "lucide-react";
import Image from "next/image";
import Select, { SingleValue } from "react-select";
import ReactCountryFlag from "react-country-flag";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";

import AnaImg from "../../../public/assets/anna.png";

interface Message {
  id: number;
  sender: "user" | "agent" | "system";
  text: string;
}

interface OptionType {
  value: string;
  label: React.JSX.Element;
}

const languageOptions: OptionType[] = [
  {
    value: "dn",
    label: (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode="DK"
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span>DN</span>
      </div>
    ),
  },
  {
    value: "de",
    label: (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode="DE"
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span>DE</span>
      </div>
    ),
  },
  {
    value: "fr",
    label: (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode="FR"
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span>FR</span>
      </div>
    ),
  },
  {
    value: "it",
    label: (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode="IT"
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span>IT</span>
      </div>
    ),
  },
  {
    value: "tr",
    label: (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode="TR"
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span>TR</span>
      </div>
    ),
  },
];

const ChatRoom: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "system",
      text: "We typically reply you under 30 minutes. Feel free to drop your questions",
    },
    {
      id: 2,
      sender: "agent",
      text: "Hello, Thanks for reaching out to Support! How can we help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedLang, setSelectedLang] = useState<OptionType | null>(
    languageOptions[0]
  );

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="w-[340px] h-[700px] bg-[#121428] text-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex flex-col border-b border-[#30334A] px-3 py-2 bg-[#121428]">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[#8C8FA8] text-black rounded-md p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold text-sm">Chat room</span>
              <Select
                className="w-[130px] text-xs"
                options={languageOptions}
                value={selectedLang}
                onChange={(val: SingleValue<OptionType>) => setSelectedLang(val)}
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#121428",
                    border: "1px solid #30334A",
                    minHeight: "28px",
                    height: "28px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: "28px",
                    padding: "0 6px",
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "28px",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#1E2135",
                    color: "white",
                  }),
                }}
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 text-sm">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col w-full">
                {msg.sender === "system" && (
                  <p className="text-gray-400 text-xs bg-[#26293E] p-2 rounded-md w-full text-center">
                    {msg.text}
                  </p>
                )}

                {(msg.sender === "agent" || msg.sender === "user") && (
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="rounded-full overflow-hidden">
                        {msg.sender === "agent" ? (
                          <Image
                            src={AnaImg}
                            alt="Agent"
                            width={24}
                            height={24}
                          />
                        ) : (
                          // removed default profile image — neutral placeholder
                          <div className="h-6 w-6 rounded-full bg-[#2A2D44]" />
                        )}
                      </div>
                      <span className="text-xs text-gray-300">
                        {msg.sender === "agent" ? "Anna" : "Adio Bustin"}
                      </span>
                    </div>

                    <div className="bg-[#26293E] px-3 py-2 rounded-lg w-full">
                      <p className="text-[13px] leading-snug">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center bg-[#121428] p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your message..."
              className="flex-1 px-3 py-2 bg-[#26293E] text-white text-sm rounded-md outline-none"
            />
            <button
              onClick={handleSend}
              className="ml-2 p-2 bg-[#099F86] rounded-md hover:opacity-90 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-[#3A3E57] text-white rounded-full shadow-lg hover:bg-[#4a4f6e] transition"
        >
          <BiSolidMessageRoundedAdd size={30} />
        </button>
      )}
    </div>
  );
};

export default ChatRoom;
