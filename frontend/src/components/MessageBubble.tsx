import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { formatMessageTime } from "@/lib/messaging";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  read?: boolean;
  senderName?: string;
}

export default function MessageBubble({
  content,
  timestamp,
  isOwn,
  read,
  senderName,
}: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-xs rounded-lg px-4 py-2 ${
          isOwn
            ? "gradient-primary text-primary-foreground rounded-br-none"
            : "border border-border bg-card text-foreground rounded-bl-none"
        }`}
      >
        {!isOwn && senderName && (
          <p className="text-xs font-semibold mb-1 opacity-75">{senderName}</p>
        )}
        <p className="text-sm break-words">{content}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}>
          <span>{formatMessageTime(timestamp)}</span>
          {isOwn && (
            read ? (
              <CheckCheck className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
