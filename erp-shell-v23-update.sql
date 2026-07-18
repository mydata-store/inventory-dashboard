update public.erp_shell_settings
set settings_json = coalesce(settings_json,'{}'::jsonb) || '{
  "navigationPosition":"left",
  "startupPage":"index.html",
  "sidebarAutoHide":true,
  "sidebarAutoHideDelay":5000,
  "sidebarExpandOnHover":true,
  "sidebarCollapseOnLeave":true,
  "sidebarShowTooltips":true,
  "sidebarRememberState":true,
  "sidebarAnimationMs":200,
  "profileVisible":true,
  "profilePosition":"left-bottom"
}'::jsonb,
updated_by='Muhammad Waqas',
updated_at=now()
where setting_key='global';
