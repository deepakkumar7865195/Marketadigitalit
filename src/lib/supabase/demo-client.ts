// A lightweight, in-memory stand-in for the Supabase client used ONLY in demo
// mode (NEXT_PUBLIC_DEMO_AUTH=true). It serves seeded data from demo-data.ts
// and lets CRUD server actions mutate that data for the life of the dev server.

import {
  DEMO_SESSION_COOKIE,
  isDemoMode,
} from "@/lib/demo-mode";
import { db, DEMO_ADMIN_ID, seedProfileByEmail } from "@/lib/demo-data";

export interface DemoCookieJar {
  get(name: string): string | null;
  set(name: string, value: string, options?: Record<string, unknown>): void;
  delete(name: string): void;
}

function noopJar(): DemoCookieJar {
  const store = new Map<string, string>();
  return {
    get: (n) => store.get(n) ?? null,
    set: (n, v) => void store.set(n, v),
    delete: (n) => void store.delete(n),
  };
}

// ---------------------------------------------------------------------------
// Select-string parser: "*, clients(id, company_name), project_members(user_id)"
// ---------------------------------------------------------------------------
function parseSelect(cols: string) {
  const frags = splitTopLevel(cols).map((raw) => raw.trim()).filter(Boolean);

  const top: string[] = [];
  const embedded: { name: string; inner: boolean; sub: string }[] = [];

  for (const frag of frags) {
    const open = frag.indexOf("(");
    if (open === -1) {
      top.push(frag.replace(/!inner/g, "").trim());
    } else {
      let name = frag.slice(0, open).trim();
      const inner = name.endsWith("!inner");
      name = name.replace(/!inner/g, "").trim();
      const sub = frag.slice(open + 1, frag.lastIndexOf(")"));
      embedded.push({ name, inner, sub });
    }
  }

  const star = top.includes("*");
  return { top, embedded, star };
}

const splitTopLevel = (s: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
};

// ---------------------------------------------------------------------------
// Relation resolution between seeded tables
// ---------------------------------------------------------------------------
function related(table: string, name: string, row: any): any {
  if (name === "profiles") {
    const fk: Record<string, string> = {
      attendance: "user_id",
      daily_work_reports: "user_id",
      leave_requests: "user_id",
      tasks: "assigned_to",
      project_members: "user_id",
    };
    const col = fk[table];
    if (!col) return undefined;
    const id = row?.[col];
    return id ? db.profiles.find((p) => p.id === id) ?? null : null;
  }
  if (name === "clients") {
    if (table === "projects") {
      const id = row?.client_id;
      return id ? db.clients.find((c) => c.id === id) ?? null : null;
    }
    return undefined;
  }
  if (name === "projects") {
    if (table === "daily_work_reports" || table === "tasks") {
      const id = row?.project_id;
      return id ? db.projects.find((p) => p.id === id) ?? null : null;
    }
    if (table === "clients") return db.projects.filter((p) => p.client_id === row.id);
    return undefined;
  }
  if (name === "tasks") {
    if (table === "projects") return db.tasks.filter((t) => t.project_id === row.id);
    if (table === "daily_work_reports") {
      const id = row?.task_id;
      return id ? db.tasks.find((t) => t.id === id) ?? null : null;
    }
    if (table === "clients") return undefined; // handled inside projects recursion
    return undefined;
  }
  if (name === "project_members") {
    if (table === "projects") return db.project_members.filter((pm) => pm.project_id === row.id);
    return undefined;
  }
  return undefined;
}

function tableFor(name: string): string {
  return name === "profiles" ? "profiles" : name === "clients" ? "clients" : name;
}

function project(tableName: string, row: any, parsed: ReturnType<typeof parseSelect>): any {
  const out: any = parsed.star ? { ...row } : {};
  if (!parsed.star) {
    for (const col of parsed.top) {
      if (col in row) out[col] = row[col];
    }
  }
  for (const frag of parsed.embedded) {
    const value = related(tableName, frag.name, row);
    const subParsed = parseSelect(frag.sub || "*");
    const childTable = tableFor(frag.name);
    const expand = (v: any) => project(childTable, v, subParsed);
    if (Array.isArray(value)) out[frag.name] = value.map(expand);
    else out[frag.name] = value != null ? expand(value) : null;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------
type Filter =
  | { kind: "eq"; column: string; value: unknown }
  | { kind: "in"; column: string; values: unknown[] }
  | { kind: "gte"; column: string; value: unknown }
  | { kind: "lte"; column: string; value: unknown }
  | { kind: "or"; clauses: { field: string; pattern: string }[] };

function pathValues(row: any, column: string): unknown[] {
  const parts = column.split(".");
  let cur: any[] = [row];
  for (const part of parts) {
    const next: any[] = [];
    for (const c of cur) {
      if (c && typeof c === "object") {
        const v = c[part];
        if (Array.isArray(v)) next.push(...v);
        else if (v !== undefined) next.push(v);
      }
    }
    cur = next;
    if (cur.length === 0) break;
  }
  return cur;
}

function matches(row: any, filters: Filter[]): boolean {
  for (const f of filters) {
    if (f.kind === "or") {
      const ok = f.clauses.some(({ field, pattern }) => {
        const needle = pattern.replace(/^%|%$/g, "").toLowerCase();
        return pathValues(row, field).some((v) => String(v ?? "").toLowerCase().includes(needle));
      });
      if (!ok) return false;
      continue;
    }
    const vals = pathValues(row, f.column);
    const ok = vals.some((v) => {
      if (f.kind === "eq") return v == f.value as unknown;
      if (f.kind === "in") return (f.values as unknown[]).includes(v);
      if (f.kind === "gte") return String(v) >= String(f.value);
      if (f.kind === "lte") return String(v) <= String(f.value);
      return false;
    });
    if (!ok) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Query builder (thenable)
// ---------------------------------------------------------------------------
type Mode =
  | { type: "select"; cols: string }
  | { type: "insert"; rows: Record<string, unknown>[] }
  | { type: "update"; payload: Record<string, unknown> }
  | { type: "delete" }
  | { type: "upsert"; rows: Record<string, unknown>[] };

class MockQuery {
  private table: string;
  private filters: Filter[] = [];
  private orderCol: string | null = null;
  private orderAsc = true;
  private limitN: number | null = null;
  private singleMode = false;
  private maybeMode = false;
  private mode: Mode;

  constructor(table: string) {
    this.table = table;
    this.mode = { type: "select", cols: "*" };
  }

  select(cols: string) {
    if (this.mode.type === "insert" || this.mode.type === "upsert") return this;
    this.mode = { type: "select", cols };
    return this;
  }
  insert(rows: Record<string, unknown> | Record<string, unknown>[]) {
    this.mode = { type: "insert", rows: Array.isArray(rows) ? rows : [rows] };
    return this;
  }
  upsert(rows: Record<string, unknown> | Record<string, unknown>[], _opts?: unknown) {
    this.mode = { type: "upsert", rows: Array.isArray(rows) ? rows : [rows] };
    return this;
  }
  update(payload: Record<string, unknown>) {
    this.mode = { type: "update", payload };
    return this;
  }
  delete() {
    this.mode = { type: "delete" };
    return this;
  }
  eq(column: string, value: unknown) {
    this.filters.push({ kind: "eq", column, value });
    return this;
  }
  in(column: string, values: unknown[]) {
    this.filters.push({ kind: "in", column, values });
    return this;
  }
  gte(column: string, value: unknown) {
    this.filters.push({ kind: "gte", column, value });
    return this;
  }
  lte(column: string, value: unknown) {
    this.filters.push({ kind: "lte", column, value });
    return this;
  }
  or(orString: string) {
    const clauses = orString
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const [field, op, pattern] = c.split(".");
        return { field, op, pattern };
      })
      .filter((c) => c.op === "ilike")
      .map(({ field, pattern }) => ({ field, pattern: pattern ?? "" }));
    if (clauses.length) this.filters.push({ kind: "or", clauses });
    return this;
  }
  order(column: string, opts?: { ascending?: boolean; nullsFirst?: boolean }) {
    this.orderCol = column;
    this.orderAsc = opts?.ascending !== false;
    return this;
  }
  limit(n: number) {
    this.limitN = n;
    return this;
  }
  single() {
    this.singleMode = true;
    return this;
  }
  maybeSingle() {
    this.singleMode = true;
    this.maybeMode = true;
    return this;
  }

  async execute(): Promise<{ data: any; error: any; count?: number | null }> {
    const rows: any[] = (db as any)[this.table] ?? [];

    if (this.mode.type === "select") {
      const parsed = parseSelect(this.mode.cols);
      let out = rows
        .filter((r) => matches(r, this.filters))
        .map((r) => project(this.table, r, parsed));

      if (this.orderCol) {
        const col = this.orderCol;
        out = [...out].sort((a, b) => {
          const av = a[col];
          const bv = b[col];
          const cmp =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av ?? "").localeCompare(String(bv ?? ""));
          return this.orderAsc ? cmp : -cmp;
        });
      }
      if (this.limitN != null) out = out.slice(0, this.limitN);

      if (this.singleMode) {
        if (out.length > 1 && !this.maybeMode)
          return { data: null, error: { message: "more than 1 row returned", code: "PGRST116" } };
        if (out.length > 1 && this.maybeMode) return { data: out[0], error: null };
        return { data: out[0] ?? null, error: null };
      }
      return { data: out, error: null };
    }

    if (this.mode.type === "insert" || this.mode.type === "upsert") {
      const inserted: any[] = [];
      for (const row of this.mode.rows as Record<string, unknown>[]) {
        const existing =
          this.mode.type === "upsert" && row.id
            ? rows.find((r) => r.id === row.id)
            : undefined;
        if (existing) {
          Object.assign(existing, row);
          inserted.push(existing);
        } else {
          const clone = {
            id: row.id ?? `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...row,
          };
          rows.push(clone);
          inserted.push(clone);
        }
      }
      return { data: this.singleMode ? inserted[0] ?? null : inserted, error: null };
    }

    if (this.mode.type === "update") {
      const touched = rows.filter((r) => matches(r, this.filters));
      for (const r of touched) {
        Object.assign(r, this.mode.payload, { updated_at: new Date().toISOString() });
      }
      return { data: this.singleMode ? touched[0] ?? null : null, error: null };
    }

    if (this.mode.type === "delete") {
      const doomed = rows.filter((r) => matches(r, this.filters));
      (db as any)[this.table] = rows.filter((r) => !doomed.includes(r));
      return { data: null, error: null };
    }

    return { data: null, error: null };
  }

  then<TResult1 = { data: any; error: any; count?: number | null }, TResult2 = never>(
    onfulfilled?:
      | ((value: { data: any; error: any; count?: number | null }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

// ---------------------------------------------------------------------------
// Auth + storage + public client
// ---------------------------------------------------------------------------
function makeAuth(jar: DemoCookieJar) {
  const demoProfile = () => {
    const uid = jar.get(DEMO_SESSION_COOKIE);
    return uid ? db.profiles.find((p) => p.id === uid) ?? null : null;
  };

  return {
    async getUser() {
      const p = demoProfile();
      return {
        data: {
          user: p ? { id: p.id, email: p.email, user_metadata: { full_name: p.full_name } } : null,
        },
        error: null,
      };
    },
    async getSession() {
      const p = demoProfile();
      return {
        data: {
          session: p ? { user: { id: p.id, email: p.email } } : null,
        },
        error: null,
      };
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const profile = seedProfileByEmail(email);
      if (!profile || !profile.demo_password || profile.demo_password !== password) {
        return { data: null, error: { message: "Invalid login credentials" } };
      }
      jar.set(DEMO_SESSION_COOKIE, profile.id, { path: "/", maxAge: 60 * 60 * 12 });
      return {
        data: { user: { id: profile.id, email: profile.email }, session: { user: { id: profile.id, email: profile.email } } },
        error: null,
      };
    },
    async signUp() {
      return { data: { user: null }, error: null };
    },
    async signOut() {
      jar.delete(DEMO_SESSION_COOKIE);
      return { error: null };
    },
    async resetPasswordForEmail(_email: string, _opts?: Record<string, unknown>) {
      return { data: {}, error: null };
    },
    async updateUser(_updates: Record<string, unknown>) {
      return { data: { user: { id: DEMO_ADMIN_ID } }, error: null };
    },
    admin: {
      async createUser({ email, password, user_metadata }: { email: string; password?: string; email_confirm?: boolean; user_metadata?: Record<string, unknown> }) {
        const id = `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        db.profiles.push({
          id,
          employee_code: `MDI-${1000 + db.profiles.length + 1}`,
          full_name: String(user_metadata?.full_name ?? email.split("@")[0]),
          email: email.toLowerCase(),
          phone: user_metadata?.phone ? String(user_metadata.phone) : null,
          profile_photo_url: null,
          designation: null,
          department: null,
          joining_date: null,
          role: "employee",
          status: "pending",
          demo_password: password ?? "Staff@1234",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        return { data: { user: { id, email: email.toLowerCase() }, session: null }, error: null };
      },
      async deleteUser(uid: string) {
        db.profiles = db.profiles.filter((p) => p.id !== uid);
        return { data: {}, error: null };
      },
    },
  };
}

function makeStorage() {
  return {
    from(_bucket: string) {
      return {
        async upload(path: string, _file: Blob, _opts?: Record<string, unknown>) {
          return { data: { path }, error: null };
        },
        async createSignedUrl(_path: string, _expiresIn: number) {
          return { data: null, error: { message: "Demo mode does not serve files" } };
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: null, path }, error: null };
        },
      };
    },
  };
}

export function createDemoClient(jar: DemoCookieJar = noopJar()) {
  return {
    auth: makeAuth(jar),
    storage: makeStorage(),
    from(table: string) {
      return new MockQuery(table);
    },
  };
}

export type DemoClient = ReturnType<typeof createDemoClient>;
export { isDemoMode };