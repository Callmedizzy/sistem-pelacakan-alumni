import { useState } from "react";

const initialState = {
  nama: "",
  jurusan: "",
  tahunMasuk: "",
  tanggalLulus: "",
  tahunLulus: "",
  status: "Belum Dilacak"
};

export default function AlumniForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setFormData(initialState);
  };

  return (
    <section className="rounded-xl border border-slate-700/70 bg-card p-4 shadow-soft">
      <h2 className="text-sm font-semibold text-slate-100 md:text-base">Tambah Data Alumni</h2>
      <p className="mt-1 text-xs text-slate-400">Lengkapi form berikut untuk menambahkan data alumni.</p>

      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <Input
          label="Nama"
          name="nama"
          placeholder="Contoh: Rina Putri"
          value={formData.nama}
          onChange={handleChange}
        />
        <Input
          label="Jurusan"
          name="jurusan"
          placeholder="Contoh: Teknik Informatika"
          value={formData.jurusan}
          onChange={handleChange}
        />
        <Input
          label="Tahun Masuk"
          name="tahunMasuk"
          placeholder="Contoh: 2020"
          value={formData.tahunMasuk}
          onChange={handleChange}
        />
        <Input
          label="Tanggal Lulus"
          name="tanggalLulus"
          placeholder="Contoh: 1 Juli 2024"
          value={formData.tanggalLulus}
          onChange={handleChange}
        />
        <Input
          label="Tahun Lulus"
          name="tahunLulus"
          placeholder="Contoh: 2024"
          value={formData.tahunLulus}
          onChange={handleChange}
        />

        <label className="flex flex-col gap-1 text-xs text-slate-300">
          Status
          <select
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500 transition focus:ring-2"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Belum Dilacak</option>
            <option>Perlu Verifikasi</option>
            <option>Teridentifikasi</option>
          </select>
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 hover:shadow-lg"
          >
            Simpan Data
          </button>
        </div>
      </form>
    </section>
  );
}

function Input({ label, name, value, onChange, placeholder }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-300">
      {label}
      <input
        className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-cyan-500 transition focus:ring-2"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </label>
  );
}
