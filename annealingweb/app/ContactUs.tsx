'use client'
import { useState, useEffect, useActionState } from "react"
import { usePathname } from "next/navigation"

type FormState = {
    success: boolean | null
    message: string
}

const initialState: FormState = {
    success: null,
    message: '',
}

export default function ContactUs() {
    const [isOpenContact, setOpenContact] = useState<boolean>(false)
    const pathname = usePathname()

    const hiddenPaths = ['/games']

    // 改用 fetch 呼叫你寫的 API
    const submitAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            institution: formData.get('institution'),
            duration: formData.get('duration'),
            purpose: formData.get('purpose'),
        }

        try {
            const response = await fetch('/annealing/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()
            return result // 回傳 { success, message }
        } catch (error) {
            return { success: false, message: '送出失敗，請稍後再試。' }
        }
    }

    const [state, formAction, isPending] = useActionState(submitAction, initialState)

    useEffect(() => {
        if (state.success === true) {
            alert(state.message)
            setOpenContact(false)
        } else if (state.success === false) {
            alert(state.message)
        }
    }, [state])

    if (hiddenPaths.includes(pathname) || pathname.startsWith('/games')) {
        return null
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    onClick={() => setOpenContact(!isOpenContact)}
                    className="border-2 border-black w-28 h-[5vh] min-h-[40px] bg-white rounded-2xl hover:bg-gray-100 transition-colors shadow-lg font-medium"
                >
                    {isOpenContact ? '關閉' : '申請時數'}
                </button>
            </div>

            {isOpenContact && (
                <div className="fixed bottom-24 right-6 z-50 w-80 p-6 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-[75vh] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">申請時數</h3>
                    
                    <form action={formAction} className="flex flex-col gap-3">
                        <div>
                            <label htmlFor="name" className="block text-sm text-gray-600 mb-1">姓名</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                placeholder="請輸入您的姓名"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="institution" className="block text-sm text-gray-600 mb-1">學術單位</label>
                            <input 
                                type="text" 
                                id="institution" 
                                name="institution" 
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                placeholder="例如：國立成功大學 數學系"
                            />
                        </div>

                        <div>
                            <label htmlFor="duration" className="block text-sm text-gray-600 mb-1">申請時數 (最大 30分鐘)</label>
                            <input 
                                type="number" 
                                id="duration" 
                                name="duration" 
                                max="30"
                                min="0"
                                step="1"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                placeholder="例如：1 為 1分鐘"
                            />
                        </div>

                        <div>
                            <label htmlFor="purpose" className="block text-sm text-gray-600 mb-1">用途</label>
                            <textarea 
                                id="purpose" 
                                name="purpose" 
                                rows={3}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
                                placeholder="請簡述您的申請用途..."
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="mt-2 w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                        >
                            {isPending ? '傳送中...' : '送出申請'}
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}