export default function StatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-panel px-4 py-3 shadow-soft">
      <p className="text-xs text-slate-400">{label}</p>
      <h3 className="mt-1 text-2xl font-semibold text-slate-100">{value}</h3>
    </article>
  );
}
