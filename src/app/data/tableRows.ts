export interface TableRow {
    id: number;
    issueType: string;
    severity: string;
    component: string;
    selector: string;
    url: string;
    description: string;
    codeSnippet: string;
    screenshot: string;
    // new types below
    status?: string;
    priority?: string;
    reportedBy?: string;
    createdAt?: string;
    lastUpdated?: string;
}

export const generateMockData = (count: number): TableRow[] => {
  const issueTypes = ["Interactable Role", "Visual Bug", "Performance Issue", "Accessibility"];
  const severities = ["Critical Severity", "High Severity", "Medium Severity", "Low Severity"];
  const components = ["ABC", "DEF", "XYZ", "Main"];
  const statuses = ["Open", "Closed", "In Progress"];
  const priorities = ["High", "Medium", "Low"];
  const reportedBys = ["QA Team", "Dev Team", "Product Team"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    issueType: issueTypes[i % issueTypes.length],
    severity: severities[i % severities.length],
    component: components[i % components.length],
    selector: `.selector-${i + 1}`,
    url: `https://www.example.com/${i + 1}`,
    description: `Issue description for item ${i + 1}`,
    codeSnippet: `<button>Click me ${i + 1}</button>`,
    screenshot: `https://via.placeholder.com/150?text=Item+${i + 1}`,
    // status: statuses[i % statuses.length],
    // priority: priorities[i % priorities.length],
    // reportedBy: reportedBys[i % reportedBys.length],
    // createdAt: `2024-12-12T10:15:00Z`,
    // lastUpdated: `2025-01-10T14:22:00Z`,
  }));
};

export const tableRows = generateMockData(10000);
