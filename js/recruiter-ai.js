/**
 * ========================================================
 * RECRUITER AI QUERY ASSISTANT & MULTI-POV NLU ENGINE
 * Comprehensive Grammatical Perspective & Intent Resolver
 * ========================================================
 * Handles 1st-person, 2nd-person, and 3rd-person queries
 * (he/him/his, she/her, they/them, Harivansh, this candidate).
 * Generates natural, concise answers matching the user's POV.
 */

// Conversation memory state
export const conversationHistory = [];
let lastPov = 'first_person';
let lastIntent = null;

/**
 * 1. Query Normalization
 * Expands contractions, informal abbreviations, slang, and common typos.
 */
export function normalizeQuery(raw) {
  if (!raw) return '';
  let clean = raw.toLowerCase().trim();

  // Contractions expansion
  const contractions = [
    [/\bwhat's\b/g, 'what is'],
    [/\bwho's\b/g, 'who is'],
    [/\bwhere's\b/g, 'where is'],
    [/\bhow's\b/g, 'how is'],
    [/\bhe's\b/g, 'he is'],
    [/\bshe's\b/g, 'she is'],
    [/\bthey're\b/g, 'they are'],
    [/\bthere's\b/g, 'there is'],
    [/\bcan't\b/g, 'cannot'],
    [/\bisn't\b/g, 'is not'],
    [/\baren't\b/g, 'are not'],
    [/\bwon't\b/g, 'will not'],
    [/\bdon't\b/g, 'do not'],
    [/\bdoesn't\b/g, 'does not'],
    [/\bi'm\b/g, 'i am'],
    [/\byou're\b/g, 'you are']
  ];
  for (const [pat, rep] of contractions) {
    clean = clean.replace(pat, rep);
  }

  // Informal slang & typos
  const slang = [
    [/\bur\b/g, 'your'],
    [/\bu\b/g, 'you'],
    [/\br u\b/g, 'are you'],
    [/\bwats\b/g, 'what is'],
    [/\bwat\b|\bwht\b/g, 'what'],
    [/\babt\b/g, 'about'],
    [/\btel\b/g, 'tell'],
    [/\bplz\b|\bpls\b/g, 'please'],
    [/\bclg\b|\bcolg\b/g, 'college'],
    [/\bedu\b|\bedukation\b/g, 'education'],
    [/\bproj\b|\bprojs\b|\bprjs\b/g, 'projects'],
    [/\bskils\b|\bskillz\b/g, 'skills'],
    [/\blookin\b/g, 'looking'],
    [/\bworkin\b/g, 'working'],
    [/\bcanditate\b/g, 'candidate']
  ];
  for (const [pat, rep] of slang) {
    clean = clean.replace(pat, rep);
  }

  // Replace punctuation but retain spaces and alphanumeric
  clean = clean.replace(/[^\w\s\+]/g, ' ');
  clean = clean.replace(/\s+/g, ' ').trim();
  return clean;
}

/**
 * 2. Grammatical Perspective (POV) Detection
 * Determines whether the question is asked:
 * - 1st/2nd Person (direct to owner): "you", "your", "are you", "tell me about yourself"
 * - 3rd Person Masculine: "he", "him", "his", "himself", "Harivansh", "this candidate"
 * - 3rd Person Feminine: "she", "her", "hers", "herself"
 * - 3rd Person Plural / Neutral: "they", "them", "their", "themselves"
 */
export function detectPOV(clean, customLastPov = null) {
  const activeLastPov = customLastPov || lastPov || 'first_person';

  const hasYou = /\b(you|your|yourself|yours)\b/.test(clean);
  const hasHe = /\b(he|him|his|himself)\b/.test(clean);
  const hasShe = /\b(she|her|hers|herself)\b/.test(clean);
  const hasThey = /\b(they|them|their|theirs|themselves)\b/.test(clean);

  // Explicit third-person reference to Harivansh by name or demonstrative third-person noun
  const hasExplicitName = /\b(harivansh|vats)\b/.test(clean);
  const hasThirdNoun = /\b(this candidate|this student|this person|this applicant|the candidate|the student|the applicant|the portfolio owner|the person)\b/.test(clean);

  // If Harivansh or third-person target is explicitly named (e.g. "Could you tell me what projects Harivansh built?"),
  // the question is asking ABOUT Harivansh in the 3rd person.
  if (hasExplicitName || hasThirdNoun) {
    return 'third_he';
  }

  // Third person feminine
  if (hasShe) {
    return 'third_she';
  }

  // Third person plural / neutral
  if (hasThey) {
    return 'third_they';
  }

  // Third person masculine
  if (hasHe) {
    return 'third_he';
  }

  // If query addresses candidate directly ("you", "your", "can you tell me about yourself", "what makes you a good candidate?")
  if (hasYou) {
    return 'first_person';
  }

  // Other third person role keywords (e.g. "what are the candidate's skills", "what is the developer's email")
  if (/\b(candidate|student|applicant|person|developer|engineer|owner|author|creator)\b/.test(clean)) {
    return 'third_he';
  }

  // Direct imperative commands or inquiries
  if (
    clean.startsWith('tell me about yourself') ||
    clean.startsWith('who are you') ||
    clean.startsWith('are you') ||
    clean.startsWith('can you') ||
    clean.startsWith('do you') ||
    clean.startsWith('what can you') ||
    clean.startsWith('what are you') ||
    clean.startsWith('what do you')
  ) {
    return 'first_person';
  }

  // In a multi-turn conversation, inherit active POV if no explicit pronoun was supplied
  return activeLastPov;
}

/**
 * 3. Intent Detection Engine
 * Detects the specific attribute requested to satisfy Rule 7 (Answer ONLY what is asked).
 */
export function detectIntent(clean, customLastIntent = null) {
  const activeLastIntent = customLastIntent || lastIntent;

  // A. Specific Contact Info
  if (/\b(phone|mobile|call|number|telephone|cell)\b/.test(clean)) {
    return 'CONTACT_PHONE';
  }
  if (/\b(email|mail|gmail|inbox)\b/.test(clean)) {
    return 'CONTACT_EMAIL';
  }
  if (/\b(where do you live|where does he live|where are you located|location|city|hometown|faridabad|delhi ncr|address|based in|where reside)\b/.test(clean)) {
    return 'CONTACT_LOCATION';
  }
  if (/\b(contact|reach|get in touch|talk to|connect|channel)\b/.test(clean)) {
    return 'CONTACT_OVERVIEW';
  }

  // B. Name Identification (e.g. "What is your name?", "What is his name?", "What's his name?")
  if (/\b(name|called)\b/.test(clean)) {
    if (!/\b(college|university|company|project|tool|file)\b/.test(clean)) {
      return 'NAME';
    }
  }

  // C. Engineering Branch / Stream
  if (/\b(branch|major|discipline|stream|field of study|specialization in college|department)\b/.test(clean)) {
    return 'BRANCH';
  }

  // D. Education Background & College
  if (/\b(education|educational|college|university|degree|btech|b tech|school|dcrust|murthal|study|studying|graduation|cohort|class 10|class 12|gpa|cgpa)\b/.test(clean)) {
    return 'EDUCATION';
  }

  // E. Resume & CV
  if (/\b(resume|cv|curriculum vitae|pdf resume|download resume|view resume)\b/.test(clean)) {
    return 'RESUME';
  }

  // F. Availability & Hiring Status
  if (/\b(open to work|available|availability|looking for (a )?job|looking for work|hire|hiring|ready to work|internship opportunity|job opportunity|seeking work|join|start working)\b/.test(clean)) {
    return 'AVAILABILITY';
  }

  // G. Why Hire / Strengths
  if (/\b(why hire|why should (i|we) hire|good candidate|strong candidate|strengths|why you|why him|why them|value)\b/.test(clean)) {
    return 'WHY_HIRE';
  }

  // H. Current Learning & Upskilling
  if (/\b(learn|learning|currently learning|learning now|upskilling|upskill|currently studying)\b/.test(clean)) {
    return 'LEARNING';
  }

  // I. Work Experience & Internships
  if (/\b(experience|internship|intern|work history|where did you work|where did he work|past work|bharatcares|deloitte|forage)\b/.test(clean)) {
    return 'EXPERIENCE';
  }

  // J. Certifications & Credentials
  if (/\b(certificate|certificates|certification|certifications|certified|credential|credentials|license|oracle cert|google cert|ibm cert)\b/.test(clean)) {
    return 'CERTIFICATIONS';
  }

  // K. Specific Project Queries
  if (/\b(patrol robot|security robot|esp32 robot)\b/.test(clean)) {
    return 'PROJECT_PATROL';
  }
  if (/\b(gripper|robotic arm|hand motion|flex sensor)\b/.test(clean)) {
    return 'PROJECT_GRIPPER';
  }
  if (/\b(automated data analysis|n8n project|claude pipeline|data analysis pipeline)\b/.test(clean)) {
    return 'PROJECT_N8N_AI';
  }
  if (/\b(whatsapp bot|whatsapp chatbot)\b/.test(clean)) {
    return 'PROJECT_WHATSAPP';
  }
  if (/\b(sales dashboard|retail dashboard)\b/.test(clean)) {
    return 'PROJECT_RETAIL';
  }
  if (/\b(resume maker)\b/.test(clean)) {
    return 'PROJECT_RESUME_MAKER';
  }

  // L. General Projects
  if (/\b(project|projects|built|build|portfolio work|what did you build|what did he build|show me projects|work samples)\b/.test(clean)) {
    return 'PROJECTS_OVERVIEW';
  }

  // M. Specific Skills
  if (/\b(ai skills|automation skills|agentic|n8n|claude|llm|generative ai|genai|prompt engineering)\b/.test(clean)) {
    return 'SKILLS_AI';
  }
  if (/\b(data skills|bi skills|data analytics|power bi|tableau|sql|excel|data cleaning)\b/.test(clean)) {
    return 'SKILLS_DATA';
  }
  if (/\b(skill|skills|tech stack|technologies|tools|what can (you|he|she|they|harivansh) do|what (do|does) (you|he|she|they|harivansh) know|expertise|proficient|abilities)\b/.test(clean)) {
    return 'SKILLS_OVERVIEW';
  }

  // N. General About / Bio / Candidate Profile
  if (/\b(about yourself|about himself|about herself|about them|about this candidate|about harivansh|tell me about|who is this candidate|who is this person|who is this|who is harivansh|who is he|who is she|who is they|who are you|who is|who are they|introduction|summary|brief overview|bio|background)\b/.test(clean)) {
    return 'ABOUT';
  }

  // O. Leadership & Extracurricular
  if (/\b(leadership|extracurricular|coordinator|gaming event|cultural event|responsibilities)\b/.test(clean)) {
    return 'LEADERSHIP';
  }

  // P. Contextual Follow-up Resolution
  if (activeLastIntent) {
    if (/^(and|what about|how about|tell me more|where|when|why)$/.test(clean)) {
      return activeLastIntent;
    }
  }

  // Q. Ambiguity check
  const words = clean.split(' ');
  if (words.length <= 2 && ['why', 'who', 'which', 'how', 'what'].includes(words[0])) {
    return 'AMBIGUOUS';
  }

  return 'ABOUT';
}

/**
 * 4. Multi-POV Response Generator
 * Formats precise, grammatically sound answers adhering strictly to Rule 7.
 */
export function generateResponse(intent, pov) {
  const isFirstPerson = pov === 'first_person';
  const isShe = pov === 'third_she';
  const isThey = pov === 'third_they';
  // default 3rd person is masculine (he/him/his/Harivansh)
  const isHe = !isFirstPerson && !isShe && !isThey;

  // Helper pronouns
  const pSubj = isFirstPerson ? 'I' : isShe ? 'She' : isThey ? 'They' : 'He';
  const pSubjLower = isFirstPerson ? 'I' : isShe ? 'she' : isThey ? 'they' : 'he';
  const pPoss = isFirstPerson ? 'My' : isShe ? 'Her' : isThey ? 'Their' : 'His';
  const pPossLower = isFirstPerson ? 'my' : isShe ? 'her' : isThey ? 'their' : 'his';
  const pObj = isFirstPerson ? 'me' : isShe ? 'her' : isThey ? 'them' : 'him';
  const pBe = isFirstPerson ? 'am' : isThey ? 'are' : 'is';
  const pHave = isFirstPerson || isThey ? 'have' : 'has';

  switch (intent) {
    case 'NAME':
      return {
        tag: 'IDENTITY // FULL NAME',
        answer: `${pPoss} name is <strong>Harivansh Vats</strong>.`
      };

    case 'BRANCH':
      return {
        tag: 'ACADEMICS // ENGINEERING BRANCH',
        answer: `${pSubj} ${pBe} pursuing a B.Tech in <strong>Mechanical Engineering</strong> at DCRUST, Murthal.`
      };

    case 'EDUCATION':
      return {
        tag: 'EDUCATION // ACADEMIC BACKGROUND',
        answer: isFirstPerson
          ? `I am pursuing my <strong>B.Tech in Mechanical Engineering (2023–2027)</strong> at Deenbandhu Chhotu Ram University of Science and Technology (DCRUST), Murthal. I completed Class XII in 2023 and Class X in 2021.`
          : `Harivansh is pursuing a <strong>B.Tech in Mechanical Engineering (2023–2027)</strong> at DCRUST, Murthal. ${pSubj} completed Class XII in 2023 and Class X in 2021.`
      };

    case 'SKILLS_OVERVIEW':
      return {
        tag: 'TECHNICAL SKILLS // CORE TOOLKIT',
        answer: `${pPoss} skills include <strong>Python, SQL, Excel, Power BI, and AI Automation</strong>.`
      };

    case 'SKILLS_AI':
      return {
        tag: 'AI & AUTOMATION // WORKFLOWS',
        answer: `${pPoss} AI and automation skills include <strong>n8n workflow automation, Claude AI integration, Oracle Agentic AI architecture</strong>, Prompt Engineering, and conversational bot development.`
      };

    case 'SKILLS_DATA':
      return {
        tag: 'DATA ANALYTICS // BI & REPORTING',
        answer: `${pPoss} data analytics toolkit includes <strong>Microsoft Excel (pivot tables, modeling), SQL (queries, aggregations), Power BI (DAX, executive dashboards), and Tableau</strong>.`
      };

    case 'AVAILABILITY':
      return {
        tag: 'STATUS // OPEN TO WORK',
        answer: isFirstPerson
          ? `Yes, I'm open to relevant internship and full-time opportunities.`
          : `Yes, ${pSubjLower} ${pBe} open to relevant internship and full-time opportunities.`
      };

    case 'ABOUT':
      return {
        tag: 'PROFILE // CANDIDATE SUMMARY',
        answer: isFirstPerson
          ? `I am a Mechanical Engineering student at DCRUST Murthal with strong expertise in Data Analytics, Business Intelligence, AI Automation, and Web Development.`
          : `Harivansh Vats is a Mechanical Engineering student interested in Data Analytics, Business Intelligence, AI Automation, and Web Development.`
      };

    case 'WHY_HIRE':
      return {
        tag: 'CANDIDATE VALUE // STRENGTHS',
        answer: `What makes ${pObj} a strong candidate is ${pPossLower} multidisciplinary blend of engineering problem-solving, hands-on data analytics (SQL, Power BI, Excel), and cutting-edge AI automation skills.`
      };

    case 'PROJECTS_OVERVIEW':
      return {
        tag: 'PORTFOLIO // FEATURED PROJECTS',
        answer: `${pPoss} projects include a <strong>Hand Motion Controlled Robotic Gripper Arm</strong> and an <strong>AI-Based Security Patrol Robot</strong>.`
      };

    case 'PROJECT_PATROL':
      return {
        tag: 'PROJECT // AI PATROL ROBOT',
        answer: `${pSubj} built the <strong>AI-Based Security Patrol Robot</strong>—an autonomous mobile surveillance platform featuring ESP32 camera streaming, obstacle sensing, and automated alert telemetry.`
      };

    case 'PROJECT_GRIPPER':
      return {
        tag: 'PROJECT // ROBOTIC GRIPPER ARM',
        answer: `${pSubj} engineered the <strong>Hand Motion Controlled Robotic Gripper Arm</strong>—a wearable flex-sensor glove paired with a 5-DOF servo robotic arm for precision gripping.`
      };

    case 'PROJECT_N8N_AI':
      return {
        tag: 'PROJECT // AUTOMATED DATA ANALYSIS',
        answer: `${pSubj} designed the <strong>AI-Powered Automated Data Analysis</strong> pipeline, which uses n8n workflows and Claude AI to transform raw spreadsheets into actionable visual reports.`
      };

    case 'PROJECT_WHATSAPP':
      return {
        tag: 'PROJECT // AI WHATSAPP CHATBOT',
        answer: `${pSubj} developed an <strong>AI-Powered WhatsApp Chatbot</strong> to automate customer query workflows with generative AI responses and webhook handling.`
      };

    case 'PROJECT_RETAIL':
      return {
        tag: 'PROJECT // RETAIL SALES DASHBOARD',
        answer: `${pSubj} developed the <strong>Retail Sales Analysis Dashboard</strong> using Excel, SQL, and Power BI to analyze category performance, sales trends, and executive KPIs.`
      };

    case 'PROJECT_RESUME_MAKER':
      return {
        tag: 'PROJECT // RESUME MAKER PLATFORM',
        answer: `${pSubj} created the <strong>Resume Maker Platform</strong>—a modern web application with customizable templates, real-time editing, and direct PDF generation.`
      };

    case 'LEARNING':
      return {
        tag: 'PROFESSIONAL DEVELOPMENT // ACTIVE LEARNING',
        answer: `${pSubj} ${pBe} currently learning <strong>advanced agentic workflows, n8n automation pipelines, and deep predictive modeling in Python</strong>.`
      };

    case 'EXPERIENCE':
      return {
        tag: 'WORK EXPERIENCE // INTERNSHIPS',
        answer: `${pPoss} work experience includes a <strong>Data Analytics Internship at BharatCares</strong> (Aug–Sep 2026), a <strong>Deloitte Data Analytics Job Simulation</strong> on Forage, and practical AI workflow projects with IBM SkillsBuild.`
      };

    case 'CERTIFICATIONS':
      return {
        tag: 'CREDENTIALS // CERTIFICATIONS',
        answer: `${pPoss} certifications include <strong>Oracle Agentic AI Certified Foundations Associate, Foundations of Data Science (Google), Python for Data Science & AI (IBM), and Generative AI Studio (Simplilearn)</strong>.`
      };

    case 'CONTACT_PHONE':
      return {
        tag: 'CONTACT // PHONE NUMBER',
        answer: `${pPoss} phone number is <a href="tel:+917011863224" style="color: var(--neon-emerald); font-weight: 600;">+91 7011863224</a>.`
      };

    case 'CONTACT_EMAIL':
      return {
        tag: 'CONTACT // EMAIL ADDRESS',
        answer: `${pPoss} email address is <a href="mailto:harivanshvats@gmail.com" style="color: var(--neon-emerald); font-weight: 600;">harivanshvats@gmail.com</a>.`
      };

    case 'CONTACT_LOCATION':
      return {
        tag: 'LOCATION // CURRENT BASE',
        answer: `${pSubj} ${pBe} based in <strong>Faridabad, Haryana, India</strong>.`
      };

    case 'CONTACT_OVERVIEW':
      return {
        tag: 'CONTACT & CHANNELS // DIRECT REACH',
        answer: isFirstPerson
          ? `You can reach me directly via email at <a href="mailto:harivanshvats@gmail.com" style="color: var(--neon-emerald); font-weight: 600;">harivanshvats@gmail.com</a> or phone at <a href="tel:+917011863224" style="color: var(--neon-emerald); font-weight: 600;">+91 7011863224</a>. I am also on <a href="https://www.linkedin.com/in/harivansh-vats-b00a722a4" target="_blank" style="color: var(--neon-cyan); text-decoration: underline;">LinkedIn</a> and <a href="https://github.com/Harivansh31" target="_blank" style="color: var(--neon-cyan); text-decoration: underline;">GitHub</a>.`
          : `You can reach Harivansh via email at <a href="mailto:harivanshvats@gmail.com" style="color: var(--neon-emerald); font-weight: 600;">harivanshvats@gmail.com</a> or phone at <a href="tel:+917011863224" style="color: var(--neon-emerald); font-weight: 600;">+91 7011863224</a>. ${pSubj} ${pBe} also reachable on <a href="https://www.linkedin.com/in/harivansh-vats-b00a722a4" target="_blank" style="color: var(--neon-cyan); text-decoration: underline;">LinkedIn</a> and <a href="https://github.com/Harivansh31" target="_blank" style="color: var(--neon-cyan); text-decoration: underline;">GitHub</a>.`
      };

    case 'RESUME':
      return {
        tag: 'OFFICIAL RESUME // CURRICULUM VITAE',
        answer: `${isFirstPerson ? "You can view my interactive resume directly on this site or download the official PDF below:" : "You can view Harivansh's verified resume directly on this site or download the official PDF below:"}<br><br>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
          <button type="button" class="btn-primary" onclick="window.openResumeModal()" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
            <span>👁️ View Interactive PDF</span>
          </button>
          <a href="assets/resume/Harivansh_Vats_Resume.pdf" download="Harivansh_Vats_Resume.pdf" class="btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
            <span>⬇️ Download PDF</span>
          </a>
        </div>`
      };

    case 'LEADERSHIP':
      return {
        tag: 'LEADERSHIP & INITIATIVES // COORDINATION',
        answer: `${pPoss} leadership roles include serving as <strong>University-Level Gaming Event Coordinator</strong> and <strong>Cultural Event Coordinator</strong>, as well as leading mechanical design tasks in team projects.`
      };

    case 'AMBIGUOUS':
      return {
        tag: 'ASSISTANT // CLARIFICATION NEEDED',
        answer: `Could you please specify which project, skill, or credential you'd like to know more about regarding Harivansh?`
      };

    default:
      return {
        tag: 'PROFILE // QUICK OVERVIEW',
        answer: isFirstPerson
          ? `I am a B.Tech student at DCRUST Murthal with expertise in <strong>Python, SQL, Excel, Power BI, and AI Automation</strong>. Ask me about my skills, projects, experience, or contact details!`
          : `Harivansh Vats is a B.Tech student at DCRUST Murthal with expertise in <strong>Python, SQL, Excel, Power BI, and AI Automation</strong>. Ask about his skills, projects, experience, or contact details!`
      };
  }
}

/**
 * 5. Initialization & DOM Hooking
 */
export function initRecruiterAssistant() {
  const input = document.getElementById('recruiterInput');
  const submitBtn = document.getElementById('btnAskSubmit');
  const responseCard = document.getElementById('recruiterResponseCard');
  const responseBody = document.getElementById('recruiterResponseBody');
  const closeBtn = document.getElementById('responseCloseBtn');
  const chips = document.querySelectorAll('.chip-btn');

  if (!input || !responseCard || !responseBody) return;

  function handleQuery(rawQuery) {
    if (!rawQuery) return;
    const clean = normalizeQuery(rawQuery);
    if (!clean) return;

    // Detect POV and Intent
    const pov = detectPOV(clean);
    const intent = detectIntent(clean);

    // Save to conversation memory
    lastPov = pov;
    lastIntent = intent;
    const response = generateResponse(intent, pov);

    conversationHistory.push({
      query: rawQuery,
      cleanQuery: clean,
      intent,
      pov,
      response: response.answer,
      timestamp: Date.now()
    });

    // Render response into terminal: ONLY the answer text
    responseBody.innerHTML = `
      <div class="response-result-text">${response.answer}</div>
    `;
    responseCard.classList.add('active');
    responseCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Submit button click handler
  submitBtn.addEventListener('click', () => {
    const q = input.value.trim();
    if (q) handleQuery(q);
  });

  // Enter key handler
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) handleQuery(q);
    }
  });

  // Quick Prompt Chips Click Handlers
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      input.value = q;
      handleQuery(q);
    });
  });

  // Close Response Window
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      responseCard.classList.remove('active');
    });
  }

  // Interactive Touch / Hover Click Reaction for Floating Hero Texts
  const floatingTexts = document.querySelectorAll('.interactive-floating-text');
  floatingTexts.forEach(el => {
    el.addEventListener('click', () => {
      el.classList.add('text-touched');
      setTimeout(() => {
        el.classList.remove('text-touched');
      }, 700);
    });
  });
}
