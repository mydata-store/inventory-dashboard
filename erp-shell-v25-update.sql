update public.erp_shell_settings
set settings_json=coalesce(settings_json,'{}'::jsonb)||'{"profileVisible":true,"profileSingleOnly":true,"profilePosition":"left-bottom","sidebarShowCollapseButton":false}'::jsonb,
updated_by='Muhammad Waqas',updated_at=now()
where setting_key='global';
