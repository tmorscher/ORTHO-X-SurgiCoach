<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ortho-x.maivan.ai/wp-content/uploads/2025/03/cropped-Gemini_ORTHO-X.fyi_Logo_color_small-1.jpg" />
</div>

# Run and deploy your ORTHO-X SurgiCoach app

This contains everything you need to run your ORTHO-X SurgiCoach app locally.

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


ORTHO-X: MedGemma-Powered Orthopedic Workflow & Decision Support System

1. Problem Domain
Globally, orthopedic trauma care faces a critical bottleneck: a shortage of specialized surgeons and immense variability in fracture classification and treatment. In rural or low-resource settings, general practitioners often must make urgent orthopedic decisions without immediate specialist consultation. Misclassification of complex injuries (like a Schatzker Tibial Plateau fracture) leads to incorrect hardware selection, prolonged surgery times, and severe post-operative complications.

The Unmet Need: A tool that can translate raw medical imaging into standardized, globally recognized orthopedic classifications (AO/OTA) and ground its treatment recommendations entirely in vetted clinical guidelines, without hallucinating.

2. Effective Use of HAI-DEF Models
ORTHO-X solves this through a novel "Hand-Off Multimodal Architecture" using the Google HAI-DEF ecosystem:

Vision Extraction: We use Gemini 3.1 Pro to analyze uploaded DICOMs/X-Rays. Instead of forcing it to diagnose, it acts as a radiologic extractor, parsing geometric displacement and bone morphology into strict JSON.

Clinical Reasoning (MedGemma): The JSON is fed into MedGemma (via Vertex AI). MedGemma acts as the clinical brain, applying its medical fine-tuning to evaluate the findings against the 2018 AO/OTA Fracture Compendium (using long-context RAG) to output a deterministic classification and flag urgent surgical red flags.

3. Impact Potential
By standardizing diagnosis through the AO/OTA Fracture Classification compendium, ORTHO-X reduces subjective human error.

Resource Optimization: If a hospital flags a "low-resource setting," ORTHO-X dynamically adapts its treatment grounding to prioritize generic hardware (e.g., K-wires, standard tubular plates) over expensive proprietary implants.

Proactive Care: The Outcome Assessment module tracks post-op recovery metrics, shifting post-op care from reactive to proactive, reducing readmission rates.

4. Product Feasibility & Architecture
ORTHO-X is a production-ready React/Express stack.

Privacy First: It features an explicit PHI-scrubbing gate and uses Firebase Authentication to ensure only authorized clinicians can trigger Vertex AI inference.

Stateless Security: By routing the MedGemma API calls exclusively through a secure Express backend using Google Cloud ADC, client-side credential leakage is impossible.

Grounded Search: Treatment algorithms utilize Google Search Grounding strictly restricted via site: operators to the AO Foundation Surgery Reference, ensuring 100% accuracy.

5. Execution & Links
Code Repository: https://github.com/tmorscher/ORTHO-X-SurgiCoach

Demo Video: https://www.youtube.com/watch?v=Lo3DbIMQlWY

Interactive Demo: https://ortho-x-orthopedic-workflow-platform-for-diagnosi-103354814032.us-west1.run.app

6. The Team: The MAIVAN Mavens
https://maivan.ai/maivan-mavens/

ORTHO X SurgiCoach : MedGemma-powered Orthopedic Workflow Companion - The Demo Video Script
https://www.youtube.com/watch?v=Lo3DbIMQlWY

The Hook: Welcome to ORTHO-X. Every day, orthopedic surgeons face complex traumas. Misclassifying a fracture can lead to the wrong surgery and lifelong disability. ORTHO-X SurgiCoach changes that.

The AI Hand-off: Here is our workspace. A clinician uploads multiple Proximal Femur Fracture images. First, Gemini 3.1 Pro acts as our 'eyes', extracting joint displacement and bone morphology into JSON. Next, this data is passed to MedGemma, our 'brain.' Using its HAI-DEF medical tuning and the 2018 AO/OTA compendium in its context window, MedGemma classifies the fracture with zero hallucinations.

Grounded Treatment: Once classified, ORTHO-X generates a treatment plan. Notice how every single step is strictly grounded. We force the AI to only cite the AO Foundation Surgery Reference. If the clinician toggles 'Low Resource Setting', the AI instantly swaps proprietary plate recommendations for generic, accessible external fixators.

Privacy & Outcome Assessment: Privacy is paramount. Our Express backend securely authenticates clinicians via Firebase before ever touching Vertex AI, ensuring zero PHI leaks. Post-surgery, clinicians upload follow-up imaging, where MedGemma monitors hardware integrity and healing progress.

Conclusion: ORTHO-X isn't just an MedGemma model wrapper. It is a governed, multi-agent medical workflow designed to democratize elite orthopedic care globally.

Author
Thomas Morscher
Creator · thomasmorscher


Share
Competition Prize Track
Main Track
Agentic Workflow Prize
Project Links
ORTHO-X SurgiCoach Demo App for MedGemma Impact Challenge
https://ortho-x-orthopedic-workflow-platform-for-diagnosi-103354814032.us-west1.run.app

ORTHO-X Orthopedic workflow platform for diagnosis, treatment planning, implant selection, outcome assessment, and case documentation

GitHub Repo - MAIVAN.ai/ORTHO-X-SurgiCoach: ORTHO-X Orthopedic workflow platform for diagnosis, treatment planning, implant selection, outcome assessment, and case documentation
https://github.com/tmorscher/ORTHO-X-SurgiCoach


github.com

ORTHO-X connects Surgeons, their Mentors and MedTech partners through AI-driven Insights
https://ortho-x.maivan.ai/


maivan.ai

The SurgiCorder® Intelligence Suite >> A joint effort for safer surgery
https://maivan.ai/the-surgicorder-intelligence-suite-%e2%86%92-a-collaborative-development/


maivan.ai

SurgiCorder® Intelligence Suite : The Orthopedic Execution OS | SurgiCorder® > SurgiCoach > SurgiNaut
