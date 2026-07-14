window.ERPComponentLibrary = {
  definitions: {
    summary_cards: {
      title: "Summary Cards",
      category: "Dashboard",
      icon: "▦",
      description: "KPI cards for totals, values, status and alerts.",
      defaults: {
        key: "summary_cards",
        title: "Summary",
        visible: true,
        order: 1,
        columns: 4,
        items: [
          {label:"Total Records",value_source:"total_records",icon:"▦"},
          {label:"Active",value_source:"active_records",icon:"✓"},
          {label:"Pending",value_source:"pending_records",icon:"!"},
          {label:"Value",value_source:"total_value",icon:"PKR"}
        ]
      }
    },
    search_panel: {
      title: "Search & Filters",
      category: "Controls",
      icon: "⌕",
      description: "Search, date range and master-data filters.",
      defaults: {
        key: "search_panel",
        title: "Search & Filters",
        visible: true,
        order: 2,
        fields: [
          {key:"search",label:"Search",type:"text"},
          {key:"date_from",label:"From Date",type:"date"},
          {key:"date_to",label:"To Date",type:"date"},
          {key:"status",label:"Status",type:"select"}
        ]
      }
    },
    entry_form: {
      title: "Entry Form",
      category: "Forms",
      icon: "▤",
      description: "Configurable data-entry form using the common form engine.",
      defaults: {
        key: "entry_form",
        title: "Entry Form",
        visible: true,
        order: 3,
        columns: 4
      }
    },
    data_table: {
      title: "Data Table",
      category: "Tables",
      icon: "▦",
      description: "Searchable, sortable, resizable common ERP table.",
      defaults: {
        key: "data_table",
        title: "Records",
        visible: true,
        order: 4,
        searchable: true,
        sortable: true,
        resizable: true,
        selectable: true,
        freeze_header: true
      }
    },
    action_bar: {
      title: "Action Bar",
      category: "Controls",
      icon: "⚙",
      description: "New, Save, Draft, Finalize, Print and custom actions.",
      defaults: {
        key: "action_bar",
        title: "Actions",
        visible: true,
        order: 5
      }
    },
    detail_panel: {
      title: "Detail Panel",
      category: "Information",
      icon: "ⓘ",
      description: "Popup or inline record detail panel.",
      defaults: {
        key: "detail_panel",
        title: "Details",
        visible: true,
        order: 6,
        display_mode: "modal"
      }
    },
    attachment_panel: {
      title: "Attachments",
      category: "Information",
      icon: "📎",
      description: "Upload and display bills, images and supporting files.",
      defaults: {
        key: "attachment_panel",
        title: "Attachments",
        visible: true,
        order: 7,
        multiple: true
      }
    },
    approval_panel: {
      title: "Approval Panel",
      category: "Workflow",
      icon: "✓",
      description: "Approval status, approvers and approval history.",
      defaults: {
        key: "approval_panel",
        title: "Approval",
        visible: true,
        order: 8
      }
    },
    activity_timeline: {
      title: "Activity Timeline",
      category: "Workflow",
      icon: "↕",
      description: "Chronological record activity and audit events.",
      defaults: {
        key: "activity_timeline",
        title: "Activity Timeline",
        visible: true,
        order: 9
      }
    },
    chart_panel: {
      title: "Chart Panel",
      category: "Dashboard",
      icon: "▥",
      description: "Bar, line, doughnut or area chart.",
      defaults: {
        key: "chart_panel",
        title: "Analysis",
        visible: true,
        order: 10,
        chart_type: "bar"
      }
    },
    quick_actions: {
      title: "Quick Actions",
      category: "Dashboard",
      icon: "⚡",
      description: "Large action tiles for frequently used pages.",
      defaults: {
        key: "quick_actions",
        title: "Quick Actions",
        visible: true,
        order: 11,
        columns: 4
      }
    },
    notification_panel: {
      title: "Notifications",
      category: "Dashboard",
      icon: "🔔",
      description: "Alerts, warnings and operational notifications.",
      defaults: {
        key: "notification_panel",
        title: "Notifications",
        visible: true,
        order: 12
      }
    }
  },

  list(){
    return Object.entries(this.definitions).map(([key,value])=>({key,...value}));
  },

  create(type){
    const definition=this.definitions[type];
    if(!definition) throw new Error("Unknown component type.");
    return JSON.parse(JSON.stringify({
      component_type:type,
      ...definition.defaults
    }));
  }
};
