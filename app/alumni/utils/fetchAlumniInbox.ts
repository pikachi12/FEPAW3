const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import type { AlumniRequest, TeamMember } from "../types/types";

function mapInboxResponseToAlumniRequest(item: any): AlumniRequest {
  return {
    groupId: item.groupId,
    id: item.ketua._id || item.ketua.id || item.namaTim,
    date: new Date(item.createdAt).toLocaleDateString(),
    daysRemaining: 3, // tenggat 3 hari
    teamName: item.namaTim,
    ketua: {
      name: item.ketua.name,
      details: `${item.ketua.nim}, ${item.ketua.prodi}`,
    },
    anggota: item.anggota.map((m: any) => ({
      name: m.name,
      details: `${m.nim}, ${m.prodi}`,
    })),
    dosen: {
      name: item.dosen?.name || "Dosen Pembimbing",
      details: item.dosen?.nip || item.dosen?.NIP || "",
    },
    alasan: item.alasan,
    driveLink: item.linkcv,
    status: (() => {
      // Normalize backend status values to internal ones we use in the UI
      const s = (item.status || "").toString();
      if (s === "Menunggu Review" || s.toLowerCase() === "pending") return "pending";
      if (s === "Disetujui" || s === "Diterima" || s.toLowerCase() === "approved") return "Diterima";
      if (s === "Ditolak" || s.toLowerCase() === "declined") return "Ditolak";
      return "pending";
    })(),
  };
}

export default async function fetchAlumniInbox(): Promise<AlumniRequest[]> {
  const res = await fetch(`${API_BASE_URL}/api/reviews/inbox`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to fetch inbox requests');
  const data = await res.json();
  if (!data.requests) return [];
  return data.requests.map(mapInboxResponseToAlumniRequest);
}