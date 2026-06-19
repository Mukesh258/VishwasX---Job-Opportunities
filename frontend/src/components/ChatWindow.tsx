import { useState, useEffect, useRef } from "react";
import { Send, X, Phone, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { Conversation } from "@/lib/messaging";
import { sendMessage, markAllMessagesAsRead } from "@/lib/messaging";
import { getCurrentUser } from "@/lib/auth";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
  conversation: Conversation;
  onClose: () => void;
  onMessageSent?: () => void;
}

export default function ChatWindow({
  conversation,
  onClose,
  onMessageSent,
}: ChatWindowProps) {
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  // Mark messages as read when opening chat
  useEffect(() => {
    markAllMessagesAsRead(conversation.id);
  }, [conversation.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentUser) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      sendMessage(
        conversation.id,
        currentUser.email,
        currentUser.name,
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`,
        conversation.participantId,
        messageText
      );

      setMessageText("");
      onMessageSent?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-96 h-96 rounded-lg border border-border bg-card shadow-2xl flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3">
          <img
            src={conversation.participantAvatar}
            alt={conversation.participantName}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-foreground">{conversation.participantName}</h3>
            <p className="text-xs text-muted-foreground">{conversation.participantRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-muted-foreground text-sm">No messages yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start a conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {conversation.messages.map(message => (
              <MessageBubble
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                isOwn={message.senderId === currentUser?.email}
                read={message.read}
                senderName={!message.read && message.senderId !== currentUser?.email ? message.senderName : undefined}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 bg-muted/30">
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || isLoading}
            className="flex items-center justify-center h-10 w-10 rounded-lg gradient-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
