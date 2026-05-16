CREATE TYPE "public"."health_processing_status" AS ENUM('pending', 'processing', 'complete', 'failed');--> statement-breakpoint
CREATE TYPE "public"."carb_source" AS ENUM('manual', 'vision', 'apple_health');--> statement-breakpoint
CREATE TYPE "public"."exercise_source" AS ENUM('peloton', 'apple_health', 'manual');--> statement-breakpoint
CREATE TYPE "public"."glucose_source" AS ENUM('dexcom', 'apple_health');--> statement-breakpoint
CREATE TYPE "public"."trend_arrow" AS ENUM('NONE', 'DOUBLE_UP', 'SINGLE_UP', 'FORTY_FIVE_UP', 'FLAT', 'FORTY_FIVE_DOWN', 'SINGLE_DOWN', 'DOUBLE_DOWN', 'NOT_COMPUTABLE', 'RATE_OUT_OF_RANGE');--> statement-breakpoint
CREATE TYPE "public"."insulin_source" AS ENUM('manual', 'apple_health');--> statement-breakpoint
CREATE TYPE "public"."insulin_type" AS ENUM('rapid', 'long', 'correction');--> statement-breakpoint
CREATE TYPE "public"."meal_processing_status" AS ENUM('pending', 'processing', 'complete', 'failed');--> statement-breakpoint
CREATE TYPE "public"."observation_event_type" AS ENUM('glucose', 'insulin', 'carb', 'exercise', 'correction');--> statement-breakpoint
CREATE TYPE "public"."observation_param_type" AS ENUM('isf', 'icr', 'basal', 'rapid_duration', 'rapid_peak');--> statement-breakpoint
CREATE TYPE "public"."agent_id" AS ENUM('orchestrator', 'glucose', 'exercise', 'modeling', 'event_logger', 'research', 'insight');--> statement-breakpoint
CREATE TYPE "public"."insight_type" AS ENUM('pattern', 'drift_alert', 'hypo_risk', 'dose_recommendation', 'lab_flag', 'weekly_summary', 'appointment_prep');--> statement-breakpoint
CREATE TYPE "public"."lab_document_type" AS ENUM('a1c', 'lipid_panel', 'cbc', 'metabolic_panel', 'thyroid', 'other');--> statement-breakpoint
CREATE TYPE "public"."lab_processing_status" AS ENUM('pending', 'processing', 'complete', 'failed');--> statement-breakpoint
CREATE TABLE "apple_health_raw" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"received_at" timestamp with time zone NOT NULL,
	"payload" jsonb NOT NULL,
	"data_types" jsonb,
	"processing_status" "health_processing_status" DEFAULT 'pending' NOT NULL,
	"processed_at" timestamp with time zone,
	"error_message" text,
	"normalized_event_ids" jsonb,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"report_data" jsonb NOT NULL,
	"r2_key" text,
	"r2_bucket" text,
	"pdf_generated_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carb_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"grams" real NOT NULL,
	"gi_estimate" integer,
	"gi_confidence" real,
	"meal_photo_id" text,
	"description" text,
	"source" "carb_source" DEFAULT 'manual' NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glucose_embeddings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"window_end" timestamp with time zone NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lab_embeddings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lab_document_id" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_embeddings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"research_cache_id" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"duration_minutes" integer NOT NULL,
	"exercise_type" text NOT NULL,
	"intensity_percent" real,
	"avg_heart_rate" integer,
	"calories" integer,
	"source" "exercise_source" DEFAULT 'manual' NOT NULL,
	"external_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glucose_readings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"dexcom_record_id" text,
	"system_time" timestamp with time zone NOT NULL,
	"display_time" timestamp with time zone NOT NULL,
	"value_mgdl" real NOT NULL,
	"trend" "trend_arrow",
	"trend_rate" real,
	"source" "glucose_source" DEFAULT 'dexcom' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "glucose_readings_dexcom_record_id_unique" UNIQUE("dexcom_record_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"auth_provider_id" text NOT NULL,
	"preferences" jsonb NOT NULL,
	"diabetes_params" jsonb NOT NULL,
	"onboarding_complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_auth_provider_id_unique" UNIQUE("auth_provider_id")
);
--> statement-breakpoint
CREATE TABLE "insulin_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"units" real NOT NULL,
	"insulin_type" "insulin_type" NOT NULL,
	"iob_duration_minutes" integer,
	"brand" text,
	"note" text,
	"source" "insulin_source" DEFAULT 'manual' NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_photos" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"r2_key" text NOT NULL,
	"r2_bucket" text,
	"vision_result" jsonb,
	"carb_estimate_grams" real,
	"foods_identified" jsonb,
	"confidence" real,
	"processing_status" "meal_processing_status" DEFAULT 'pending' NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_glucose_correlations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"exercise_event_id" text NOT NULL,
	"glucose_pre_mgdl" real,
	"glucose_during_mgdl" real,
	"glucose_post_1h_mgdl" real,
	"glucose_post_2h_mgdl" real,
	"glucose_drop_mgdl" real,
	"hypo_event_post" boolean DEFAULT false NOT NULL,
	"hypo_threshold_mgdl" real DEFAULT 70 NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adaptive_observations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"event_type" "observation_event_type" NOT NULL,
	"event_id" text NOT NULL,
	"param_type" "observation_param_type" NOT NULL,
	"predicted_value" real NOT NULL,
	"actual_value" real NOT NULL,
	"delta" real NOT NULL,
	"current_param_value" real NOT NULL,
	"suggested_param_value" real,
	"agent_note" text,
	"user_acknowledged" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_insights" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"agent_id" "agent_id" NOT NULL,
	"insight_type" "insight_type" NOT NULL,
	"summary" text NOT NULL,
	"detail" jsonb NOT NULL,
	"confidence" real,
	"requires_approval" boolean DEFAULT true NOT NULL,
	"approved" boolean,
	"approved_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lab_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"r2_key" text NOT NULL,
	"r2_bucket" text NOT NULL,
	"document_type" "lab_document_type" NOT NULL,
	"lab_date" timestamp with time zone,
	"processing_status" "lab_processing_status" DEFAULT 'pending' NOT NULL,
	"extracted_values" jsonb,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"query" text NOT NULL,
	"source_url" text,
	"source_title" text,
	"content" text NOT NULL,
	"agent_summary" text,
	"relevance_tags" jsonb,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "apple_health_raw" ADD CONSTRAINT "apple_health_raw_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_reports" ADD CONSTRAINT "appointment_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carb_events" ADD CONSTRAINT "carb_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carb_events" ADD CONSTRAINT "carb_events_meal_photo_id_meal_photos_id_fk" FOREIGN KEY ("meal_photo_id") REFERENCES "public"."meal_photos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glucose_embeddings" ADD CONSTRAINT "glucose_embeddings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_embeddings" ADD CONSTRAINT "lab_embeddings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_embeddings" ADD CONSTRAINT "lab_embeddings_lab_document_id_lab_documents_id_fk" FOREIGN KEY ("lab_document_id") REFERENCES "public"."lab_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_embeddings" ADD CONSTRAINT "research_embeddings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_embeddings" ADD CONSTRAINT "research_embeddings_research_cache_id_research_cache_id_fk" FOREIGN KEY ("research_cache_id") REFERENCES "public"."research_cache"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_events" ADD CONSTRAINT "exercise_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glucose_readings" ADD CONSTRAINT "glucose_readings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insulin_events" ADD CONSTRAINT "insulin_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_photos" ADD CONSTRAINT "meal_photos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_glucose_correlations" ADD CONSTRAINT "workout_glucose_correlations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_glucose_correlations" ADD CONSTRAINT "workout_glucose_correlations_exercise_event_id_exercise_events_id_fk" FOREIGN KEY ("exercise_event_id") REFERENCES "public"."exercise_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adaptive_observations" ADD CONSTRAINT "adaptive_observations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_insights" ADD CONSTRAINT "agent_insights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_documents" ADD CONSTRAINT "lab_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_cache" ADD CONSTRAINT "research_cache_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "glucose_embeddings_user_id_window_start_idx" ON "glucose_embeddings" USING btree ("user_id","window_start");--> statement-breakpoint
CREATE INDEX "glucose_user_id_system_time_idx" ON "glucose_readings" USING btree ("user_id","system_time");