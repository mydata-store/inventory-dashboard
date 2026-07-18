(function(){window.ERPBusinessAlerts={
lowStock:(n,b,m)=>ERPPlatform?.notify("Low stock",`${n}: balance ${b}, minimum ${m}.`,"warning"),
overdueRgp:(n,d)=>ERPPlatform?.notify("RGP overdue",`${n} was due on ${d}.`,"warning"),
backupFailed:m=>ERPPlatform?.notify("Backup failed",m||"The latest backup could not be completed.","error"),
syncCompleted:c=>ERPPlatform?.notify("Synchronization completed",`${c||0} record(s) synchronized.`,"success")
};})();
