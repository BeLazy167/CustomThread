CREATE TABLE "design_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"design_id" varchar NOT NULL,
	"image_url" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"design_id" varchar NOT NULL,
	"tag" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "designs" (
	"id" serial PRIMARY KEY NOT NULL,
	"designer_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "design_images" ADD CONSTRAINT "design_images_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_tags" ADD CONSTRAINT "design_tags_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "designs" ADD CONSTRAINT "designs_designer_id_users_clerk_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."users"("clerk_id") ON DELETE no action ON UPDATE no action;