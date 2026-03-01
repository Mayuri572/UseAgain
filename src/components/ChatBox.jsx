import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { chatService } from "../services/chatService.js";
import { HiOutlinePaperAirplane } from "react-icons/hi";

export default function ChatBox({ listingId, listingTitle, sellerId, sellerName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user || !sellerId || user.uid === sellerId) return;
    let unsub;
    (async () => {
      setLoading(true);
      const chat = await chatService.getOrCreateChat(user.uid, sellerId, listingId, listingTitle);
      setChatId(chat.id);
      unsub = chatService.subscribeToMessages(chat.id, setMessages);
      setLoading(false);
    })();
    return () => unsub?.();
  }, [user, sellerId, listingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatId || sending) return;
    setSending(true);
    try {
      await chatService.sendMessage(chatId, user.uid, input.trim());
      setInput("");
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-bg-neutral rounded-xl p-4 text-center text-sm text-gray-500">
        Sign in to chat with the seller
      </div>
    );
  }

  if (user.uid === sellerId) {
    return (
      <div className="bg-bg-neutral rounded-xl p-4 text-center text-sm text-gray-500">
        This is your listing
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-80">
      {/* Header */}
      <div className="bg-primary px-4 py-3 text-white">
        <p className="text-sm font-semibold">Chat with {sellerName}</p>
        <p className="text-xs text-accent opacity-80 truncate">{listingTitle}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-bg-neutral">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-8">Start the conversation!</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user.uid ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  msg.senderId === user.uid
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-white text-text-neutral rounded-bl-sm shadow-sm"
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-0.5 ${msg.senderId === user.uid ? "text-white/60" : "text-gray-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 p-2 bg-white border-t border-gray-100">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Message input"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-40 transition-colors"
          aria-label="Send message"
        >
          <HiOutlinePaperAirplane className="text-lg rotate-90" />
        </button>
      </form>
    </div>
  );
}
