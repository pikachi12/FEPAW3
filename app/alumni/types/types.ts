// types.ts
export interface TeamMember {
  name: string;
  details: string; // Misal: "22/512345/TK/54321, Teknologi Informasi"
}

export interface AlumniRequest {
  groupId: string; // ID grup untuk API
  id: string; // ID unik untuk key dan API call
  date: string;
  teamName: string;
  ketua: TeamMember;
  anggota: TeamMember[];
  dosen: TeamMember;
  alasan: string;
  driveLink: string;
  status: "pending" | "approved" | "declined" | "Diterima" | "Ditolak"; // Status ini PENTING
  remainingDays: number;
}