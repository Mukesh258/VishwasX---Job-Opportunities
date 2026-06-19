import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Users, BookOpen, TrendingUp, Play, Star } from "lucide-react";
import { enableGuestMode } from "@/lib/guestMode";
import DecryptedText from "@/components/DecryptedText";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: Target, title: "AI Skill Gap Analysis", desc: "Identify exactly which skills you need to learn for your target role." },
  { icon: BookOpen, title: "Personalized Roadmap", desc: "Get a 3-month learning plan with curated course recommendations." },
  { icon: TrendingUp, title: "Career Readiness Score", desc: "Track your progress with AI-powered readiness metrics." },
  { icon: Users, title: "Professional Network", desc: "Connect with professionals on similar journeys." },
];

const steps = [
  { num: "01", title: "Tell Us Your Story", desc: "Share your previous experience, skills, and career goals." },
  { num: "02", title: "Get AI Analysis", desc: "Our AI identifies skill gaps and creates your personalized plan." },
  { num: "03", title: "Learn & Grow", desc: "Follow your roadmap with curated courses and resources." },
  { num: "04", title: "Land Your Role", desc: "Apply to returnships and jobs matched to your profile." },
];

const stories = [
  { name: "Priya S.", role: "Data Analyst at TCS", quote: "After a 4-year break, VishwasX helped me identify exactly what I needed to learn. I landed my dream role in 3 months!" },
  { name: "Kavita M.", role: "Product Manager at Flipkart", quote: "The professional network connected me with peers who understood my journey. The mentorship was invaluable." },
  { name: "Anjali R.", role: "UX Designer at Infosys", quote: "The personalized roadmap made my learning focused and efficient. I felt confident walking into interviews." },
];

const Index = () => {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    enableGuestMode();
    navigate("/dashboard");
  };

  return (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="px-0 py-20 sm:py-28 relative overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur">
            <Sparkles className="h-4 w-4" />
            AI-Powered Career Guidance
          </div>
          <h1 className="mb-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <DecryptedText
              text="VishwasX"
              animateOn="view"
              sequential
              revealDirection="center"
              speed={60}
              maxIterations={20}
              characters="V1$HW@5X#!&*%"
              className="text-foreground"
              encryptedClassName="text-primary/60"
            />
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Trust Every Opportunity.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-base font-semibold text-background shadow-elevated transition-transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
            >
              Sign In
            </Link>
            <button
              onClick={handleTryDemo}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
            >
              <Play className="h-5 w-5" />
              Try Demo
            </button>
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              to="/company-verification"
              className="inline-flex min-w-72 items-center justify-center gap-2 rounded-2xl border border-border bg-card/70 px-10 py-4 text-xl font-bold text-foreground shadow-card backdrop-blur transition-colors hover:bg-card"
            >
              Company Verify
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* How it Works */}
    <section className="px-0 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">How It Works</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <span className="mb-3 block font-display text-3xl font-bold text-primary/30">{s.num}</span>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Key Features */}
    <section className="px-0 py-16 sm:py-20 relative overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">Key Features</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Success Stories */}
    <section className="px-0 py-16 sm:py-20 relative overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">Success Stories</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {stories.map((s, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mb-3 flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-4 text-sm italic text-muted-foreground">"{s.quote}"</p>
              <div>
                <p className="font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-primary">{s.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="px-0 py-16 relative overflow-hidden">
      <div className="mx-auto max-w-2xl text-center relative z-10">
        <h2 className="mb-4 font-display text-3xl font-bold text-foreground">Ready to Restart?</h2>
        <p className="mb-8 text-muted-foreground">Your experience is your strength. Let AI help you chart the path forward.</p>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-105"
        >
          Begin Your Journey
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border px-0 py-8">
      <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
        <p>© 2026 VishwasX. Trust Every Opportunity.</p>
      </div>
    </footer>
  </div>
  );
};

export default Index;
