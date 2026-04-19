export type QuestionType = 'scale' | 'choice';

export interface Option {
  label: string;
  value: number; // 1-5 scoring
}

export interface Question {
  id: string;
  dimension: 'people' | 'process' | 'data' | 'tools' | 'ambition';
  text: string;
  type: QuestionType;
  options: Option[];
}

export interface Dimension {
  id: 'people' | 'process' | 'data' | 'tools' | 'ambition';
  label: string;
  icon: string; // emoji
  description: string;
}

export const dimensions: Dimension[] = [
  { id: 'people', label: 'People', icon: '👥', description: 'Your organisation, decision-making, and change readiness' },
  { id: 'process', label: 'Process', icon: '⚙️', description: 'Your manual workflows and automation opportunities' },
  { id: 'data', label: 'Data', icon: '📊', description: 'Your data quality, accessibility, and governance' },
  { id: 'tools', label: 'Tools', icon: '🛠️', description: 'Your technology stack and AI maturity' },
  { id: 'ambition', label: 'Ambition', icon: '🚀', description: 'Your goals, urgency, and investment readiness' },
];

export const questions: Question[] = [
  // PEOPLE
  {
    id: 'p1', dimension: 'people',
    text: 'How many people work in your business?',
    type: 'choice',
    options: [
      { label: 'Fewer than 20', value: 2 },
      { label: '20 to 50', value: 4 },
      { label: '51 to 100', value: 5 },
      { label: '101 to 250', value: 5 },
      { label: 'More than 250', value: 3 },
    ]
  },
  {
    id: 'p2', dimension: 'people',
    text: 'Who would make the final decision on AI & Automation investment?',
    type: 'choice',
    options: [
      { label: 'I decide alone', value: 5 },
      { label: 'Joint decision with 2-3 people', value: 4 },
      { label: 'Requires board sign-off', value: 3 },
      { label: 'I would need to build an internal case', value: 2 },
      { label: 'Not clear yet', value: 1 },
    ]
  },
  {
    id: 'p3', dimension: 'people',
    text: "How would you describe your team's attitude toward adopting new technology?",
    type: 'scale',
    options: [
      { label: 'Very resistant', value: 1 },
      { label: 'Somewhat resistant', value: 2 },
      { label: 'Neutral or mixed', value: 3 },
      { label: 'Mostly enthusiastic', value: 4 },
      { label: 'Very enthusiastic', value: 5 },
    ]
  },
  {
    id: 'p4', dimension: 'people',
    text: 'Has your business successfully rolled out a new technology in the last two years?',
    type: 'choice',
    options: [
      { label: 'Yes: multiple successful rollouts', value: 5 },
      { label: 'Yes: one successful rollout', value: 4 },
      { label: 'Mixed success', value: 3 },
      { label: "No, we haven't tried", value: 2 },
      { label: "We tried and it didn't land well", value: 1 },
    ]
  },
  {
    id: 'p5', dimension: 'people',
    text: 'Do you have a dedicated IT or technology resource?',
    type: 'choice',
    options: [
      { label: 'Yes: an internal IT team', value: 5 },
      { label: 'Yes: one internal IT person', value: 4 },
      { label: 'External IT partner (managed service)', value: 3 },
      { label: 'No one specifically', value: 2 },
      { label: 'No IT resource at all', value: 1 },
    ]
  },
  {
    id: 'p6', dimension: 'people',
    text: 'How dependent are key processes on specific individuals?',
    type: 'scale',
    options: [
      { label: 'Very dependent: a few people hold everything', value: 1 },
      { label: 'Quite dependent', value: 2 },
      { label: 'Somewhat: a few key areas', value: 3 },
      { label: 'Mostly distributed', value: 4 },
      { label: 'Not at all: fully documented and distributed', value: 5 },
    ]
  },

  // PROCESS
  {
    id: 'pr1', dimension: 'process',
    text: 'How much manual, repetitive work does your team handle each week?',
    type: 'scale',
    options: [
      { label: 'Almost none', value: 1 },
      { label: 'A little', value: 2 },
      { label: 'Some: it adds up over the week', value: 3 },
      { label: 'Quite a bit', value: 4 },
      { label: 'A huge amount', value: 5 },
    ]
  },
  {
    id: 'pr2', dimension: 'process',
    text: 'Are your core business processes documented?',
    type: 'choice',
    options: [
      { label: 'Yes: thoroughly documented', value: 4 },
      { label: 'Most of them are', value: 5 },
      { label: 'Some are', value: 3 },
      { label: 'Very few', value: 2 },
      { label: 'None', value: 1 },
    ]
  },
  {
    id: 'pr3', dimension: 'process',
    text: 'How often do manual processes lead to errors or re-work?',
    type: 'choice',
    options: [
      { label: 'Daily', value: 5 },
      { label: 'Weekly', value: 4 },
      { label: 'Monthly', value: 3 },
      { label: 'Rarely', value: 2 },
      { label: 'Almost never', value: 1 },
    ]
  },
  {
    id: 'pr4', dimension: 'process',
    text: "What proportion of your team's time goes on work that doesn't require human judgement?",
    type: 'choice',
    options: [
      { label: 'More than 50%', value: 5 },
      { label: '25 to 50%', value: 4 },
      { label: '10 to 25%', value: 3 },
      { label: 'Less than 10%', value: 2 },
      { label: 'Not sure', value: 1 },
    ]
  },
  {
    id: 'pr5', dimension: 'process',
    text: "Can you immediately identify your single biggest process bottleneck?",
    type: 'choice',
    options: [
      { label: "Yes: it's obvious", value: 5 },
      { label: 'Yes, with a little thought', value: 4 },
      { label: 'Possibly', value: 3 },
      { label: 'Not sure', value: 2 },
      { label: 'No', value: 1 },
    ]
  },
  {
    id: 'pr6', dimension: 'process',
    text: 'How well do your main business systems connect to each other?',
    type: 'choice',
    options: [
      { label: 'Mostly manual handoffs between systems', value: 5 },
      { label: 'Some manual handoffs', value: 4 },
      { label: 'Mostly integrated, a few gaps', value: 3 },
      { label: 'Well integrated', value: 2 },
      { label: "We don't really have connected systems", value: 2 },
    ]
  },

  // DATA
  {
    id: 'd1', dimension: 'data',
    text: 'Where does most of your business data live?',
    type: 'choice',
    options: [
      { label: 'Cloud systems: CRM, ERP, Microsoft 365', value: 5 },
      { label: 'Mix of cloud systems and spreadsheets', value: 4 },
      { label: 'Mostly spreadsheets', value: 3 },
      { label: 'Mostly email inboxes', value: 2 },
      { label: 'Scattered: no single source of truth', value: 1 },
    ]
  },
  {
    id: 'd2', dimension: 'data',
    text: 'How would you rate your data quality overall?',
    type: 'scale',
    options: [
      { label: 'Very poor: lots of gaps and errors', value: 1 },
      { label: 'Below average', value: 2 },
      { label: 'Average: it works but has issues', value: 3 },
      { label: 'Good', value: 4 },
      { label: 'Excellent: clean and trustworthy', value: 5 },
    ]
  },
  {
    id: 'd3', dimension: 'data',
    text: 'How quickly could you answer "how much revenue did we bill last month"?',
    type: 'choice',
    options: [
      { label: "Instantly: it's in a dashboard", value: 5 },
      { label: 'A few minutes', value: 4 },
      { label: '30+ minutes of digging', value: 3 },
      { label: 'Several hours', value: 2 },
      { label: "I'd have to ask someone and wait a day", value: 1 },
    ]
  },
  {
    id: 'd4', dimension: 'data',
    text: 'Do you have concerns about duplicate, incomplete, or inaccurate records?',
    type: 'choice',
    options: [
      { label: 'Yes: significant concerns', value: 2 },
      { label: 'Some concerns', value: 3 },
      { label: 'Minor issues only', value: 4 },
      { label: 'Very few concerns', value: 5 },
      { label: 'No concerns at all', value: 5 },
    ]
  },
  {
    id: 'd5', dimension: 'data',
    text: 'Is your data primarily in cloud-based systems?',
    type: 'choice',
    options: [
      { label: 'Yes: everything is cloud-based', value: 5 },
      { label: 'Mostly cloud', value: 4 },
      { label: 'Roughly 50/50', value: 3 },
      { label: 'Mostly local or on-premise', value: 2 },
      { label: 'All local or on-premise', value: 1 },
    ]
  },
  {
    id: 'd6', dimension: 'data',
    text: 'Is there a clear owner responsible for your data?',
    type: 'choice',
    options: [
      { label: 'Yes: formal data governance in place', value: 5 },
      { label: 'Yes, informally', value: 4 },
      { label: 'Sort of', value: 3 },
      { label: 'Not really', value: 2 },
      { label: 'No', value: 1 },
    ]
  },

  // TOOLS
  {
    id: 't1', dimension: 'tools',
    text: 'Which Microsoft 365 products does your team actively use?',
    type: 'choice',
    options: [
      { label: 'Full M365 suite: Teams, SharePoint, Power Platform and more', value: 5 },
      { label: 'Teams, SharePoint and email', value: 4 },
      { label: 'Teams and email', value: 3 },
      { label: 'Just email and calendar', value: 2 },
      { label: "We don't use Microsoft 365", value: 1 },
    ]
  },
  {
    id: 't2', dimension: 'tools',
    text: 'How well does your team actually use the tools you pay for?',
    type: 'scale',
    options: [
      { label: 'Very poorly: most tools are underused', value: 1 },
      { label: 'Below average', value: 2 },
      { label: 'Average: some adoption, some gaps', value: 3 },
      { label: 'Good', value: 4 },
      { label: 'Excellent: full adoption across the team', value: 5 },
    ]
  },
  {
    id: 't3', dimension: 'tools',
    text: 'Has anyone in your business tried AI tools like Microsoft Copilot or ChatGPT?',
    type: 'choice',
    options: [
      { label: 'Yes: rolled out organisation-wide', value: 5 },
      { label: 'Yes: several people using regularly', value: 4 },
      { label: 'Yes: a couple of people dabbling', value: 3 },
      { label: 'One person has tried it informally', value: 2 },
      { label: 'No one yet', value: 1 },
    ]
  },
  {
    id: 't4', dimension: 'tools',
    text: "Are there important business tools that don't connect to each other?",
    type: 'choice',
    options: [
      { label: 'Yes: most tools are siloed', value: 4 },
      { label: 'Yes: some significant gaps', value: 4 },
      { label: 'A few gaps', value: 3 },
      { label: 'Almost fully connected', value: 4 },
      { label: 'Fully connected and integrated', value: 3 },
    ]
  },
  {
    id: 't5', dimension: 'tools',
    text: 'Are any staff using AI tools informally, outside of official policy or guidance?',
    type: 'choice',
    options: [
      { label: 'Yes: definitely, and we know about it', value: 3 },
      { label: "Probably: we haven't checked", value: 2 },
      { label: 'Not sure', value: 2 },
      { label: 'Possibly not', value: 3 },
      { label: 'Definitely not', value: 4 },
    ]
  },
  {
    id: 't6', dimension: 'tools',
    text: "How would you describe your organisation's current AI maturity?",
    type: 'choice',
    options: [
      { label: "AI-first: it's already core to how we work", value: 5 },
      { label: 'Early adopter: actively experimenting', value: 4 },
      { label: 'Experimenting: trying a few things', value: 3 },
      { label: 'AI curious: interested but not started', value: 2 },
      { label: 'AI sceptic: not convinced yet', value: 1 },
    ]
  },

  // AMBITION
  {
    id: 'a1', dimension: 'ambition',
    text: 'What is your primary goal for AI and Automation?',
    type: 'choice',
    options: [
      { label: 'Competitive advantage: get ahead of our market', value: 5 },
      { label: 'Grow revenue faster', value: 5 },
      { label: 'Free up capacity for higher-value work', value: 4 },
      { label: 'Reduce operating costs', value: 4 },
      { label: 'Improve quality and reduce errors', value: 3 },
    ]
  },
  {
    id: 'a2', dimension: 'ambition',
    text: 'How urgently are you looking to make changes?',
    type: 'choice',
    options: [
      { label: 'Starting yesterday: this is urgent', value: 5 },
      { label: 'This quarter', value: 4 },
      { label: 'This calendar year', value: 3 },
      { label: 'Next 12 to 18 months', value: 2 },
      { label: 'Exploring options for the future', value: 1 },
    ]
  },
  {
    id: 'a3', dimension: 'ambition',
    text: 'Is budget set aside for this kind of investment?',
    type: 'choice',
    options: [
      { label: 'Yes: committed budget available', value: 5 },
      { label: 'Yes: provisional budget in place', value: 4 },
      { label: 'Would need to build a business case', value: 3 },
      { label: "Budget is tight but there's appetite", value: 2 },
      { label: 'No budget currently available', value: 1 },
    ]
  },
  {
    id: 'a4', dimension: 'ambition',
    text: 'How committed is your leadership team to making this happen?',
    type: 'scale',
    options: [
      { label: 'Very reluctant', value: 1 },
      { label: 'Somewhat reluctant', value: 2 },
      { label: 'Neutral', value: 3 },
      { label: 'Supportive', value: 4 },
      { label: 'Fully committed', value: 5 },
    ]
  },
  {
    id: 'a5', dimension: 'ambition',
    text: 'In 12 months, what would success look like for you?',
    type: 'choice',
    options: [
      { label: 'AI is central to how we operate and compete', value: 5 },
      { label: 'Significant measurable time savings across the business', value: 4 },
      { label: 'New revenue streams or faster growth', value: 5 },
      { label: 'Better data and decision-making', value: 3 },
      { label: 'Just getting started with something concrete', value: 2 },
    ]
  },
  {
    id: 'a6', dimension: 'ambition',
    text: "Does your business tend to adopt new technology early, or wait for it to mature?",
    type: 'choice',
    options: [
      { label: "Very early adopter: we're always first", value: 5 },
      { label: "Early majority: once it's proven", value: 4 },
      { label: 'Wait and see: once others have done it', value: 3 },
      { label: 'We move slowly with technology', value: 2 },
      { label: 'We tend to resist change', value: 1 },
    ]
  },
];
