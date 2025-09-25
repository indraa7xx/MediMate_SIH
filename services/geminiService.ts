import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { ChatMessage } from '../types';

// Replace "YOUR_API_KEY_HERE" with the key you copied from Google AI Studio
// Replace the hardcoded key with a reference to the environment variable
const API_KEY = process.env.GEMINI_API_KEY;
 

const ai = new GoogleGenAI({ apiKey: API_KEY });

const DEMOGRAPHIC_QUESTIONS = [
    "To help generate an accurate summary for your doctor, could you please provide your name?",
    "Thank you. And what is your age?",
    "And what is your sex or gender? This information helps in assessing potential health risks."
];

const SYMPTOM_QUESTIONS = [
    "Thank you for that information. Now, let's focus on your symptoms.\n\nFirst, could you please describe the main symptom or reason you're seeking help today?",
    "About when did this main symptom first start, and how long has it been going on?",
    "Can you describe exactly where you feel the symptom and what it feels like (e.g., sharp, dull, aching, burning)?",
    "On a scale of 1 to 10, with 10 being the worst imaginable, how would you rate your main symptom right now?",
    "Since it began, would you say the symptom has been getting better, worse, or staying about the same?",
    "Besides this main issue, have you noticed any other symptoms, even if they seem unrelated?",
    "Is there anything you've noticed that makes the symptom worse or better?",
    "Have you tried taking or doing anything to treat this yourself? If so, what did you try and did it help?",
    "Do you have any pre-existing medical conditions, such as diabetes, high blood pressure, or asthma?",
    "Finally, are you currently taking any medications or supplements, and do you have any known allergies?",
];

export const PRELIMINARY_QUESTIONS = [...DEMOGRAPHIC_QUESTIONS, ...SYMPTOM_QUESTIONS];


export const startChat = (systemInstruction: string): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
  return chat;
};

const formatReport = (data: Record<string, string>): string => {
    return `
### Patient Summary Report
**Date & Time of Report:** ${new Date().toLocaleString()}

---

**Patient Details**
- **Patient Name / ID:** ${data.patientName}
- **Age:** ${data.age}
- **Sex / Gender:** ${data.sex}

---

**Chief Complaint**
- ${data.chiefComplaint}

---

**Symptom Analysis**
- **Symptom Onset:** ${data.symptomOnset}
- **Duration of Symptoms:** ${data.duration}
- **Symptom Progression:** ${data.progression}
- **Symptom Severity:** ${data.severity}
- **Associated Symptoms:** ${data.associatedSymptoms}
- **Aggravating Factors:** ${data.aggravatingFactors}
- **Relieving Factors:** ${data.relievingFactors}

---

**Medical Context**
- **Current Medications / Supplements:** ${data.currentMedications}
- **Relevant Medical History:** ${data.medicalHistory}
- **Family History:** ${data.familyHistory}
- **Allergies:** ${data.allergies}

---

**Additional Information**
- **Lifestyle Factors:** ${data.lifestyleFactors}
- **Patient’s Self-treatment Attempts:** ${data.selfTreatment}
- **Advice Given in Conversation:** ${data.adviceGiven}
- **Follow-up Recommendation:** ${data.followUp}
    `;
};


export const generateSummaryReport = async (chatHistory: ChatMessage[]): Promise<string> => {
    const transcript = chatHistory
        .map(msg => `${msg.role === 'user' ? 'Patient' : 'Assistant'}: ${msg.text}`)
        .join('\n');

    const prompt = `Analyze the following health consultation transcript. Extract information and structure it into a JSON object based on the provided schema. Populate all fields. If information for a field is not present, use the value "Not mentioned".

TRANSCRIPT:
${transcript}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    patientName: { type: Type.STRING, description: "Patient's name or ID, if provided." },
                    age: { type: Type.STRING, description: "Patient's age, if provided." },
                    sex: { type: Type.STRING, description: "Patient's sex or gender, if provided." },
                    chiefComplaint: { type: Type.STRING, description: "The main issue in the patient’s own words." },
                    symptomOnset: { type: Type.STRING, description: "When the main symptom started." },
                    duration: { type: Type.STRING, description: "How long the symptoms have been present." },
                    progression: { type: Type.STRING, description: "Whether symptoms are improving, worsening, or stable." },
                    severity: { type: Type.STRING, description: "Symptom severity (mild, moderate, severe, or pain scale)." },
                    associatedSymptoms: { type: Type.STRING, description: "Other symptoms the patient noticed." },
                    aggravatingFactors: { type: Type.STRING, description: "What makes the symptoms worse." },
                    relievingFactors: { type: Type.STRING, description: "What makes the symptoms better." },
                    currentMedications: { type: Type.STRING, description: "Any medications or supplements the patient is taking." },
                    medicalHistory: { type: Type.STRING, description: "Patient's past conditions, surgeries, or chronic illnesses." },
                    familyHistory: { type: Type.STRING, description: "Relevant family medical history, if mentioned." },
                    allergies: { type: Type.STRING, description: "Any drug, food, or environmental allergies." },
                    lifestyleFactors: { type: Type.STRING, description: "Lifestyle factors like smoking, diet, sleep, etc." },
                    selfTreatment: { type: Type.STRING, description: "Any over-the-counter meds or home remedies the patient tried." },
                    adviceGiven: { type: Type.STRING, description: "Non-prescriptive guidance provided during the conversation." },
                    followUp: { type: Type.STRING, description: "The recommended next step (e.g., see a doctor, monitor symptoms)." },
                },
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        const reportData = JSON.parse(jsonText);
        return formatReport(reportData);
    } catch (e) {
        console.error("Failed to parse summary report JSON:", e);
        // Fallback to raw text if JSON parsing fails
        return "Could not generate a structured report, but here is the raw summary:\n\n" + response.text;
    }
};