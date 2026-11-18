import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-blue-900">
          S7S Digital Signage System
        </h1>
        <div className="grid grid-cols-2 gap-6">
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-12 px-8 rounded-lg shadow-lg transition"
          >
            <div className="text-6xl mb-4">📺</div>
            <div className="text-2xl">Admin CMS</div>
            <div className="text-sm mt-2 opacity-80">Kelola Konten Signage</div>
          </Link>
          <Link
            href="/operator"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-12 px-8 rounded-lg shadow-lg transition"
          >
            <div className="text-6xl mb-4">📞</div>
            <div className="text-2xl">Operator Antrian</div>
            <div className="text-sm mt-2 opacity-80">Panggil Nomor Antrian</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
