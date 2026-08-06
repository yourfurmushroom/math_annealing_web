import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-slate-100 border-t border-slate-200 w-full pt-12 pb-8 mt-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">數位退火研發推動計畫</h3>
                        <p className="text-sm text-slate-600 leading-relaxed pr-4">
                            推廣量子與模擬退火技術
                        </p>
                        <div className="pt-2">
                            <span className="text-xs text-slate-500 block mb-2 font-medium">指導單位</span>
                            <Image
                                src="/nstc_logo.png"
                                alt="國家科學及技術委員會"
                                width={200}
                                height={50}
                                className="max-w-[200px] w-full h-auto mix-blend-multiply"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">聯絡我們</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex flex-col">
                                <span className="text-xs text-slate-500 font-medium">聯絡信箱</span>
                                <a href="mailto:annealingquantum@gmail.com" className="hover:text-blue-600 transition-colors">
                                    annealingquantum@gmail.com
                                </a>
                            </li>
                            <li className="flex flex-col pt-2">
                                <span className="text-xs text-slate-500 font-medium">遇到網頁錯誤？</span>
                                <a
                                    href="mailto:annealingquantum@gmail.com?subject=網頁問題回報"
                                    className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors w-fit"
                                >
                                    回報技術問題
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* 區塊 3：製作與開發團隊 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">開發團隊</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex flex-col">
                                <span className="font-semibold text-slate-800">計畫負責人</span>
                                <span>舒宇宸副教授</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="font-semibold text-slate-800">系統與網頁開發</span>
                                <span>陳子輝</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* 底部版權宣告 */}
                <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} 數位退火與 GPU 運算推廣計畫. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Powered by NCKU & NSTC</p>
                </div>
            </div>
        </footer>
    );
}