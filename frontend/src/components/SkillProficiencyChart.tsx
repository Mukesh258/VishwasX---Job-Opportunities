import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { SkillProficiency } from "@/lib/mockData";

interface SkillProficiencyChartProps {
  skills: SkillProficiency[];
}

export default function SkillProficiencyChart({ skills }: SkillProficiencyChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Skill Proficiency Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={skills}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="current" fill="hsl(var(--primary))" name="Your Level" />
          <Bar dataKey="required" fill="hsl(var(--secondary))" name="Required" />
          <Bar dataKey="industry" fill="hsl(var(--accent))" name="Industry Standard" />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-xs text-muted-foreground">
        Compare your current skills against job requirements and industry standards. Focus on closing the gaps.
      </p>
    </div>
  );
}
