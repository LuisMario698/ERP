import { relations } from "drizzle-orm";
import { boolean, index, pgEnum, pgSchema, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const databaseProvider = "supabase-postgresql";
export type OrmDecision = "drizzle";
export const selectedOrm: OrmDecision = "drizzle";

export const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const entityStatusEnum = pgEnum("entity_status", ["active", "inactive"]);
export const roleNameEnum = pgEnum("role_name", ["Administrador", "Gerente", "Cajero", "Inventario", "Supervisor"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    taxId: text("tax_id"),
    status: entityStatusEnum("status").default("active").notNull(),
    createdBy: uuid("created_by").references(() => authUsers.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => ({
    nameIdx: index("companies_name_idx").on(table.name),
    statusIdx: index("companies_status_idx").on(table.status),
  })
);

export const branches = pgTable(
  "branches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code"),
    status: entityStatusEnum("status").default("active").notNull(),
    ...timestamps,
  },
  (table) => ({
    companyIdx: index("branches_company_id_idx").on(table.companyId),
    companyCodeIdx: uniqueIndex("branches_company_code_idx").on(table.companyId, table.code),
  })
);

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  activeCompanyId: uuid("active_company_id").references(() => companies.id, { onDelete: "set null" }),
  activeBranchId: uuid("active_branch_id").references(() => branches.id, { onDelete: "set null" }),
  ...timestamps,
});

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: roleNameEnum("name").notNull().unique(),
  description: text("description"),
  isSystem: boolean("is_system").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userCompanyMemberships = pgTable(
  "user_company_memberships",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    status: entityStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.companyId] }),
    userIdx: index("memberships_user_id_idx").on(table.userId),
    companyIdx: index("memberships_company_id_idx").on(table.companyId),
  })
);

export const companiesRelations = relations(companies, ({ many, one }) => ({
  branches: many(branches),
  memberships: many(userCompanyMemberships),
  creator: one(authUsers, {
    fields: [companies.createdBy],
    references: [authUsers.id],
  }),
}));

export const branchesRelations = relations(branches, ({ one }) => ({
  company: one(companies, {
    fields: [branches.companyId],
    references: [companies.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  activeCompany: one(companies, {
    fields: [profiles.activeCompanyId],
    references: [companies.id],
  }),
  activeBranch: one(branches, {
    fields: [profiles.activeBranchId],
    references: [branches.id],
  }),
  memberships: many(userCompanyMemberships),
}));

export const membershipsRelations = relations(userCompanyMemberships, ({ one }) => ({
  profile: one(profiles, {
    fields: [userCompanyMemberships.userId],
    references: [profiles.id],
  }),
  company: one(companies, {
    fields: [userCompanyMemberships.companyId],
    references: [companies.id],
  }),
  branch: one(branches, {
    fields: [userCompanyMemberships.branchId],
    references: [branches.id],
  }),
  role: one(roles, {
    fields: [userCompanyMemberships.roleId],
    references: [roles.id],
  }),
}));

export type CompanyRow = typeof companies.$inferSelect;
export type NewCompanyRow = typeof companies.$inferInsert;
export type BranchRow = typeof branches.$inferSelect;
export type NewBranchRow = typeof branches.$inferInsert;
export type ProfileRow = typeof profiles.$inferSelect;
export type NewProfileRow = typeof profiles.$inferInsert;
export type RoleRow = typeof roles.$inferSelect;
export type MembershipRow = typeof userCompanyMemberships.$inferSelect;
