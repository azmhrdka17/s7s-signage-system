'use client'

import { useState, useEffect } from 'react'

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://s7s-signage-system-production.up.railway.app').replace(/\/+$/, '');
const CLIENT_ID = 'PRAMITHA'

interface ScheduleRow {
  poli: string
  dokter: string
  jam: string
}

export default function AdminPage() {
  const [videoUrls, setVideoUrls] = useState<string[]>([])
  const [slideUrls, setSlideUrls] = useState<string[]>([])
  const [runningText, setRunningText] = useState('')
  const [scheduleTable, setScheduleTable] = useState<ScheduleRow[]>([])
  const [backgroundUrl, setBackgroundUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/api/signage/${CLIENT_ID}`)
      const result = await res.json()
      
      setVideoUrls(result.data.content.videoUrls)
      setSlideUrls(result.data.content.slideUrls)
      setRunningText(result.data.content.runningText)
      setScheduleTable(result.data.content.scheduleTable)
      setBackgroundUrl(result.data.content.backgroundUrl)
    } catch (err) {
      console.error('Failed to load config:', err)
      alert('Gagal memuat konfigurasi')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'slide' | 'background') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API_URL}/api/media/upload`, {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      
      if (type === 'video') {
        setVideoUrls([...videoUrls, result.data.url])
      } else if (type === 'slide') {
        setSlideUrls([...slideUrls, result.data.url])
      } else if (type === 'background') {
        setBackgroundUrl(result.data.url)
      }

      alert('File berhasil diupload!')
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload gagal!')
    } finally {
      setUploading(false)
    }
  }

  const addScheduleRow = () => {
    setScheduleTable([...scheduleTable, { poli: '', dokter: '', jam: '' }])
  }

  const updateScheduleRow = (index: number, field: keyof ScheduleRow, value: string) => {
    const updated = [...scheduleTable]
    updated[index][field] = value
    setScheduleTable(updated)
  }

  const deleteScheduleRow = (index: number) => {
    setScheduleTable(scheduleTable.filter((_, i) => i !== index))
  }

  const deleteMedia = (type: 'video' | 'slide', index: number) => {
    if (type === 'video') {
      setVideoUrls(videoUrls.filter((_, i) => i !== index))
    } else {
      setSlideUrls(slideUrls.filter((_, i) => i !== index))
    }
  }

  const publishToScreen = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/api/signage/${CLIENT_ID}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrls,
          slideUrls,
          runningText,
          scheduleTable,
          backgroundUrl,
        }),
      })

      if (res.ok) {
        alert('✅ Konten berhasil dipublikasi ke layar!')
      } else {
        alert('❌ Gagal mempublikasi konten')
      }
    } catch (err) {
      console.error('Publish failed:', err)
      alert('❌ Gagal mempublikasi konten')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Admin CMS - Kelola Konten Signage</h1>

      {/* Navigation */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <a
          href="/layout-editor"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
        >
          🎨 Layout Editor
        </a>
        <a
          href="/operator"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          👨‍💼 Operator Panel
        </a>
      </div>

      {/* Background */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">🖼️ Background</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'background')}
          disabled={uploading}
          className="mb-2"
        />
        {backgroundUrl && (
          <div className="mt-2">
            <img src={`${API_URL}${backgroundUrl}`} alt="Background" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
      </div>

      {/* Video */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">🎥 Video</h2>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleFileUpload(e, 'video')}
          disabled={uploading}
          className="mb-4"
        />
        <div className="grid grid-cols-4 gap-4">
          {videoUrls.map((url, index) => (
            <div key={index} className="relative">
              <video src={`${API_URL}${url}`} className="w-full h-24 object-cover rounded" />
              <button
                onClick={() => deleteMedia('video', index)}
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Slides */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">🖼️ Slides</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'slide')}
          disabled={uploading}
          className="mb-4"
        />
        <div className="grid grid-cols-4 gap-4">
          {slideUrls.map((url, index) => (
            <div key={index} className="relative">
              <img src={`${API_URL}${url}`} alt={`Slide ${index}`} className="w-full h-24 object-cover rounded" />
              <button
                onClick={() => deleteMedia('slide', index)}
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Running Text */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">📜 Running Text</h2>
        <input
          type="text"
          value={runningText}
          onChange={(e) => setRunningText(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Masukkan teks berjalan..."
        />
      </div>

      {/* Schedule Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">📅 Jadwal Dokter</h2>
        <button
          onClick={addScheduleRow}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          + Tambah Baris
        </button>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Poli</th>
              <th className="border p-2">Dokter</th>
              <th className="border p-2">Jam</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {scheduleTable.map((row, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <input
                    type="text"
                    value={row.poli}
                    onChange={(e) => updateScheduleRow(index, 'poli', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={row.dokter}
                    onChange={(e) => updateScheduleRow(index, 'dokter', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={row.jam}
                    onChange={(e) => updateScheduleRow(index, 'jam', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => deleteScheduleRow(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Publish Button */}
      <button
        onClick={publishToScreen}
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg text-xl disabled:opacity-50"
      >
        {saving ? '⏳ Mempublikasi...' : '📡 Publish ke Layar'}
      </button>
    </div>
  )
}
