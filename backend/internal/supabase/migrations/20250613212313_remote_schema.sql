create table "public"."gifts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "idea" text not null,
    "price" numeric(10,2),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "hashed_password" text not null,
    "created_at" timestamp with time zone not null default now()
);


CREATE UNIQUE INDEX gifts_pkey ON public.gifts USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."gifts" add constraint "gifts_pkey" PRIMARY KEY using index "gifts_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."gifts" add constraint "gifts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."gifts" validate constraint "gifts_user_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

grant delete on table "public"."gifts" to "anon";

grant insert on table "public"."gifts" to "anon";

grant references on table "public"."gifts" to "anon";

grant select on table "public"."gifts" to "anon";

grant trigger on table "public"."gifts" to "anon";

grant truncate on table "public"."gifts" to "anon";

grant update on table "public"."gifts" to "anon";

grant delete on table "public"."gifts" to "authenticated";

grant insert on table "public"."gifts" to "authenticated";

grant references on table "public"."gifts" to "authenticated";

grant select on table "public"."gifts" to "authenticated";

grant trigger on table "public"."gifts" to "authenticated";

grant truncate on table "public"."gifts" to "authenticated";

grant update on table "public"."gifts" to "authenticated";

grant delete on table "public"."gifts" to "service_role";

grant insert on table "public"."gifts" to "service_role";

grant references on table "public"."gifts" to "service_role";

grant select on table "public"."gifts" to "service_role";

grant trigger on table "public"."gifts" to "service_role";

grant truncate on table "public"."gifts" to "service_role";

grant update on table "public"."gifts" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


