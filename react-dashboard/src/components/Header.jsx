export default function Header() {
  return (
    <header className="rounded-xl border border-slate-700/70 bg-card p-4 shadow-soft md:p-5">
      <h1 className="text-xl font-bold tracking-tight text-slate-100 md:text-2xl">
        Sistem Pelacakan Alumni
      </h1>
      <div className="mt-3 rounded-lg border border-sky-500/50 bg-sky-900/30 px-3 py-2 text-xs text-sky-200 md:text-sm">
        Peringatan: Semua data ini hanya untuk kepentingan pembelajaran dan dilarang disebarluaskan
        untuk kepentingan apa pun.
      </div>
    </header>
  );
}
