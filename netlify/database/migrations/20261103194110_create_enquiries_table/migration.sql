CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"business" text NOT NULL,
	"email" text NOT NULL,
	"budget" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
