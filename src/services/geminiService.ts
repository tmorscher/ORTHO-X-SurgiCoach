import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
};

const AO_COMPENDIUM_URL = "https://classification.aoeducation.org/files/download/AOOTA_Classification_2018_Compendium.pdf";

/**
 * Step A: Vision Extraction via Gemini 3.1 Pro
 */
export const extractVisionData = async (mediaParts: { data: string, mimeType: string }[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          ...mediaParts.map(m => ({ inlineData: m })),
          { text: `You are a radiologic extractor. Convert the visual data from these images/videos into a structured JSON format. 
          Identify: fracture lines, displacement, articular step-off, hardware positioning, and anatomical landmarks. 
          DO NOT make definitive clinical diagnoses. Output ONLY valid JSON.` }
        ]
      }
    ],
    config: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });
  return response.text;
};

/**
 * Step B: Clinical Reasoning via MedGemma (Vertex AI Proxy)
 */
export const medGemmaReasoning = async (visionJson: string, patientContext: string) => {
  const endpoint = process.env.MEDGEMMA_ENDPOINT;
  const apiKey = process.env.MEDGEMMA_API_KEY;

  if (!endpoint) {
    // Fallback or Mock if endpoint not configured
    console.warn("MedGemma endpoint not configured. Using Gemini fallback for reasoning.");
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Patient Context: ${patientContext}. Vision Data: ${visionJson}. 
      Perform high-fidelity clinical reasoning. Assess risks, identify red flags, and suggest next workflow steps. 
      Act as MedGemma, a specialized medical fine-tuned model.`
    });
    return response.text;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ visionData: visionJson, context: patientContext })
    });
    const data = await response.json();
    return data.reasoning;
  } catch (err) {
    console.error("MedGemma call failed:", err);
    return "Error calling MedGemma clinical reasoning engine.";
  }
};

/**
 * Document-Grounded AO/OTA Classification (RAG)
 */
export const classifyAOOTA = async (visionJson: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this vision data: ${visionJson}, classify the fracture using the AO/OTA 2018 Compendium. 
    You MUST use ONLY the definitions and morphological descriptions from the compendium at ${AO_COMPENDIUM_URL}.
    Output format:
    - Alphanumeric Code (e.g., 32-A1)
    - Exact clinical description from the PDF
    - Compendium Reference (citing the section)
    If data is insufficient, state: "(Precise sub-group cannot be determined from provided views per Compendium guidelines)."`,
    config: {
      tools: [{ urlContext: {} }]
    }
  });
  return response.text;
};

export const getTreatmentAdvice = async (diagnosis: string, patientContext: string, lowResource: boolean = false) => {
  const ai = getAI();
  const domainRestriction = "site:surgeryreference.aofoundation.org OR site:aofoundation.org/approved/ OR site:journals.lww.com/jorthotrauma/Fulltext/2018/01001/";
  
  let prompt = `Based on the diagnosis: "${diagnosis}" and patient context: "${patientContext}", provide evidence-based treatment advice strictly grounded in AO Foundation guidelines. 
  Every clinical claim or operative step MUST be followed by an inline markdown hyperlink to its direct source. 
  If no direct AO Foundation guideline is found, explicitly state: "No direct AO Foundation guideline found for this specific query" before providing general advice.`;

  if (lowResource) {
    prompt += `\n\nLOW-RESOURCE SETTING ENABLED: Prioritize and recommend generic, widely available fixation methods (e.g., external fixators, standard tubular plates, K-wires, casts) over proprietary manufacturer systems.`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${prompt} Search query: "${diagnosis} treatment guidelines ${domainRestriction}"`,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });
  
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
    title: chunk.web?.title,
    url: chunk.web?.uri
  })) || [];

  return {
    text: response.text,
    sources
  };
};

export const suggestImplants = async (diagnosis: string, treatmentPlan: string, lowResource: boolean = false) => {
  const ai = getAI();
  const domainRestriction = "site:surgeryreference.aofoundation.org OR site:aofoundation.org/approved/ OR site:journals.lww.com/jorthotrauma/Fulltext/2018/01001/";
  
  let prompt = `For a patient with: ${diagnosis} undergoing: ${treatmentPlan}, suggest appropriate orthopedic implants. 
  Strictly ground suggestions in AO Foundation approved hardware. 
  Every suggestion MUST be followed by an inline markdown hyperlink to its direct source.`;

  if (lowResource) {
    prompt += `\n\nLOW-RESOURCE SETTING ENABLED: Recommend generic fixation methods (e.g., standard plates, screws, K-wires) maximizing global clinical impact.`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${prompt} Search query: "${diagnosis} implant selection ${domainRestriction}"`,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
    title: chunk.web?.title,
    url: chunk.web?.uri
  })) || [];

  return {
    text: response.text,
    sources
  };
};

export const assessOutcome = async (visionJson: string, currentStatus: string) => {
  const ai = getAI();
  // Using the hand-off logic for outcome as well
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Vision Data (Post-Op): ${visionJson}. Clinical Status: ${currentStatus}. 
    Evaluate post-operative recovery. Extract hardware positioning, alignment, and range-of-motion metrics. 
    Monitor for complications (hardware failure, infection signs). Calculate functional recovery scores.`
  });
  return response.text;
};
