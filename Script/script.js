
// Global variables
let isDarkMode = false;
let sectionsState = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    updateLastModified();
    loadThemePreference();
    initializeSectionStates();
    setupHoverEffects();
    setupProfileClick();
});

// Initialize page functionality
function initializePage() {
    // Check if we're on a sub-page (though you only have index.html now)
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'index.html' && currentPage !== '') {
        showHomeIcon();
    }

    // Initialize tooltips and hover effects
    setupHoverEffects();

    // Setup profile image click functionality
    setupProfileClick();
}

// Show home icon for sub-pages (kept for future use if needed)
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
        profileImage.addEventListener('click', function () {
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
            item.addEventListener('mouseenter', function () {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });

            item.addEventListener('mouseleave', function () {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        }
    });
}

// Initialize section states - all expanded by default
function initializeSectionStates() {
    const sections = document.querySelectorAll('.section');

    // Load saved states from localStorage
    const savedStates = localStorage.getItem('resumeSectionStates');
    if (savedStates) {
        try {
            sectionsState = JSON.parse(savedStates);
        } catch (e) {
            console.error('Error loading section states:', e);
            sectionsState = {};
        }
    }

    // Initialize all sections
    sections.forEach(section => {
        const titleElement = section.querySelector('.section-title');
        const content = section.querySelector('.section-content');
        const icon = section.querySelector('.collapse-icon');

        if (titleElement && content && icon) {
            // Get section title
            const sectionTitle = getSectionTitle(titleElement);

            // Check if we have a saved state, otherwise default to expanded
            const savedState = sectionsState[sectionTitle];
            const shouldBeExpanded = savedState !== 'collapsed'; // Default to expanded unless explicitly collapsed

            if (shouldBeExpanded) {
                expandSection(section, content, icon);
                sectionsState[sectionTitle] = 'expanded';
            } else {
                collapseSection(section, content, icon);
                sectionsState[sectionTitle] = 'collapsed';
            }
        }
    });

    // Save the initialized states
    saveSectionStates();
}

// Get section title text
function getSectionTitle(titleElement) {
    return titleElement.textContent.trim();
}

// Expand section
function expandSection(section, content, icon) {
    content.style.display = 'block';
    content.style.maxHeight = 'none';
    content.style.opacity = '1';
    icon.style.transform = 'rotate(0deg)';
    section.classList.remove('collapsed');
}

// Collapse section
function collapseSection(section, content, icon) {
    content.style.display = 'none';
    content.style.maxHeight = '0px';
    content.style.opacity = '0';
    icon.style.transform = 'rotate(-90deg)';
    section.classList.add('collapsed');
}

// Toggle section function - called from HTML onclick
function toggleSection(header) {
    const section = header.parentElement;
    const content = section.querySelector('.section-content');
    const icon = header.querySelector('.collapse-icon');
    const titleElement = header.querySelector('.section-title');

    if (!content || !icon || !titleElement) {
        console.error('Required elements not found for section toggle');
        return;
    }

    const sectionTitle = getSectionTitle(titleElement);

    // Check current state using CSS classes
    const isCurrentlyCollapsed = section.classList.contains('collapsed');

    if (isCurrentlyCollapsed) {
        // Expand section
        expandSection(section, content, icon);
        sectionsState[sectionTitle] = 'expanded';
    } else {
        // Collapse section
        collapseSection(section, content, icon);
        sectionsState[sectionTitle] = 'collapsed';
    }

    // Save section states to localStorage
    saveSectionStates();
}

// Save section states to localStorage
function saveSectionStates() {
    try {
        localStorage.setItem('resumeSectionStates', JSON.stringify(sectionsState));
    } catch (e) {
        console.error('Error saving section states:', e);
    }
}

// Expand all sections (utility function)
function expandAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const titleElement = section.querySelector('.section-title');
        const content = section.querySelector('.section-content');
        const icon = section.querySelector('.collapse-icon');

        if (titleElement && content && icon) {
            const sectionTitle = getSectionTitle(titleElement);
            expandSection(section, content, icon);
            sectionsState[sectionTitle] = 'expanded';
        }
    });
    saveSectionStates();
}

// Collapse all sections (utility function)
function collapseAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const titleElement = section.querySelector('.section-title');
        const content = section.querySelector('.section-content');
        const icon = section.querySelector('.collapse-icon');

        if (titleElement && content && icon) {
            const sectionTitle = getSectionTitle(titleElement);
            collapseSection(section, content, icon);
            sectionsState[sectionTitle] = 'collapsed';
        }
    });
    saveSectionStates();
}

// Toggle theme between light and dark mode - called from HTML onclick
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

// Update last modified date - used by your version info
function updateLastModified() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        const fixedDate = new Date('2025-08-03'); // Updated to current date
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        lastUpdatedElement.textContent = fixedDate.toLocaleDateString('en-US', options);
    }
}

// Handle window resize for responsive design
window.addEventListener('resize', function () {
    setupHoverEffects();
});

// Handle page visibility change
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        updateLastModified();
    }
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function () {
    setTimeout(() => {
        initializeSectionStates();
        setupHoverEffects();
    }, 100);
});

// Error handling for missing resources
window.addEventListener('error', function (e) {
    console.error('Resource loading error:', e);
});

// Utility functions for debugging/testing
window.resumeUtils = {
    expandAll: expandAllSections,
    collapseAll: collapseAllSections,
    getSectionStates: () => sectionsState,
    resetSectionStates: () => {
        localStorage.removeItem('resumeSectionStates');
        sectionsState = {};
        initializeSectionStates();
    }
};

// Add this function to your existing script.js file

// Navigate to resume page
function navigateToResume() {
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        // Add loading state
        const originalContent = resumeBtn.innerHTML;
        resumeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        resumeBtn.disabled = true;

        // Navigate to resume page
        setTimeout(() => {
            window.location.href = 'resume.html';
        }, 500);
    }
}
