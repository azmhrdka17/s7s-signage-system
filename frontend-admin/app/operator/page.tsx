'use client'

import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3001'
const CLIENT_ID = 'PRAMITHA'

interface QueueSlot {
  id: number
  slotNumber: number
  loketName: string
  currentNumber: string
}

export default function OperatorPage() {
  const [slots, setSlots] = useState<QueueSlot[]>([])
  const [customNumbers, setCustomNumbers] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    loadSlots()
  }, [])

  const loadSlots = async () => {
    try {
      const res = await fetch(`${API_URL}/api/signage/${CLIENT_ID}`)
      const result = await res.json()
      setSlots(result.data.queueSlots)
      
      // Initialize custom numbers with current values
      const nums: { [key: number]: string } = {}
      result.data.queueSlots.forEach((slot: QueueSlot) => {
        nums[slot.slotNumber] = slot.currentNumber
      })
      setCustomNumbers(nums)
    } catch (err) {
      console.error('Failed to load slots:', err)
    }
  }

  const parseQueueNumber = (num: string): { prefix: string; number: number } | null => {
    const match = num.match(/^([A-Z]*)(\d+)$/)
    if (!match) return null
    return {
      prefix: match[1],
      number: parseInt(match[2], 10),
    }
  }

  const incrementNumber = (current: string): string => {
    if (!current) return 'A001'
    const parsed = parseQueueNumber(current)
    if (!parsed) return 'A001'
    return `${parsed.prefix}${String(parsed.number + 1).padStart(3, '0')}`
  }

  const callNext = async (slot: QueueSlot) => {
    const nextNumber = incrementNumber(slot.currentNumber)
    await callQueue(slot.slotNumber, slot.loketName, nextNumber)
  }

  const callRepeat = async (slot: QueueSlot) => {
    if (!slot.currentNumber) {
      alert('Tidak ada nomor untuk dipanggil ulang')
      return
    }
    await callQueue(slot.slotNumber, slot.loketName, slot.currentNumber)
  }

  const callCustom = async (slotNumber: number, loketName: string) => {
    const customNum = customNumbers[slotNumber]
    if (!customNum || customNum.trim() === '') {
      alert('Masukkan nomor terlebih dahulu')
      return
    }
    await callQueue(slotNumber, loketName, customNum.trim())
  }

  const callQueue = async (slotNumber: number, loketName: string, number: string) => {
    try {
      const res = await fetch(`${API_URL}/api/signage/${CLIENT_ID}/queue/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotNumber,
          loketName,
          currentNumber: number,
        }),
      })

      if (res.ok) {
        await loadSlots()
        alert(`✅ Nomor ${number} dipanggil ke ${loketName}`)
      } else {
        alert('❌ Gagal memanggil antrian')
      }
    } catch (err) {
      console.error('Call queue failed:', err)
      alert('❌ Gagal memanggil antrian')
    }
  }

  const updateCustomNumber = (slotNumber: number, value: string) => {
    setCustomNumbers({
      ...customNumbers,
      [slotNumber]: value.toUpperCase(),
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Operator Pemanggil Antrian</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slots.map((slot) => (
          <div key={slot.slotNumber} className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-900">{slot.loketName}</h2>
              <div className="text-right">
                <div className="text-sm text-gray-600">Nomor Terakhir:</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {slot.currentNumber || '-'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => callNext(slot)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow transition"
              >
                ➕ Panggil Berikutnya
              </button>
              <button
                onClick={() => callRepeat(slot)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg shadow transition"
              >
                🔁 Panggil Ulang
              </button>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Panggil Nomor Manual:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customNumbers[slot.slotNumber] || ''}
                  onChange={(e) => updateCustomNumber(slot.slotNumber, e.target.value)}
                  placeholder="Contoh: A001"
                  className="flex-1 border-2 border-gray-300 p-3 rounded-lg font-mono text-lg"
                />
                <button
                  onClick={() => callCustom(slot.slotNumber, slot.loketName)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-lg shadow transition"
                >
                  📞 Panggil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg">
        <h3 className="font-bold text-yellow-900 mb-2">💡 Petunjuk Penggunaan:</h3>
        <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
          <li><strong>Panggil Berikutnya:</strong> Otomatis menambah 1 dari nomor terakhir (A001 → A002)</li>
          <li><strong>Panggil Ulang:</strong> Memanggil ulang nomor terakhir yang sudah dipanggil</li>
          <li><strong>Nomor Manual:</strong> Masukkan nomor spesifik untuk dipanggil (contoh: A010, B005)</li>
        </ul>
      </div>
    </div>
  )
}
