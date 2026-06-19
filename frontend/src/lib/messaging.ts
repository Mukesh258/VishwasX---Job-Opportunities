// Messaging system utilities
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Message[];
}

// Mentor response templates
const mentorResponses: Record<string, string[]> = {
  default: [
    "That's a great question! Let me share some insights based on my experience.",
    "I appreciate you reaching out. Here's what I'd recommend based on your situation.",
    "This is something I've dealt with before. Here's my advice:",
    "Excellent point! Let me help you think through this.",
    "I'm glad you asked. This is an important topic in our field.",
  ],
  career: [
    "Career transitions can be challenging, but your background is valuable. Focus on highlighting transferable skills.",
    "The key to a successful career change is showing how your previous experience applies to the new role.",
    "Don't underestimate the value of your past experience. Many employers value diverse backgrounds.",
    "Your career break doesn't define you. What matters is how you frame your growth during that time.",
    "Consider taking on projects that bridge your old and new skills to strengthen your transition.",
  ],
  skills: [
    "Building new skills takes time and consistency. I'd recommend starting with foundational concepts.",
    "The best way to learn is by doing. Try building small projects to apply what you're learning.",
    "Don't worry about knowing everything. Focus on mastering the fundamentals first.",
    "Practice is key. Set aside dedicated time each day for skill development.",
    "Consider joining communities or study groups to accelerate your learning.",
  ],
  interview: [
    "Interview preparation is crucial. Practice telling your story in a compelling way.",
    "Remember to use the STAR method when answering behavioral questions.",
    "Research the company thoroughly before your interview. It shows genuine interest.",
    "Don't forget to ask thoughtful questions. It demonstrates your engagement.",
    "Practice mock interviews to build confidence and get feedback.",
  ],
  networking: [
    "Networking is about building genuine relationships, not just collecting contacts.",
    "Reach out to people in your field. Most are happy to help if you're respectful of their time.",
    "LinkedIn is a great tool for networking. Personalize your connection requests.",
    "Attend industry events and conferences to meet people in your field.",
    "Follow up after conversations. A simple message can lead to lasting connections.",
  ],
};

// Get mentor response based on message content
function getMentorResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("career") || lowerMessage.includes("transition") || lowerMessage.includes("change")) {
    return mentorResponses.career[Math.floor(Math.random() * mentorResponses.career.length)];
  }
  if (lowerMessage.includes("skill") || lowerMessage.includes("learn") || lowerMessage.includes("course")) {
    return mentorResponses.skills[Math.floor(Math.random() * mentorResponses.skills.length)];
  }
  if (lowerMessage.includes("interview") || lowerMessage.includes("interview prep") || lowerMessage.includes("question")) {
    return mentorResponses.interview[Math.floor(Math.random() * mentorResponses.interview.length)];
  }
  if (lowerMessage.includes("network") || lowerMessage.includes("connect") || lowerMessage.includes("contact")) {
    return mentorResponses.networking[Math.floor(Math.random() * mentorResponses.networking.length)];
  }
  
  return mentorResponses.default[Math.floor(Math.random() * mentorResponses.default.length)];
}

// Get all conversations from localStorage
export const getConversations = (): Conversation[] => {
  const stored = localStorage.getItem("sheReboot_conversations");
  return stored ? JSON.parse(stored) : [];
};

// Save conversations to localStorage
export const saveConversations = (conversations: Conversation[]): void => {
  localStorage.setItem("sheReboot_conversations", JSON.stringify(conversations));
};

// Get or create conversation
export const getOrCreateConversation = (
  participantId: string,
  participantName: string,
  participantRole: string,
  participantAvatar: string
): Conversation => {
  const conversations = getConversations();
  let conversation = conversations.find(c => c.participantId === participantId);

  if (!conversation) {
    conversation = {
      id: `conv_${Date.now()}`,
      participantId,
      participantName,
      participantRole,
      participantAvatar,
      unreadCount: 0,
      messages: [],
    };
    conversations.push(conversation);
    saveConversations(conversations);
  }

  return conversation;
};

// Send message
export const sendMessage = (
  conversationId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string,
  recipientId: string,
  content: string
): Message => {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const message: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    senderId,
    senderName,
    senderAvatar,
    recipientId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  };

  conversation.messages.push(message);
  conversation.lastMessage = content;
  conversation.lastMessageTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Auto-reply from mentor after a short delay
  setTimeout(() => {
    const mentorReply: Message = {
      id: `msg_${Date.now() + 1}`,
      conversationId,
      senderId: recipientId,
      senderName: conversation.participantName,
      senderAvatar: conversation.participantAvatar,
      recipientId: senderId,
      content: getMentorResponse(content),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedConversations = getConversations();
    const updatedConversation = updatedConversations.find(c => c.id === conversationId);
    if (updatedConversation) {
      updatedConversation.messages.push(mentorReply);
      updatedConversation.unreadCount += 1;
      updatedConversation.lastMessage = mentorReply.content;
      updatedConversation.lastMessageTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      saveConversations(updatedConversations);
    }
  }, 1500);

  saveConversations(conversations);
  return message;
};

// Mark message as read
export const markMessageAsRead = (conversationId: string, messageId: string): void => {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);

  if (conversation) {
    const message = conversation.messages.find(m => m.id === messageId);
    if (message) {
      message.read = true;
      conversation.unreadCount = Math.max(0, conversation.unreadCount - 1);
      saveConversations(conversations);
    }
  }
};

// Mark all messages as read
export const markAllMessagesAsRead = (conversationId: string): void => {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);

  if (conversation) {
    conversation.messages.forEach(m => {
      if (!m.read) {
        m.read = true;
      }
    });
    conversation.unreadCount = 0;
    saveConversations(conversations);
  }
};

// Get unread count
export const getUnreadCount = (): number => {
  const conversations = getConversations();
  return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
};

// Delete conversation
export const deleteConversation = (conversationId: string): void => {
  const conversations = getConversations();
  const filtered = conversations.filter(c => c.id !== conversationId);
  saveConversations(filtered);
};

// Format timestamp
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};
