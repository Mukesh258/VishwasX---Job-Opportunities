import { motion } from "framer-motion";
import { MessageCircle, Trash2 } from "lucide-react";
import type { Conversation } from "@/lib/messaging";
import { deleteConversation } from "@/lib/messaging";

interface ConversationsListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  onDelete?: (conversationId: string) => void;
}

export default function ConversationsList({
  conversations,
  selectedId,
  onSelect,
  onDelete,
}: ConversationsListProps) {
  const handleDelete = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    deleteConversation(conversationId);
    onDelete?.(conversationId);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-foreground font-medium">No conversations yet</p>
        <p className="text-sm text-muted-foreground">Start messaging with a mentor</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation, idx) => (
        <motion.div
          key={conversation.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onSelect(conversation)}
          className={`p-3 rounded-lg border-2 cursor-pointer transition-all group ${
            selectedId === conversation.id
              ? "border-primary/50 bg-primary/5"
              : "border-border bg-card hover:border-primary/30"
          }`}
        >
          <div className="flex items-start gap-3">
            <img
              src={conversation.participantAvatar}
              alt={conversation.participantName}
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-foreground truncate">
                  {conversation.participantName}
                </h4>
                {conversation.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1">{conversation.participantRole}</p>
              <p className="text-sm text-muted-foreground truncate">
                {conversation.lastMessage || "No messages yet"}
              </p>
              {conversation.lastMessageTime && (
                <p className="text-xs text-muted-foreground mt-1">{conversation.lastMessageTime}</p>
              )}
            </div>
            <button
              onClick={(e) => handleDelete(e, conversation.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded-lg transition-all"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
