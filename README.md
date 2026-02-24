<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/721f1858-5234-480a-a15d-55d7ef3ceb2e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# 🦴 ORTHO-X: AI-Powered Orthopedic Workflow 

ORTHO-X is an intelligent clinical decision support system built for the **Kaggle MedGemma Impact Challenge**. It combines Gemini 3.1 Pro's visual extraction with **MedGemma's** advanced clinical reasoning to classify fractures and plan grounded treatments.

## 🚀 Features
- **Two-Step AI Architecture:** Gemini extracts JSON imaging features -> MedGemma performs diagnostic reasoning.
- **RAG Classification:** Uses the 2018 AO/OTA Compendium for globally standardized fracture classification.
- **Strictly Grounded Treatment:** Forces search constraints to the AO Foundation to eliminate surgical hallucinations.
- **HIPAA-Ready:** Firebase Auth + Express Backend ensures secure Vertex AI communication.

## 🛠️ Tech Stack
- **Frontend:** React 19, Tailwind CSS 4, Framer Motion
- **Backend:** Express.js, better-sqlite3, Firebase Admin SDK
- **AI/ML:** Vertex AI (MedGemma), Google GenAI SDK (Gemini 3.1 Pro)

## ⚙️ How to Run Locally

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/ortho-x.git](https://github.com/yourusername/ortho-x.git)
   cd ortho-x
