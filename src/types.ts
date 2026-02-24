export interface Case {
  id: string;
  patient_uuid: string;
  patient_name: string; // Anonymized or placeholder
  diagnosis?: string;
  treatment_plan?: string;
  implant_choice?: string;
  outcome_notes?: string;
  created_at: string;
  notes?: Note[];
  media?: Media[];
  low_resource_mode: boolean;
  phi_confirmed: boolean;
}

export interface Media {
  id: string;
  case_id: string;
  type: 'image' | 'video' | 'youtube';
  url: string;
  created_at: string;
}

export interface Note {
  id: string;
  case_id: string;
  content: string;
  source_url?: string;
  created_at: string;
}

export type WorkflowStep = 'diagnosis' | 'treatment' | 'implant' | 'outcome';
