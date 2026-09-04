import crypto from "crypto";
import { UserProfile, UserRole, AuthSession, AuditLogEntry } from "@/types/auth";

interface StoredUser extends UserProfile {
  passwordHash: string;
  salt: string;
}

const auditLogs: AuditLogEntry[] = [];
const AUTH_SECRET = process.env.AUTH_SECRET || "cityflow-prod-auth-master-secret-key";

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function generateToken(userId: string, role: UserRole): string {
  const payload = JSON.stringify({
    userId,
    role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  const b64Payload = Buffer.from(payload).toString("base64");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(b64Payload).digest("hex");
  return `${b64Payload}.${signature}`;
}

export function verifyToken(token: string): { userId: string; role: UserRole } | null {
  try {
    const [b64Payload, signature] = token.split(".");
    if (!b64Payload || !signature) return null;
    
    const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(b64Payload).digest("hex");
    if (signature !== expectedSig) return null;
    
    const payloadStr = Buffer.from(b64Payload, "base64").toString("utf-8");
    const data = JSON.parse(payloadStr);
    if (data.expiresAt < Date.now()) return null;
    
    return { userId: data.userId, role: data.role };
  } catch {
    return null;
  }
}

// Seed Initial System Users
const usersStore: Map<string, StoredUser> = new Map();

function seedUsers() {
  const defaultAccounts = [
    {
      id: "usr-auth-1",
      email: "authority@cityflow.ai",
      name: "Dr. Rajesh Sharma",
      role: "AUTHORITY" as UserRole,
      department: "Delhi Traffic Police Command & SCATS Network",
      organization: "Metropolitan Urban Transport Authority",
      password: "AuthorityPassword2026!",
      isDemo: true,
      createdAt: "2026-01-15T08:30:00.000Z"
    },
    {
      id: "usr-log-1",
      email: "logistics@cityflow.ai",
      name: "Priya Menon",
      role: "LOGISTICS_OPERATOR" as UserRole,
      department: "Last-Mile Distribution Fleet Management",
      organization: "National Express Freight Network",
      password: "LogisticsPassword2026!",
      isDemo: true,
      createdAt: "2026-01-18T10:00:00.000Z"
    },
    {
      id: "usr-cit-1",
      email: "citizen@cityflow.ai",
      name: "Amit Kumar",
      role: "CITIZEN" as UserRole,
      department: "Registered Commuter & Civic Contributor",
      organization: "Delhi NCR Commuters Alliance",
      password: "CitizenPassword2026!",
      isDemo: true,
      createdAt: "2026-02-01T12:00:00.000Z"
    }
  ];

  for (const acc of defaultAccounts) {
    const salt = generateSalt();
    const passwordHash = hashPassword(acc.password, salt);
    usersStore.set(acc.email.toLowerCase(), {
      id: acc.id,
      name: acc.name,
      email: acc.email,
      role: acc.role,
      department: acc.department,
      organization: acc.organization,
      isDemo: acc.isDemo,
      createdAt: acc.createdAt,
      salt,
      passwordHash
    });
  }
}

seedUsers();

export async function authenticateUser(email: string, password: string): Promise<AuthSession | null> {
  const user = usersStore.get(email.toLowerCase());
  if (!user) return null;

  const inputHash = hashPassword(password, user.salt);
  if (inputHash !== user.passwordHash) {
    logAuditEvent(user.id, user.name, user.role, "LOGIN", "Failed login attempt (invalid password)", "FAILED");
    return null;
  }

  const token = generateToken(user.id, user.role);
  const session: AuthSession = {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      organization: user.organization,
      isDemo: user.isDemo,
      createdAt: user.createdAt
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  logAuditEvent(user.id, user.name, user.role, "LOGIN", `User logged in successfully via ${user.role} role`, "SUCCESS");
  return session;
}

export async function createDemoSession(role: UserRole): Promise<AuthSession> {
  const roleEmailMap: Record<UserRole, string> = {
    AUTHORITY: "authority@cityflow.ai",
    LOGISTICS_OPERATOR: "logistics@cityflow.ai",
    CITIZEN: "citizen@cityflow.ai"
  };

  const user = usersStore.get(roleEmailMap[role])!;
  const token = generateToken(user.id, user.role);

  const session: AuthSession = {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      organization: user.organization,
      isDemo: true,
      createdAt: user.createdAt
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  logAuditEvent(user.id, user.name, user.role, "DIRECT_ACCESS", `Authorized enterprise session initialized for ${role}`, "SUCCESS");
  return session;
}

export async function registerUser(name: string, email: string, password: string, role: UserRole): Promise<AuthSession | { error: string }> {
  if (usersStore.has(email.toLowerCase())) {
    return { error: "An account with this email address already exists." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long and contain numbers/symbols." };
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);
  const newUser: StoredUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    role,
    isDemo: false,
    department: role === "AUTHORITY" ? "City Municipal Transport Bureau" : role === "LOGISTICS_OPERATOR" ? "Commercial Delivery Fleet" : "Verified Citizen Commuter",
    organization: "CityFlow Network Participant",
    createdAt: new Date().toISOString(),
    salt,
    passwordHash
  };

  usersStore.set(email.toLowerCase(), newUser);
  const token = generateToken(newUser.id, newUser.role);

  logAuditEvent(newUser.id, newUser.name, newUser.role, "REGISTER", `New user registered as ${role}`, "SUCCESS");

  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      organization: newUser.organization,
      isDemo: false,
      createdAt: newUser.createdAt
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
}

export function logAuditEvent(
  userId: string,
  userName: string,
  userRole: UserRole,
  action: AuditLogEntry["action"],
  details: string,
  status: AuditLogEntry["status"] = "SUCCESS"
) {
  auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    userName,
    userRole,
    action,
    details,
    timestamp: new Date().toISOString(),
    status
  });

  if (auditLogs.length > 500) auditLogs.pop();
}

export function getAuditLogs(): AuditLogEntry[] {
  return auditLogs;
}