// Global variables
let isDarkMode = false;
let sectionsState = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    updateLastModified();
    loadThemePreference();
    loadSectionStates();
    setupHoverEffects();
    setupProfileClick();
});

// Initialize page functionality
function initializePage() {
    // Check if we're on a sub-page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'index.html' && currentPage !== '') {
        showHomeIcon();
    }
    
    // Initialize tooltips and hover effects
    setupHoverEffects();
    
    // Setup profile image click functionality
    setupProfileClick();
}

// Show home icon for sub-pages
function showHomeIcon() {
    const homeIcon = document.getElementById('homeIcon');
    if (homeIcon) {
        homeIcon.style.display = 'block';
    }
}

// Setup profile image click functionality
function setupProfileClick() {
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        profileImage.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        
        // Add clickable class for styling
        profileImage.classList.add('clickable');
    }
}

// Setup hover effects for contact items
function setupHoverEffects() {
    const contactItems = document.querySelectorAll('.contact-item[data-hover-text]');
    
    contactItems.forEach(item => {
        // Remove existing tooltips first
        const existingTooltip = item.querySelector('.tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        const hoverText = item.getAttribute('data-hover-text');
        if (hoverText) {
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = hoverText;
            item.appendChild(tooltip);
            
            // Add hover event listeners
            item.addEventListener('mouseenter', function() {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            
            item.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        }
    });
}

// Toggle section collapse/expand
function toggleSection(header) {
    const section = header.parentElement;
    const content = section.querySelector('.section-content');
    const icon = header.querySelector('.collapse-icon');
    const sectionTitle = header.querySelector('.section-title').textContent.trim();
    
    // Check current state
    const isCollapsed = content.style.display === 'none' || content.style.maxHeight === '0px';
    
    if (isCollapsed) {
        // Expand section
        content.style.display = 'block';
        content.style.maxHeight = 'none';
        content.style.opacity = '1';
        icon.style.transform = 'rotate(0deg)';
        section.classList.remove('collapsed');
        sectionsState[sectionTitle] = 'expanded';
    } else {
        // Collapse section
        content.style.display = 'none';
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        icon.style.transform = 'rotate(-90deg)';
        section.classList.add('collapsed');
        sectionsState[sectionTitle] = 'collapsed';
    }
    
    // Save section states to localStorage
    saveSectionStates();
}

// Save section states to localStorage
function saveSectionStates() {
    localStorage.setItem('resumeSectionStates', JSON.stringify(sectionsState));
}

// Load section states from localStorage
function loadSectionStates() {
    const savedStates = localStorage.getItem('resumeSectionStates');
    if (savedStates) {
        try {
            sectionsState = JSON.parse(savedStates);
            
            // Apply saved states
            Object.keys(sectionsState).forEach(sectionTitle => {
                const sections = document.querySelectorAll('.section');
                sections.forEach(section => {
                    const titleElement = section.querySelector('.section-title');
                    if (titleElement) {
                        // Get text content, handling both direct text and links
                        const titleText = titleElement.textContent.trim() || 
                                        (titleElement.querySelector('a') ? titleElement.querySelector('a').textContent.trim() : '');
                        
                        if (titleText === sectionTitle) {
                            const content = section.querySelector('.section-content');
                            const icon = section.querySelector('.collapse-icon');
                            
                            if (content && icon) {
                                if (sectionsState[sectionTitle] === 'collapsed') {
                                    content.style.display = 'none';
                                    content.style.maxHeight = '0px';
                                    content.style.opacity = '0';
                                    icon.style.transform = 'rotate(-90deg)';
                                    section.classList.add('collapsed');
                                } else {
                                    content.style.display = 'block';
                                    content.style.maxHeight = 'none';
                                    content.style.opacity = '1';
                                    icon.style.transform = 'rotate(0deg)';
                                    section.classList.remove('collapsed');
                                }
                            }
                        }
                    }
                });
            });
        } catch (e) {
            console.error('Error loading section states:', e);
            sectionsState = {};
        }
    }
}

// Toggle theme between light and dark mode
function toggleTheme() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    
    if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
        body.classList.add('dark-mode');
        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    } else {
        body.removeAttribute('data-theme');
        body.classList.remove('dark-mode');
        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }
    
    // Save theme preference
    localStorage.setItem('resumeTheme', isDarkMode ? 'dark' : 'light');
}

// Load theme preference from localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('resumeTheme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        document.body.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    } else {
        isDarkMode = false;
        document.body.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }
}

// Download PDF functionality with better error handling
function downloadPDF() {
    // Show loading state immediately
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        downloadBtn.disabled = true;
    }

    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf library not loaded');
        alert('PDF library not loaded. Please refresh the page and try again.');
        resetDownloadButton();
        return;
    }
    
    const element = document.getElementById('resume-content');
    if (!element) {
        console.error('Resume content element not found');
        alert('Resume content not found.');
        resetDownloadButton();
        return;
    }

    try {
        // Store original states
        const originalStates = prepareForPDF();
        
        // Configure PDF options
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'Jayant_Jangir_Resume.pdf',
            image: { 
                type: 'jpeg', 
                quality: 0.95 
            },
            html2canvas: { 
                scale: 1.5,
                useCORS: true,
                letterRendering: true,
                allowTaint: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1200,
                windowHeight: window.innerHeight,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css'],
                before: '.section',
                after: '.page-break'
            }
        };
        
        // Generate PDF
        html2pdf().set(opt).from(element).save()
            .then(() => {
                console.log('PDF generated successfully');
                restoreAfterPDF(originalStates);
                resetDownloadButton();
            })
            .catch((error) => {
                console.error('PDF generation failed:', error);
                alert('Failed to generate PDF. Please try again or use the Print option.');
                restoreAfterPDF(originalStates);
                resetDownloadButton();
            });
            
    } catch (error) {
        console.error('Error in downloadPDF function:', error);
        alert('An error occurred while generating PDF. Please try again.');
        resetDownloadButton();
    }
}

// Prepare elements for PDF generation
function prepareForPDF() {
    const controls = document.querySelector('.controls');
    const versionInfo = document.querySelector('.version-info');
    const homeIcon = document.querySelector('.home-icon');
    
    // Store original states
    const originalStates = {
        controlsDisplay: controls ? controls.style.display : '',
        versionDisplay: versionInfo ? versionInfo.style.display : '',
        homeDisplay: homeIcon ? homeIcon.style.display : '',
        sectionStates: {}
    };
    
    // Hide controls and version info for PDF
    if (controls) controls.style.display = 'none';
    if (versionInfo) versionInfo.style.display = 'none';
    if (homeIcon) homeIcon.style.display = 'none';
    
    // Expand all sections and store their states
    const allSections = document.querySelectorAll('.section-content');
    const allIcons = document.querySelectorAll('.collapse-icon');
    const allSectionElements = document.querySelectorAll('.section');
    
    allSections.forEach((section, index) => {
        originalStates.sectionStates[index] = {
            display: section.style.display,
            maxHeight: section.style.maxHeight,
            opacity: section.style.opacity
        };
        section.style.display = 'block';
        section.style.maxHeight = 'none';
        section.style.opacity = '1';
    });
    
    allIcons.forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
    });
    
    allSectionElements.forEach(section => {
        section.classList.remove('collapsed');
    });
    
    return originalStates;
}

// Restore elements after PDF generation
function restoreAfterPDF(originalStates) {
    const controls = document.querySelector('.controls');
    const versionInfo = document.querySelector('.version-info');
    const homeIcon = document.querySelector('.home-icon');
    
    // Restore original display states
    if (controls) controls.style.display = originalStates.controlsDisplay;
    if (versionInfo) versionInfo.style.display = originalStates.versionDisplay;
    if (homeIcon) homeIcon.style.display = originalStates.homeDisplay;
    
    // Restore original section states
    const allSections = document.querySelectorAll('.section-content');
    allSections.forEach((section, index) => {
        if (originalStates.sectionStates[index]) {
            section.style.display = originalStates.sectionStates[index].display || 'block';
            section.style.maxHeight = originalStates.sectionStates[index].maxHeight || 'none';
            section.style.opacity = originalStates.sectionStates[index].opacity || '1';
        }
    });
    
    // Restore section states from localStorage
    setTimeout(() => {
        loadSectionStates();
    }, 100);
}

// Reset download button to original state
function resetDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.innerHTML = '<i class="fas fa-file-arrow-down"></i> Download PDF';
        downloadBtn.disabled = false;
    }
}

// Print page functionality
function printPage() {
    const originalStates = prepareForPDF();
    
    // Print the page
    window.print();
    
    // Restore original states after printing
    setTimeout(() => {
        restoreAfterPDF(originalStates);
    }, 1000);
}

// Update last modified date
function updateLastModified() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        lastUpdatedElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    setupHoverEffects();
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateLastModified();
    }
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function() {
    setTimeout(() => {
        loadSectionStates();
        setupHoverEffects();
    }, 100);
});

// Error handling for missing resources
window.addEventListener('error', function(e) {
    console.error('Resource loading error:', e);
});

// Check if all required libraries are loaded
window.addEventListener('load', function() {
    if (typeof html2pdf === 'undefined') {
        console.warn('html2pdf library not loaded. PDF download may not work.');
    }
});