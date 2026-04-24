import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-6">
      <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-8 border border-red-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-4 tracking-tighter">ACCESS DENIED</h1>
      <p className="text-gray-400 text-center max-w-md mb-10 leading-relaxed">
        This area of <span className="text-white font-semibold">The Owner's Box</span> is reserved for authorized personnel only. If you believe this is an error, please contact the system administrator.
      </p>
      <Link 
        href="/"
        className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
      >
        RETURN HOME
      </Link>
    </div>
  );
}
