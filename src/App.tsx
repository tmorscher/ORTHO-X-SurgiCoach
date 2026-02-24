import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ChevronRight, 
  ClipboardList, 
  FileText, 
  Layers, 
  Plus, 
  Search, 
  Settings, 
  Upload, 
  X,
  BookOpen,
  ExternalLink,
  Loader2,
  CheckCircle2,
  History,
  LogIn,
  LogOut,
  ShieldCheck,
  Globe,
  Youtube,
  Video,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { cn } from './utils';
import { Case, Note, WorkflowStep, Media } from './types';
import { 
  extractVisionData,
  medGemmaReasoning,
  classifyAOOTA,
  getTreatmentAdvice, 
  suggestImplants, 
  assessOutcome 
} from './services/geminiService';
import { getAuthInstance, signInWithGoogle, logout, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [activeStep, setActiveStep] = useState<WorkflowStep>('diagnosis');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [lowResourceMode, setLowResourceMode] = useState(false);
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const auth = getAuthInstance();
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchCases();
    });
    return () => unsubscribe();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const auth = getAuthInstance();
    if (!auth) {
      setAuthError("Firebase not initialized. Check API keys.");
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const fetchCases = async () => {
    const res = await fetch('/api/cases');
    const data = await res.json();
    setCases(data);
  };

  const handleCreateCase = async () => {
    if (!newPatientName) return;
    const id = Math.random().toString(36).substring(2, 11);
    const patient_uuid = uuidv4();
    await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id, 
        patient_uuid, 
        patient_name: `Patient_${patient_uuid.slice(0, 8)}`, // Anonymized
        low_resource_mode: lowResourceMode 
      })
    });
    setNewPatientName('');
    setShowNewCaseModal(false);
    fetchCases();
  };

  const selectCase = async (id: string) => {
    const res = await fetch(`/api/cases/${id}`);
    const data = await res.json();
    setActiveCase(data);
    setLowResourceMode(!!data.low_resource_mode);
  };

  const updateCase = async (updates: Partial<Case>) => {
    if (!activeCase) return;
    await fetch(`/api/cases/${activeCase.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    selectCase(activeCase.id);
  };

  const addNote = async (content: string, sourceUrl?: string) => {
    if (!activeCase) return;
    const id = Math.random().toString(36).substring(2, 11);
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, case_id: activeCase.id, content, source_url: sourceUrl })
    });
    selectCase(activeCase.id);
  };

  const addMedia = async (type: Media['type'], url: string) => {
    if (!activeCase) return;
    const id = Math.random().toString(36).substring(2, 11);
    await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, case_id: activeCase.id, type, url })
    });
    selectCase(activeCase.id);
  };

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-ortho-bg p-4 overflow-y-auto">
        <div className="max-w-md w-full p-8 md:p-12 bg-white rounded-3xl shadow-2xl text-center space-y-8 my-auto">
          <div className="w-20 h-20 bg-ortho-ink rounded-3xl mx-auto flex items-center justify-center text-ortho-bg">
            <Activity size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">ORTHO-X</h1>
            <p className="text-sm opacity-50 font-serif italic">Advanced Orthopedic Workflow Platform</p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold opacity-40">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@hospital.com"
                className="w-full p-3 bg-ortho-bg/50 border border-ortho-line rounded-xl focus:outline-none focus:border-ortho-ink transition-colors text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold opacity-40">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-ortho-bg/50 border border-ortho-line rounded-xl focus:outline-none focus:border-ortho-ink transition-colors text-sm"
                required
              />
            </div>
            
            {authError && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">{authError}</p>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-ortho-ink text-ortho-bg rounded-xl font-bold uppercase tracking-widest hover:bg-ortho-ink/90 transition-all text-sm"
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ortho-line"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-2 opacity-30">Or continue with</span></div>
          </div>

          <button 
            onClick={signInWithGoogle}
            className="w-full py-4 border border-ortho-line text-ortho-ink rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-ortho-bg transition-all text-sm"
          >
            <LogIn size={20} />
            Google Account
          </button>

          <div className="pt-4">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-bold uppercase tracking-widest text-ortho-accent hover:underline"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
            </button>
          </div>

          <p className="text-[10px] opacity-40 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-ortho-bg text-ortho-ink overflow-hidden font-sans">
      {/* Sidebar - Case List */}
      <aside className="w-72 border-r border-ortho-line flex flex-col bg-white/50 backdrop-blur-sm">
        <div className="p-6 border-b border-ortho-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ortho-ink rounded flex items-center justify-center text-ortho-bg">
              <Activity size={18} />
            </div>
            <h1 className="font-bold tracking-tighter text-xl">ORTHO-X</h1>
          </div>
          <button 
            onClick={() => setShowNewCaseModal(true)}
            className="p-1 hover:bg-ortho-ink hover:text-ortho-bg rounded transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            <span className="col-header">Patient Cases</span>
          </div>
          {cases.map((c) => (
            <div 
              key={c.id}
              onClick={() => selectCase(c.id)}
              className={cn(
                "px-6 py-4 border-b border-ortho-line cursor-pointer transition-all",
                activeCase?.id === c.id ? "bg-ortho-ink text-ortho-bg" : "hover:bg-white"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm">{c.patient_name}</span>
                <span className="text-[10px] opacity-50 font-mono">
                  {format(new Date(c.created_at), 'MMM d')}
                </span>
              </div>
              <div className="text-[11px] opacity-60 truncate">
                {c.diagnosis || 'No diagnosis yet'}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-ortho-line bg-white/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold opacity-60">
              <div className="w-6 h-6 rounded-full bg-ortho-ink/10 flex items-center justify-center overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="User" /> : <Settings size={12} />}
              </div>
              <span className="truncate max-w-[120px]">{user.displayName}</span>
            </div>
            <button onClick={logout} className="p-1 hover:bg-red-50 text-red-600 rounded">
              <LogOut size={14} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs opacity-60">
            <Settings size={14} />
            <span>System Status: Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {activeCase ? (
          <>
            {/* Header / Tabs */}
            <header className="h-16 border-b border-ortho-line flex items-center px-8 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-8 h-full">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Active Case</span>
                  <span className="font-semibold text-sm">{activeCase.patient_name}</span>
                </div>
                <nav className="flex h-full gap-6">
                  {(['diagnosis', 'treatment', 'implant', 'outcome'] as WorkflowStep[]).map((step) => (
                    <button
                      key={step}
                      onClick={() => setActiveStep(step)}
                      className={cn(
                        "h-full px-2 text-xs font-medium uppercase tracking-widest border-b-2 transition-all",
                        activeStep === step ? "border-ortho-ink opacity-100" : "border-transparent opacity-40 hover:opacity-70"
                      )}
                    >
                      {step}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-ortho-line rounded-full px-3 py-1.5">
                  <Globe size={12} className={cn(lowResourceMode ? "text-emerald-600" : "opacity-30")} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Low Resource</span>
                  <button 
                    onClick={() => {
                      const newVal = !lowResourceMode;
                      setLowResourceMode(newVal);
                      updateCase({ low_resource_mode: newVal });
                    }}
                    className={cn(
                      "w-8 h-4 rounded-full relative transition-colors",
                      lowResourceMode ? "bg-emerald-500" : "bg-ortho-bg"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                      lowResourceMode ? "left-4.5" : "left-0.5"
                    )} />
                  </button>
                </div>

                <button 
                  onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                    isWorkspaceOpen ? "bg-ortho-ink text-ortho-bg" : "bg-white border border-ortho-line hover:bg-ortho-bg"
                  )}
                >
                  <BookOpen size={14} />
                  Workspace
                </button>
              </div>
            </header>

            {/* PHI Gate */}
            {!activeCase.phi_confirmed && (
              <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center justify-center gap-4">
                <AlertTriangle size={18} className="text-amber-600" />
                <p className="text-xs font-medium text-amber-900">
                  MANDATORY: Confirm all uploaded data has been scrubbed of Protected Health Information (PHI).
                </p>
                <button 
                  onClick={() => updateCase({ phi_confirmed: true })}
                  className="px-4 py-1.5 bg-amber-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors"
                >
                  Confirm De-identification
                </button>
              </div>
            )}

            {/* Workflow Area */}
            <div className="flex-1 overflow-y-auto p-12">
              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeStep === 'diagnosis' && (
                      <DiagnosisView 
                        caseData={activeCase} 
                        onUpdate={(d) => updateCase({ diagnosis: d })}
                        onAddNote={addNote}
                      />
                    )}
                    {activeStep === 'treatment' && (
                      <TreatmentView 
                        caseData={activeCase} 
                        onUpdate={(t) => updateCase({ treatment_plan: t })}
                        onAddNote={addNote}
                      />
                    )}
                    {activeStep === 'implant' && (
                      <ImplantView 
                        caseData={activeCase} 
                        onUpdate={(i) => updateCase({ implant_choice: i })}
                        onAddNote={addNote}
                      />
                    )}
                    {activeStep === 'outcome' && (
                      <OutcomeView 
                        caseData={activeCase} 
                        onUpdate={(o) => updateCase({ outcome_notes: o })}
                        onAddNote={addNote}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30">
            <Activity size={64} className="mb-4" />
            <p className="font-serif italic text-xl">Select or create a patient case to begin workflow</p>
          </div>
        )}

        {/* Workspace Panel (NotebookLM style) */}
        <AnimatePresence>
          {isWorkspaceOpen && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-96 h-full bg-white border-l border-ortho-line shadow-2xl z-20 flex flex-col"
            >
              <div className="p-6 border-b border-ortho-line flex items-center justify-between bg-ortho-bg/30">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  <h2 className="font-bold text-sm uppercase tracking-widest">Workspace</h2>
                </div>
                <button onClick={() => setIsWorkspaceOpen(false)} className="opacity-50 hover:opacity-100">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-2">
                  <span className="col-header">Saved Notes & Sources</span>
                  {activeCase?.notes?.length === 0 && (
                    <p className="text-xs opacity-40 italic">No notes saved yet. Add insights from the workflow steps.</p>
                  )}
                  {activeCase?.notes?.map((note) => (
                    <div key={note.id} className="p-4 bg-ortho-bg/50 rounded-lg border border-ortho-line text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="opacity-40 font-mono text-[9px]">{format(new Date(note.created_at), 'HH:mm')}</span>
                        {note.source_url && (
                          <a href={note.source_url} target="_blank" rel="noreferrer" className="text-ortho-accent hover:underline flex items-center gap-1">
                            Source <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      <div className="markdown-body">
                        <Markdown>{note.content}</Markdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-ortho-line bg-ortho-bg/10">
                <button className="w-full py-3 bg-ortho-ink text-ortho-bg rounded text-xs font-bold uppercase tracking-widest hover:bg-ortho-ink/90 transition-colors">
                  Generate Case Summary
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>

      {/* New Case Modal */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div className="fixed inset-0 bg-ortho-ink/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">New Patient Case</h2>
                  <p className="text-sm opacity-60">Initialize a new orthopedic workflow session.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold opacity-40">Patient Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full p-3 bg-ortho-bg/50 border border-ortho-line rounded focus:outline-none focus:border-ortho-ink transition-colors"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowNewCaseModal(false)}
                    className="flex-1 py-3 border border-ortho-line rounded text-xs font-bold uppercase tracking-widest hover:bg-ortho-bg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateCase}
                    className="flex-1 py-3 bg-ortho-ink text-ortho-bg rounded text-xs font-bold uppercase tracking-widest hover:bg-ortho-ink/90 transition-colors"
                  >
                    Create Case
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Views ---

function DiagnosisView({ caseData, onUpdate, onAddNote }: { caseData: Case, onUpdate: (d: string) => void, onAddNote: (c: string) => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [mediaList, setMediaList] = useState<{data: string, mimeType: string, type: 'image' | 'video'}[]>([]);
  const [visionJson, setVisionJson] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result as string;
        const mimeType = data.split(';')[0].split(':')[1];
        const type = mimeType.startsWith('video') ? 'video' : 'image';
        setMediaList(prev => [...prev, { data, mimeType, type }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const runPipeline = async () => {
    if (mediaList.length === 0) return;
    setIsAnalyzing(true);
    try {
      // Step A: Vision Extraction
      const mediaParts = mediaList.map(m => ({ data: m.data.split(',')[1], mimeType: m.mimeType }));
      const visionData = await extractVisionData(mediaParts);
      setVisionJson(visionData);

      // Step B: MedGemma Reasoning
      const reasoning = await medGemmaReasoning(visionData, "Orthopedic trauma case assessment.");
      onUpdate(reasoning);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runClassification = async () => {
    if (!visionJson) return;
    setIsClassifying(true);
    try {
      const classification = await classifyAOOTA(visionJson);
      onAddNote(`### AO/OTA Classification\n${classification}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsClassifying(false);
    }
  };

  const addYoutubeLink = () => {
    if (!youtubeUrl) return;
    setMediaList(prev => [...prev, { data: youtubeUrl, mimeType: 'text/plain', type: 'video' }]);
    setYoutubeUrl('');
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h2 className="text-4xl font-serif italic">Diagnosis Support</h2>
        <p className="text-lg opacity-60 leading-relaxed">
          The Multimodal "Hand-Off" Architecture: Vision extraction via Gemini 3.1 Pro followed by MedGemma clinical reasoning.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {mediaList.map((m, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-ortho-line relative group">
                {m.type === 'image' ? (
                  <img src={m.data} className="w-full h-full object-cover" alt="Scan" />
                ) : (
                  <video src={m.data} className="w-full h-full object-cover" />
                )}
                <button 
                  onClick={() => setMediaList(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-ortho-line flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors">
              <Plus size={24} className="opacity-20" />
              <span className="text-[10px] font-bold uppercase mt-2 opacity-40">Add Media</span>
              <input type="file" className="hidden" onChange={handleFileUpload} multiple accept="image/*,video/*" />
            </label>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="YouTube Link (Intra-op feed)"
              className="flex-1 p-3 bg-white border border-ortho-line rounded-lg text-xs focus:outline-none"
            />
            <button 
              onClick={addYoutubeLink}
              className="p-3 bg-ortho-ink text-ortho-bg rounded-lg hover:bg-ortho-ink/90 transition-colors"
            >
              <Youtube size={18} />
            </button>
          </div>
          
          <div className="space-y-3">
            <button 
              disabled={mediaList.length === 0 || isAnalyzing}
              onClick={runPipeline}
              className="w-full py-4 bg-ortho-ink text-ortho-bg rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              {isAnalyzing ? 'Processing Pipeline...' : 'Run Gemini-to-MedGemma Analysis'}
            </button>

            {visionJson && (
              <button 
                disabled={isClassifying}
                onClick={runClassification}
                className="w-full py-4 border-2 border-ortho-ink text-ortho-ink rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
              >
                {isClassifying ? <Loader2 className="animate-spin" size={20} /> : <Layers size={20} />}
                {isClassifying ? 'Classifying...' : 'AO/OTA Classification (RAG)'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-white rounded-2xl border border-ortho-line shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <span className="col-header">MedGemma Clinical Reasoning</span>
              {caseData.diagnosis && (
                <button 
                  onClick={() => onAddNote(caseData.diagnosis!)}
                  className="text-[10px] font-bold uppercase tracking-widest text-ortho-accent hover:underline"
                >
                  Save to Workspace
                </button>
              )}
            </div>
            {caseData.diagnosis ? (
              <div className="markdown-body">
                <Markdown>{caseData.diagnosis}</Markdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 opacity-20 text-center">
                <FileText size={48} className="mb-4" />
                <p className="text-sm italic">Clinical reasoning will appear here after analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TreatmentView({ caseData, onUpdate, onAddNote }: { caseData: Case, onUpdate: (t: string) => void, onAddNote: (c: string, url?: string) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [patientContext, setPatientContext] = useState('');
  const [sources, setSources] = useState<{title?: string, url?: string}[]>([]);

  const runAdvice = async () => {
    if (!caseData.diagnosis) return;
    setIsGenerating(true);
    try {
      const result = await getTreatmentAdvice(caseData.diagnosis, patientContext, !!caseData.low_resource_mode);
      onUpdate(result.text);
      setSources(result.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h2 className="text-4xl font-serif italic">Treatment Advice</h2>
        <p className="text-lg opacity-60 leading-relaxed">
          Evidence-based recommendations grounded in the latest orthopedic research and clinical guidelines.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <span className="col-header">Patient Context</span>
            <textarea 
              value={patientContext}
              onChange={(e) => setPatientContext(e.target.value)}
              placeholder="e.g. 45yo active male, no comorbidities, failed conservative management for 6 months..."
              className="w-full h-48 p-4 bg-white border border-ortho-line rounded-xl focus:outline-none focus:ring-2 focus:ring-ortho-ink/5 text-sm resize-none"
            />
          </div>
          
          <button 
            disabled={!caseData.diagnosis || isGenerating}
            onClick={runAdvice}
            className="w-full py-4 bg-ortho-ink text-ortho-bg rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {isGenerating ? 'Searching Guidelines...' : 'Generate Advice'}
          </button>

          {sources.length > 0 && (
            <div className="space-y-4">
              <span className="col-header">Research Sources</span>
              <div className="space-y-2">
                {sources.map((s, i) => (
                  <a 
                    key={i} 
                    href={s.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block p-3 bg-white border border-ortho-line rounded-lg text-[11px] hover:border-ortho-accent transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate pr-4">{s.title || 'Clinical Source'}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="p-8 bg-white rounded-2xl border border-ortho-line shadow-sm min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <span className="col-header">Recommended Plan</span>
              {caseData.treatment_plan && (
                <button 
                  onClick={() => onAddNote(caseData.treatment_plan!)}
                  className="text-[10px] font-bold uppercase tracking-widest text-ortho-accent hover:underline"
                >
                  Save to Workspace
                </button>
              )}
            </div>
            {caseData.treatment_plan ? (
              <div className="markdown-body">
                <Markdown>{caseData.treatment_plan}</Markdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 opacity-20 text-center">
                <ClipboardList size={48} className="mb-4" />
                <p className="text-sm italic">Advice will be generated based on diagnosis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImplantView({ caseData, onUpdate, onAddNote }: { caseData: Case, onUpdate: (i: string) => void, onAddNote: (c: string, url?: string) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sources, setSources] = useState<{title?: string, url?: string}[]>([]);

  const runImplantChoice = async () => {
    if (!caseData.diagnosis || !caseData.treatment_plan) return;
    setIsGenerating(true);
    try {
      const result = await suggestImplants(caseData.diagnosis, caseData.treatment_plan, !!caseData.low_resource_mode);
      onUpdate(result.text);
      setSources(result.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h2 className="text-4xl font-serif italic">Implant Choice</h2>
        <p className="text-lg opacity-60 leading-relaxed">
          Technical assistance for selecting hardware, prosthetics, and materials optimized for the patient's anatomy.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="p-6 bg-ortho-ink text-ortho-bg rounded-2xl space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest">Case Summary</h3>
            <div className="space-y-2 opacity-70 text-xs">
              <p><span className="font-bold">Diagnosis:</span> {caseData.diagnosis ? 'Available' : 'Missing'}</p>
              <p><span className="font-bold">Plan:</span> {caseData.treatment_plan ? 'Available' : 'Missing'}</p>
            </div>
            <button 
              disabled={!caseData.treatment_plan || isGenerating}
              onClick={runImplantChoice}
              className="w-full py-4 bg-white text-ortho-ink rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Layers size={20} />}
              {isGenerating ? 'Analyzing Hardware...' : 'Suggest Implants'}
            </button>
          </div>

          {sources.length > 0 && (
            <div className="space-y-4">
              <span className="col-header">Manufacturer Data</span>
              <div className="space-y-2">
                {sources.map((s, i) => (
                  <a 
                    key={i} 
                    href={s.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block p-3 bg-white border border-ortho-line rounded-lg text-[11px] hover:border-ortho-accent transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate pr-4">{s.title || 'Implant Data'}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="p-8 bg-white rounded-2xl border border-ortho-line shadow-sm min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <span className="col-header">Hardware Selection</span>
              {caseData.implant_choice && (
                <button 
                  onClick={() => onAddNote(caseData.implant_choice!)}
                  className="text-[10px] font-bold uppercase tracking-widest text-ortho-accent hover:underline"
                >
                  Save to Workspace
                </button>
              )}
            </div>
            {caseData.implant_choice ? (
              <div className="markdown-body">
                <Markdown>{caseData.implant_choice}</Markdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 opacity-20 text-center">
                <Layers size={48} className="mb-4" />
                <p className="text-sm italic">Hardware suggestions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OutcomeView({ caseData, onUpdate, onAddNote }: { caseData: Case, onUpdate: (o: string) => void, onAddNote: (c: string) => void }) {
  const [isAssessing, setIsAssessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [mediaList, setMediaList] = useState<{data: string, mimeType: string, type: 'image' | 'video'}[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result as string;
        const mimeType = data.split(';')[0].split(':')[1];
        const type = mimeType.startsWith('video') ? 'video' : 'image';
        setMediaList(prev => [...prev, { data, mimeType, type }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const runAssessment = async () => {
    if (mediaList.length === 0) return;
    setIsAssessing(true);
    try {
      const mediaParts = mediaList.map(m => ({ data: m.data.split(',')[1], mimeType: m.mimeType }));
      const visionData = await extractVisionData(mediaParts);
      const result = await assessOutcome(visionData, currentStatus);
      onUpdate(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h2 className="text-4xl font-serif italic">Outcome Assessment</h2>
        <p className="text-lg opacity-60 leading-relaxed">
          Post-operative tracking using Gemini-to-MedGemma pipeline for hardware positioning and ROM metrics.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="grid grid-cols-2 gap-2">
            {mediaList.map((m, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-ortho-line relative group">
                {m.type === 'image' ? (
                  <img src={m.data} className="w-full h-full object-cover" alt="Post-Op" />
                ) : (
                  <video src={m.data} className="w-full h-full object-cover" />
                )}
                <button 
                  onClick={() => setMediaList(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-ortho-line flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors">
              <Plus size={16} className="opacity-20" />
              <input type="file" className="hidden" onChange={handleFileUpload} multiple accept="image/*,video/*" />
            </label>
          </div>

          <div className="space-y-4">
            <span className="col-header">Clinical Progress</span>
            <textarea 
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              placeholder="e.g. 6 weeks post-op, ROM 0-110, minimal swelling..."
              className="w-full h-32 p-4 bg-white border border-ortho-line rounded-xl focus:outline-none text-sm resize-none"
            />
          </div>
          
          <button 
            disabled={mediaList.length === 0 || isAssessing}
            onClick={runAssessment}
            className="w-full py-4 bg-ortho-ink text-ortho-bg rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
          >
            {isAssessing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            {isAssessing ? 'Assessing Recovery...' : 'Run Post-Op Assessment'}
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="p-8 bg-white rounded-2xl border border-ortho-line shadow-sm min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <span className="col-header">Clinical Assessment</span>
              {caseData.outcome_notes && (
                <button 
                  onClick={() => onAddNote(caseData.outcome_notes!)}
                  className="text-[10px] font-bold uppercase tracking-widest text-ortho-accent hover:underline"
                >
                  Save to Workspace
                </button>
              )}
            </div>
            {caseData.outcome_notes ? (
              <div className="markdown-body">
                <Markdown>{caseData.outcome_notes}</Markdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 opacity-20 text-center">
                <History size={48} className="mb-4" />
                <p className="text-sm italic">Assessment results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
