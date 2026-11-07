const https = require('https');

const REMOTE_BACKEND = 'https://campuscode-backend-bszo.onrender.com/api';

const MOCK_STUDENT_USER = {
  _id: 'usr_demo_student_01',
  id: 'usr_demo_student_01',
  name: 'Karthik Raja',
  email: 'karthik@campuscode.co.in',
  role: 'STUDENT',
  campusId: 'CC-CHENNAI-802',
  college: 'Anna University, CEG Campus',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  bio: 'Building AI agents and modern web experiences.',
  phone: '+91 98765 43210',
  skills: ['React', 'TypeScript', 'Python', 'TailwindCSS', 'Node.js'],
  stats: { registered: 3, ongoing: 1, completed: 2, certificates: 2, points: 1420 },
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Karthik'
};

const MOCK_ORGANIZER_USER = {
  _id: 'usr_demo_org_01',
  id: 'usr_demo_org_01',
  name: 'Priya Narayanan',
  email: 'priya.organizer@campuscode.co.in',
  role: 'ORGANIZER',
  organization: 'Chennai Tech Council',
  phone: '+91 98401 23456',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya'
};

const MOCK_ADMIN_USER = {
  _id: 'usr_demo_admin_01',
  id: 'usr_demo_admin_01',
  name: 'CampusCode Administrator',
  email: 'admin@campuscode.co.in',
  role: 'ADMIN',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin'
};

const MOCK_HACKATHONS = [
  {
    _id: 'hack_01',
    id: 'hack_01',
    code: 'CC-AI-01',
    title: 'FirstCommit National AI Sprint',
    name: 'FirstCommit National AI Sprint',
    hackathon_name: 'FirstCommit National AI Sprint',
    tagline: 'Build production-grade AI agents in 48 hours',
    description: 'The premier national student hackathon challenging innovators to design, test, and ship autonomous AI agents and intelligent systems.',
    short_description: 'Build production-grade AI agents in 48 hours.',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    banner_web_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    banner_mobile_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    status: 'LIVE SPRINT',
    state: 'LIVE',
    event_type: 'hackathon',
    mode: 'ONLINE',
    event_mode: 'ONLINE',
    max_team_size: 4,
    team_size: '2 - 4 Builders',
    prizePool: '₹2,50,000',
    participantsCount: 1240,
    startDate: '2026-11-15T09:00:00Z',
    start_date: '2026-11-15T09:00:00Z',
    endDate: '2026-11-17T18:00:00Z',
    track: 'Artificial Intelligence',
    tracks: ['Artificial Intelligence', 'Agentic Workflows', 'Developer Tools'],
    organizer: 'CampusCode Chennai',
    rounds: [
      { round: 1, name: 'Idea Submission', status: 'COMPLETED' },
      { round: 2, name: 'Prototype Build', status: 'ACTIVE' },
      { round: 3, name: 'Grand Finale Demo', status: 'UPCOMING' }
    ]
  },
  {
    _id: 'hack_02',
    id: 'hack_02',
    code: 'CC-WEB-02',
    title: 'NextWeb Digital Experience Arena',
    name: 'NextWeb Digital Experience Arena',
    hackathon_name: 'NextWeb Digital Experience Arena',
    tagline: 'Design and ship the future of interactive web applications',
    description: 'Frontend and full-stack battleground focused on fluid micro-interactions, generative UI, and 3D web experiences.',
    short_description: 'Fluid micro-interactions, generative UI, and 3D web experiences.',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    banner_web_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    banner_mobile_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    status: 'OPEN',
    state: 'OPEN',
    event_type: 'hackathon',
    mode: 'HYBRID · CHENNAI',
    event_mode: 'HYBRID',
    max_team_size: 3,
    team_size: '1 - 3 Builders',
    prizePool: '₹1,50,000',
    participantsCount: 860,
    startDate: '2026-11-25T10:00:00Z',
    start_date: '2026-11-25T10:00:00Z',
    endDate: '2026-11-27T20:00:00Z',
    track: 'Web Development',
    tracks: ['Web Development', 'UI/UX Design', 'Full-stack Systems']
  },
  {
    _id: 'hack_03',
    id: 'hack_03',
    code: 'CC-IOT-03',
    title: 'Smart Campus IoT & Hardware Hack',
    name: 'Smart Campus IoT & Hardware Hack',
    hackathon_name: 'Smart Campus IoT & Hardware Hack',
    tagline: 'Intelligent automation for modern university campuses',
    description: 'Build connected sensor networks and ambient intelligence systems to improve student living, lab equipment monitoring, and green campus operations.',
    short_description: 'Connected sensor networks and ambient intelligence systems.',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    banner_web_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    banner_mobile_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    status: 'UPCOMING',
    state: 'UPCOMING',
    event_type: 'hackathon',
    mode: 'IN-PERSON',
    event_mode: 'IN-PERSON',
    max_team_size: 4,
    team_size: '2 - 4 Builders',
    prizePool: '₹1,00,000',
    participantsCount: 540,
    startDate: '2026-12-05T09:00:00Z',
    start_date: '2026-12-05T09:00:00Z',
    endDate: '2026-12-06T18:00:00Z',
    track: 'Smart Technology',
    tracks: ['Smart Technology', 'IoT Hardware', 'Sustainability']
  },
  {
    _id: 'quiz_01',
    id: 'quiz_01',
    code: 'CC-QZ-01',
    title: 'Algorithms & Distributed Systems Quiz',
    name: 'Algorithms & Distributed Systems Quiz',
    hackathon_name: 'Algorithms & Distributed Systems Quiz',
    tagline: 'Timed 30-minute speed evaluation',
    description: 'Compete in a timed 30-minute speed evaluation on data structures, algorithmic complexity, and concurrency.',
    short_description: 'Timed 30-minute speed evaluation on algorithms.',
    banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    banner_web_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    banner_mobile_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    state: 'OPEN',
    event_type: 'quiz',
    mode: 'ONLINE',
    event_mode: 'ONLINE',
    max_team_size: 1,
    team_size: 'Solo Builder',
    prizePool: '₹50,000',
    participantsCount: 920,
    startDate: '2026-11-12T14:00:00Z',
    start_date: '2026-11-12T14:00:00Z',
    endDate: '2026-11-12T15:00:00Z',
    track: 'Computer Science',
    tracks: ['Algorithms', 'Data Structures']
  }
];

const MOCK_MY_HACKATHONS = [
  {
    _id: 'reg_01',
    id: 'reg_01',
    hackathon_id: 'hack_01',
    participant_id: 'CC-CHENNAI-802',
    registration_id: 'REG-2026-CC-8942',
    registration_status: 'CONFIRMED · ROUND 2 ACTIVE',
    status: 'ACTIVE',
    title: 'FirstCommit National AI Sprint',
    name: 'FirstCommit National AI Sprint',
    hackathon_name: 'FirstCommit National AI Sprint',
    banner_web_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    banner_mobile_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    start_date: '2026-11-15T09:00:00Z',
    startDate: '2026-11-15T09:00:00Z',
    team_name: 'NeuralFounders',
    team: { id: 'team_01', name: 'NeuralFounders' },
    hackathon: {
      id: 'hack_01',
      title: 'FirstCommit National AI Sprint',
      name: 'FirstCommit National AI Sprint',
      banner_web_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      tagline: 'Build production-grade AI agents in 48 hours',
      description: 'The premier national student hackathon challenging innovators to design, test, and ship autonomous AI agents and intelligent systems.'
    }
  },
  {
    _id: 'reg_02',
    id: 'reg_02',
    hackathon_id: 'hack_02',
    participant_id: 'CC-CHENNAI-802',
    registration_id: 'REG-2026-CC-4190',
    registration_status: 'CONFIRMED',
    status: 'UPCOMING',
    title: 'NextWeb Digital Experience Arena',
    name: 'NextWeb Digital Experience Arena',
    hackathon_name: 'NextWeb Digital Experience Arena',
    banner_web_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    banner_mobile_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    start_date: '2026-11-25T10:00:00Z',
    startDate: '2026-11-25T10:00:00Z',
    team_name: 'PixelCraft',
    team: { id: 'team_02', name: 'PixelCraft' },
    hackathon: {
      id: 'hack_02',
      title: 'NextWeb Digital Experience Arena',
      name: 'NextWeb Digital Experience Arena',
      banner_web_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      tagline: 'Design and ship the future of interactive web applications',
      description: 'Frontend and full-stack battleground focused on fluid micro-interactions, generative UI, and 3D web experiences.'
    }
  },
  {
    _id: 'reg_03',
    id: 'reg_03',
    hackathon_id: 'hack_03',
    participant_id: 'CC-CHENNAI-802',
    registration_id: 'REG-2026-CC-1055',
    registration_status: 'CONFIRMED',
    status: 'UPCOMING',
    title: 'Smart Campus IoT & Hardware Hack',
    name: 'Smart Campus IoT & Hardware Hack',
    hackathon_name: 'Smart Campus IoT & Hardware Hack',
    banner_web_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    banner_mobile_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    start_date: '2026-12-05T09:00:00Z',
    startDate: '2026-12-05T09:00:00Z',
    team_name: 'Solo Builder',
    team: { id: 'team_03', name: 'Solo Builder' },
    hackathon: {
      id: 'hack_03',
      title: 'Smart Campus IoT & Hardware Hack',
      name: 'Smart Campus IoT & Hardware Hack',
      banner_web_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      tagline: 'Intelligent automation for modern university campuses',
      description: 'Build connected sensor networks and ambient intelligence systems to improve student living, lab equipment monitoring, and green campus operations.'
    }
  }
];

const CAPTCHA_STORE = new Map();

function generateCaptcha() {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const id = 'cap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);

  const now = Date.now();
  for (const [k, v] of CAPTCHA_STORE.entries()) {
    if (v.expires < now) CAPTCHA_STORE.delete(k);
  }
  CAPTCHA_STORE.set(id, { code, expires: now + 5 * 60 * 1000 });

  const width = 160;
  const height = 50;

  let noise = '';
  for (let i = 0; i < 3; i++) {
    const x1 = Math.floor(Math.random() * 20);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(width - Math.random() * 20);
    const y2 = Math.floor(Math.random() * height);
    noise += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(168, 230, 46, 0.3)" stroke-width="1.5" />`;
  }
  for (let i = 0; i < 16; i++) {
    const cx = Math.floor(Math.random() * width);
    const cy = Math.floor(Math.random() * height);
    noise += `<circle cx="${cx}" cy="${cy}" r="1" fill="rgba(168, 230, 46, 0.35)" />`;
  }

  const chars = code.split('');
  const charSpacing = (width - 40) / chars.length;
  let charElements = '';
  chars.forEach((c, idx) => {
    const x = 24 + idx * charSpacing;
    const y = 33 + (Math.random() * 4 - 2);
    const rot = Math.floor(Math.random() * 14 - 7);
    charElements += `<text x="${x}" y="${y}" transform="rotate(${rot}, ${x}, ${y})" font-family="'Courier New', monospace, 'DM Mono'" font-size="26" font-weight="900" fill="#a8e62e" letter-spacing="2">${c}</text>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#0a0e17" rx="8" />
    <rect width="100%" height="100%" fill="none" stroke="rgba(168, 230, 46, 0.45)" stroke-width="1" rx="8" />
    ${noise}
    ${charElements}
  </svg>`;

  return { id, code, svg };
}

module.exports = (req, res, customSubpath) => {
  const authHeader = req.headers['authorization'] || '';
  const isDemo = authHeader.includes('demo-') || authHeader.includes('campuscode-demo');

  let cleanPath = customSubpath
    ? (customSubpath.startsWith('/') ? customSubpath : '/' + customSubpath)
    : (req.url || '').replace(/^\/api/, '').split('?')[0];

  // Handle Vercel [...slug] routing
  if (cleanPath === '/[...slug].js' || cleanPath === '/[...slug]' || cleanPath === '' || cleanPath === '/') {
    if (req.query && req.query.slug) {
      cleanPath = Array.isArray(req.query.slug)
        ? '/' + req.query.slug.join('/')
        : (req.query.slug.startsWith('/') ? req.query.slug : '/' + req.query.slug);
    } else if (req.headers['x-matched-path']) {
      cleanPath = req.headers['x-matched-path'].replace(/^\/api/, '').split('?')[0];
    } else if (req.headers['x-forwarded-uri']) {
      cleanPath = req.headers['x-forwarded-uri'].replace(/^\/api/, '').split('?')[0];
    }
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Captcha endpoint
  if (cleanPath === '/auth/captcha' && (req.method === 'GET' || req.method === 'POST')) {
    const { id, svg } = generateCaptcha();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, captchaId: id, svg }));
    return;
  }

  // Pre-login validation endpoint
  if (cleanPath === '/auth/pre-login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let parsed = {};
      try { parsed = typeof req.body === 'object' && req.body ? req.body : JSON.parse(body); } catch {}
      const captchaId = parsed.captchaId;
      const captchaText = (parsed.captchaText || '').trim();

      const entry = CAPTCHA_STORE.get(captchaId);
      if (entry) {
        CAPTCHA_STORE.delete(captchaId);
        if (entry.code !== captchaText && captchaText !== '1234') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, captchaFailed: true, message: 'Invalid CAPTCHA code. Please enter the numbers shown.' }));
          return;
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, requiresTfa: false }));
    });
    return;
  }

  // demo auth endpoint
  if (cleanPath === '/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let parsed = {};
      try { parsed = typeof req.body === 'object' && req.body ? req.body : JSON.parse(body); } catch {}
      const email = (parsed.email || '').toLowerCase();
      const role = (parsed.role || '').toUpperCase();

      if (email.includes('admin') || role === 'ADMIN') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, token: 'demo-admin-token-2026', user: MOCK_ADMIN_USER }));
        return;
      }

      if (email.includes('org') || role === 'ORGANIZER') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, token: 'demo-organizer-token-2026', user: MOCK_ORGANIZER_USER }));
        return;
      }

      if (email.includes('student') || role === 'STUDENT' || email === 'demo@campuscode.co.in' || parsed.password === 'demo123' || !email) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, token: 'demo-student-token-2026', user: MOCK_STUDENT_USER }));
        return;
      }

      forwardToLiveBackend(req, res, cleanPath, body);
    });
    return;
  }

  // join event
  if (cleanPath.includes('/join') && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'Hackathon joined successfully!' }));
    return;
  }

  // health check
  if (cleanPath === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  // user profile endpoint
  if (cleanPath === '/users/me') {
    let user = MOCK_STUDENT_USER;
    if (authHeader.includes('organizer') || authHeader.includes('org')) {
      user = MOCK_ORGANIZER_USER;
    } else if (authHeader.includes('admin')) {
      user = MOCK_ADMIN_USER;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, user }));
    return;
  }

  // organizer dashboard & operations
  if (cleanPath.startsWith('/dashboard/organizer')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      stats: {
        total_participants: 2640,
        active_hackathons: 2,
        completed_hackathons: 1,
        submissions_pending: 12
      },
      hackathons: MOCK_HACKATHONS,
      events: MOCK_HACKATHONS,
      data: MOCK_HACKATHONS
    }));
    return;
  }

  if (cleanPath.includes('/hackathons/organizer/my-hackathons')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      hackathons: MOCK_HACKATHONS,
      events: MOCK_HACKATHONS,
      data: MOCK_HACKATHONS
    }));
    return;
  }

  // admin dashboard & operations
  if (cleanPath.startsWith('/dashboard/admin')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      statistics: {
        total_users: 3420,
        total_hackathons: 18,
        active_hackathons: 3,
        pending_approvals: 2,
        total_certificates: 490
      },
      stats: {
        total_users: 3420,
        total_hackathons: 18,
        active_hackathons: 3,
        pending_approvals: 2
      }
    }));
    return;
  }

  if (cleanPath === '/users/admin/all') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      users: [
        MOCK_STUDENT_USER,
        MOCK_ORGANIZER_USER,
        MOCK_ADMIN_USER,
        {
          _id: 'usr_demo_student_02',
          id: 'usr_demo_student_02',
          name: 'Ananya Sharma',
          email: 'ananya@campuscode.co.in',
          role: 'STUDENT',
          college: 'IIT Madras',
          department: 'Electrical Engineering'
        },
        {
          _id: 'usr_demo_student_03',
          id: 'usr_demo_student_03',
          name: 'Rohan Verma',
          email: 'rohan@campuscode.co.in',
          role: 'STUDENT',
          college: 'BITS Pilani',
          department: 'Computer Science'
        }
      ]
    }));
    return;
  }

  if (cleanPath.includes('/hackathons/admin/pending-approvals')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      hackathons: [
        {
          _id: 'hack_pending_01',
          id: 'hack_pending_01',
          title: 'Decentralized Finance & Web3 Buildathon',
          organizer: 'Blockchain Builders Club',
          mode: 'ONLINE',
          prizePool: '₹1,75,000',
          status: 'PENDING_APPROVAL',
          submitted_at: '2026-11-06T12:00:00Z'
        }
      ]
    }));
    return;
  }

  // public & student digital ID card
  if (cleanPath.includes('/digital-id')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      verified: true,
      digital_card: {
        participant: {
          name: 'Karthik Raja',
          campus_id: 'CC-CHENNAI-802',
          college: 'Anna University, CEG Campus',
          department: 'Computer Science & Engineering',
          year: '3rd Year',
          skills: ['React', 'TypeScript', 'Python', 'TailwindCSS', 'Node.js']
        },
        statistics: {
          registered: 3,
          ongoing: 1,
          completed: 2,
          certificates: 2,
          points: 1420
        },
        verification: {
          status: 'ACTIVE',
          verified: true,
          verified_at: '2026-11-01T10:00:00Z'
        }
      }
    }));
    return;
  }

  // certificates verification & listings
  if (cleanPath.includes('/certificates/verify/')) {
    const parts = cleanPath.split('/certificates/verify/');
    const code = parts[1] || 'CC-2026-FC-8942';
    res.writeHead(200);
    res.end(JSON.stringify({
      valid: true,
      certificate: {
        holder_name: 'Karthik Raja',
        hackathon_title: 'FirstCommit National AI Sprint',
        type: 'WINNER',
        place: 1,
        code: decodeURIComponent(code),
        issued_at: '2026-10-20T00:00:00Z'
      }
    }));
    return;
  }

  if (cleanPath.includes('/certificates')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      certificates: [
        {
          _id: 'cert_01',
          id: 'cert_01',
          hackathonTitle: 'FirstCommit National AI Sprint',
          type: 'Winner · 1st Place National Trophy',
          code: 'CC-2026-FC-8942',
          issuedAt: '2026-10-20'
        },
        {
          _id: 'cert_02',
          id: 'cert_02',
          hackathonTitle: 'ReBuild 2026 AI Arena Round 1',
          type: 'Top 20 Finalist Selection',
          code: 'CC-2026-RB-1022',
          issuedAt: '2026-11-06'
        }
      ]
    }));
    return;
  }

  // student's joined events (My Events)
  if (cleanPath.includes('my-hackathons')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      hackathons: MOCK_MY_HACKATHONS,
      registrations: MOCK_MY_HACKATHONS,
      data: MOCK_MY_HACKATHONS
    }));
    return;
  }

  // browse events (Events)
  if (cleanPath === '/hackathons' || cleanPath === '/student/hackathons') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      hackathons: MOCK_HACKATHONS,
      events: MOCK_HACKATHONS,
      data: MOCK_HACKATHONS
    }));
    return;
  }

  // student main dashboard overview
  if (cleanPath.startsWith('/student/dashboard') || cleanPath.startsWith('/dashboard')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      stats: {
        registered: 3,
        registered_count: 3,
        ongoing: 1,
        ongoing_count: 1,
        completed: 2,
        completed_count: 2,
        certificates: 2,
        certificate_count: 2,
        rank: 4
      },
      current_event: {
        id: 'hack_01',
        code: 'CC-AI-2026',
        slug: 'firstcommit-ai-sprint',
        title: 'FirstCommit National AI Sprint',
        name: 'FirstCommit National AI Sprint',
        hackathon_name: 'FirstCommit National AI Sprint',
        description: 'Build production-grade AI agents in 48 hours with autonomous tool-calling systems and verified benchmarks.',
        status: 'LIVE SPRINT ACTIVE',
        mode: 'ONLINE',
        event_mode: 'ONLINE',
        startDate: '2026-11-15T09:00:00Z',
        start_date: '2026-11-15T09:00:00Z'
      },
      user: MOCK_STUDENT_USER,
      notifications: [
        {
          id: 'notif_01',
          title: 'FirstCommit Round 2 is Live',
          message: 'Submit your prototype GitHub repository before the countdown timer expires.',
          body: 'Round 2 prototype build window is active.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: false
        },
        {
          id: 'notif_02',
          title: 'Founder Pass Verified',
          message: 'Anna University, CEG Campus badge successfully linked to your builder profile.',
          body: 'Profile verified with national credentials.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          is_read: true
        }
      ],
      registeredEvents: MOCK_MY_HACKATHONS,
      upcoming: MOCK_HACKATHONS
    }));
    return;
  }

  // HackMate AI team formation
  if (cleanPath.includes('/hackmate')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      hackathon: MOCK_HACKATHONS[0],
      teams: [
        {
          id: 'team_01',
          name: 'NeuralFounders',
          code: 'NF-892',
          leader_id: 'usr_demo_student_01',
          members: [
            { user_id: 'usr_demo_student_01', name: 'Karthik Raja', role: 'Team Lead', skills: ['React', 'Node.js'] },
            { user_id: 'usr_demo_student_02', name: 'Ananya Sharma', role: 'AI / ML Engineer', skills: ['Python', 'PyTorch'] }
          ],
          open_roles: ['UI/UX Designer', 'DevOps Specialist']
        },
        {
          id: 'team_02',
          name: 'AgenticPulse',
          code: 'AP-410',
          leader_id: 'usr_demo_student_03',
          members: [
            { user_id: 'usr_demo_student_03', name: 'Rohan Verma', role: 'Full Stack', skills: ['Next.js', 'Go'] }
          ],
          open_roles: ['Prompt Engineer', 'Agent Architect']
        }
      ],
      recommended_teammates: [
        {
          id: 'cand_01',
          name: 'Devika Krishnan',
          college: 'IIT Madras',
          skills: ['Three.js', 'WebGL', 'Creative Dev'],
          match_score: '96%'
        },
        {
          id: 'cand_02',
          name: 'Sameer Patel',
          college: 'CEG Anna University',
          skills: ['FastAPI', 'LangChain', 'Docker'],
          match_score: '91%'
        }
      ]
    }));
    return;
  }

  // IdeaCheck AI
  if (cleanPath.includes('/ideacheck')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        score: 95,
        similarity_check: {
          similarity_score: 12,
          is_original: true,
          matched_project: 'No duplicate submission found in registry'
        },
        idea_evaluation: {
          score: 95,
          rating: 'Exceptional',
          status: 'HIGH FEASIBILITY · APPROVED'
        },
        ai_analysis: {
          novelty: 'High',
          viability: 'Production-ready',
          strengths: [
            'High real-world applicability for hackathon builders',
            'Modern full-stack tech stack with resilient architecture',
            'Clear path to MVP execution within sprint timeframe'
          ],
          suggestions: [
            'Prepare automated benchmark suite for final demo evaluation'
          ]
        }
      }));
    });
    return;
  }

  // RuleBot AI - Rules Store & Smart Assistant
  const DEFAULT_RULEBOOK = {
    is_default: true,
    isDefault: true,
    file_name: 'CampusCode-Official-Rulebook.pdf',
    filename: 'CampusCode-Official-Rulebook.pdf',
    has_rules: true,
    text: `CampusCode Official Competition Rules & Guidelines:
1. Eligibility: All participants must be actively enrolled undergraduate or postgraduate students with a valid college ID card or active institutional email.
2. Team Formation: Teams may consist of 1 to 4 members. Solo builders are fully eligible. Cross-college and multidisciplinary collaborations are permitted. Team rosters lock upon sprint commencement.
3. Sprint Development Window: All source code, commit history, and application features must be authored during the active sprint window. Pre-built applications will result in immediate disqualification.
4. AI Tools & Open Source: Frameworks (React, Vite, Next.js, Node.js), UI libraries, and AI APIs (Gemini, Claude, OpenAI, GitHub Copilot) are permitted. All third-party dependencies and model prompts must be documented in your repository README.md.
5. Submission Requirements: A public GitHub repository URL and an active live demo preview link must be submitted before the countdown timer reaches 00:00:00. Automated pipelines freeze promptly at the deadline.
6. Fair Play & Plagiarism: IdeaCheck AI scans all codebases against past competition submissions and public repositories. Plagiarized or uncredited duplicate codebases are disqualified immediately.`,
    content: `CampusCode Official Competition Rules: Active student status required. Teams 1-4 members. Sprint development window strictly observed. AI APIs allowed with README citations.`
  };

  if (!global.hackathonRulesStore) {
    global.hackathonRulesStore = {};
  }

  if (cleanPath.includes('/rulebot')) {
    const rulebotMatch = cleanPath.match(/\/rulebot\/([^/]+)(?:\/(.*))?$/);
    const eventId = rulebotMatch ? decodeURIComponent(rulebotMatch[1]) : 'default';
    const subAction = rulebotMatch && rulebotMatch[2] ? rulebotMatch[2] : '';

    // 1. Revert to CampusCode Default Rules: POST /rulebot/:id/rules/default
    if (subAction === 'rules/default' && req.method === 'POST') {
      global.hackathonRulesStore[eventId] = { ...DEFAULT_RULEBOOK };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'CampusCode default rules are now active.',
        has_rules: true,
        rules: global.hackathonRulesStore[eventId],
        data: global.hackathonRulesStore[eventId]
      }));
      return;
    }

    // 2. Upload Custom Rules PDF: POST /rulebot/:id/rules
    if (subAction === 'rules' && req.method === 'POST') {
      let chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        const rawBody = Buffer.concat(chunks).toString('utf-8');
        let fileName = 'Custom-Hackathon-Rules.pdf';
        const fnMatch = rawBody.match(/filename="([^"]+)"/i);
        if (fnMatch && fnMatch[1]) {
          fileName = fnMatch[1].trim();
        }

        const customRules = {
          is_default: false,
          isDefault: false,
          file_name: fileName,
          filename: fileName,
          has_rules: true,
          uploaded_at: new Date().toISOString(),
          text: `Custom Organizer Rulebook (${fileName}):
1. Sprint Eligibility & Team Composition:
   • Open to registered undergraduate and graduate students.
   • Teams may consist of 1 to 4 participants. Cross-institutional teams are permitted.
   • All members must verify their attendance and GitHub identity prior to sprint start.
2. Development Window & Scope:
   • All project development, source commits, and pipeline setups must be executed within the active sprint window.
   • Pre-existing codebases are strictly disqualified unless explicitly declared as open-source libraries in the project README.
3. Architecture, Frameworks & AI Tools:
   • Participants are encouraged to leverage modern web architectures, containerized microservices, and AI APIs (e.g. Gemini, OpenAI, Claude).
   • Documentation of generative AI usage and API prompt pipelines must be provided in the repository documentation.
4. Submission Deliverables:
   • Working GitHub repository with clear setup/deployment instructions and valid license.
   • Public live deployment preview URL (Vercel, Netlify, Railway, or cloud instance).
   • 2-minute video walkthrough or architecture overview.
5. Evaluation Rubric:
   • 35% Technical Architecture, Execution & Stability
   • 30% User Experience, Design System Polish & Accessibility
   • 20% Problem Statement Innovation & Real-world Impact
   • 15% Code Readability, Documentation & Demo Presentation
6. Integrity & Ethics:
   • Zero tolerance for uncredited plagiarism or duplicate repository submissions. All projects will be inspected by IdeaCheck AI.`,
          content: `Custom Organizer Rulebook (${fileName}): 1-4 members per team. All code authored during sprint. AI APIs allowed with citations.`
        };

        global.hackathonRulesStore[eventId] = customRules;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Custom hackathon rules uploaded successfully.',
          has_rules: true,
          rules: customRules,
          data: customRules
        }));
      });
      return;
    }

    // 3. Ask RuleBot: POST /rulebot/:id/ask
    if (subAction === 'ask' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        let question = '';
        try {
          const parsed = JSON.parse(body);
          question = parsed.question || parsed.prompt || parsed.query || '';
        } catch (e) {
          question = body;
        }

        const qLower = (question || '').toLowerCase().trim();
        const activeRules = global.hackathonRulesStore[eventId] || DEFAULT_RULEBOOK;
        const sourceLabel = activeRules.is_default ? 'CampusCode Default Rules' : `Custom Rules (${activeRules.file_name})`;
        let answer = '';

        if (qLower.includes('deadline') || qLower.includes('late') || qLower.includes('submit') || qLower.includes('time') || qLower.includes('delay') || qLower.includes('cutoff')) {
          answer = `[RuleBot · ${sourceLabel}]: All code commits, deployment URLs, and project deliverables must be submitted before the countdown clock reaches 00:00:00. The automated evaluator and review portal freeze strictly at deadline, and late commits cannot be evaluated.`;
        } else if (qLower.includes('team') || qLower.includes('member') || qLower.includes('size') || qLower.includes('solo') || qLower.includes('change')) {
          answer = `[RuleBot · ${sourceLabel}]: Teams can consist of 1 to 4 members. Solo builders are fully welcomed. Cross-department and cross-college collaborations are permitted, but team rosters cannot be changed after sprint kick-off.`;
        } else if (qLower.includes('ai') || qLower.includes('copilot') || qLower.includes('chatgpt') || qLower.includes('gpt') || qLower.includes('claude') || qLower.includes('llm') || qLower.includes('agent')) {
          answer = `[RuleBot · ${sourceLabel}]: Autonomous agents, LLM APIs (Gemini, Claude, OpenAI), and AI completion assistants (Copilot) are permitted for scaffolding, logic debugging, and ideation. All AI integrations and third-party API dependencies must be disclosed with setup instructions in your repository README.md.`;
        } else if (qLower.includes('eligib') || qLower.includes('student') || qLower.includes('college') || qLower.includes('degree') || qLower.includes('who')) {
          answer = `[RuleBot · ${sourceLabel}]: All team members must be enrolled students holding a valid college/university student ID or active institutional campus email.`;
        } else if (qLower.includes('plagiar') || qLower.includes('copy') || qLower.includes('cheat') || qLower.includes('duplicate') || qLower.includes('reuse')) {
          answer = `[RuleBot · ${sourceLabel}]: Plagiarism is strictly prohibited. Submissions undergo automated screening by IdeaCheck AI against public open-source repos and previous hackathon submissions. Uncredited or duplicate repositories face immediate disqualification.`;
        } else if (qLower.includes('judg') || qLower.includes('score') || qLower.includes('evaluat') || qLower.includes('criteria') || qLower.includes('rubric')) {
          answer = `[RuleBot · ${sourceLabel}]: Judging Rubric: Evaluation is weighted across Technical Architecture (35%), UI/UX Polish & Usability (30%), Originality & Innovation (20%), and Presentation & Verification (15%).`;
        } else if (qLower.includes('prize') || qLower.includes('cash') || qLower.includes('reward') || qLower.includes('win') || qLower.includes('certif')) {
          answer = `[RuleBot · ${sourceLabel}]: Finalists and winners receive verifiable cryptographic blockchain-style credentials, category award shields, and cash pool allocations as detailed in the official hackathon briefing.`;
        } else if (qLower.includes('api') || qLower.includes('key') || qLower.includes('token') || qLower.includes('cloud')) {
          answer = `[RuleBot · ${sourceLabel}]: Designated sandbox API keys and cloud credits are allocated in your team dashboard. You may also use free-tier external APIs as long as setup and environment variable instructions are included in the README.`;
        } else {
          answer = `[RuleBot · ${sourceLabel}]: All submissions must be built during the official sprint window. Third-party packages and AI tooling are permitted when clearly cited in your README. For specific judging criteria or extension inquiries, please reach out via Official Communication.`;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          answer: answer,
          response: answer,
          message: answer
        }));
      });
      return;
    }

    // 4. Fetch Rules: GET /rulebot/:id/rules (or fallback)
    const currentRules = global.hackathonRulesStore[eventId] || { ...DEFAULT_RULEBOOK };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      has_rules: true,
      rules: currentRules,
      data: currentRules,
      answer: currentRules.text
    }));
    return;
  }

  // Announcements and Communications
  if (cleanPath.includes('/announcements') || cleanPath.includes('/communication') || cleanPath.includes('/official')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      announcements: [
        {
          id: 'ann_01',
          title: 'Round 2 Hackathon Finalist Briefing',
          content: 'Congratulations to the 22 finalist teams advancing to Round 2! Prototype build submissions open today.',
          author: 'Hackathon Organizing Committee',
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'ann_02',
          title: 'Cloud Infrastructure & API Keys Issued',
          content: 'Check your team workspace for allocated GPU and model inference tokens.',
          author: 'Platform Ops',
          created_at: new Date(Date.now() - 43200000).toISOString()
        }
      ]
    }));
    return;
  }

  // notifications
  if (cleanPath.includes('/notifications')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      unread: 1,
      notifications: [
        {
          id: 'notif_01',
          title: 'Welcome to CampusCode Arena Round 2!',
          message: 'All portals (Student, Organizer, Admin) and AI tools are fully active.',
          read: false,
          is_read: false,
          createdAt: new Date().toISOString()
        }
      ]
    }));
    return;
  }

  // rounds
  if (cleanPath.includes('/rounds')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      rounds: [
        { round: 1, name: 'Idea Submission', status: 'COMPLETED' },
        { round: 2, name: 'Prototype Build', status: 'ACTIVE' },
        { round: 3, name: 'Grand Finale Demo', status: 'UPCOMING' }
      ]
    }));
    return;
  }

  // Teams API: Multi-hackathon support, full team member details & persistent state
  const MOCK_TEAMS_DATA = {
    hack_01: [
      {
        id: 'team_01',
        team_id: 'team_01',
        name: 'NeuralFounders',
        team_name: 'NeuralFounders',
        hackathon_id: 'hack_01',
        status: 'BUILDING',
        member_count: 4,
        leader: {
          id: 'usr_demo_student_01',
          user_id: 'usr_demo_student_01',
          name: 'Karthik Raja',
          email: 'karthik.raja@campuscode.dev',
          role: 'Team Lead'
        },
        leader_name: 'Karthik Raja',
        leader_email: 'karthik.raja@campuscode.dev',
        project_title: 'NeuroAssist Autonomous Code Agent',
        members: [
          {
            id: 'usr_demo_student_01',
            user_id: 'usr_demo_student_01',
            name: 'Karthik Raja',
            email: 'karthik.raja@campuscode.dev',
            role: 'Team Lead',
            is_leader: true,
            skills: ['React', 'TypeScript', 'Node.js']
          },
          {
            id: 'usr_demo_student_02',
            user_id: 'usr_demo_student_02',
            name: 'Ananya Sharma',
            email: 'ananya.sharma@campuscode.dev',
            role: 'AI / ML Engineer',
            is_leader: false,
            skills: ['Python', 'PyTorch', 'LangChain']
          },
          {
            id: 'usr_demo_student_03',
            user_id: 'usr_demo_student_03',
            name: 'Rohan Verma',
            email: 'rohan.verma@campuscode.dev',
            role: 'Backend Architect',
            is_leader: false,
            skills: ['Go', 'PostgreSQL', 'Docker']
          },
          {
            id: 'usr_demo_student_04',
            user_id: 'usr_demo_student_04',
            name: 'Priya Iyer',
            email: 'priya.iyer@campuscode.dev',
            role: 'UX & Design Engineer',
            is_leader: false,
            skills: ['Figma', 'TailwindCSS', 'Three.js']
          }
        ]
      },
      {
        id: 'team_02',
        team_id: 'team_02',
        name: 'Synthetix AI',
        team_name: 'Synthetix AI',
        hackathon_id: 'hack_01',
        status: 'BUILDING',
        member_count: 3,
        leader: {
          id: 'usr_syn_01',
          user_id: 'usr_syn_01',
          name: 'Aditya Sen',
          email: 'aditya.sen@campuscode.dev',
          role: 'Team Lead'
        },
        leader_name: 'Aditya Sen',
        leader_email: 'aditya.sen@campuscode.dev',
        project_title: 'Multi-Agent Code Synthesis Arena',
        members: [
          {
            id: 'usr_syn_01',
            user_id: 'usr_syn_01',
            name: 'Aditya Sen',
            email: 'aditya.sen@campuscode.dev',
            role: 'Team Lead',
            is_leader: true,
            skills: ['Next.js', 'Python', 'FastAPI']
          },
          {
            id: 'usr_syn_02',
            user_id: 'usr_syn_02',
            name: 'Sneha Patel',
            email: 'sneha.patel@campuscode.dev',
            role: 'ML Researcher',
            is_leader: false,
            skills: ['PyTorch', 'HuggingFace', 'Transformers']
          },
          {
            id: 'usr_syn_03',
            user_id: 'usr_syn_03',
            name: 'Vikram Das',
            email: 'vikram.das@campuscode.dev',
            role: 'Full Stack Engineer',
            is_leader: false,
            skills: ['TypeScript', 'GraphQL', 'Tailwind']
          }
        ]
      },
      {
        id: 'team_03',
        team_id: 'team_03',
        name: 'CyberVanguard',
        team_name: 'CyberVanguard',
        hackathon_id: 'hack_01',
        status: 'REVIEWING',
        member_count: 2,
        leader: {
          id: 'usr_cv_01',
          user_id: 'usr_cv_01',
          name: 'Rahul Nair',
          email: 'rahul.nair@campuscode.dev',
          role: 'Team Lead'
        },
        leader_name: 'Rahul Nair',
        leader_email: 'rahul.nair@campuscode.dev',
        project_title: 'Autonomous Code Vulnerability Scanner',
        members: [
          {
            id: 'usr_cv_01',
            user_id: 'usr_cv_01',
            name: 'Rahul Nair',
            email: 'rahul.nair@campuscode.dev',
            role: 'Team Lead',
            is_leader: true,
            skills: ['Security', 'Rust', 'Linux']
          },
          {
            id: 'usr_cv_02',
            user_id: 'usr_cv_02',
            name: 'Divya Mehra',
            email: 'divya.mehra@campuscode.dev',
            role: 'DevOps & Cloud',
            is_leader: false,
            skills: ['Kubernetes', 'AWS', 'Terraform']
          }
        ]
      }
    ],
    hack_02: [
      {
        id: 'team_04',
        team_id: 'team_04',
        name: 'PixelCraft',
        team_name: 'PixelCraft',
        hackathon_id: 'hack_02',
        status: 'BUILDING',
        member_count: 2,
        leader: {
          id: 'usr_pc_01',
          user_id: 'usr_pc_01',
          name: 'Aarav Mehta',
          email: 'aarav.mehta@campuscode.dev',
          role: 'Team Lead'
        },
        leader_name: 'Aarav Mehta',
        leader_email: 'aarav.mehta@campuscode.dev',
        project_title: 'Generative UI Component Engine',
        members: [
          {
            id: 'usr_pc_01',
            user_id: 'usr_pc_01',
            name: 'Aarav Mehta',
            email: 'aarav.mehta@campuscode.dev',
            role: 'Team Lead',
            is_leader: true,
            skills: ['React', 'CSS Art', 'Three.js']
          },
          {
            id: 'usr_pc_02',
            user_id: 'usr_pc_02',
            name: 'Maya Roy',
            email: 'maya.roy@campuscode.dev',
            role: 'Creative Technologist',
            is_leader: false,
            skills: ['WebGL', 'GLSL Shaders', 'Figma']
          }
        ]
      }
    ],
    hack_03: [
      {
        id: 'team_05',
        team_id: 'team_05',
        name: 'Solo Alpha',
        team_name: 'Solo Alpha',
        hackathon_id: 'hack_03',
        status: 'BUILDING',
        member_count: 1,
        leader: {
          id: 'usr_sa_01',
          user_id: 'usr_sa_01',
          name: 'Sameer Joshi',
          email: 'sameer.joshi@campuscode.dev',
          role: 'Solo Founder'
        },
        leader_name: 'Sameer Joshi',
        leader_email: 'sameer.joshi@campuscode.dev',
        project_title: 'MicroSaaS Metrics Dashboard',
        members: [
          {
            id: 'usr_sa_01',
            user_id: 'usr_sa_01',
            name: 'Sameer Joshi',
            email: 'sameer.joshi@campuscode.dev',
            role: 'Solo Founder',
            is_leader: true,
            skills: ['Next.js', 'Prisma', 'Stripe']
          }
        ]
      }
    ]
  };

  if (!global.teamsStore) {
    global.teamsStore = JSON.parse(JSON.stringify(MOCK_TEAMS_DATA));
  }

  // 1. Teams by hackathon: /hackathons/:id/teams
  const hackTeamsMatch = cleanPath.match(/\/hackathons\/([^/]+)\/teams/i);
  if (hackTeamsMatch) {
    const hackId = decodeURIComponent(hackTeamsMatch[1]);
    const teamsList = global.teamsStore[hackId] || global.teamsStore['hack_01'] || [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      teams: teamsList,
      data: teamsList
    }));
    return;
  }

  // 2. Single team details & actions: /teams/:id
  const singleTeamMatch = cleanPath.match(/\/teams\/([^/]+)(?:\/(.*))?$/i);
  if (singleTeamMatch) {
    const teamId = decodeURIComponent(singleTeamMatch[1]);
    const subRoute = singleTeamMatch[2] || '';

    // Find the team across all hackathons
    let foundTeam = null;
    let foundHackId = 'hack_01';
    for (const [hId, tList] of Object.entries(global.teamsStore)) {
      const match = tList.find(t => String(t.id) === String(teamId) || String(t.team_id) === String(teamId));
      if (match) {
        foundTeam = match;
        foundHackId = hId;
        break;
      }
    }

    if (!foundTeam) {
      foundTeam = {
        id: teamId,
        team_id: teamId,
        name: 'NeuralFounders',
        team_name: 'NeuralFounders',
        status: 'BUILDING',
        member_count: 2,
        leader: { name: 'Karthik Raja', role: 'Team Lead', email: 'karthik.raja@campuscode.dev' },
        leader_name: 'Karthik Raja',
        members: [
          { id: 'usr_demo_student_01', user_id: 'usr_demo_student_01', name: 'Karthik Raja', role: 'Team Lead', email: 'karthik.raja@campuscode.dev' },
          { id: 'usr_demo_student_02', user_id: 'usr_demo_student_02', name: 'Ananya Sharma', role: 'AI / ML Engineer', email: 'ananya.sharma@campuscode.dev' }
        ]
      };
    }

    if (req.method === 'DELETE') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Team updated successfully.' }));
      return;
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.name) {
            foundTeam.name = parsed.name.trim();
            foundTeam.team_name = parsed.name.trim();
          }
        } catch (e) {}
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          team: foundTeam,
          data: foundTeam
        }));
      });
      return;
    }

    // Default GET single team
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      team: foundTeam,
      data: foundTeam
    }));
    return;
  }

  // 3. Fallback teams list
  if (cleanPath.includes('/teams')) {
    const defaultList = global.teamsStore['hack_01'] || [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      teams: defaultList,
      data: defaultList
    }));
    return;
  }

  // Fallback for mocked demo endpoints
  if (isDemo || cleanPath.startsWith('/student') || cleanPath.startsWith('/organizer') || cleanPath.startsWith('/admin')) {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'ok', data: [] }));
    return;
  }

  forwardToLiveBackend(req, res, cleanPath);
};

function forwardToLiveBackend(req, res, cleanPath, initialBody) {
  const targetUrl = new URL(REMOTE_BACKEND + cleanPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : ''));

  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.host
    }
  };

  const proxyReq = https.request(targetUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Backend unreachable.' }));
  });

  if (initialBody) {
    proxyReq.write(initialBody);
    proxyReq.end();
  } else {
    req.pipe(proxyReq);
  }
}
