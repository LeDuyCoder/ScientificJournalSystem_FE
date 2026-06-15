/**
 * Mock Data dành cho Journal, Volume và Issue.
 * Cấu trúc thiết kế theo mô hình quan hệ ID để dễ dàng thực hiện Filter/Query tại FE.
 */

export const INITIAL_JOURNALS = [
  {
    id: "J01",
    title: "International Journal of Computer Science & Trends",
    subjectCategory: "Computer Science",
    subjectArea: "Artificial Intelligence",
    issn: "1937-4771",
    onlineIssn: "1937-478X",
    publisher: "ResearchPulse Press",
    country: "Vietnam",
    editorInChief: "Dr. Nguyen Van A",
    lastUpdated: "2026-06-10",
    status: "Active",
    aimScope: "This journal focuses on the latest trends in AI, Machine Learning, and Software Engineering.",
    visibility: "Public",
    broadCategory: "Technology",
    specificResearchArea: "Neural Networks"
  },
  {
    id: "J02",
    title: "Journal of Climate Change and Environmental Engineering",
    subjectCategory: "Environmental Science",
    subjectArea: "Renewable Energy",
    issn: "2047-3214",
    onlineIssn: "2047-3222",
    publisher: "FPT University Publisher",
    country: "Vietnam",
    editorInChief: "Prof. Le Thi B",
    lastUpdated: "2026-05-28",
    status: "Draft",
    aimScope: "Focusing on global warming solutions and sustainable engineering.",
    visibility: "Private",
    broadCategory: "Science",
    specificResearchArea: "Solar Energy"
  }
];

export const INITIAL_VOLUMES = [
  { id: "V01", journalId: "J01", volumeNumber: "Volume 1", publicationYear: 2025, totalIssues: 2, totalArticles: 24, frequency: "Quarterly", description: "First official volume" },
  { id: "V02", journalId: "J01", volumeNumber: "Volume 2", publicationYear: 2026, totalIssues: 1, totalArticles: 12, frequency: "Quarterly", description: "Focusing on 2026 trends" },
  { id: "V03", journalId: "J02", volumeNumber: "Volume 1", publicationYear: 2026, totalIssues: 0, totalArticles: 0, frequency: "Bi-annual", description: "Initial setup volume" }
];

export const INITIAL_ISSUES = [
  { id: "I01", volumeId: "V01", issueName: "Special Issue on Deep Learning", issueNumber: "No. 1", publicationYear: 2025, status: "Published" },
  { id: "I02", volumeId: "V01", issueName: "Regular Issue", issueNumber: "No. 2", publicationYear: 2025, status: "Published" },
  { id: "I03", volumeId: "V02", issueName: "Trends in NLP", issueNumber: "No. 1", publicationYear: 2026, status: "Scheduled" }
];