const menus = ["Dashboard", "Data Alumni", "Tambah Alumni", "Logout"];

export default function Sidebar() {
  return (
    <aside className="h-fit rounded-xl border border-slate-700/70 bg-card p-3 shadow-soft">
      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Menu
      </p>
      <nav className="space-y-2">
        {menus.map((menu, index) => (
          <button
            key={menu}
            type="button"
            className={[
              "w-full rounded-md border px-3 py-2 text-left text-xs font-medium transition",
              index === 0
                ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
                : "border-slate-700 bg-slate-800/70 text-slate-200 hover:border-cyan-500/40 hover:bg-cyan-500/10"
            ].join(" ")}
          >
            {menu}
          </button>
        ))}
      </nav>
    </aside>
  );
}
