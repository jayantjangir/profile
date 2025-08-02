// Resume View Toggle Functionality

let isResumeView = false;

// Initialize resume functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Add print button to controls
    addPrintButtonToControls();

    // Restore previous view state from localStorage
    const savedViewState = localStorage.getItem('resumeViewState');
    if (savedViewState === 'resume') {
        toggleResumeView();
    }
});

// Add print button to the existing controls (replacing dark mode)
function addPrintButtonToControls() {
    const controls = document.querySelector('.controls');
    if (controls) {
        // Remove dark mode button if it exists
        const darkModeBtn = document.getElementById('darkModeBtn');
        if (darkModeBtn) {
            darkModeBtn.remove();
        }

        // Create print button
        const printBtn = document.createElement('button');
        printBtn.id = 'printResumeBtn';
        printBtn.className = 'control-btn';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Resume';
        printBtn.title = 'Print Resume';
        printBtn.onclick = printResume;

        // Add to controls
        controls.appendChild(printBtn);
    }
}

// Toggle between profile and resume view
function toggleResumeView() {
    const body = document.body;
    const resumeViewBtn = document.getElementById('resumeViewBtn');

    if (!isResumeView) {
        // Switch to resume view
        showResumeView();
        body.classList.add('resume-mode');
        resumeViewBtn.innerHTML = '<i class="fas fa-user"></i> Profile View';
        resumeViewBtn.title = 'Switch to Profile View';
        isResumeView = true;
        localStorage.setItem('resumeViewState', 'resume');
    } else {
        // Switch to profile view
        hideResumeView();
        body.classList.remove('resume-mode');
        resumeViewBtn.innerHTML = '<i class="fas fa-file-alt"></i> Resume View';
        resumeViewBtn.title = 'Switch to Resume View';
        isResumeView = false;
        localStorage.setItem('resumeViewState', 'profile');
    }
}

// Show resume view
function showResumeView() {
    let resumeView = document.getElementById('resumeView');

    if (!resumeView) {
        createResumeView();
        resumeView = document.getElementById('resumeView');
    }

    resumeView.classList.add('active');
}

// Hide resume view
function hideResumeView() {
    const resumeView = document.getElementById('resumeView');
    if (resumeView) {
        resumeView.classList.remove('active');
    }
}

// Print resume functionality
function printResume() {
    if (!isResumeView) {
        showNotification('Please switch to Resume View first to print', 'info');
        return;
    }
    window.print();
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#667eea'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;

    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Extract data from index.html profile view
function extractProfileData() {
    const profileData = {
        name: '',
        title: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        profileImage: '',
        about: '',
        skills: [],
        experience: [],
        education: [],
        projects: []
    };

    // Extract name
    const nameElement = document.querySelector('.profile-name, h1');
    if (nameElement) {
        profileData.name = nameElement.textContent.trim();
    }

    // Extract title
    const titleElement = document.querySelector('.profile-title, .title');
    if (titleElement) {
        profileData.title = titleElement.textContent.trim();
    }

    // Extract contact info
    const emailElement = document.querySelector('a[href^="mailto:"]');
    if (emailElement) {
        profileData.email = emailElement.href.replace('mailto:', '');
    }

    const phoneElement = document.querySelector('a[href^="tel:"]');
    if (phoneElement) {
        profileData.phone = phoneElement.textContent.trim();
    }

    const linkedinElement = document.querySelector('a[href*="linkedin"]');
    if (linkedinElement) {
        profileData.linkedin = linkedinElement.href;
    }

    const githubElement = document.querySelector('a[href*="github"]');
    if (githubElement) {
        profileData.github = githubElement.href;
    }

    // Extract profile image
    const profileImageElement = document.querySelector('.profile-image img, .profile-pic img');
    if (profileImageElement) {
        profileData.profileImage = profileImageElement.src;
    }

    // Extract about section
    const aboutElement = document.querySelector('.about-text, .bio, .description');
    if (aboutElement) {
        profileData.about = aboutElement.textContent.trim();
    }

    return profileData;
}

// Create resume view HTML structure using data from index.html
function createResumeView() {
    const profileData = extractProfileData();

    const resumeHTML = `
        <div id="resumeView" class="resume-view">
            <div class="resume-content">
                <!-- Header Section with Profile Picture -->
                <div class="resume-header">
                    <div class="resume-header-left">
                        <div class="resume-profile-image">
                            <img src="${profileData.profileImage || './Resources/JayantJangir.jpg'}" alt="${profileData.name || 'Jayant Jangir'}" onerror="this.style.display='none'">
                        </div>
                    </div>
                    <div class="resume-header-right">
                        <h1 class="resume-name">${profileData.name || 'JAYANT JANGIR'}</h1>
                        <div class="resume-title">${profileData.title || 'Software Developer'}</div>
                        <div class="resume-contact-grid">
                            <div class="resume-contact-row">
                                <span class="resume-contact-item">
                                    <i class="fas fa-envelope"></i>
                                    <a href="mailto:${profileData.email || 'jayantjangir97@gmail.com'}">${profileData.email || 'jayantjangir97@gmail.com'}</a>
                                </span>
                                <span class="resume-contact-item">
                                    <i class="fas fa-phone"></i>
                                    <a href="tel:${profileData.phone || '+918112286926'}">${profileData.phone || '+91 811 22 86 926'}</a>
                                </span>
                            </div>
                            <div class="resume-contact-row">
                                <span class="resume-contact-item">
                                    <i class="fab fa-linkedin"></i>
                                    <a href="${profileData.linkedin || 'https://www.linkedin.com/in/jayantjangir/'}" target="_blank">linkedin.com/in/jayantjangir</a>
                                </span>
                                <span class="resume-contact-item">
                                    <i class="fab fa-github"></i>
                                    <a href="${profileData.github || 'https://github.com/jayantjangir'}" target="_blank">github.com/jayantjangir</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Career Objective -->
                <div class="resume-section">
                    <h2 class="resume-section-title">
                        <i class="fas fa-bullseye"></i>
                        Career Objective
                    </h2>
                    <p class="resume-objective">${profileData.about || 'Results-driven Software Developer with 5+ years of experience in enterprise-grade application development and DevOps automation with cloud-native architectures. Seeking a senior software development role to architect innovative solutions, lead cross-functional teams, and drive end-to-end digital transformation initiatives that accelerate business growth and operational excellence in a technology-forward enterprise.'}</p>
                </div>

                <!-- Technical Skills -->
                <div class="resume-section">
                    <h2 class="resume-section-title">
                        <i class="fas fa-code"></i>
                        Technical Skills
                    </h2>
                    <div class="resume-skills-grid">
                        <div class="resume-skill-item">
                            <strong>Core:</strong> Data Structure, Analysis and Design of Algorithms
                        </div>
                        <div class="resume-skill-item">
                            <strong>Programming Languages:</strong> C, C++, C#, Java, Python
                        </div>
                        <div class="resume-skill-item">
                            <strong>Frameworks & Libraries:</strong> Enterprise Java Beans (EJB), Spring Framework, Spring Boot, ASP.NET, Windows Presentation Foundation (WPF), Django
                        </div>
                        <div class="resume-skill-item">
                            <strong>Architectural Design:</strong> REST APIs, Microservices
                        </div>
                        <div class="resume-skill-item">
                            <strong>Frontend Technologies:</strong> HTML5, CSS3, JavaScript
                        </div>
                        <div class="resume-skill-item">
                            <strong>Data Languages:</strong> JSON, XML, XAML
                        </div>
                        <div class="resume-skill-item">
                            <strong>IDE and Tools:</strong> IntelliJ IDEA Ultimate, Microsoft Visual Studio 2022 Professional, Visual Studio Code, Amdocs Eclipse IDE, Microsoft Office 365, Oxygen XML Editor, Toad for Oracle, Postman, Beyond Compare, MobaXterm, Jira
                        </div>
                        <div class="resume-skill-item">
                            <strong>DevOps:</strong> Git, GitHub, Perforce, Nexus, Cloud, Docker, Automation tools and Scripts
                        </div>
                        <div class="resume-skill-item">
                            <strong>Databases:</strong> Microsoft SQL Server, Oracle Database, MySQL, PostgreSQL, IBM Db2
                        </div>
                        <div class="resume-skill-item">
                            <strong>Methodologies:</strong> Scrum Methodologies, Agile
                        </div>
                    </div>
                </div>

                <!-- Professional Experience -->
                <div class="resume-section">
                    <h2 class="resume-section-title">
                        <i class="fas fa-briefcase"></i>
                        Professional Experience
                    </h2>
                    
                    <div class="resume-job">
                        <div class="resume-job-header">
                            <div class="resume-job-title">Software Developer</div>
                            <div class="resume-company">Amdocs Development Centre India LLP, Gurgaon SEZ Unit</div>
                            <div class="resume-duration">April 11, 2022 - Present (3.3 Years) | Gurgaon, Haryana</div>
                            <div class="resume-job-details"><strong>Project:</strong> Charter Mobile (Product: Amdocs Billing - Scrum Team: Invoicing)</div>
                        </div>
                        <ul class="resume-highlights">
                            <li>Being a part of Scrum Team of Invoicing, getting involved in ongoing development and defects fixing along with Experts and Architects.</li>
                            <li>Developed customized source code as part of Sprint development for functionalities per the business requirement for Charter in various billing activities.</li>
                            <li>Aligning with Scrum Masters (SM) and Product Owners (PO) to closely understand the new Business requirements as part of ongoing Sprint Development or Defects fixes considering existing production behavior.</li>
                            <li>Helped in building simplified, scalable and secure functionality for Charter Account by leveraging the latest technology advancements to enhance and upgrade the billing system.</li>
                            <li>Developed and customized various functionalities related to telecom Billing product (Ordering, ESB, EOC).</li>
                            <li>Enriched the customer experience by delivering high standard of code quality in Scrum Development and Production Defect by fixing and keeping the new functionality to robust enough to handle the existing production cases and behavior.</li>
                            <li>Improved application design and flow by enhancing and reviewing database queries and coding standards with TabNine and Copilot.</li>
                            <li>Enhanced customer experience by leveraging GenAI tools and techniques with Advanced Prompt Engineering by crafting precise and contextually relevant prompts.</li>
                        </ul>
                    </div>

                    <div class="resume-job">
                        <div class="resume-job-header">
                            <div class="resume-job-title">Systems Engineer</div>
                            <div class="resume-company">TATA Consultancy Services (TCS), Mumbai</div>
                            <div class="resume-duration">September 9, 2019 - April 8, 2022 (2.6+ Years) | Mumbai, Maharashtra</div>
                            <div class="resume-job-details"><strong>Project:</strong> GE Current & Lightning (Migrated from GE and later Acquisition of Hubbell)</div>
                        </div>
                        <ul class="resume-highlights">
                            <li>Managed migration of Infra while cut-over GE Current from GE by enrolling Network Devices and On-premise Compute and Servers.</li>
                            <li>Managed and upgraded the operating version of Network and Compute devices and Servers which are located in various location worldwide.</li>
                            <li>Managed Security via iBoss, Zscaler portal and providing Company Network Access via AppGate VPN and managing PRTG Monitoring tool.</li>
                            <li>Managed PC Migration and Mobile Device Enrollment in Intune Company portal.</li>
                            <li>Managing Symphony Summit as IT Service Management tool to handle Incidents, Service Requests, Change Requests, Inventory of Network and Compute devices.</li>
                            <li>Being a part of AI and Automation leading team, ensured to leverage the best product capabilities of services and functionalities and enhanced more functionalities via Automation Scripts.</li>
                        </ul>
                    </div>
                </div>

                <!-- Key Projects -->
                <div class="resume-section">
                    <h2 class="resume-section-title">
                        <i class="fas fa-project-diagram"></i>
                        Key Projects
                    </h2>
                    
                    <div class="resume-category-header">
                        <i class="fas fa-building"></i>
                        Professional Projects
                    </div>
                    
                    <div class="resume-project">
                        <div class="resume-project-title">PRTG Auto Ticket Generation in Symphony Summit</div>
                        <div class="resume-project-subtitle">Enterprise ITSM Integration & Automation</div>
                        <div class="resume-project-meta">Enterprise Project | 6 Months | 4 Members</div>
                        <div class="resume-project-description">Developed automated incident management system integrating PRTG Monitoring tool with Symphony Summit ITSM. The solution automatically generates tickets for Network and Compute device failures based on PING sensor alerts, reducing manual ticket creation time from 15 minutes to 30 seconds.</div>
                        <div class="resume-technologies"><strong>Technologies:</strong> PRTG Network Monitor, Symphony Summit ITSM, MS Office 365</div>
                    </div>

                    <div class="resume-project">
                        <div class="resume-project-title">AI Assistant for GE Current (Intelligent Chat Bot)</div>
                        <div class="resume-project-subtitle">RASA-based Contextual AI Assistant</div>
                        <div class="resume-project-meta">AI/ML Project | 1 Month | 2 Members</div>
                        <div class="resume-project-description">Designed and developed an intelligent chatbot using RASA Core and RASA NLU frameworks. The assistant provides contextual troubleshooting guidance to GE Current L2 Team members, enabling first-level issue resolution.</div>
                        <div class="resume-technologies"><strong>Technologies:</strong> RASA Framework, Natural Language Processing, Machine Learning, Python</div>
                    </div>

                    <div class="resume-category-header">
                        <i class="fas fa-user-cog"></i>
                        Personal Projects
                    </div>
                    
                    <div class="resume-project">
                        <div class="resume-project-title">HillShare (Smart Carpooling Platform)</div>
                        <div class="resume-project-subtitle">Android Application Development</div>
                        <div class="resume-project-meta">Mobile App | 4 Months | 6 Members</div>
                        <div class="resume-project-description">Built comprehensive carpooling Android application with features including ride creation, ride search, join request, accept ride request, real time tracking and notifications via mail and phone for updates.</div>
                        <div class="resume-technologies"><strong>Technologies:</strong> Android Studio, Java, Firebase, Google Maps API</div>
                    </div>

                    <div class="resume-project">
                        <div class="resume-project-title">Profo Platform</div>
                        <div class="resume-project-subtitle">Online Assessment Portal</div>
                        <div class="resume-project-meta">Web Application | 5 Months | 6 Members</div>
                        <div class="resume-project-description">Developed scalable online testing platform using Python Django framework with advanced features for test creation, test schedule, automated score evaluation, and comprehensive analytics.</div>
                        <div class="resume-technologies"><strong>Technologies:</strong> Python, Django, HTML5, CSS3, JavaScript, Bootstrap, PostgreSQL</div>
                    </div>
                </div>

                <!-- Education -->
                <div class="resume-section">
                    <h2 class="resume-section-title">
                        <i class="fas fa-graduation-cap"></i>
                        Education
                    </h2>
                    
                    <div class="resume-education">
                        <div class="resume-institution">National Institute of Technology (NIT) Hamirpur, Himachal Pradesh</div>
                        <div class="resume-degree">Bachelor of Technology - Computer Science and Engineering</div>
                        <div class="resume-academic-info">CGPA: 8.04 / 10.0 | Duration: 2015 - 2019 (4 Years)</div>
                    </div>

                    <div class="resume-education">
                        <div class="resume-institution">Board of Secondary Education, Rajasthan, India</div>
                        <div class="resume-degree">S.B.S. Memo. S. S. Sr. Sec. School Sabalpura, Sikar</div>
                        <div class="resume-academic-info">Senior Secondary (XII): 86.80% (2014) | Secondary (X): 74.33% (2012)</div>
                    </div>
                </div>

                <!-- Certifications -->
                <div class="resume-section">
                    <h2 class="resume-section-title">
                        <i class="fas fa-certificate"></i>
                        Certifications & Training
                    </h2>
                    
                    <div class="resume-project">
                        <div class="resume-project-title">Microsoft Azure Fundamentals (AZ-900) Certification</div>
                        <div class="resume-project-subtitle">Cloud Computing Expertise | Microsoft | 2023</div>
                        <div class="resume-project-description">Achieved Microsoft Azure Fundamentals certification, demonstrating proficiency in cloud concepts, Azure services, security, privacy, compliance, and Azure pricing and support.</div>
                    </div>

                    <div class="resume-project">
                        <div class="resume-project-title">CBO AI Zumba - Advanced AI Training Program</div>
                        <div class="resume-project-subtitle">TCS Wellspring, Mumbai - Instructor-Led Training</div>
                        <div class="resume-project-description">Completed intensive training program focused on adopting AI and emerging technologies in enterprise projects, gaining expertise in machine learning algorithms, neural networks, and AI implementation strategies.</div>
                    </div>
                </div>

                <!-- Achievements -->
                <div class="resume-section">
                    <h2 class="resume-section-title">
                        <i class="fas fa-trophy"></i>
                        Key Achievements
                    </h2>
                    
                    <div class="resume-project">
                        <div class="resume-project-title">Star Performer Award - Amdocs</div>
                        <div class="resume-project-subtitle">Q2 2025 | Outstanding Performance Recognition</div>
                        <div class="resume-project-description">Recognized for exceptional contribution to Charter Mobile project, delivering high-quality solutions and maintaining code quality standards while meeting all sprint deadlines.</div>
                    </div>

                    <div class="resume-project">
                        <div class="resume-project-title">Innovation Excellence Award - TCS</div>
                        <div class="resume-project-subtitle">2021 | AI & Automation Initiative</div>
                        <div class="resume-project-description">Awarded for developing innovative automation solutions that reduced manual effort and improved operational efficiency.</div>
                    </div>
                </div>

                <!-- Additional Information -->
                <div class="resume-section">
                    <h2 class="resume-section-title">
                        <i class="fas fa-info-circle"></i>
                        Additional Information
                    </h2>
                    
                    <div class="resume-skills-grid">
                        <div class="resume-skill-item">
                            <strong>Languages:</strong> English (Fluent), Hindi (Native)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert the resume view after the main container
    const container = document.querySelector('.container');
    if (container) {
        container.insertAdjacentHTML('afterend', resumeHTML);
    } else {
        document.body.insertAdjacentHTML('beforeend', resumeHTML);
    }
}

// Export functions for global access
window.toggleResumeView = toggleResumeView;
window.printResume = printResume;