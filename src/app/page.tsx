import Link from 'next/link'

export const metadata = {
  title: 'FloraMarket | Premium B2B Floral Marketplace',
  description: 'Join the most exclusive network of premium flower suppliers and professional buyers worldwide.'
}

export default function LandingPage() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 font-sans min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Abstract background elements for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/20 rounded-full blur-[120px]"></div>

      <div className="relative w-full max-w-5xl h-auto lg:h-[80vh] min-h-[100dvh] lg:min-h-[650px] flex shadow-2xl rounded-2xl overflow-hidden glass-panel-auth flex-col lg:flex-row">

        {/* Left Side: Visual Content */}
        <div className="w-full lg:w-1/2 relative floral-bg flex flex-col justify-center lg:justify-between p-6 sm:p-8 lg:p-12 gap-8 lg:gap-0 text-white">
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
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">Empowering the <br /><span className="text-emerald-400">Global Floral</span> Trade.</h2>
            <p className="text-white/80 text-lg max-w-sm">Access exclusive high-volume inventory from the world&apos;s finest farms, directly to your shop.</p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC0m3WXkal0ebrzqXb7qH9mN_OfWq2c497krVvYF73QdBw4AwsFKtslsfRrY6H97MB5xFIX3NlX-stGlIblkI_IQdM9LAmm51AahOnoCi_DXUXYG_sHtQxDmTAELaTI7Z_4DsriYTNRQZi9rZ01Qfw4iBRpStYdlH0X-sLmkmreS0l5mbsHmZ9kATZbm8CV8XLbs7dcQOhfQspmNk1sScQNpQhuSY6_RC3QhifXZfdiS2dOu9EASZbu12FDJj1Osmhl-HIJ-c609A" />
                <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6uwJ9AQkUMT9LQKJsoDLaxlmhJKosYRFCxePjv1KJctGcU77wKyHjP16Mq3iKC0uKNIwOSm_IbxbJkp-RcLopMFHL0INBWuy5_x2OIZb89eA7kWrvQsIxrEuzsCF1a7GexePkxayQn1aI8e7k163utI3cxJyRCZ712EWRLJD_0NOom-83odbUKNmtr1aPu6Tzu0utz701apAvkOMj4Lhtn8G7lU5gHjf0X3rW2zE08TK1TKxQXT9P3rqOm80SXpk-P97Ls08tYTc" />
                <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPOueMbxURgVzUipApJjTifHfHHKz4pkIkYrBOf6hL_x0UWb1wao9MRP_RuNvex03ZPkufRdx65YVnJ9YFJQdZyr2bvP05xaCyzdjS7-Cc9qZksxD336eCZkPEa2HrS-snIb09d0Xx1RLhozXLtZWz5gMQGJ_DD49IJEYiCIiwsYmT7vQipZpvH1v01qcb7Tut8G_CA9Y5UlB2Pja9H1Ah5wI2D0lspQV3D-kJG4NdSJEehmN6LXWbLUGyWJkVEbP-ASJ-DrvDMwk" />
              </div>
              <span className="text-sm font-medium">5,000+ businesses already joined</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Area */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-16 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="space-y-2">
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">Get Started</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Join the premier floral sourcing platform today.</p>
            </div>

            <div className="space-y-4">
              <Link href="/signup" className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-primary-100 dark:border-primary-900/30 hover:border-primary-500 dark:hover:border-primary-500 bg-white/50 dark:bg-zinc-900/50 transition-all group">
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Apply as Buyer</span>
                  <span className="text-sm text-zinc-500">For florists, event planners, and retail shops</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>

              <Link href="/signup" className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 transition-all group">
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Join as Supplier</span>
                  <span className="text-sm text-zinc-500">For farms, importers, and wholesalers</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-center text-zinc-600 dark:text-zinc-400">
                Already have a business account?
                <Link href="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline ml-1">Sign In</Link>
              </p>
            </div>

            <div className="flex justify-center gap-6 text-[11px] font-medium text-zinc-400 uppercase tracking-widest pt-4">
              <Link href="#" className="hover:text-primary-500">Help Center</Link>
              <Link href="#" className="hover:text-primary-500">Privacy</Link>
              <Link href="#" className="hover:text-primary-500">Terms</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
