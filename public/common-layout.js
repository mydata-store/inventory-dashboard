// V22 compatibility shim.
// Navigation is now created by public/common-shell-engine.js on every page.
window.buildERPLayout = () => window.ERPUniversalShell?.init?.();
window.applyERPLayout = settings => window.ERPUniversalShell?.render?.(settings);
