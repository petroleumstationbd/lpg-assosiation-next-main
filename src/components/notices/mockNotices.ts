export type NoticeRow = {
  id?: string;
  sl: number;
  title: string;
  publishedDate: string;
  viewUrl?: string;
};

export const MOCK_NOTICES: NoticeRow[] = [
  {sl: 1, title: 'Modina LPG Gas Station & Conversion Center', publishedDate: '2024-01-10', viewUrl: '#'},
  {sl: 2, title: 'Faridpur LPG Autogas Filling Station', publishedDate: '2024-01-18', viewUrl: '#'},
  {sl: 3, title: 'Baraka LPG & Filling Station', publishedDate: '2024-02-05', viewUrl: '#'},
  {sl: 4, title: 'Sheikh Saad LPG Auto Gas Filling Station', publishedDate: '2024-02-20', viewUrl: '#'},
  {sl: 5, title: 'Ashotalhi LPG Filling Station', publishedDate: '2024-03-04', viewUrl: '#'},
  {sl: 6, title: 'A Rahman & Sons', publishedDate: '2024-03-19', viewUrl: '#'},
  {sl: 7, title: 'LPG Safety Workshop Registration Open', publishedDate: '2024-04-02', viewUrl: '#'},
  {sl: 8, title: 'Emergency Response Drill Schedule Update', publishedDate: '2024-04-16', viewUrl: '#'},
  {sl: 9, title: 'Annual Membership Renewal Notice', publishedDate: '2024-05-01', viewUrl: '#'},
  {sl: 10, title: 'Monthly Price Review Meeting Invitation', publishedDate: '2024-05-14', viewUrl: '#'},
  {sl: 11, title: 'Maintenance Window for Depot Operations', publishedDate: '2024-05-27', viewUrl: '#'},
  {sl: 12, title: 'Updated Safety Compliance Checklist', publishedDate: '2024-06-06', viewUrl: '#'},
  {sl: 13, title: 'Industry Seminar on LPG Infrastructure', publishedDate: '2024-06-18', viewUrl: '#'},
  {sl: 14, title: 'Holiday Service Hours Announcement', publishedDate: '2024-07-01', viewUrl: '#'},
  {sl: 15, title: 'Community Awareness Program Update', publishedDate: '2024-07-12', viewUrl: '#'},
];
