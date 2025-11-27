// src/app/pledge/Pledge.tsx
"use client";

import React, {
  useRef,
  useState,
  forwardRef,
  ForwardRefRenderFunction,
} from "react";
import { useForm } from "react-hook-form";

type PledgeFormValues = {
  consent: boolean;
  fullName: string;
  gender: "male" | "female";
  dob: string;
  place: string;
  phone: string;
  email: string;
};

type PledgeData = PledgeFormValues & {
  certificateId: string;
  issuedOn: string;
};

const generateCertificateId = () => {
  return "SCRAPLY/EWPC/" + Date.now().toString(36).toUpperCase().slice(-6);
};

/* ---------------- Certificate component ---------------- */

interface CertificateProps {
  data: PledgeData;
  mode: "preview" | "export"; // preview => scaled; export => true size, hidden
}

const CertificateBase: ForwardRefRenderFunction<HTMLDivElement, CertificateProps> =
  ({ data, mode }, ref) => {
    const baseStyle: React.CSSProperties = {
      position: "relative",
      width: 900,
      height: 636,
      fontFamily: "Montserrat, system-ui, sans-serif",
      lineHeight: 1,
    };

    // Preview is visible & scaled, export is 1:1 and hidden off-screen
    const modeStyle: React.CSSProperties =
      mode === "preview"
        ? {
            transform: "scale(0.75)",
            transformOrigin: "top center",
          }
        : {
            position: "absolute",
            top: -9999,
            left: -9999,
          };

    // Slightly different values for preview vs export
    // so the DOWNLOADED certificate looks perfect
    const nameTop = mode === "preview" ? "58%" : "56.5%";
    const bottomDateLeft = mode === "preview" ? "15%" : "17.5%";
    const signatureRight = mode === "preview" ? "19%" : "18.5%";
    const certficateId = mode === "preview" ? "7%" : "10%";
    const signatureBottom = mode === "preview" ? "14%" : "16.5%";

    return (
      <div ref={ref} style={{ ...baseStyle, ...modeStyle }}>
        <img
          src="/assets/pledge-certificate-template.png"
          alt="Pledge Certificate"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* Name on the main line */}
        <div
          style={{
            position: "absolute",
            top: nameTop,
            left: "56%",
            transform: "translate(-50%, -50%)",
            fontSize: 30,
            fontWeight: 700,
            color: "#d11c1c",
            textAlign: "center",
            maxWidth: "80%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {data.fullName}
        </div>

        {/* "Issued on" date at top-right */}
        <div
          style={{
            position: "absolute",
            top: "18%",
            right: "11%",
            fontSize: 18,
          }}
        >
          Issued on : {data.issuedOn}
        </div>

        {/* Certificate ID bottom-left, above DATE text */}
        <div
          style={{
            position: "absolute",
            bottom: certficateId,
            left: "30%",
            fontSize: 20,
          }}
        >
          {data.certificateId}
        </div>

        {/* Bottom Date on the "Date" line */}
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: bottomDateLeft,
            fontSize: 14,
          }}
        >
          {data.issuedOn}
        </div>

        {/* Signature (user name) on Signature line */}
        <div
          style={{
            position: "absolute",
            bottom: signatureBottom,
            right: signatureRight,
            fontSize: 16,
          }}
        >
          {data.fullName}
        </div>
      </div>
    );
  };

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(CertificateBase);
Certificate.displayName = "Certificate";

/* --------------------------- Pledge Page ---------------------------- */

const Pledge: React.FC = () => {
  const [pledgeData, setPledgeData] = useState<PledgeData | null>(null);

  // This ref is used only for html2canvas → export PNG/PDF
  const exportRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PledgeFormValues>();

  const consentChecked = watch("consent");

  const onSubmit = (values: PledgeFormValues) => {
    const certificateId = generateCertificateId();
    const issuedOn = new Date().toLocaleDateString("en-IN");

    const data: PledgeData = {
      ...values,
      certificateId,
      issuedOn,
    };

    setPledgeData(data);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("scraply_pledge", JSON.stringify(data));
    }
  };

  /* ---------------- Download helpers (PNG / PDF) ---------------- */

  const downloadPng = async () => {
    if (!exportRef.current || !pledgeData) return;

    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(exportRef.current, {
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = "scraply-pledge.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadPdf = async () => {
    if (!exportRef.current || !pledgeData) return;

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(exportRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "pt", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("scraply-pledge.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-8xl mx-auto grid gap-10 lg:grid-cols-[1fr,1fr] px-6">
        {/* LEFT: Consent + Form */}
        <div className="mt-40">
          <div className="bg-green-600 text-white rounded-2xl p-6 space-y-3 shadow-lg">
            <h1 className="text-2xl font-semibold">Take the E-Waste Pledge</h1>
            <p className="text-sm opacity-90">
              By taking this pledge, you promise to dispose your electronic
              waste only through authorised recycling facilities and encourage
              others to do the same.
            </p>

            <label className="flex items-start gap-3 mt-3">
              <input
                type="checkbox"
                {...register("consent", { required: true })}
                className="mt-1 w-5 h-5 rounded border-white"
              />
              <span className="text-sm">
                Yes, I fully agree with all the points of this pledge.
              </span>
            </label>
            {errors.consent && (
              <p className="text-xs text-red-100 mt-1">
                You must agree before continuing.
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`mt-6 space-y-4 bg-white p-6 rounded-2xl shadow ${
              !consentChecked && "opacity-40 pointer-events-none"
            }`}
          >
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Name as you want on the certificate"
                {...register("fullName", { required: "Name is required" })}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-sm font-medium mb-1">Gender</p>
                <label className="mr-4 text-sm">
                  <input
                    type="radio"
                    value="male"
                    {...register("gender", { required: true })}
                    className="mr-1"
                  />
                  Male
                </label>
                <label className="text-sm">
                  <input
                    type="radio"
                    value="female"
                    {...register("gender", { required: true })}
                    className="mr-1"
                  />
                  Female
                </label>
                {errors.gender && (
                  <p className="text-xs text-red-500 mt-1">
                    Please select a gender.
                  </p>
                )}
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...register("dob", { required: true })}
                />
                {errors.dob && (
                  <p className="text-xs text-red-500 mt-1">
                    Please select your birth date.
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Place</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Where do you live?"
                  {...register("place", { required: true })}
                />
                {errors.place && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter your place.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Phone number"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter your phone number.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid email.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 text-sm"
            >
              {isSubmitting
                ? "Generating..."
                : "Take pledge & generate certificate"}
            </button>
          </form>
        </div>

        {/* RIGHT: Preview + Download */}
        <div className="flex flex-col mt-40 items-center">
          {pledgeData ? (
            <>
              {/* Visible preview (scaled) */}
              <Certificate data={pledgeData} mode="preview" />

              {/* Hidden full-size certificate for export */}
              <Certificate data={pledgeData} mode="export" ref={exportRef} />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={downloadPng}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm"
                >
                  Download PNG
                </button>
                <button
                  onClick={downloadPdf}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                >
                  Download PDF
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 mt-10 text-center">
              Fill the pledge form to preview and download your certificate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pledge;
