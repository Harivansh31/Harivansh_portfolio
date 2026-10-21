/**
 * ========================================================
 * MODALS & INTERACTIVE DIALOG CONTROLLERS (REAL RESUME DATA)
 * Project Case Studies, Certifications, Resume, & Toast
 * ========================================================
 */

export function initModals() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalWindow = document.getElementById('modalWindow');
  const modalClose = document.getElementById('modalCloseBtn');
  const toast = document.getElementById('cyberToast');
  const toastMsg = document.getElementById('toastMessage');

  // Real Projects Database for Harivansh Vats (9 Projects)
  const projectData = {
    'resume-maker': {
      tag: 'WEB DEVELOPMENT // PRODUCTION READY',
      title: 'Resume Maker Platform',
      body: `
        <p><strong>Overview:</strong> A responsive web-based resume builder application featuring customizable templates, real-time live editing, typography controls, and professional client-side PDF export.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Implemented intuitive user controls for section ordering, font styling, and layout customization.</li>
          <li>Integrated client-side PDF compilation allowing users to download print-ready resumes instantly.</li>
          <li>Deployed locally and fully responsive across all desktop and mobile viewports.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> HTML5, CSS3, JavaScript ES6+, PDF Generation Engine, LocalStorage.</p>
      `,
      links: [
        { label: 'Launch Application', url: 'resume-maker/index.html', primary: true },
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: false }
      ]
    },
    'ai-resume': {
      tag: 'WEB DEVELOPMENT // PRODUCTION READY',
      title: 'Resume Maker Platform',
      body: `
        <p><strong>Overview:</strong> A responsive web-based resume builder application featuring customizable templates, real-time live editing, typography controls, and professional client-side PDF export.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Implemented intuitive user controls for section ordering, font styling, and layout customization.</li>
          <li>Integrated client-side PDF compilation allowing users to download print-ready resumes instantly.</li>
          <li>Deployed locally and fully responsive across all desktop and mobile viewports.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> HTML5, CSS3, JavaScript ES6+, PDF Generation Engine, LocalStorage.</p>
      `,
      links: [
        { label: 'Launch Application', url: 'resume-maker/index.html', primary: true },
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: false }
      ]
    },
    'gripper-arm': {
      tag: 'ROBOTICS & EMBEDDED // SENSOR GESTURE CONTROL',
      title: 'Hand Motion Controlled Robotic Gripper Arm',
      galleryWide: true,
      body: `
        <p><strong>Overview:</strong> Custom hand-crafted robotic arm controlled via a wearable 5-finger flex sensor glove, MPU6050 6-axis IMU, and Arduino/ESP32 microcontroller architecture with servo drive kinematics. All mechanical linkages, dual-axis arm pivots, reduction gears, and vented base housings were engineered in SolidWorks and 3D-printed.</p>

        <div class="modal-gallery-section">
          <div class="modal-gallery-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 15px; height: 15px;">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Hardware Prototype & 3D CAD Engineering Gallery (Click Image to Enlarge)</span>
          </div>

          <!-- Section 1: Physical Prototype & Lab Bench Integration -->
          <div class="modal-gallery-subtitle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px;">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <span>01 // Physical Prototype Builds & Bench Integration</span>
          </div>

          <div class="modal-gallery-grid">
            <div class="modal-gallery-item item-featured">
              <span class="modal-gallery-badge">PROTOTYPE SETUP</span>
              <img src="assets/images/gripper_arm_bench.jpg" alt="Complete Prototype Setup with Sensor Glove and Controller" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Full System Integration:</strong> Wearable 5-finger sensory glove, Arduino/ESP32 controller, breadboard power circuit & articulated arm on test bench.</span>
            </div>
            <div class="modal-gallery-item item-featured">
              <span class="modal-gallery-badge">PHYSICAL BUILD</span>
              <img src="assets/images/gripper_arm_assembled.jpg" alt="Physical Assembled Robotic Arm" class="modal-gallery-img" loading="lazy" style="object-position: top center;">
              <span class="gallery-caption"><strong>Physical Assembly & Kinematics:</strong> Multi-axis articulation with mechanical gripper securely clutching object under real-time servo drive.</span>
            </div>
          </div>

          <!-- Section 2: 3D CAD Robotic Arm Assemblies & Exploded Views -->
          <div class="modal-gallery-subtitle" style="margin-top: 1.5rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px;">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span>02 // SolidWorks 3D CAD Assemblies & Exploded Architecture</span>
          </div>

          <div class="modal-gallery-grid">
            <div class="modal-gallery-item item-featured">
              <span class="modal-gallery-badge badge-cad">EXPLODED VIEW ASSEMBLY</span>
              <img src="assets/images/gripper_cad_exploded.jpg" alt="3D CAD Exploded View Assembly of Robotic Arm" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Exploded Mechanical Architecture:</strong> SolidWorks exploded CAD render illustrating dual link arms, ball bearings, pivot axles, actuator mount blocks, and wrist knuckle.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">ARTICULATED ARM ASSEMBLY</span>
              <img src="assets/images/gripper_cad_arm_assembled.jpg" alt="3D CAD Articulated Dual-Link Arm Assembly" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Articulated Arm Assembly:</strong> Dual-link arm kinematic structure in folded operating stance showing servo pocket and wire routing channel.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">VENTED BASE ENCLOSURE</span>
              <img src="assets/images/gripper_cad_housing.jpg" alt="3D CAD Vented Base Unit Assembly" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Assembled Base Unit:</strong> Cylindrical enclosure featuring perimeter cooling louvers, top ventilation slots, and exterior anchor lugs.</span>
            </div>
          </div>

          <!-- Section 3: Precision Mechanical Components & Structural Links -->
          <div class="modal-gallery-subtitle" style="margin-top: 1.5rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px;">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>03 // Precision Mechanical Components & Structural Links (SolidWorks)</span>
          </div>

          <div class="modal-gallery-grid-3col">
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">FOREARM BEAM</span>
              <img src="assets/images/gripper_cad_forearm_beam.jpg" alt="3D CAD Forearm Structural Link Beam" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Forearm Link Beam:</strong> Structural forearm beam featuring bottom rectangular pocket and top servo horn mounting ring.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">SERVO KNUCKLE</span>
              <img src="assets/images/gripper_cad_servo_knuckle.jpg" alt="3D CAD Arched Servo Knuckle" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Servo Knuckle Bracket:</strong> Arched actuator knuckle bracket with pass-through cavity and base fastening points.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">PIVOT LINK PLATE</span>
              <img src="assets/images/gripper_cad_pivot_plate.jpg" alt="3D CAD Arched Pivot Link Plate" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Pivot Link Plate:</strong> Arched support upright with precision oval bearing recess and 3-point anchor base.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">PIVOT BOSS PLATE</span>
              <img src="assets/images/gripper_cad_pivot_boss.jpg" alt="3D CAD Square Pivot Boss Plate" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Pivot Boss Plate:</strong> Square mounting plate with central cylindrical shaft pin and 4 counterbored corner holes.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">DUAL LINK BLOCK</span>
              <img src="assets/images/gripper_cad_link_connector.jpg" alt="3D CAD Dual-Socket Link Connector" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Dual-Socket Link Block:</strong> Dual actuator coupling connector with square servo pockets and central wire groove.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">UPPER ARM BEAM</span>
              <img src="assets/images/gripper_cad_armbeam.jpg" alt="3D CAD Articulated Arm Link Beam" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Upper Arm Beam:</strong> Structural arm beam with 4-hole servo horn mounting circle and axial pivot slot.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">SERVO MOUNT</span>
              <img src="assets/images/gripper_cad_servomount.jpg" alt="3D CAD Rectangular Servo Mount Bracket" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Chassis Servo Mount:</strong> Rectangular hollow servo chassis block with 3-point side fastener holes.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">TURNTABLE PLATE</span>
              <img src="assets/images/gripper_cad_baseplate.jpg" alt="3D CAD Turntable Base Plate" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Turntable Base Plate:</strong> Keyed central actuator slot, 8-hole bolt circle, and motor mount holes.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">MOUNT BRACKET</span>
              <img src="assets/images/gripper_cad_bracket.jpg" alt="3D CAD Motor/Bearing Bracket" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Actuator Bracket:</strong> Custom H-frame support bracket with central aperture and 4-point screw anchor.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">FLANGE RING</span>
              <img src="assets/images/gripper_cad_flange.jpg" alt="3D CAD Mounting Flange Ring" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Mounting Flange Ring:</strong> Precision 8-hole circular retaining flange for rotational bearing retention.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">LINK SPACER</span>
              <img src="assets/images/gripper_cad_linkspacer.jpg" alt="3D CAD Oval Bearing Link Spacer" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Oval Link Spacer:</strong> Precision bearing link spacer / bushing for joint clearance and smooth rotation.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">BEARING SPACER</span>
              <img src="assets/images/gripper_cad_disc.jpg" alt="3D CAD Bearing Spacer Disc" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Spacer Disc:</strong> Precision internal bearing spacer disc with central shaft aperture.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">BASE RING</span>
              <img src="assets/images/gripper_cad_ring.jpg" alt="3D CAD Turntable Base Ring" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Turntable Ring:</strong> 3D-modeled turntable slotted base housing for azimuth rotation.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">SPUR GEAR</span>
              <img src="assets/images/gripper_cad_gear1.jpg" alt="3D CAD Drive Spur Gear" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Drive Spur Gear:</strong> Precision involute tooth spur gear for high-torque arm transmission.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">WRIST COLLAR</span>
              <img src="assets/images/gripper_cad_wrist_collar.jpg" alt="3D CAD Wrist Swivel Collar Housing" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Wrist Swivel Collar:</strong> Semi-circular joint collar housing with rectangular actuator pocket and dual forward pin holes.</span>
            </div>
            <div class="modal-gallery-item">
              <span class="modal-gallery-badge badge-cad">PINION GEAR</span>
              <img src="assets/images/gripper_cad_gear2.jpg" alt="3D CAD Motor Pinion" class="modal-gallery-img" loading="lazy">
              <span class="gallery-caption"><strong>Motor Pinion:</strong> Custom servo reduction gear for compact gear coupling.</span>
            </div>
          </div>
        </div>

        <p><strong>Physical Hardware & Mechanical Fabrication:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li><strong>Hand-Made Prototyping:</strong> Designed from scratch and physically fabricated using custom 3D-printed PLA mechanical linkages, precision reduction gears, and durable mounting structures.</li>
          <li><strong>Wearable Sensor Glove:</strong> Engineered a 5-finger sensory glove integrating variable flex resistance sensors and an MPU6050 gyroscope/accelerometer to capture discrete finger bending and hand spatial orientation.</li>
          <li><strong>Kinematics & Servo Articulation:</strong> Programmed multi-channel PWM servo drivers to translate human hand gestures into smooth, proportional mechanical gripper motion with low latency.</li>
          <li><strong>SolidWorks 3D Modeling:</strong> Designed and sliced all functional gears, base rings, and arm brackets for additive manufacturing with tight mechanical tolerances.</li>
        </ul>
        <p><strong>Tools & Fabrication:</strong> Hand-crafted Physical Assembly, 3D Printing (CAD/CAM), SolidWorks, Arduino, ESP32, Flex Sensors, MPU6050 IMU, High-Torque Servos, C++ Embedded Control.</p>
      `,
      links: []
    },
    'patrol-robot': {
      tag: 'ROBOTICS & EMBEDDED IOT // AUTONOMOUS SECURITY',
      title: 'AI Security Patrol Robot',
      galleryWide: true,
      body: `
        <p><strong>Overview:</strong> Autonomous security patrol robot featuring ESP32 microcontroller architecture, pan-tilt ESP32-CAM video surveillance, HC-SR04 ultrasonic obstacle avoidance, dual emergency warning strobe lights, and real-time mobile telemetry alerts.</p>

        <div class="modal-gallery-section">
          <div class="modal-gallery-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 15px; height: 15px;">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Hardware Architecture & Technical Schematics (Click Image to Enlarge)</span>
          </div>

          <div class="modal-gallery-grid">
            <div class="modal-gallery-item item-featured">
              <span class="modal-gallery-badge">SYSTEM INFOGRAPHIC & WORKFLOW</span>
              <img src="assets/images/patrol_robot_hardware_infographic.jpg" alt="AI Security Patrol Robot Technical Specifications and Workflow Infographic" class="modal-gallery-img" loading="lazy" style="height: 320px; object-fit: contain; background: #010A14;">
              <span class="gallery-caption"><strong>Complete Hardware Specifications & Workflow:</strong> Physical robot prototype build, bill of materials (BOM), sensor-to-controller block diagram, and step-by-step autonomous patrol workflow.</span>
            </div>
            <div class="modal-gallery-item item-featured">
              <span class="modal-gallery-badge badge-cad">EXPLODED 3D CAD SCHEMATIC</span>
              <img src="assets/images/patrol_robot_exploded_cad.jpg" alt="Exploded View of Security Patrol Robot" class="modal-gallery-img" loading="lazy" style="height: 320px; object-fit: contain; background: #000000;">
              <span class="gallery-caption"><strong>Exploded Mechanical & Electronic Architecture:</strong> PTZ camera head, rotating base mount, controller, sensor array, L298N driver, 4 DC geared motors, Li-ion battery, and mobile chassis.</span>
            </div>
            <div class="modal-gallery-item item-featured">
              <span class="modal-gallery-badge">PHYSICAL ROBOT CLOSE-UP</span>
              <img src="assets/images/patrol_robot_real_hardware.jpg" alt="Physical Mobile Robot Prototype" class="modal-gallery-img" loading="lazy" style="height: 260px; object-fit: cover;">
              <span class="gallery-caption"><strong>Assembled Mobile Prototype:</strong> Pan-tilt ESP32-CAM turret, dual ultrasonic eyes, high-intensity red & blue warning strobe LEDs, and 12V geared drive chassis.</span>
            </div>
          </div>
        </div>

        <p><strong>System Specifications & Capabilities:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li><strong>Autonomous Line Navigation:</strong> Navigates predefined facility patrol corridors utilizing high-contrast IR ground reflectance sensors.</li>
          <li><strong>Real-Time Computer Vision:</strong> 2 MP ESP32-CAM optical sensor mounted on a high-speed pan-tilt servo head for continuous 360° visual perimeter inspection.</li>
          <li><strong>Active Obstacle Avoidance:</strong> HC-SR04 ultrasonic array continuously samples distance up to 4 meters to safely steer around dynamic hazards.</li>
          <li><strong>Instant Intrusion Alerts:</strong> Automatically triggers dual blue/red emergency strobes, sounds a high-decibel piezo buzzer, and transmits real-time telemetry snapshots to the operator's mobile phone via 2.4 GHz Wi-Fi.</li>
          <li><strong>Specs & Endurance:</strong> 400 × 300 × 250 mm chassis, 3–4 kg payload weight, 0–20 m/min adjustable velocity, powered by a 12V Li-ion battery with integrated BMS (2–3 hours patrol).</li>
        </ul>

        <p><strong>Bill of Materials & Tech Stack:</strong> ESP32 Dev Board, ESP32-CAM Module, L298N Dual H-Bridge Motor Driver, 12V DC Geared Motors, SG90 Pan-Tilt Servos, HC-SR04 Ultrasonic Sensor, PIR Motion Sensor, 12V Li-ion Pack + BMS, C++ Embedded Control, Wi-Fi Telemetry Server.</p>
      `,
      links: [
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: true }
      ]
    },
    'ecommerce-analytics': {
      tag: 'DATA ANALYTICS // POWER BI & SQL',
      title: 'E-Commerce Data Analysis (Power BI)',
      body: `
        <p><strong>Overview:</strong> End-to-end retail sales intelligence dashboard tracking $125K+ in revenues, order conversion rates, profit margins, and customer behavioral cohorts.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Organized and normalized complex transactional datasets using SQL Server and Power Query.</li>
          <li>Constructed executive Power BI dashboards with DAX metrics for regional margins and returns.</li>
          <li>Enabled actionable business reporting identifying top-performing category drivers.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> Power BI, SQL, Python, Data Cleaning, DAX, Excel.</p>
      `,
      links: [
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: true }
      ]
    },
    'sales-dashboard': {
      tag: 'DATA ANALYTICS // POWER BI & SQL',
      title: 'E-Commerce Data Analysis (Power BI)',
      body: `
        <p><strong>Overview:</strong> End-to-end retail sales intelligence dashboard tracking $125K+ in revenues, order conversion rates, profit margins, and customer behavioral cohorts.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Organized and normalized complex transactional datasets using SQL Server and Power Query.</li>
          <li>Constructed executive Power BI dashboards with DAX metrics for regional margins and returns.</li>
          <li>Enabled actionable business reporting identifying top-performing category drivers.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> Power BI, SQL, Python, Data Cleaning, DAX, Excel.</p>
      `,
      links: [
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: true }
      ]
    },
    'fraud-analytics': {
      tag: 'DATA ANALYTICS // PYTHON & ANOMALY DETECTION',
      title: 'Financial Transaction & Fraud Analytics',
      body: `
        <p><strong>Overview:</strong> Enterprise financial analytics system examining 148,000+ transactions to isolate fraudulent patterns, suspicious velocity peaks, and mitigate potential financial loss.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Constructed Python data pipelines detecting statistical anomalies and outlier transaction spikes.</li>
          <li>Formulated fraud-risk scoring algorithms reducing false positives across simulated credit transactions.</li>
          <li>Designed interactive Power BI drill-down views displaying high-risk accounts and loss prevention metrics.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> Python, SQL, Power BI, Anomaly Detection, Pandas.</p>
      `,
      links: [
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: true }
      ]
    },
    'marketing-analytics': {
      tag: 'DATA ANALYTICS // MARKETING CAMPAIGN & ROI',
      title: 'Marketing Campaign & Customer Acquisition Analytics',
      body: `
        <p><strong>Overview:</strong> Multichannel marketing performance dashboard evaluating campaign ROAS, Customer Acquisition Cost (CAC), funnel conversion drop-offs, and social ad spend.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Aggregated performance data across Meta, Google Ads, and email acquisition channels.</li>
          <li>Modelled conversion funnels from click to checkout, isolating retention leaks.</li>
          <li>Delivered visual executive reports optimizing marketing budget allocations for 3.9x ROAS.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> SQL, Excel, Power BI, Marketing Analytics, DAX.</p>
      `,
      links: [
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: true }
      ]
    },
    'manufacturing-analytics': {
      tag: 'DATA ANALYTICS // INDUSTRIAL OEE & DOWNTIME',
      title: 'Manufacturing & Production Performance Analytics',
      body: `
        <p><strong>Overview:</strong> Industrial IoT and production analytics dashboard measuring Overall Equipment Effectiveness (OEE), unplanned machine downtime, rejection rates, and throughput.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Monitored assembly line machine metrics across 1,245 production units and 12.4 hrs downtime.</li>
          <li>Structured Root-Cause Analysis (RCA) dashboards identifying recurring mechanical wear factors.</li>
          <li>Established OEE benchmarks improving plant utilization and material scrap reduction.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> Excel, SQL, Python, Power BI, OEE Metrics.</p>
      `,
      links: [
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: true }
      ]
    },
    'whatsapp-bot': {
      tag: 'AI AUTOMATION // WORKFLOW & NLP',
      title: 'AI-Powered WhatsApp Chatbot',
      body: `
        <p><strong>Overview:</strong> Automated conversational chatbot engineered to address common customer queries, trigger instant responses, and schedule structured follow-up communications.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Engineered automated response logic ensuring rapid, consistent information access around the clock.</li>
          <li>Drastically reduced repetitive manual inquiries, freeing up operational team capacity.</li>
          <li>Integrated multi-turn conversational dialogs for common business services and FAQs.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> Python, Generative AI APIs, WhatsApp API, Webhook Automation.</p>
      `,
      links: [
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: true }
      ]
    },
    'himalaya-travel': {
      tag: 'WEB DEVELOPMENT // FULL STACK PLATFORM',
      title: 'Himalaya Travel & Stay Platform',
      body: `
        <p><strong>Overview:</strong> Responsive travel and accommodation discovery platform showcasing Himalayan destinations (Manali, Kasol, Leh), boutique homestays, and curated mountain trekking routes.</p>
        <p><strong>Key Accomplishments:</strong></p>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; color: var(--text-secondary);">
          <li>Engineered interactive destination search with price filtering, location tags, and stay previews.</li>
          <li>Integrated interactive maps and elevation profile previews for high-altitude itineraries.</li>
          <li>Built high-performance responsive UI optimized for low-bandwidth mobile travelers.</li>
        </ul>
        <p><strong>Tools & Technologies:</strong> React, Node.js, MongoDB, Google Maps API, Travel API, CSS3.</p>
      `,
      links: [
        { label: 'View GitHub Repository', url: 'https://github.com/Harivansh31', primary: true }
      ]
    }
  };

  // Real Certificates Database for Harivansh Vats
  const certData = {
    'bharatcares-internship': {
      tag: 'ACCREDITED INTERNSHIP // BHARATCARES · AICTE · IBM',
      title: 'IBM SkillsBuild Data Analytics with AI Internship Program',
      body: `
        <p><strong>Issuing Organization:</strong> BharatCares · in association with AICTE & IBM SkillsBuild</p>
        <p><strong>Period:</strong> 17th August 2026 – 30th September 2026 (6-Week Academic Program)</p>
        <p><strong>Credential Unique ID:</strong> <code>IBMACBHDAI2875</code></p>
        <p><strong>Executive Signatories:</strong> Ms. Shrilakshmi Nair (Senior Manager CSR, BharatCares) & Dr. Buddha Chandrasekhar (Chief Coordinating Officer, AICTE)</p>
        <p><strong>Validated Competencies:</strong> Practical Data Analytics Workflows, Data Preparation, Analytical Modeling, Data Visualization, and Applied Project Development.</p>
      `
    },
    'deloitte-simulation': {
      tag: 'FORAGE SIMULATION // DELOITTE',
      title: 'Deloitte Data Analytics Job Simulation',
      body: `
        <p><strong>Issuing Organization:</strong> Deloitte · Forage Virtual Experience</p>
        <p><strong>Completion Date:</strong> August 7th, 2026</p>
        <p><strong>Enrolment Verification Code:</strong> <code>EKXFZ3kbEPNZcdYm4</code></p>
        <p><strong>User Verification Code:</strong> <code>696aa9638d5b9c666d209bf9</code></p>
        <p><strong>Issued By:</strong> Tina McCreery, Chief Human Resources Officer, Deloitte</p>
        <p><strong>Validated Competencies:</strong> Factory Telemetry Data Analysis, Equipment Downtime Pattern Recognition, Forensic Technology, and Tableau Dashboard Design.</p>
      `
    },
    'ibm-skillsbuild-ai': {
      tag: 'COMPLETION CREDENTIAL // IBM SKILLSBUILD',
      title: 'AICTE | IBM SkillsBuild Academic Internship - Data Analytics with AI',
      body: `
        <p><strong>Issuing Organization:</strong> IBM SkillsBuild · BharatCares</p>
        <p><strong>Completion Date:</strong> 20 Aug 2026</p>
        <p><strong>System Record Plan ID:</strong> <code>PLAN-D44A9C2C463C</code></p>
        <p><strong>Validated Competencies:</strong> Data Analytics with AI, Machine Learning Fundamentals, Structured Query Operations, and Generative AI-assisted Productivity Workflows.</p>
      `
    },
    'oracle-ai': {
      tag: 'VERIFIED CREDENTIAL // ORACLE',
      title: 'Oracle Agentic AI Certified Foundations Associate',
      body: `
        <p><strong>Issuing Organization:</strong> Oracle University</p>
        <p><strong>Status:</strong> Active & Authenticated Credential</p>
        <p><strong>Validated Competencies:</strong> Autonomous Agent Architecture, Agentic Workflows, LLM Function Calling, Task Planning, Multi-Agent Collaboration.</p>
      `
    },
    'google-data': {
      tag: 'VERIFIED CREDENTIAL // GOOGLE',
      title: 'Foundations of Data Science',
      body: `
        <p><strong>Issuing Organization:</strong> Google / Coursera</p>
        <p><strong>Status:</strong> Completed & Verified</p>
        <p><strong>Validated Competencies:</strong> Data Analysis Methodologies, Data Ecosystems, Spreadsheet Modeling, SQL Querying, Data Ethics & Storytelling.</p>
      `
    },
    'ibm-python': {
      tag: 'VERIFIED CREDENTIAL // IBM',
      title: 'Python for Data Science, AI & Development',
      body: `
        <p><strong>Issuing Organization:</strong> IBM / Coursera</p>
        <p><strong>Status:</strong> Completed & Verified</p>
        <p><strong>Validated Competencies:</strong> Python Programming, Pandas, NumPy, Data Structures, REST APIs, Web Scraping, AI Fundamentals.</p>
      `
    },
    'deloitte-forage': {
      tag: 'VERIFIED SIMULATION // DELOITTE',
      title: 'Deloitte Data Analytics Job Simulation',
      body: `
        <p><strong>Issuing Organization:</strong> Deloitte / Forage</p>
        <p><strong>Status:</strong> Completed & Verified Simulation</p>
        <p><strong>Validated Competencies:</strong> Enterprise Data Analytics, Identifying Trends & Anomalies, Strategic Business Observations, Tableau Dashboard Design.</p>
      `
    }
  };

  // Dedicated Lightbox for high-resolution gallery and CAD inspection
  function openLightbox(src, captionHtml) {
    let lb = document.getElementById('cyberLightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'cyberLightbox';
      lb.className = 'cyber-lightbox-backdrop';
      lb.innerHTML = `
        <div class="cyber-lightbox-content">
          <button type="button" class="cyber-lightbox-close" aria-label="Close Lightbox">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <img src="" alt="Hardware CAD Full Preview" class="cyber-lightbox-img" id="cyberLightboxImg">
          <div class="cyber-lightbox-caption" id="cyberLightboxCaption"></div>
        </div>
      `;
      document.body.appendChild(lb);
      lb.querySelector('.cyber-lightbox-close').addEventListener('click', () => {
        lb.classList.remove('active');
      });
      lb.addEventListener('click', (e) => {
        if (e.target === lb) lb.classList.remove('active');
      });
    }
    const imgEl = document.getElementById('cyberLightboxImg');
    const capEl = document.getElementById('cyberLightboxCaption');
    if (imgEl) imgEl.src = src;
    if (capEl) capEl.innerHTML = captionHtml || '';
    lb.classList.add('active');
  }

  function closeLightbox() {
    const lb = document.getElementById('cyberLightbox');
    if (lb) lb.classList.remove('active');
  }

  function openModal(htmlContent, isWide = false, isGalleryWide = false) {
    if (!modalBackdrop || !modalWindow) return;
    const bodyContainer = document.getElementById('modalDynamicContent');
    if (bodyContainer) {
      bodyContainer.innerHTML = htmlContent;
    }
    if (isWide) {
      modalWindow.classList.add('modal-wide');
    } else {
      modalWindow.classList.remove('modal-wide');
    }
    if (isGalleryWide) {
      modalWindow.classList.add('modal-gallery-wide');
    } else {
      modalWindow.classList.remove('modal-gallery-wide');
    }
    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Bind click events on gallery items to open cyber lightbox
    bodyContainer?.querySelectorAll('.modal-gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.modal-gallery-img');
        const caption = item.querySelector('.gallery-caption')?.innerHTML || '';
        if (img) {
          openLightbox(img.src, caption);
        }
      });
    });
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    modalWindow?.classList.remove('modal-wide');
    modalWindow?.classList.remove('modal-gallery-wide');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lb = document.getElementById('cyberLightbox');
      if (lb && lb.classList.contains('active')) {
        closeLightbox();
        return;
      }
      if (modalBackdrop && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    }
  });

  // Dedicated Interactive Resume Viewer
  window.openResumeModal = function() {
    const html = `
      <div class="resume-preview-container">
        <img 
          src="assets/resume/Harivansh_Vats_Resume_preview.webp" 
          alt="Harivansh Vats Official Resume" 
          class="resume-preview-image"
        />
      </div>
      <div class="modal-actions" style="margin-top: 0.85rem; padding-top: 0.75rem; display: flex; justify-content: center; width: 100%;">
        <a href="assets/resume/Harivansh_Vats_Resume.pdf" download="Harivansh_Vats_Resume.pdf" class="btn-primary" id="modalResumeDownloadBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download PDF
        </a>
      </div>
    `;
    openModal(html, true);
    document.getElementById('modalResumeDownloadBtn')?.addEventListener('click', () => {
      showCyberToast('DOWNLOADING OFFICIAL RESUME // HARIVANSH VATS');
    });
  };

  // Wire all .btn-view-resume elements
  document.querySelectorAll('.btn-view-resume, [data-action="view-resume"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openResumeModal();
    });
  });

  // Attach Project Card Click Handlers
  document.querySelectorAll('[data-project-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      const data = projectData[id];
      if (!data) return;

      const html = `
        <div class="modal-header">
          <span class="modal-tag">${data.tag}</span>
          <h2 class="modal-title">${data.title}</h2>
        </div>
        <div class="modal-body">${data.body}</div>
        <div class="modal-actions">
          ${data.links.map(l => `
            <a href="${l.url}" target="_blank" rel="noopener" class="${l.primary ? 'btn-primary' : 'btn-secondary'}">
              ${l.label}
            </a>
          `).join('')}
          <button type="button" class="${data.links.length === 0 ? 'btn-primary' : 'btn-secondary'}" id="modalDismissBtn">Close Window</button>
        </div>
      `;
      openModal(html, Boolean(data.wide), Boolean(data.galleryWide));
      document.getElementById('modalDismissBtn')?.addEventListener('click', closeModal);
    });
  });

  // Projects in Development Phase: Ensure project details modal is NOT accessed
  document.querySelectorAll('.btn-cs-status, .coming-soon-card').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showCyberToast('PROJECT IN DEVELOPMENT // Technical specifications & live demo will be published upon release.');
    });
  });

  // Attach Certificate Click Handlers
  document.querySelectorAll('[data-cert-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-cert-id');
      const data = certData[id];
      if (!data) return;

      const html = `
        <div class="modal-header">
          <span class="modal-tag">${data.tag}</span>
          <h2 class="modal-title">${data.title}</h2>
        </div>
        <div class="modal-body">${data.body}</div>
        <div class="modal-actions">
          <a href="https://www.linkedin.com/in/harivansh-vats-b00a722a4" target="_blank" rel="noopener" class="btn-primary">
            View on LinkedIn Profile
          </a>
          <button type="button" class="btn-secondary" id="modalDismissBtn">Done</button>
        </div>
      `;
      openModal(html);
      document.getElementById('modalDismissBtn')?.addEventListener('click', closeModal);
    });
  });

  // Resume Download Handler
  const resumeBtns = document.querySelectorAll('.btn-resume, #headerResumeBtn');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const link = document.createElement('a');
      link.href = 'assets/resume/Harivansh_Vats_Resume.pdf';
      link.download = 'Harivansh_Vats_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showCyberToast('DOWNLOADING OFFICIAL RESUME // HARIVANSH VATS');
    });
  });

  // Toast Function
  window.showCyberToast = function(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  };

  // Contact Form Submission
  const contactForm = document.getElementById('cyberContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⚡</span> TRANSMITTING DATA...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>✓</span> SIGNAL CONFIRMED`;
        contactForm.reset();
        showCyberToast('TRANSMISSION SENT // HARIVANSH VATS HAS RECEIVED YOUR MESSAGE');

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1200);
    });
  }

  // Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('harivanshvats@gmail.com');
      showCyberToast('COPIED: harivanshvats@gmail.com');
    });
  }

  // Copy Phone Button
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('+917011863224');
      showCyberToast('COPIED PHONE: +91 7011863224');
    });
  }
}
