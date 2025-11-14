'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('❌ Gagal konek ke backend'));
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Cek Koneksi Backend</h1>
      <p className="mt-4 text-lg">{message}</p>
    </div>
  );
}
