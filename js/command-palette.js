/**
 * ========================================================
 * COMMAND PALETTE (Cmd+K / Ctrl+K)
 * ========================================================
 * High-performance Linear/Raycast style Command Palette.
 * Empowers recruiters, developers, and visitors to navigate,
 * copy details, and trigger interactions instantaneously.
 */

import { cyberAudio } from './audio.js';

export function initCommandPalette() {
  const modal = document.getElementById('commandPaletteModal');
  const input = document.getElementById('cmdPaletteInput');
  const list = document.getElementById('cmdPaletteList');
  const triggerBtn = document.getElementById('cmdPaletteTrigger');
  const closeBtn = document.getElementById('cmdPaletteClose');

  if (!modal || !input || !list) return;

  const COMMANDS = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      icon: '⚡',
      title: 'Home',
      subtitle: 'Overview, hero portrait & quick links',
      keywords: ['home', 'hero', 'start', 'top'],
      action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      icon: '🧠',
      title: 'About Me',
      subtitle: 'Engineering mindset, education & focus areas',
      keywords: ['about', 'bio', 'education', 'college', 'degree', 'ipu'],
      action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-skills',
      category: 'Navigation',
      icon: '🛠️',
      title: 'Skills & Expertise',
      subtitle: 'Data Analytics, AI & Automation, Tools, IoT',
      keywords: ['skills', 'tools', 'python', 'sql', 'power bi', 'llm', 'ai', 'langchain'],
      action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      icon: '🚀',
      title: 'Featured Projects',
      subtitle: 'Patrol Robot, WhatsApp Bot, Resume Maker, Sales Dashboard',
      keywords: ['projects', 'robot', 'whatsapp', 'sales', 'resume', 'portfolio'],
      action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-experience',
      category: 'Navigation',
      icon: '💼',
      title: 'Work Experience',
      subtitle: 'Technical journey, internships & leadership',
      keywords: ['experience', 'work', 'timeline', 'career', 'job', 'roles'],
      action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-certs',
      category: 'Navigation',
      icon: '📜',
      title: 'Certifications',
      subtitle: 'Verified credentials & technical specializations',
      keywords: ['certifications', 'certificates', 'credentials', 'licenses'],
      action: () => document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      icon: '✉️',
      title: 'Contact Harivansh',
      subtitle: 'Direct email, phone, location & channels',
      keywords: ['contact', 'email', 'phone', 'reach', 'message', 'hire'],
      action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    },

    // Instant Actions
    {
      id: 'action-resume',
      category: 'Actions',
      icon: '📄',
      title: 'View & Download Resume',
      subtitle: 'Official PDF curriculum vitae',
      keywords: ['resume', 'cv', 'pdf', 'download', 'hire'],
      action: () => {
        const link = document.createElement('a');
        link.href = 'assets/resume/Harivansh_Vats_Resume.pdf';
        link.download = 'Harivansh_Vats_Resume.pdf';
        link.click();
        showToast('Resume download initiated');
      }
    },
    {
      id: 'action-copy-email',
      category: 'Actions',
      icon: '📬',
      title: 'Copy Email Address',
      subtitle: 'harivanshvats@gmail.com',
      keywords: ['copy email', 'mail', 'harivanshvats@gmail.com'],
      action: () => {
        navigator.clipboard?.writeText('harivanshvats@gmail.com');
        showToast('Email copied to clipboard: harivanshvats@gmail.com');
      }
    },
    {
      id: 'action-copy-phone',
      category: 'Actions',
      icon: '📞',
      title: 'Copy Phone Number',
      subtitle: '+91 7011863224',
      keywords: ['copy phone', 'call', 'mobile', '+91 7011863224'],
      action: () => {
        navigator.clipboard?.writeText('+917011863224');
        showToast('Phone number copied to clipboard: +91 7011863224');
      }
    },
    {
      id: 'action-linkedin',
      category: 'Socials',
      icon: '🌐',
      title: 'Open LinkedIn Profile',
      subtitle: 'linkedin.com/in/harivansh-vats',
      keywords: ['linkedin', 'profile', 'connect', 'social'],
      action: () => window.open('https://www.linkedin.com/in/harivansh-vats-b00a722a4', '_blank')
    },
    {
      id: 'action-github',
      category: 'Socials',
      icon: '🐙',
      title: 'Open GitHub Profile',
      subtitle: 'github.com/Harivansh31',
      keywords: ['github', 'code', 'repos', 'git'],
      action: () => window.open('https://github.com/Harivansh31', '_blank')
    },

    // Interactive System Features
    {
      id: 'sys-helmet-toggle',
      category: 'Interactive',
      icon: '⚡',
      title: 'Toggle Cyber Helmet Scanner',
      subtitle: 'Trigger full holographic rider reveal',
      keywords: ['helmet', 'scanner', 'holo', 'rider', 'avatar', 'face', 'mask'],
      action: () => {
        const toggleBtn = document.getElementById('mobileHoloToggle');
        toggleBtn?.click();
      }
    },
    {
      id: 'sys-recruiter-ai',
      category: 'Interactive',
      icon: '🤖',
      title: 'Ask Recruiter AI Query Assistant',
      subtitle: 'Jump to AI query input with focus',
      keywords: ['ai', 'recruiter', 'search', 'query', 'assistant', 'bot', 'prompt'],
      action: () => {
        const aiInput = document.getElementById('recruiterQueryInput');
        aiInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => aiInput?.focus(), 400);
      }
    },
    {
      id: 'sys-audio-toggle',
      category: 'Interactive',
      icon: '🔊',
      title: 'Toggle Cyber Audio SFX',
      subtitle: 'Turn synthesized sound effects on or off',
      keywords: ['audio', 'sound', 'sfx', 'music', 'mute', 'beep'],
      action: () => {
        const audioBtn = document.getElementById('audioToggleBtn');
        audioBtn?.click();
      }
    }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...COMMANDS];

  function showToast(message) {
    const toast = document.getElementById('cyberToast');
    const toastMsg = document.getElementById('toastMessage');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3200);
    }
  }

  function renderList() {
    list.innerHTML = '';

    if (filteredCommands.length === 0) {
      list.innerHTML = `
        <div class="cmd-empty-state">
          <span>⚠️</span> No matching commands found for "${input.value}"
        </div>
      `;
      return;
    }

    // Group commands by category
    const categories = {};
    filteredCommands.forEach((cmd, idx) => {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push({ cmd, flatIndex: idx });
    });

    Object.keys(categories).forEach(cat => {
      const header = document.createElement('div');
      header.className = 'cmd-group-header';
      header.textContent = cat.toUpperCase();
      list.appendChild(header);

      categories[cat].forEach(({ cmd, flatIndex }) => {
        const item = document.createElement('div');
        item.className = `cmd-item ${flatIndex === selectedIndex ? 'selected' : ''}`;
        item.setAttribute('role', 'option');
        item.setAttribute('data-index', String(flatIndex));

        item.innerHTML = `
          <div class="cmd-item-left">
            <span class="cmd-item-icon">${cmd.icon}</span>
            <div class="cmd-item-details">
              <span class="cmd-item-title">${cmd.title}</span>
              <span class="cmd-item-subtitle">${cmd.subtitle}</span>
            </div>
          </div>
          <span class="cmd-item-enter-hint">↵</span>
        `;

        item.addEventListener('mouseenter', () => {
          selectedIndex = flatIndex;
          updateSelectedVisual();
          cyberAudio.playHover();
        });

        item.addEventListener('click', () => {
          executeCommand(cmd);
        });

        list.appendChild(item);
      });
    });

    // Ensure selected item is scrolled into view
    const selectedEl = list.querySelector('.cmd-item.selected');
    selectedEl?.scrollIntoView({ block: 'nearest' });
  }

  function updateSelectedVisual() {
    list.querySelectorAll('.cmd-item').forEach((el, idx) => {
      if (idx === selectedIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  function executeCommand(cmd) {
    cyberAudio.playClick();
    closePalette();
    setTimeout(() => {
      cmd.action();
    }, 150);
  }

  function filterCommands(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      filteredCommands = [...COMMANDS];
    } else {
      filteredCommands = COMMANDS.filter(cmd => {
        const titleMatch = cmd.title.toLowerCase().includes(q);
        const subMatch = cmd.subtitle.toLowerCase().includes(q);
        const keywordMatch = cmd.keywords.some(k => k.toLowerCase().includes(q));
        const catMatch = cmd.category.toLowerCase().includes(q);
        return titleMatch || subMatch || keywordMatch || catMatch;
      });
    }
    selectedIndex = 0;
    renderList();
  }

  function openPalette() {
    cyberAudio.playOpen();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    input.value = '';
    filterCommands('');
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    cyberAudio.playClick();
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    input.blur();
  }

  // Trigger button click
  triggerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openPalette();
  });

  // Close button click
  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closePalette();
  });

  // Backdrop click to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePalette();
    }
  });

  // Input typing filter
  input.addEventListener('input', () => {
    filterCommands(input.value);
  });

  // Keyboard Navigation inside Command Palette
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        updateSelectedVisual();
        cyberAudio.playHover();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        updateSelectedVisual();
        cyberAudio.playHover();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  });

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, '/')
  window.addEventListener('keydown', (e) => {
    // Ignore if focus is inside an input or textarea (unless Cmd+K)
    const isEditing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === '/' && !isEditing) {
      e.preventDefault();
      openPalette();
    } else if (e.key === 'Escape' && modal.classList.contains('active')) {
      e.preventDefault();
      closePalette();
    }
  });
}
