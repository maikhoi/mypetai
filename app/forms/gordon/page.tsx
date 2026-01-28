"use client";

import { useMemo, useState } from "react";

type FormState = {
  firstName: string;
  surname: string;
  email: string;
  mobile: string;
  homePhone: string;
  citySuburb: string;
  state: string;
  postCode: string;
  dob: string;

  gender: "Female" | "Male" | "Other" | "";
  genderOtherText: string;

  countryOfBirth: "Australia" | "Other" | "";
  countryOtherText: string;
  yearOfArrival: string;

  languageOtherThanEnglish: "No" | "Yes" | "";
  languageSpecify: string;

  aboriginalTorres: "No" | "YesAboriginal" | "YesTorres" | "YesBoth" | "";

  q1: "Yes" | "No" | "";
  q2: "Yes" | "No" | "";
  q3: "Unemployed" | "Employed" | "";
  q4: "Yes" | "No" | "";
  q5: "Yes" | "No" | "";
  q6: "Yes" | "No" | "";
  q7: "Yes" | "No" | "";
  q8: "Yes" | "No" | "";

  hearAbout: string; // single choice
  hearOtherText: string;

  optOutEmails: boolean;
};

const initialState: FormState = {
  firstName: "",
  surname: "",
  email: "",
  mobile: "",
  homePhone: "",
  citySuburb: "",
  state: "",
  postCode: "",
  dob: "",

  gender: "",
  genderOtherText: "",

  countryOfBirth: "",
  countryOtherText: "",
  yearOfArrival: "",

  languageOtherThanEnglish: "",
  languageSpecify: "",

  aboriginalTorres: "",

  q1: "",
  q2: "",
  q3: "",
  q4: "",
  q5: "",
  q6: "",
  q7: "",
  q8: "",

  hearAbout: "",
  hearOtherText: "",

  optOutEmails: false,
};

function Box({ checked }: { checked?: boolean }) {
  return (
    <span
      className={[
        "inline-flex h-4 w-4 items-center justify-center border border-black",
        checked ? "bg-black text-white" : "bg-white",
      ].join(" ")}
      aria-hidden
    >
      {checked ? "✓" : ""}
    </span>
  );
}

export default function GordonFormPage() {
  const [form, setForm] = useState<FormState>(useMemo(() => initialState, []));
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function onSend() {
    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/forms/gordon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("✅ Sent! PDF emailed to owner@mypetai.app");
    } catch (e: any) {
      setStatus(`❌ ${e?.message || "Failed"}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Skills & Jobs Centre Registration</h1>
            <p className="mt-1 text-sm text-zinc-300">
              Fill in the form then click Send to generate a PDF and email it to owner@mypetai.app
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setForm(initialState);
                setStatus("");
              }}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm"
              disabled={sending}
            >
              Reset
            </button>
            <button
              onClick={onSend}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        {status ? <div className="mt-4 text-sm text-zinc-100">{status}</div> : null}

        {/* FORM “PAPER” */}
        <div className="mt-6 rounded-2xl bg-white p-6 text-black shadow">
          <div className="border-b-2 border-black pb-3">
            <div className="text-lg font-bold">Registration</div>
            <div className="mt-1 text-xs">
              The Victorian Government monitors and funds The Gordon Skills and Jobs Centre…
            </div>
          </div>

          {/* Personal details grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <label className="flex flex-col gap-1">
              <span className="font-semibold">First Name</span>
              <input className="border border-black px-2 py-1" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-semibold">Surname</span>
              <input className="border border-black px-2 py-1" value={form.surname} onChange={(e) => set("surname", e.target.value)} />
            </label>

            <label className="col-span-2 flex flex-col gap-1">
              <span className="font-semibold">Email</span>
              <input className="border border-black px-2 py-1" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-semibold">Mobile</span>
              <input className="border border-black px-2 py-1" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-semibold">Home phone</span>
              <input className="border border-black px-2 py-1" value={form.homePhone} onChange={(e) => set("homePhone", e.target.value)} />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-semibold">City/Suburb</span>
              <input className="border border-black px-2 py-1" value={form.citySuburb} onChange={(e) => set("citySuburb", e.target.value)} />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="font-semibold">State</span>
                <input className="border border-black px-2 py-1" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-semibold">Post code</span>
                <input className="border border-black px-2 py-1" value={form.postCode} onChange={(e) => set("postCode", e.target.value)} />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="font-semibold">D.O.B.</span>
              <input className="border border-black px-2 py-1" value={form.dob} onChange={(e) => set("dob", e.target.value)} placeholder="DD/MM/YYYY" />
            </label>

            {/* Gender */}
            <div className="col-span-2 mt-2 border-t border-black pt-3">
              <div className="font-semibold">Gender</div>
              <div className="mt-2 flex flex-wrap items-center gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" checked={form.gender === "Female"} onChange={() => set("gender", "Female")} />
                  Female
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" checked={form.gender === "Male"} onChange={() => set("gender", "Male")} />
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" checked={form.gender === "Other"} onChange={() => set("gender", "Other")} />
                  Other — please specify:
                </label>
                <input
                  className="border border-black px-2 py-1"
                  value={form.genderOtherText}
                  onChange={(e) => set("genderOtherText", e.target.value)}
                  disabled={form.gender !== "Other"}
                />
              </div>
            </div>

            {/* Country of Birth */}
            <div className="col-span-2 mt-2 border-t border-black pt-3">
              <div className="font-semibold">Country of Birth</div>
              <div className="mt-2 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="radio" name="cob" checked={form.countryOfBirth === "Australia"} onChange={() => set("countryOfBirth", "Australia")} />
                  Australia
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="cob" checked={form.countryOfBirth === "Other"} onChange={() => set("countryOfBirth", "Other")} />
                  Other — please specify:
                </label>
                <input
                  className="border border-black px-2 py-1"
                  value={form.countryOtherText}
                  onChange={(e) => set("countryOtherText", e.target.value)}
                  disabled={form.countryOfBirth !== "Other"}
                />
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm font-semibold">If Other, year of arrival:</span>
                <input
                  className="border border-black px-2 py-1"
                  value={form.yearOfArrival}
                  onChange={(e) => set("yearOfArrival", e.target.value)}
                  disabled={form.countryOfBirth !== "Other"}
                />
              </div>
            </div>
          </div>

          {/* Questions block (table-like) */}
          <div className="mt-6 border-t-2 border-black pt-3">
            <div className="grid grid-cols-[1fr_140px] border border-black text-sm">
              {[
                ["Q1: Are you currently undertaking an apprenticeship?", "q1"],
                ["Q2: Are you currently undertaking a traineeship?", "q2"],
                ["Q3: Are you currently employed?", "q3"],
                ["Q4: Are you underemployed? (Working < 35hrs pw but wanting more)", "q4"],
                ["Q5: Are you currently studying?", "q5"],
                ["Q6: Are you a Carer or Parent?", "q6"],
                ["Q7: Have you been retrenched in the last 5 years?", "q7"],
                ["Q8: Do you consider yourself to have a disability/impairment/long-term condition?", "q8"],
              ].map(([label, key]) => (
                <div key={key} className="contents">
                  <div className="border-b border-black p-2">{label}</div>
                  <div className="border-b border-l border-black p-2">
                    {key === "q3" ? (
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="q3"
                            checked={form.q3 === "Unemployed"}
                            onChange={() => set("q3", "Unemployed")}
                          />
                          Unemployed
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="q3"
                            checked={form.q3 === "Employed"}
                            onChange={() => set("q3", "Employed")}
                          />
                          Employed
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={key}
                            checked={(form as any)[key] === "Yes"}
                            onChange={() => set(key as any, "Yes")}
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={key}
                            checked={(form as any)[key] === "No"}
                            onChange={() => set(key as any, "No")}
                          />
                          No
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hear about section */}
          <div className="mt-6 border-t-2 border-black pt-3">
            <div className="font-semibold">
              How did you FIRST hear about The Gordon Skills and Jobs Centre? (Choose only ONE)
            </div>

            {[
              "The Gordon TAFE",
              "Just walking by",
              "Learn Local (Comm. Centre / Neighbourhood House)",
              "Other TAFE / Private Training Provider (RTO)",
              "Other Skills and Jobs Centre",
              "Department of Justice / Corrections",
              "Word of mouth",
              "Community / Welfare Organisation",
              "Job Active / DES Provider",
              "Jobs Victoria (JVEN)",
              "Internet search / Website / Social Media",
              "Jobs Fair / Jobs Expo",
              "Skills Uplift Provider (Multiskills / Foresite / Vic Uni etc.)",
              "Other (please specify)",
            ].map((opt) => (
              <label key={opt} className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="hearAbout"
                  checked={form.hearAbout === opt}
                  onChange={() => set("hearAbout", opt)}
                />
                {opt}
              </label>
            ))}

            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="font-semibold">If “Other”, specify:</span>
              <input
                className="border border-black px-2 py-1"
                value={form.hearOtherText}
                onChange={(e) => set("hearOtherText", e.target.value)}
                disabled={form.hearAbout !== "Other (please specify)"}
              />
            </div>
          </div>

          {/* opt-out */}
          <div className="mt-6 border-t-2 border-black pt-3 text-sm">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.optOutEmails}
                onChange={(e) => set("optOutEmails", e.target.checked)}
              />
              I do not wish to be contacted by the Skills and Jobs Centre regarding job opportunities, workshops, information sessions or training opportunities.
            </label>
          </div>

          {/* footer note */}
          <div className="mt-6 text-xs">
            If you need assistance completing this form please call us on 03 5225 0700.
          </div>
        </div>
      </div>
    </div>
  );
}