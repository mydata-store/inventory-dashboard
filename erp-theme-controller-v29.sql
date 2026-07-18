insert into public.erp_theme_settings(setting_key,theme_json,updated_by,updated_at)
values ('global','{}'::jsonb,'Muhammad Waqas',now())
on conflict (setting_key) do nothing;
