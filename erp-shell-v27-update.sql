update public.erp_shell_settings
set settings_json = coalesce(settings_json,'{}'::jsonb) || '{
  "navigationPosition":"left",
  "sidebarExpandOnHover":true,
  "sidebarCollapseOnLeave":true,
  "sidebarAutoHide":true,
  "sidebarRememberState":false,
  "sidebarShowCollapseButton":false,
  "profileSingleOnly":true,
  "profilePosition":"left-bottom"
}'::jsonb,
updated_by='Muhammad Waqas',
updated_at=now()
where setting_key='global';
