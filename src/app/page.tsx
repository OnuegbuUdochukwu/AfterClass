export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-sans">
      <main className="flex flex-col items-center gap-8 text-center max-w-2xl bg-surface p-12 rounded-3xl backdrop-blur-md shadow-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Welcome to <span className="text-primary">AfterClass</span>
        </h1>
        <p className="text-xl text-foreground/80 leading-relaxed">
          The definitive third space for university learning. Organize modules, find high-signal discussions, and never miss an important update.
        </p>
        <div className="flex gap-4 mt-4">
          <button className="px-8 py-3 rounded-full bg-primary text-background font-bold hover:bg-primary/90 transition-colors">
            Get Started
          </button>
          <button className="px-8 py-3 rounded-full bg-transparent border-2 border-surface text-foreground font-bold hover:bg-surface transition-colors">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
