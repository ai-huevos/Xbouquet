import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 font-sans min-h-screen flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* Abstract background elements for depth */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/20 rounded-full blur-[120px]"></div>

            <div className="relative w-full max-w-5xl h-[80vh] min-h-[650px] flex shadow-2xl rounded-2xl overflow-hidden glass-panel-auth flex-col lg:flex-row">

                {/* Left Side: Visual Content (Shared) */}
                <div className="hidden lg:flex lg:w-1/2 relative floral-bg flex-col justify-between p-12 text-white shadow-[inset_-10px_0_30px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z" />
                                <path d="M12 22c-4.97 0-9-4.03-9-9 4.97 0 9 4.03 9 9z" />
                                <path d="M12 13V2" />
                                <path d="M12 13c3.87 0 7-3.13 7-7 0-2.21-1.79-4-4-4s-4 1.79-4 4" />
                                <path d="M12 13c-3.87 0-7-3.13-7-7 0-2.21 1.79-4 4-4s4 1.79 4 4" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight">FloraMarket B2B</h1>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold leading-tight">Empowering the <br /><span className="text-emerald-400">Global Floral</span> Trade.</h2>
                        <p className="text-white/80 text-lg max-w-sm">Join the most exclusive network of premium flower suppliers and professional buyers worldwide.</p>

                        <div className="flex items-center gap-4 pt-6">
                            <div className="flex -space-x-3">
                                <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC0m3WXkal0ebrzqXb7qH9mN_OfWq2c497krVvYF73QdBw4AwsFKtslsfRrY6H97MB5xFIX3NlX-stGlIblkI_IQdM9LAmm51AahOnoCi_DXUXYG_sHtQxDmTAELaTI7Z_4DsriYTNRQZi9rZ01Qfw4iBRpStYdlH0X-sLmkmreS0l5mbsHmZ9kATZbm8CV8XLbs7dcQOhfQspmNk1sScQNpQhuSY6_RC3QhifXZfdiS2dOu9EASZbu12FDJj1Osmhl-HIJ-c609A" />
                                <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6uwJ9AQkUMT9LQKJsoDLaxlmhJKosYRFCxePjv1KJctGcU77wKyHjP16Mq3iKC0uKNIwOSm_IbxbJkp-RcLopMFHL0INBWuy5_x2OIZb89eA7kWrvQsIxrEuzsCF1a7GexePkxayQn1aI8e7k163utI3cxJyRCZ712EWRLJD_0NOom-83odbUKNmtr1aPu6Tzu0utz701apAvkOMj4Lhtn8G7lU5gHjf0X3rW2zE08TK1TKxQXT9P3rqOm80SXpk-P97Ls08tYTc" />
                                <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPOueMbxURgVzUipApJjTifHfHHKz4pkIkYrBOf6hL_x0UWb1wao9MRP_RuNvex03ZPkufRdx65YVnJ9YFJQdZyr2bvP05xaCyzdjS7-Cc9qZksxD336eCZkPEa2HrS-snIb09d0Xx1RLhozXLtZWz5gMQGJ_DD49IJEYiCIiwsYmT7vQipZpvH1v01qcb7Tut8G_CA9Y5UlB2Pja9H1Ah5wI2D0lspQV3D-kJG4NdSJEehmN6LXWbLUGyWJkVEbP-ASJ-DrvDMwk" />
                            </div>
                            <span className="text-sm font-medium">5,000+ businesses already joined</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Dynamic Form Area */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md overflow-y-auto relative no-scrollbar">

                    {/* Mobile Branding Header */}
                    <div className="mb-10 lg:hidden flex items-center justify-center gap-3 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="bg-primary-600 p-1.5 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z" />
                                <path d="M12 22c-4.97 0-9-4.03-9-9 4.97 0 9 4.03 9 9z" />
                                <path d="M12 13V2" />
                                <path d="M12 13c3.87 0 7-3.13 7-7 0-2.21-1.79-4-4-4s-4 1.79-4 4" />
                                <path d="M12 13c-3.87 0-7-3.13-7-7 0-2.21 1.79-4 4-4s4 1.79 4 4" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">FloraMarket B2B</h1>
                    </div>

                    <div className="max-w-[420px] mx-auto w-full">
                        {children}

                        {/* Footer Links */}
                        <div className="mt-12 flex justify-center gap-6 text-[11px] font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-widest pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <a href="#" className="hover:text-primary-500 transition-colors">Help Center</a>
                            <a href="#" className="hover:text-primary-500 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary-500 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
