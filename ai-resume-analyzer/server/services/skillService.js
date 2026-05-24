const natural = require('natural');

// Comprehensive skill dictionaries
const SKILL_DICT = {
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'ruby', 'go', 'golang',
    'rust', 'swift', 'kotlin', 'php', 'scala', 'r', 'matlab', 'dart', 'perl', 'haskell',
    'lua', 'julia', 'elixir', 'clojure', 'f#', 'vb.net', 'cobol', 'fortran', 'assembly',
    'bash', 'shell', 'powershell', 'groovy', 'objective-c', 'solidity'
  ],
  frameworks: [
    'react', 'react.js', 'angular', 'vue', 'vue.js', 'next.js', 'nuxt', 'svelte',
    'node.js', 'express', 'express.js', 'fastapi', 'flask', 'django', 'spring', 'spring boot',
    'laravel', 'rails', 'ruby on rails', 'asp.net', '.net', 'nestjs', 'koa', 'hapi',
    'gatsby', 'remix', 'electron', 'react native', 'flutter', 'ionic', 'xamarin',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'opencv',
    'graphql', 'apollo', 'redux', 'mobx', 'rxjs', 'jest', 'mocha', 'cypress', 'playwright',
    'jquery', 'bootstrap', 'tailwind', 'material ui', 'chakra ui', 'ant design'
  ],
  databases: [
    'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'elasticsearch', 'cassandra',
    'dynamodb', 'firebase', 'supabase', 'oracle', 'mssql', 'sql server', 'mariadb',
    'neo4j', 'couchdb', 'influxdb', 'cockroachdb', 'planetscale', 'fauna', 'prisma',
    'mongoose', 'sequelize', 'typeorm', 'hibernate', 'sqlalchemy'
  ],
  tools: [
    'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'k8s', 'aws', 'azure',
    'gcp', 'google cloud', 'heroku', 'vercel', 'netlify', 'digitalocean', 'linux', 'unix',
    'nginx', 'apache', 'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci',
    'terraform', 'ansible', 'puppet', 'chef', 'vagrant', 'webpack', 'vite', 'babel',
    'npm', 'yarn', 'pnpm', 'maven', 'gradle', 'jira', 'confluence', 'slack', 'figma',
    'postman', 'swagger', 'grafana', 'prometheus', 'kibana', 'datadog', 'sentry',
    'sonarqube', 'ci/cd', 'devops', 'rest api', 'soap', 'grpc', 'kafka', 'rabbitmq',
    'elasticsearch', 'logstash', 'airflow', 'spark', 'hadoop', 'tableau', 'power bi'
  ],
  softSkills: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'problem-solving',
    'critical thinking', 'analytical', 'agile', 'scrum', 'kanban', 'project management',
    'time management', 'mentoring', 'collaboration', 'adaptability', 'creativity',
    'attention to detail', 'multitasking', 'presentation', 'negotiation', 'strategic',
    'cross-functional', 'stakeholder management', 'code review', 'technical writing'
  ]
};

// Display names mapping
const DISPLAY_NAMES = {
  'javascript': 'JavaScript', 'typescript': 'TypeScript', 'python': 'Python',
  'java': 'Java', 'c++': 'C++', 'c#': 'C#', 'react': 'React', 'react.js': 'React',
  'node.js': 'Node.js', 'express': 'Express.js', 'express.js': 'Express.js',
  'mongodb': 'MongoDB', 'postgresql': 'PostgreSQL', 'mysql': 'MySQL',
  'docker': 'Docker', 'kubernetes': 'Kubernetes', 'aws': 'AWS', 'azure': 'Azure',
  'git': 'Git', 'github': 'GitHub', 'next.js': 'Next.js', 'vue.js': 'Vue.js',
  'flask': 'Flask', 'django': 'Django', 'spring': 'Spring', 'redis': 'Redis',
  'ci/cd': 'CI/CD', 'rest api': 'REST API', 'graphql': 'GraphQL', 'gcp': 'GCP',
  'tailwind': 'Tailwind CSS', 'redux': 'Redux', 'fastapi': 'FastAPI'
};

const normalizeSkill = (skill) => skill.toLowerCase().trim();

const getDisplayName = (skill) => {
  const lower = normalizeSkill(skill);
  return DISPLAY_NAMES[lower] || skill.charAt(0).toUpperCase() + skill.slice(1);
};

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  const found = {
    technicalSkills: new Set(),
    frameworks: new Set(),
    languages: new Set(),
    databases: new Set(),
    tools: new Set(),
    softSkills: new Set()
  };

  // Language detection
  SKILL_DICT.languages.forEach(skill => {
    if (matchSkillInText(lowerText, skill)) {
      found.languages.add(getDisplayName(skill));
    }
  });

  // Framework detection
  SKILL_DICT.frameworks.forEach(skill => {
    if (matchSkillInText(lowerText, skill)) {
      found.frameworks.add(getDisplayName(skill));
    }
  });

  // Database detection
  SKILL_DICT.databases.forEach(skill => {
    if (matchSkillInText(lowerText, skill)) {
      found.databases.add(getDisplayName(skill));
    }
  });

  // Tools detection
  SKILL_DICT.tools.forEach(skill => {
    if (matchSkillInText(lowerText, skill)) {
      found.tools.add(getDisplayName(skill));
    }
  });

  // Soft skills detection
  SKILL_DICT.softSkills.forEach(skill => {
    if (matchSkillInText(lowerText, skill)) {
      found.softSkills.add(getDisplayName(skill));
    }
  });

  // Combine languages and key frameworks as technicalSkills
  found.languages.forEach(s => found.technicalSkills.add(s));
  found.frameworks.forEach(s => found.technicalSkills.add(s));
  found.databases.forEach(s => found.technicalSkills.add(s));
  found.tools.forEach(s => found.technicalSkills.add(s));

  return {
    technicalSkills: [...found.technicalSkills],
    frameworks: [...found.frameworks],
    languages: [...found.languages],
    databases: [...found.databases],
    tools: [...found.tools],
    softSkills: [...found.softSkills]
  };
};

const matchSkillInText = (text, skill) => {
  // Escape special regex chars
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match whole word or phrase
  const regex = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'i');
  return regex.test(text);
};

module.exports = { extractSkills, SKILL_DICT, getDisplayName };
