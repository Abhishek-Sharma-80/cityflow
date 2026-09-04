export type UserRole = "CITIZEN" | "LOGISTICS_OPERATOR" | "AUTHORITY";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isDemo: boolean;
  department?: string;
  organization?: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  expiresAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: "LOGIN" | "LOGOUT" | "REGISTER" | "DIRECT_ACCESS" | "DEMO_ACCESS" | "REPORT_INCIDENT" | "VERIFY_INCIDENT" | "RUN_VRP_OPTIMIZER" | "AUTHORITY_MITIGATION_TRIGGER" | "QUERY_AI_DECISION";
  details: string;
  timestamp: string;
  ipAddress?: string;
  status: "SUCCESS" | "DENIED" | "FAILED";
}