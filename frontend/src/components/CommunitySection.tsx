import { Users, MessageCircle, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  category: string;
}

const samplePosts: CommunityPost[] = [
  {
    id: "1",
    author: "Priya Sharma",
    avatar: "PS",
    content: "Just completed my SQL certification! Feeling confident about my career. Anyone else preparing for interviews?",
    timestamp: "2 hours ago",
    likes: 24,
    replies: 8,
    category: "Wins",
  },
  {
    id: "2",
    author: "Anita Reddy",
    avatar: "AR",
    content: "Looking for accountability partners for the Python bootcamp. Who's interested in forming a study group?",
    timestamp: "4 hours ago",
    likes: 15,
    replies: 12,
    category: "Study Groups",
  },
  {
    id: "3",
    author: "Meera Joshi",
    avatar: "MJ",
    content: "Got an offer from Goldman Sachs returnship program! The interview prep workshop really helped. Thank you all!",
    timestamp: "1 day ago",
    likes: 56,
    replies: 18,
    category: "Success Stories",
  },
];

export default function CommunitySection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold text-foreground">Community Network</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-4 shadow-card text-center"
        >
          <div className="text-2xl font-bold text-primary">2,847</div>
          <p className="text-sm text-muted-foreground">Professionals in Community</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-4 shadow-card text-center"
        >
          <div className="text-2xl font-bold text-secondary">1,243</div>
          <p className="text-sm text-muted-foreground">Success Stories</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4 shadow-card text-center"
        >
          <div className="text-2xl font-bold text-accent">156</div>
          <p className="text-sm text-muted-foreground">Active Study Groups</p>
        </motion.div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>

        {samplePosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  {post.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {post.category}
              </span>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">{post.content}</p>

            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <button className="flex items-center gap-1 transition-colors hover:text-primary">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 transition-colors hover:text-primary">
                <MessageCircle className="h-4 w-4" />
                <span>{post.replies}</span>
              </button>
              <button className="flex items-center gap-1 transition-colors hover:text-primary">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full rounded-lg gradient-primary px-4 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105">
        Join Community Discussion
      </button>
    </div>
  );
}
