export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "admin";
  stripe_customer_id: string;
  stripe_session_id: string;
  purchased_at: string;
  has_nutrition_course: boolean;
  has_consultation: boolean;
  consultation_booked: boolean;
  consultation_cancelled: boolean;
  consultation_completed: boolean;
  consultation_completed_at: string | null;
  login_dates: string[];
  last_login: string | null;
  created_at: string;
};

export type Lead = {
  id: string;
  email: string;
  full_name: string;
  source: string;
  purchased: boolean;
  created_at: string;
};

export type ModuleProgress = {
  id: string;
  user_id: string;
  module_number: number;
  unlocked_at: string;
  first_accessed_at: string;
  completed_at: string;
};

export type EmailLog = {
  id: string;
  recipient_email: string;
  email_type: string;
  sent_at: string;
  status: string;
};
