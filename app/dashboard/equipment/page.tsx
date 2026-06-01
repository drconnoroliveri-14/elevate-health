import Image from "next/image";

export default function EquipmentPage() {
  const TRX_URL =
    "https://www.amazon.com/TRX-Suspension-Training-System-Travel/dp/B01LXL27XI?crid=2MWMSGA69W848&dib=eyJ2IjoiMSJ9.6h3WEiJTCikzHlXScPSMul3MuD7IaIH-oJ-vmh_7JGURS7cXTGRRStUZKiw-ME1Lh65qrS3UP3AzjEDMdn2CjHdiP0T661gHyxXQCKKveB0tFNV0bg5WEWhZX51aNDdJAbT8g4g5GtN2DedYD29czIsOdhO4xLFou2ftYamvRBozSuyRBkEE8SVOahX4aOm4rSnclu3xblY2PMCnvokkW9q2cUXEIT4zlbGV-7fk_69bEj2_2KmfnX3tenB9rOlznq9ftONmkY5a-6sOGPCMHl_n-Otriawbcx65Kooce3Q.m-Pb48umnpk7ovWlOKQEzBBrkxb_7omSMerIgc0JFXw&dib_tag=se&keywords=trx+straps&qid=1779655823&sprefix=trx+strap%2Caps%2C259&sr=8-1&linkCode=ll2&tag=drconnorolive-20&linkId=8832a84ac506e94e64e32a751d9aeb47&language=en_US&ref_=as_li_ss_tl";

  const FOAM_URL =
    "https://www.amazon.com/Zmarthumb-Massager-Patented-Exercise-Recovery/dp/B0GCD9D2X8?content-id=amzn1.sym.18b50c3f-a123-4897-9b3c-9fc67766a865%3Aamzn1.sym.18b50c3f-a123-4897-9b3c-9fc67766a865&crid=29EY38EZ0V8Y0&cv_ct_cx=foam%2Broller&keywords=foam%2Broller&pd_rd_i=B0GCD9D2X8&pd_rd_r=eed3b090-ab0d-41fe-8565-d853739203c2&pd_rd_w=Hh0Ek&pd_rd_wg=Q7p7z&pf_rd_p=18b50c3f-a123-4897-9b3c-9fc67766a865&pf_rd_r=FD0GXNY26AVGKCFW8AWT&qid=1779666599&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=foam%2Broll%2Caps%2C285&sr=1-3-28dec9df-ff35-40b5-8e68-2d1c97dfc4dc-spons&aref=ZAsXgIoxfU&sp_csd=d2lkZ2V0TmFtZT1zcF9zZWFyY2hfdGhlbWF0aWM&th=1&linkCode=ll2&tag=drconnorolive-20&linkId=40ce3e790b53660041cafb8f0b7ff973&language=en_US&ref_=as_li_ss_tl";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-teal-700 mb-2">Recommended Equipment</h1>
        <p className="text-gray-500 text-base">
          These are the tools Dr. Oliveri recommends to get the most out of your program.
        </p>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Card 1 — TRX */}
        <div className="bg-white border-2 border-teal-400 rounded-2xl shadow-md flex flex-col overflow-hidden">
          <Image src="/TRX%20(2).webp" alt="TRX Suspension Trainer" width={800} height={200} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px 8px 0 0" }} unoptimized />
          <div className="p-6 flex flex-col flex-1">
            <span className="inline-block bg-teal-500 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">
              Recommended for Modules
            </span>
            <h2 className="text-xl font-bold text-gray-900 mb-3">TRX Suspension Trainer</h2>
            <p className="text-gray-600 text-sm flex-1 mb-5">
              The TRX Suspension Trainer is the perfect tool for building strength and stability at home. Used in several modules of the Elevate Pain-Free Program.
            </p>
            <a
              href={TRX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="amazon-btn inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              style={{ backgroundColor: "#F5C842", color: "#1a1a1a" }}
            >
              Shop on Amazon →
            </a>
          </div>
        </div>

        {/* Card 2 — Foam Roller */}
        <div className="bg-white border-2 border-teal-400 rounded-2xl shadow-md flex flex-col overflow-hidden">
          <Image src="/Foam%20Roller.jpg" alt="Foam Roller Massager" width={800} height={200} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px 8px 0 0" }} unoptimized />
          <div className="p-6 flex flex-col flex-1">
            <span className="inline-block bg-teal-500 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">
              Recommended for Recovery
            </span>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Foam Roller Massager</h2>
            <p className="text-gray-600 text-sm flex-1 mb-5">
              This patented foam roller massager is perfect for thoracic spine mobilization and muscle recovery between sessions.
            </p>
            <a
              href={FOAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="amazon-btn inline-flex items-center justify-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              style={{ backgroundColor: "#F5C842", color: "#1a1a1a" }}
            >
              Shop on Amazon →
            </a>
          </div>
        </div>
      </div>

      {/* Affiliate disclaimer */}
      <p className="text-xs text-gray-400 italic text-center">
        Disclaimer: These are affiliate links. As an Amazon Associate, Elevate Health earns a small commission from qualifying purchases at no extra cost to you. We only recommend products we genuinely use and believe in.
      </p>
    </div>
  );
}
