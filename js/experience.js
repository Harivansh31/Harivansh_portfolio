/**
 * ========================================================
 * EXPERIENCE & VIRTUAL SIMULATIONS CONTROLLER
 * Split-Card Timeline, Parallax Hero, & Certificate Verification
 * ========================================================
 */

import { openCertificateViewer } from './certificates.js';

// Central Data-Driven Registry for Certificates & Verification
export const certificateRegistry = {
  'bharatcares-internship': {
    id: 'bharatcares-internship',
    title: 'IBM SkillsBuild Data Analytics with AI Internship Program',
    issuer: 'BharatCares · in association with AICTE & IBM SkillsBuild',
    associatedExperience: 'BharatCares · IBM SkillsBuild Internship Program',
    categoryBadge: 'ACCREDITED INTERNSHIP',
    credentialId: 'IBMACBHDAI2875',
    issueDate: 'August 2026 – September 2026',
    previewImage: 'assets/certificates/bharatcares_ibm_internship_cert.png',
    filePath: 'assets/certificates/bharatcares_ibm_internship_cert.pdf',
    downloadFilename: 'Harivansh_Vats_BharatCares_AICTE_IBM_Internship_Certificate.pdf',
    verificationUrl: null, // Authentic Unique ID is verified directly via AICTE / BharatCares
    description: 'Successfully completed the rigorous 6-week academic internship program in Data Analytics with AI conducted in association with the All India Council for Technical Education (AICTE) and BharatCares. Formally signed by Ms. Shrilakshmi Nair (BharatCares) and Dr. Buddha Chandrasekhar (Chief Coordinating Officer, AICTE).'
  },
  'deloitte-simulation': {
    id: 'deloitte-simulation',
    title: 'Deloitte Data Analytics Job Simulation',
    issuer: 'Deloitte · Forage Virtual Experience',
    associatedExperience: 'Deloitte · Forage Virtual Experience',
    categoryBadge: 'FORAGE SIMULATION',
    credentialId: 'EKXFZ3kbEPNZcdYm4 | User: 696aa9638d5b9c666d209bf9',
    issueDate: 'August 7th, 2026',
    previewImage: 'assets/certificates/deloitte_data_analytics_simulation_cert.png',
    filePath: 'assets/certificates/deloitte_data_analytics_simulation_cert.png',
    downloadFilename: 'Harivansh_Vats_Deloitte_Data_Analytics_Simulation_Certificate.png',
    verificationUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Deloitte%20Australia/EKXFZ3kbEPNZcdYm4_Deloitte_696aa9638d5b9c666d209bf9_completion_certificate.pdf',
    description: 'Practical job simulation completing tasks in factory telemetry data analysis, equipment downtime pattern classification, and Tableau dashboard design for executive reporting. Issued by Tina McCreery, Chief Human Resources Officer, Deloitte.'
  },
  'ibm-skillsbuild-ai': {
    id: 'ibm-skillsbuild-ai',
    title: 'AICTE | IBM SkillsBuild Academic Internship - Data Analytics with AI',
    issuer: 'IBM SkillsBuild · BharatCares',
    associatedExperience: 'IBM SkillsBuild · Professional Learning',
    categoryBadge: 'COMPLETION CERTIFICATE',
    credentialId: 'PLAN-D44A9C2C463C',
    issueDate: '20 Aug 2026',
    previewImage: 'assets/certificates/ibm_skillsbuild_ai_analytics_cert.jpg',
    filePath: 'assets/certificates/ibm_skillsbuild_ai_analytics_cert.jpg',
    downloadFilename: 'Harivansh_Vats_IBM_SkillsBuild_Data_Analytics_AI_Certificate.jpg',
    verificationUrl: 'https://skills.yourlearning.ibm.com/certificate/PLAN-D44A9C2C463C',
    description: 'Official completion credential for the AICTE | IBM SkillsBuild Academic Internship in Data Analytics with AI, recorded in the Your Learning Builder plan system of record.'
  },
  'oracle-ai': {
    id: 'oracle-ai',
    title: 'Oracle Agentic AI Certified Foundations Associate',
    issuer: 'Oracle University',
    associatedExperience: 'Data & AI-Enabled Workflows',
    categoryBadge: 'ORACLE VERIFIED',
    credentialId: 'Oracle University Verified',
    issueDate: 'Issued by Oracle',
    previewImage: null, // Graceful fallback: uses geometric cyber credential shield icon
    filePath: null,    // Graceful: no nonfunctional download button
    downloadFilename: null,
    verificationUrl: null,
    description: 'Specialized credential validating foundational expertise in autonomous agent architectures, multi-agent orchestration, LLM tool integration, task planning, and operational workflows.'
  }
};

export function initExperienceSection() {
  // 1. Interactive Timeline Nodes & Staggered Viewport Entrance
  const timelineItems = document.querySelectorAll('.exp-timeline-item');
  if (timelineItems.length > 0) {
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active', 'is-revealed');
          } else {
            // Remove active node highlight when scrolled out to preserve single focus
            entry.target.classList.remove('is-active');
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '-40px 0px -60px 0px'
      }
    );

    timelineItems.forEach((item, index) => {
      item.classList.add('reveal-on-scroll');
      item.style.transitionDelay = `${index * 0.12}s`;
      itemObserver.observe(item);
    });
  }

  // 3. Certificate Modal Viewer (Delegates to Unified Certificate Controller)
  function openCertificateModal(certId) {
    openCertificateViewer(certId);
  }

  // Attach Certificate Card Triggers
  document.querySelectorAll('[data-cert-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certId = btn.getAttribute('data-cert-view');
      openCertificateModal(certId);
    });
  });

  document.querySelectorAll('[data-cert-download]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-cert-title') || 'Official Certificate';
      if (window.showCyberToast) {
        window.showCyberToast(`DOWNLOADING DOCUMENT // ${title.substring(0, 32)}...`);
      }
    });
  });

  // Make preview frame clickable to open certificate viewer directly
  document.querySelectorAll('.cert-preview-frame[data-cert-view-frame]').forEach(frame => {
    frame.addEventListener('click', () => {
      const certId = frame.getAttribute('data-cert-view-frame');
      openCertificateModal(certId);
    });
  });
}
