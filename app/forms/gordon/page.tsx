// app/forms/gordon/page.tsx
"use client";

import { useMemo, useState } from "react";

type YesNo = "Yes" | "No" | "";
type Employed = "Employed" | "Unemployed" | "";

type ActiveQuestion = "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6" | "Q7";

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

  languageOtherThanEnglish: YesNo;
  languageSpecify: string;

  aboriginalTorres: "No" | "YesAboriginal" | "YesTorres" | "YesBoth" | "";

  q1: YesNo;
  q2: YesNo;
  q3: Employed;
  q4: YesNo;
  q5: YesNo;
  q6: YesNo;
  q7: YesNo;
  q8: YesNo;

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

function resolveFromStart(form: FormState): ActiveQuestion {
  // Follow the red-arrow logic deterministically to pick the next question to show.
  // If something required is unanswered, that's the current "active" question.
  if (!form.q1) return "Q1";
  if (form.q1 === "Yes") return "Q7";

  // q1 === "No" -> Q2
  if (!form.q2) return "Q2";
  if (form.q2 === "Yes") return "Q7";

  // q2 === "No" -> Q3
  if (!form.q3) return "Q3";
  if (form.q3 === "Employed") {
    // employed -> Q4
    if (!form.q4) return "Q4";
    return "Q7";
  }

  // unemployed -> Q5
  if (!form.q5) return "Q5";
  if (form.q5 === "Yes") return "Q7";

  // q5 === "No" -> Q6
  if (!form.q6) return "Q6";
  return "Q7";
}

function QuestionRow({
  label,
  yesChecked,
  noChecked,
  onYes,
  onNo,
}: {
  label: string;
  yesChecked: boolean;
  noChecked: boolean;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_220px] border border-black text-sm">
      <div className="p-2">{label}</div>
      <div className="border-l border-black p-2">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2">
            <input type="radio" checked={yesChecked} onChange={onYes} />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={noChecked} onChange={onNo} />
            No
          </label>
        </div>
      </div>
    </div>
  );
}

export default function GordonFormPage() {
  const [form, setForm] = useState<FormState>(useMemo(() => initialState, []));
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const activeQ = resolveFromStart(form);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function onSend() {
    setSending(true);
    setStatus("");
    try {
      // optional: you can enforce Q7 answered before send if you want:
      // if (activeQ !== "Q7" || !form.q7) throw new Error("Please complete Q1–Q7 flow first.");

      const res = await fetch("/api/forms/gordon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, petname: "" }), // keep honeypot
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("✅ Sent! PDF emailed");
    } catch (e: any) {
      setStatus(`❌ ${e?.message || "Failed"}`);
    } finally {
      setSending(false);
    }
  }

  const hearOptions = [
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
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Skills & Jobs Centre Registration
            </h1>
            <p className="mt-1 text-sm text-zinc-300">
              Smart question flow (Q1–Q7) based on the official red-arrow logic.
              Click <span className="font-semibold">Send</span> to generate a PDF and email it.
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
              <input
                className="border border-black px-2 py-1"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-semibold">Surname</span>
              <input
                className="border border-black px-2 py-1"
                value={form.surname}
                onChange={(e) => set("surname", e.target.value)}
              />
            </label>

            <label className="col-span-2 flex flex-col gap-1">
              <span className="font-semibold">Email</span>
              <input
                className="border border-black px-2 py-1"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-semibold">Mobile</span>
              <input
                className="border border-black px-2 py-1"
                value={form.mobile}
                onChange={(e) => set("mobile", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-semibold">Home phone</span>
              <input
                className="border border-black px-2 py-1"
                value={form.homePhone}
                onChange={(e) => set("homePhone", e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-semibold">City/Suburb</span>
              <input
                className="border border-black px-2 py-1"
                value={form.citySuburb}
                onChange={(e) => set("citySuburb", e.target.value)}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="font-semibold">State</span>
                <input
                  className="border border-black px-2 py-1"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-semibold">Post code</span>
                <input
                  className="border border-black px-2 py-1"
                  value={form.postCode}
                  onChange={(e) => set("postCode", e.target.value)}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="font-semibold">D.O.B.</span>
              <input
                className="border border-black px-2 py-1"
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
                placeholder="DD/MM/YYYY"
              />
            </label>

            {/* Gender */}
            <div className="col-span-2 mt-2 border-t border-black pt-3">
              <div className="font-semibold">Gender</div>
              <div className="mt-2 flex flex-wrap items-center gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === "Female"}
                    onChange={() => set("gender", "Female")}
                  />
                  Female
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === "Male"}
                    onChange={() => set("gender", "Male")}
                  />
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    checked={form.gender === "Other"}
                    onChange={() => set("gender", "Other")}
                  />
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
                  <input
                    type="radio"
                    name="cob"
                    checked={form.countryOfBirth === "Australia"}
                    onChange={() => set("countryOfBirth", "Australia")}
                  />
                  Australia
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cob"
                    checked={form.countryOfBirth === "Other"}
                    onChange={() => set("countryOfBirth", "Other")}
                  />
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
                <span className="text-sm font-semibold">
                  If Other, year of arrival:
                </span>
                <input
                  className="border border-black px-2 py-1"
                  value={form.yearOfArrival}
                  onChange={(e) => set("yearOfArrival", e.target.value)}
                  disabled={form.countryOfBirth !== "Other"}
                />
              </div>
            </div>
          </div>

          {/* Questions block — SMART FLOW */}
          <div className="mt-6 border-t-2 border-black pt-3">
            <div className="mb-2 text-sm font-semibold">
              Smart Question Flow (shows only the next relevant question)
            </div>

            {/* Q1 */}
            {activeQ === "Q1" && (
              <QuestionRow
                label="Q1: Are you currently undertaking an apprenticeship?"
                yesChecked={form.q1 === "Yes"}
                noChecked={form.q1 === "No"}
                onYes={() => setForm((p) => ({ ...p, q1: "Yes" }))}
                onNo={() => setForm((p) => ({ ...p, q1: "No" }))}
              />
            )}

            {/* Q2 */}
            {activeQ === "Q2" && (
              <QuestionRow
                label="Q2: Are you currently undertaking a traineeship?"
                yesChecked={form.q2 === "Yes"}
                noChecked={form.q2 === "No"}
                onYes={() => setForm((p) => ({ ...p, q2: "Yes" }))}
                onNo={() => setForm((p) => ({ ...p, q2: "No" }))}
              />
            )}

            {/* Q3 */}
            {activeQ === "Q3" && (
              <div className="grid grid-cols-[1fr_320px] border border-black text-sm">
                <div className="p-2">Q3: Are you currently employed?</div>
                <div className="border-l border-black p-2">
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={form.q3 === "Unemployed"}
                        onChange={() =>
                          setForm((p) => ({ ...p, q3: "Unemployed" }))
                        }
                      />
                      No – Unemployed
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={form.q3 === "Employed"}
                        onChange={() =>
                          setForm((p) => ({ ...p, q3: "Employed" }))
                        }
                      />
                      Yes – Employed (Full time / Part / Casual)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Q4 */}
            {activeQ === "Q4" && (
              <QuestionRow
                label="Q4: Are you underemployed? (Working less than 35 hours pw but wanting more)"
                yesChecked={form.q4 === "Yes"}
                noChecked={form.q4 === "No"}
                onYes={() => setForm((p) => ({ ...p, q4: "Yes" }))}
                onNo={() => setForm((p) => ({ ...p, q4: "No" }))}
              />
            )}

            {/* Q5 */}
            {activeQ === "Q5" && (
              <QuestionRow
                label="Q5: Are you currently studying?"
                yesChecked={form.q5 === "Yes"}
                noChecked={form.q5 === "No"}
                onYes={() => setForm((p) => ({ ...p, q5: "Yes" }))}
                onNo={() => setForm((p) => ({ ...p, q5: "No" }))}
              />
            )}

            {/* Q6 */}
            {activeQ === "Q6" && (
              <QuestionRow
                label="Q6: Are you a Carer or Parent?"
                yesChecked={form.q6 === "Yes"}
                noChecked={form.q6 === "No"}
                onYes={() => setForm((p) => ({ ...p, q6: "Yes" }))}
                onNo={() => setForm((p) => ({ ...p, q6: "No" }))}
              />
            )}

            {/* Q7 */}
            {activeQ === "Q7" && (
              <QuestionRow
                label="Q7: Have you been retrenched in the last 5 years?"
                yesChecked={form.q7 === "Yes"}
                noChecked={form.q7 === "No"}
                onYes={() => setForm((p) => ({ ...p, q7: "Yes" }))}
                onNo={() => setForm((p) => ({ ...p, q7: "No" }))}
              />
            )}
          </div>

          {/* Q8 (shown once Q7 is reached, like the original flow section continuing) */}
          {activeQ === "Q7" && (
            <div className="mt-4 border-t border-black pt-3">
              <div className="grid grid-cols-[1fr_220px] border border-black text-sm">
                <div className="p-2">
                  Q8: Do you consider yourself to have a disability, impairment
                  or long-term condition?
                  <div className="mt-1 text-xs">
                    This may include: Physical, Developmental, Learning, Mental,
                    Intellectual, Medical condition — chronic or acute
                  </div>
                </div>
                <div className="border-l border-black p-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={form.q8 === "Yes"}
                        onChange={() => set("q8", "Yes")}
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={form.q8 === "No"}
                        onChange={() => set("q8", "No")}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hear about section */}
          <div className="mt-6 border-t-2 border-black pt-3">
            <div className="font-semibold">
              How did you FIRST hear about The Gordon Skills and Jobs Centre?
              (Choose only ONE)
            </div>

            {hearOptions.map((opt) => (
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
              I do not wish to be contacted by the Skills and Jobs Centre
              regarding job opportunities, workshops, information sessions or
              training opportunities.
            </label>
          </div>

          <div className="mt-6 text-xs">
            If you need assistance completing this form please call us on 03 5225
            0700.
          </div>
        </div>
      </div>
    </div>
  );
}