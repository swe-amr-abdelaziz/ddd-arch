export const adrDefaults = {
  adr: {
    sections: ['Status', 'Context', 'Decision', 'Consequences'],
    statuses: ['Proposed', 'Accepted', 'Rejected', 'Deprecated'],
    maxLength: {
      Title: 80,
      Status: 120,
      Context: 600,
      Decision: 600,
      Consequences: 600,
    },
    dir: 'docs/decisions',
  },
};
