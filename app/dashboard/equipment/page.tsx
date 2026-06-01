import Image from "next/image";

export default function EquipmentPage() {
  const TRX_URL = "https://www.amazon.com/TRX-Suspension-Training-System-Travel/dp/B01LXL27XI?linkCode=ll2&tag=drconnorolive-20&linkId=8832a84ac506e94e64e32a751d9aeb47&language=en_US&ref_=as_li_ss_tl";
  const FOAM_URL = "https://www.amazon.com/Zmarthumb-Massager-Patented-Exercise-Recovery/dp/B0GCD9D2X8?linkCode=ll2&tag=drconnorolive-20&linkId=40ce3e790b53660041cafb8f0b7ff973&language=en_US&ref_=as_li_ss_tl";
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-teal-700 mb-2">Recommended Equipment</h1>
        <p className="text-gray-500 text-base">These are the tools Dr. Oliveri recommends to get the most out of your program.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border-2 border-teal-400 rounded-2xl shadow-md flex flex-col overflow-hidden">
          <Image src="/TRX%20(2).webp" alt="TRX Suspension Trainer" width={800} height={200} style={{ width: "100%", height: "200px", objectFit: "cover" }} unoptimized />
          <div className="p-6 flex flex-col flex-1">
            <span className="inline-block bg-teal-500 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">Recommended for Modules</span>
            <h2 className="text-xl font-bold text-gray-900 mb-3">TRX Suspension Trainer</h2>
            <p className="text-gray-600 text-sm flex-1 mb-5">The TRX Suspension Trainer is the perfect tool for building strength and stability at home. Used in several modules of the Elevate Pain-Free Program.</p>
            <a href={TRX_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-colors" style={{ backgroundColor: "#F5C842", color: "#1a1a1a" }}>Shop on Amazon →</a>
          </div>
        </div>
        <div className="bg-white border-2 border-teal-400 rounded-2xl shadow-md flex flex-col overflow-hidden">
          <Image src="/Foam%20Roller.jpg" alt="Foam Roller Massager" width={800} height={200} style={{ width: "100%", height: "200px", objectFit: "cover" }} unoptimized />
          <div className="p-6 flex flex-col flex-1">
            <span className="inline-block bg-teal-500 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">Recommended for Recovery</span>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Foam Roller Massager</h2>
            <p className="text-gray-600 text-sm flex-1 mb-5">This patented foam roller massager is perfect for thoracic spine mobilization and muscle recovery between sessions.</p>
            <a href={FOAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-colors" style={{ backgroundColor: "#F5C842", color: "#1a1a1a" }}>Shop on Amazon →</a>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 italic text-center">Disclaimer: These are affiliate links. As an Amazon Associate, Elevate Health earns a small commission from qualifying purchases at no extra cost to you.</p>
    </div>
  );
}