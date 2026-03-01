/**
 * Chat service — real-time messaging with Firestore mock
 */
import { MOCK_CHATS, MOCK_USERS } from "../mockData.js";

let mockChats = [...MOCK_CHATS.map(c => ({ ...c, messages: [...c.messages] }))];
const chatListeners = {};

export const chatService = {
  getOrCreateChat: async (userId1, userId2, listingId, listingTitle) => {
    await delay(200);
    let chat = mockChats.find(c =>
      c.participants.includes(userId1) && c.participants.includes(userId2) && c.listingId === listingId
    );
    if (!chat) {
      chat = {
        id: `chat_${Date.now()}`,
        participants: [userId1, userId2],
        listingId,
        listingTitle,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      mockChats.push(chat);
    }
    return chat;
  },

  sendMessage: async (chatId, senderId, text) => {
    await delay(100);
    const chat = mockChats.find(c => c.id === chatId);
    if (!chat) throw new Error("Chat not found");
    const msg = {
      id: `msg_${Date.now()}`,
      senderId,
      text,
      createdAt: new Date().toISOString(),
    };
    chat.messages.push(msg);
    // Notify listeners
    if (chatListeners[chatId]) {
      chatListeners[chatId].forEach(cb => cb([...chat.messages]));
    }
    return msg;
  },

  subscribeToMessages: (chatId, callback) => {
    if (!chatListeners[chatId]) chatListeners[chatId] = [];
    chatListeners[chatId].push(callback);
    // Initial load
    const chat = mockChats.find(c => c.id === chatId);
    setTimeout(() => callback(chat?.messages || []), 100);
    return () => {
      if (chatListeners[chatId]) {
        chatListeners[chatId] = chatListeners[chatId].filter(cb => cb !== callback);
      }
    };
  },

  getUserChats: async (userId) => {
    await delay(200);
    return mockChats.filter(c => c.participants.includes(userId));
  },
};

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
