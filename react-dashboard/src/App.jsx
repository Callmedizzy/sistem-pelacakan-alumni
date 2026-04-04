import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import AlumniTable from "./components/AlumniTable";
import AlumniForm from "./components/AlumniForm";

const initialAlumni = [
  {
    id: 1,
    nama: "Catur Rahmani Oktavia",
    jurusan: "Akuntansi",
    tahunMasuk: "1995",
    tanggalLulus: "1 Juli 2000",
    tahunLulus: "2000",
    status: "Belum Dilacak"
  },
  {
    id: 2,
    nama: "Indayati",
    jurusan: "Akuntansi",
    tahunMasuk: "1995",
    tanggalLulus: "1 Juli 2000",
    tahunLulus: "2000",
    status: "Belum Dilacak"
  },
  {
    id: 3,
    nama: "Assa Idhika",
    jurusan: "Akuntansi",
    tahunMasuk: "1995",
    tanggalLulus: "1 Juli 2000",
    tahunLulus: "2000",
    status: "Perlu Verifikasi"
  },
  {
    id: 4,
    nama: "Yuli Eka Venti",
    jurusan: "Akuntansi",
    tahunMasuk: "1995",
    tanggalLulus: "1 Juli 2000",
    tahunLulus: "2000",
    status: "Teridentifikasi"
  },
  {
    id: 5,
    nama: "Gunawan",
    jurusan: "Akuntansi",
    tahunMasuk: "1995",
    tanggalLulus: "1 Juli 2000",
    tahunLulus: "2000",
    status: "Belum Dilacak"
  }
];

export default function App() {
  const [alumni, setAlumni] = useState(initialAlumni);

  const stats = useMemo(() => {
    const total = alumni.length;
    const teridentifikasi = alumni.filter((item) => item.status === "Teridentifikasi").length;
    const verifikasi = alumni.filter((item) => item.status === "Perlu Verifikasi").length;
    const belumDilacak = alumni.filter((item) => item.status === "Belum Dilacak").length;

    return [
      { label: "Total Alumni", value: total },
      { label: "Alumni Teridentifikasi", value: teridentifikasi },
      { label: "Perlu Verifikasi", value: verifikasi },
      { label: "Belum Dilacak", value: belumDilacak }
    ];
  }, [alumni]);

  const handleAddAlumni = (newData) => {
    const payload = {
      id: Date.now(),
      nama: newData.nama,
      jurusan: newData.jurusan,
      tahunMasuk: newData.tahunMasuk,
      tanggalLulus: newData.tanggalLulus,
      tahunLulus: newData.tahunLulus,
      status: newData.status
    };

    setAlumni((prev) => [payload, ...prev]);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
      <Header />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_220px]">
        <div className="space-y-5">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <AlumniTable data={alumni} />
            <AlumniForm onSubmit={handleAddAlumni} />
          </section>
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
