import Link from "next/link";

const STEPS = [
  { num: 1, title: "Check your email", desc: "Your login credentials have been sent to your inbox. Check your spam folder if you don't see it within a few minutes." },
  { num: 2, title: "Log in to your portal", desc: "Click the link in your email or visit /login with the credentials provided to access all 7 rehabilitation modules." },
  { num: 3, title: "Start Module 1 today", desc: "Begin with Understanding Your Pain — your first step toward a pain-free life starts now." },
];

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-10"><img src="/logo.PNG" alt="Elevate Health" style={{ height: "70px", width: "auto" }} /></Link>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">You&apos;re in!</h1>
        <p className="text-center text-gray-600 text-lg mb-10">Check your email for login details.</p>
        <div className="flex flex-col sm:flex-row gap-5 mb-10">
          {STEPS.map((step) => (<div key={step.num} className="flex-1 bg-teal-50 border border-teal-100 rounded-xl p-5"><div className="w-8 h-8 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center mb-3">{step.num}</div><h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3><p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p></div>))}
        </div>
        <Link href="/login" className="block w-full text-center bg-teal-500 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition-colors">Go to Login →</Link>
      </div>
    </div>
  );
}