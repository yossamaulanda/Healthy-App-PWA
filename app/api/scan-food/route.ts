import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Inisialisasi OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Gambar tidak ditemukan' },
        { status: 400 }
      )
    }

    // Validasi API Key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API Key tidak dikonfigurasi' },
        { status: 500 }
      )
    }

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // atau "gpt-4o" untuk hasil lebih akurat
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analisis gambar makanan ini dan berikan informasi nutrisi dalam format JSON berikut:
{
  "nama": "nama makanan dalam bahasa Indonesia",
  "protein": angka (dalam gram),
  "karbohidrat": angka (dalam gram),
  "lemak": angka (dalam gram),
  "serat": angka (dalam gram),
  "kalori": angka (dalam kkal)
}

PENTING: 
- Berikan estimasi yang realistis berdasarkan porsi yang terlihat
- Jika tidak bisa mengidentifikasi makanan, set nama menjadi "Makanan tidak dikenali"
- Semua nilai harus berupa angka (bukan string)
- Hanya return JSON tanpa text tambahan`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
                detail: "low" // "low", "high", atau "auto"
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    })

    // Parse response
    const content = response.choices[0]?.message?.content
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada response dari AI' },
        { status: 500 }
      )
    }

    // Extract JSON from response
    let nutritionData
    try {
      // Coba parse langsung
      nutritionData = JSON.parse(content)
    } catch {
      // Jika gagal, coba extract JSON dari markdown code block
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        nutritionData = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        throw new Error('Format response tidak valid')
      }
    }

    // Validasi dan konversi data
    const result = {
      success: true,
      nama: nutritionData.nama || 'Makanan tidak dikenali',
      protein: parseFloat(nutritionData.protein) || 0,
      karbohidrat: parseFloat(nutritionData.karbohidrat) || 0,
      lemak: parseFloat(nutritionData.lemak) || 0,
      serat: parseFloat(nutritionData.serat) || 0,
      kalori: parseInt(nutritionData.kalori) || 0,
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Error scanning food:', error)
    
    // Handle specific errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { success: false, error: 'Kuota API habis. Silakan hubungi administrator.' },
        { status: 429 }
      )
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { success: false, error: 'API Key tidak valid' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Terjadi kesalahan saat memproses gambar' 
      },
      { status: 500 }
    )
  }
}