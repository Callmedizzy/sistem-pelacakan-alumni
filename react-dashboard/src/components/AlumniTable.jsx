const headers = [
  "Nama",
  "Jurusan",
  "Tahun Masuk",
  "Tanggal Lulus",
  "Tahun Lulus",
  "Status"
];

export default function AlumniTable({ data }) {
  return (
    <section className="rounded-xl border border-slate-700/70 bg-card p-4 shadow-soft">
      <h2 className="text-sm font-semibold text-slate-100 md:text-base">Data Alumni</h2>
      <p className="mt-1 text-xs text-slate-400">
        Halaman ini hanya menampilkan data. Tambah data dilakukan dari menu Tambah Alumni.
      </p>

      <div className="mt-3 overflow-auto rounded-lg border border-slate-700/70 bg-slate-900/60">
        <table className="min-w-[760px] text-left text-xs text-slate-200">
          <thead className="bg-slate-800/85 text-[11px] uppercase tracking-wide text-slate-300">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-2 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-slate-800 hover:bg-slate-800/45">
                <td className="px-3 py-2">{item.nama}</td>
                <td className="px-3 py-2">{item.jurusan}</td>
                <td className="px-3 py-2">{item.tahunMasuk}</td>
                <td className="px-3 py-2">{item.tanggalLulus}</td>
                <td className="px-3 py-2">{item.tahunLulus}</td>
                <td className="px-3 py-2">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
