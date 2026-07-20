import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
    try {
        // 解析前端傳來的 JSON 資料
        const data = await request.json()
        const { name, email, institution, duration, purpose } = data

        // 建立 Nodemailer 傳送器
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        // 寄出信件
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.TARGET_EMAIL,
            replyTo: email,
            subject: `【數位退火時數申請】來自 ${name} (${institution})`,
            text: `
您有一筆新的數位退火時數申請：

姓名：${name}
聯絡信箱：${email}
學術單位：${institution}
申請時數：${duration} 小時

用途說明：
${purpose}
            `,
        })

        // 回傳成功狀態給前端
        return NextResponse.json({ success: true, message: '申請已成功送出！' })

    } catch (error) {
        console.error('API 寄信錯誤:', error)
        return NextResponse.json(
            { success: false, message: '伺服器發生錯誤，請稍後再試。' },
            { status: 500 }
        )
    }
}