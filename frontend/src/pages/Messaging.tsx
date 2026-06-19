import { useState, useEffect } from "react";
import { MessageCircle, Plus, Send } from "lucide-react";
import { motion } from "framer-motion";
import type { Conversation } from "@/lib/messaging";
import { getConversations, getOrCreateConversation, sendMessage } from "@/lib/messaging";
import { getCurrentUser } from "@/lib/auth";
import { sampleMentors } from "@/lib/mockData";
import ConversationsList from "@/components/ConversationsList";
import { GirlIllustration1, GirlIllustration2 } from "@/components/BackgroundIllustrations";

const Messaging = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showMentorList, setShowMentorList] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setConversations(getConversations());
  }, [refreshKey]);

  // Poll for new messages every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = getConversations();
      setConversations(updated);
      
      // Update selected conversation if it has new messages
      if (selectedConversation) {
        const updatedConv = updated.find(c => c.id === selectedConversation.id);
        if (updatedConv && updatedConv.messages.length > selectedConversation.messages.length) {
          setSelectedConversation(updatedConv);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [selectedConversation]);

  const handleStartConversation = (mentorId: string) => {
    const mentor = sampleMentors.find(m => m.id === mentorId);
    if (!mentor) return;

    const conversation = getOrCreateConversation(
      mentorId,
      mentor.name,
      mentor.currentRole,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentorId}`
    );

    setConversations(getConversations());
    setSelectedConversation(conversation);
    setShowMentorList(false);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessageText("");
  };

  const handleDeleteConversation = () => {
    setConversations(getConversations());
    if (selectedConversation?.id === selectedConversation?.id) {
      setSelectedConversation(null);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const currentUser = getCurrentUser();

    if (!currentUser) {
      alert("Please sign in to send messages");
      return;
    }

    sendMessage(
      selectedConversation.id,
      currentUser.email,
      currentUser.name,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`,
      selectedConversation.participantId,
      messageText
    );

    setMessageText("");
    setRefreshKey(prev => prev + 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-0 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-3 pointer-events-none" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,0,0,.05) 25%, rgba(255,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(255,0,0,.05) 75%, rgba(255,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,0,0,.05) 25%, rgba(255,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(255,0,0,.05) 75%, rgba(255,0,0,.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }}></div>

      {/* Girl illustrations */}
      <div className="absolute -left-32 top-40 w-64 h-80">
        <GirlIllustration1 />
      </div>
      <div className="absolute -right-32 bottom-40 w-64 h-80">
        <GirlIllustration2 />
      </div>

      <div className="mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">Messages</h1>
            </div>
            <button
              onClick={() => setShowMentorList(!showMentorList)}
              className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              New Message
            </button>
          </div>
          <p className="text-muted-foreground">Connect directly with mentors and get personalized guidance</p>
        </motion.div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversations list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 rounded-lg border border-border bg-card p-4 h-96 overflow-y-auto"
          >
            <h2 className="font-semibold text-foreground mb-4">Conversations</h2>
            <ConversationsList
              conversations={conversations}
              selectedId={selectedConversation?.id}
              onSelect={handleSelectConversation}
              onDelete={handleDeleteConversation}
            />
          </motion.div>

          {/* Chat area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {selectedConversation ? (
              <div className="rounded-lg border border-border bg-card h-96 flex flex-col overflow-hidden">
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-border p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
                  <img
                    src={selectedConversation.participantAvatar}
                    alt={selectedConversation.participantName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedConversation.participantName}</h3>
                    <p className="text-xs text-muted-foreground">{selectedConversation.participantRole}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {selectedConversation.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">No messages yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    selectedConversation.messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-4 py-2 ${
                            message.senderId === "user"
                              ? "gradient-primary text-primary-foreground rounded-br-none"
                              : "border border-border bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-border p-3 bg-muted/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="flex items-center justify-center h-10 w-10 rounded-lg gradient-primary text-primary-foreground transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-foreground font-medium">Select a conversation</p>
                  <p className="text-sm text-muted-foreground mt-1">or start a new one with a mentor</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mentor selection modal */}
        {showMentorList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMentorList(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-lg border border-border p-6 max-w-md w-full max-h-96 overflow-y-auto"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Select a Mentor</h2>
              <div className="space-y-2">
                {sampleMentors.map(mentor => (
                  <button
                    key={mentor.id}
                    onClick={() => handleStartConversation(mentor.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.id}`}
                      alt={mentor.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{mentor.name}</p>
                      <p className="text-xs text-muted-foreground">{mentor.currentRole}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
