import Link from 'next/link'
import { Brain, Zap, BarChart3, BookOpen } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">MCAT Forge</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          AI-Powered MCAT Preparation
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
          Forge Your Path to
          <span className="text-primary"> Medical School</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Subsection-specific flashcards, AI-generated AAMC-style quizzes, and intelligent
          spaced repetition — everything you need to score your best.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
          >
            Start Studying Free
          </Link>
          <Link
            href="/auth/login"
            className="border border-border text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors text-lg"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: 'Spaced Repetition Flashcards',
              description:
                'Hundreds of flashcards across all MCAT subsections with smart scheduling based on difficulty.',
            },
            {
              icon: Brain,
              title: 'AI-Generated Quizzes',
              description:
                'GPT-4 generates fresh AAMC-style questions on demand for any subsection and difficulty level.',
            },
            {
              icon: BarChart3,
              title: 'Progress Analytics',
              description:
                'Track accuracy by subsection, identify weak areas, and watch your scores improve over time.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3"
            >
              <feature.icon className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-foreground text-lg">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections overview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">All 4 MCAT Sections Covered</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Bio/Biochem', subs: 'Biochemistry · Molecular Biology · Genetics · Metabolism · Cell Biology', color: 'text-blue-400' },
            { name: 'Chem/Phys', subs: 'Gen Chem · Organic Chem · Physics · Thermodynamics · Electrochemistry', color: 'text-purple-400' },
            { name: 'Psych/Soc', subs: 'Psychology · Sociology · Behavioral Science', color: 'text-green-400' },
            { name: 'CARS', subs: 'Passage Analysis · Reading Comprehension · Logic & Reasoning', color: 'text-orange-400' },
          ].map((s) => (
            <div key={s.name} className="bg-card border border-border rounded-xl p-5">
              <p className={`font-bold text-lg mb-1 ${s.color}`}>{s.name}</p>
              <p className="text-muted-foreground text-sm">{s.subs}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <p>MCAT Forge — Built for future physicians.</p>
      </footer>
    </div>
  )
}
