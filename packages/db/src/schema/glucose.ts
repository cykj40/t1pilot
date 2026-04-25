import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const glucoseReadings = sqliteTable("glucose_readings", {
  id: text("id").primaryKey(),
  systemTime: text("system_time").notNull(),
  displayTime: text("display_time").notNull(),
  value: real("value").notNull(),
  unit: text("unit", { enum: ["mg/dL", "mmol/L"] })
    .notNull()
    .default("mg/dL"),
  trend: text("trend").notNull(),
  trendRate: real("trend_rate"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type GlucoseReadingRow = typeof glucoseReadings.$inferSelect;
export type NewGlucoseReadingRow = typeof glucoseReadings.$inferInsert;
