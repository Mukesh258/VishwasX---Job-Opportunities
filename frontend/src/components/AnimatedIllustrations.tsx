import { motion } from "framer-motion";

// Animated Career Growth Illustration
export function CareerGrowthIllustration() {
  return (
    <motion.svg
      viewBox="0 0 300 300"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background circle */}
      <motion.circle
        cx="150"
        cy="150"
        r="140"
        fill="url(#gradient1)"
        opacity="0.1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E8C" />
          <stop offset="100%" stopColor="#4B5BA8" />
        </linearGradient>
      </defs>

      {/* Chart bars */}
      <motion.rect
        x="60"
        y="180"
        width="30"
        height="60"
        fill="#E91E8C"
        rx="4"
        initial={{ height: 0, y: 240 }}
        animate={{ height: 60, y: 180 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.rect
        x="105"
        y="140"
        width="30"
        height="100"
        fill="#4B5BA8"
        rx="4"
        initial={{ height: 0, y: 240 }}
        animate={{ height: 100, y: 140 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.rect
        x="150"
        y="100"
        width="30"
        height="140"
        fill="#FF6B35"
        rx="4"
        initial={{ height: 0, y: 240 }}
        animate={{ height: 140, y: 100 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.rect
        x="195"
        y="60"
        width="30"
        height="180"
        fill="#E91E8C"
        rx="4"
        initial={{ height: 0, y: 240 }}
        animate={{ height: 180, y: 60 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />

      {/* Upward arrow */}
      <motion.path
        d="M 240 200 L 240 80 M 240 80 L 230 95 M 240 80 L 250 95"
        stroke="#4B5BA8"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      />

      {/* Floating circle */}
      <motion.circle
        cx="80"
        cy="80"
        r="12"
        fill="#FF6B35"
        initial={{ y: 0 }}
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.svg>
  );
}

// Animated Learning Illustration
export function LearningIllustration() {
  return (
    <motion.svg
      viewBox="0 0 300 300"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background */}
      <motion.circle
        cx="150"
        cy="150"
        r="140"
        fill="url(#gradient2)"
        opacity="0.1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      <defs>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B5BA8" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>

      {/* Book */}
      <motion.g
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <rect x="80" y="100" width="70" height="90" fill="#E91E8C" rx="4" />
        <line x1="115" y1="100" x2="115" y2="190" stroke="white" strokeWidth="2" />
        <line x1="85" y1="120" x2="145" y2="120" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <line x1="85" y1="135" x2="145" y2="135" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <line x1="85" y1="150" x2="145" y2="150" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <line x1="85" y1="165" x2="145" y2="165" stroke="white" strokeWidth="1.5" opacity="0.6" />
      </motion.g>

      {/* Lightbulb */}
      <motion.g
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <circle cx="200" cy="110" r="18" fill="#FF6B35" />
        <rect x="195" y="128" width="10" height="15" fill="#4B5BA8" />
        <rect x="192" y="143" width="16" height="4" fill="#4B5BA8" />
        <rect x="192" y="150" width="16" height="4" fill="#4B5BA8" />
      </motion.g>

      {/* Floating stars */}
      <motion.circle
        cx="120"
        cy="60"
        r="4"
        fill="#FF6B35"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="200"
        cy="70"
        r="3"
        fill="#E91E8C"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
      />
      <motion.circle
        cx="160"
        cy="50"
        r="3"
        fill="#4B5BA8"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.1 }}
      />
    </motion.svg>
  );
}

// Animated Network Illustration
export function NetworkIllustration() {
  return (
    <motion.svg
      viewBox="0 0 300 300"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background */}
      <motion.circle
        cx="150"
        cy="150"
        r="140"
        fill="url(#gradient3)"
        opacity="0.1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      <defs>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E8C" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>

      {/* Center node */}
      <motion.circle
        cx="150"
        cy="150"
        r="20"
        fill="#E91E8C"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Connecting lines */}
      <motion.line
        x1="150"
        y1="150"
        x2="100"
        y2="80"
        stroke="#4B5BA8"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.line
        x1="150"
        y1="150"
        x2="200"
        y2="80"
        stroke="#4B5BA8"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.line
        x1="150"
        y1="150"
        x2="80"
        y2="150"
        stroke="#4B5BA8"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.line
        x1="150"
        y1="150"
        x2="220"
        y2="150"
        stroke="#4B5BA8"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
      <motion.line
        x1="150"
        y1="150"
        x2="100"
        y2="220"
        stroke="#4B5BA8"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />
      <motion.line
        x1="150"
        y1="150"
        x2="200"
        y2="220"
        stroke="#4B5BA8"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      />

      {/* Outer nodes */}
      <motion.circle
        cx="100"
        cy="80"
        r="12"
        fill="#FF6B35"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.circle
        cx="200"
        cy="80"
        r="12"
        fill="#FF6B35"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />
      <motion.circle
        cx="80"
        cy="150"
        r="12"
        fill="#FF6B35"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      />
      <motion.circle
        cx="220"
        cy="150"
        r="12"
        fill="#FF6B35"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      <motion.circle
        cx="100"
        cy="220"
        r="12"
        fill="#FF6B35"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />
      <motion.circle
        cx="200"
        cy="220"
        r="12"
        fill="#FF6B35"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      />
    </motion.svg>
  );
}

// Animated Success Illustration
export function SuccessIllustration() {
  return (
    <motion.svg
      viewBox="0 0 300 300"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background */}
      <motion.circle
        cx="150"
        cy="150"
        r="140"
        fill="url(#gradient4)"
        opacity="0.1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      <defs>
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B5BA8" />
          <stop offset="100%" stopColor="#E91E8C" />
        </linearGradient>
      </defs>

      {/* Trophy */}
      <motion.g
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Cup */}
        <path
          d="M 110 120 Q 110 100 130 100 Q 150 100 150 120 Q 150 100 170 100 Q 190 120 190 120 L 185 140 Q 150 150 150 150 Q 150 150 115 140 Z"
          fill="#FF6B35"
        />
        {/* Base */}
        <rect x="130" y="150" width="40" height="15" fill="#4B5BA8" rx="2" />
        <rect x="125" y="165" width="50" height="8" fill="#4B5BA8" rx="2" />
      </motion.g>

      {/* Checkmark */}
      <motion.path
        d="M 120 180 L 140 200 L 180 160"
        stroke="#E91E8C"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />

      {/* Confetti circles */}
      <motion.circle
        cx="80"
        cy="100"
        r="5"
        fill="#E91E8C"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 50, opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="220"
        cy="100"
        r="5"
        fill="#FF6B35"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 50, opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
      />
      <motion.circle
        cx="100"
        cy="80"
        r="4"
        fill="#4B5BA8"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 50, opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
      />
    </motion.svg>
  );
}
