document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const navLinks = document.querySelectorAll('#sidebar a[data-module]');
    const contentArea = document.getElementById('main-area');

    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const module = link.getAttribute('data-module');
            const context = link.getAttribute('data-context') || 'modern';
            
            // Update active link
            document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            loadModule(module, context);
        });
    });

    const helpMapping = {
        'home': 'help-home',
        'prepare': 'help-prepare',
        'prepare-old': 'help-prepare',
        'map': 'help-map',
        'plan': 'help-plan',
        'move': 'help-move',
        'evaluate': 'help-evaluate',
        'discovered-data': 'help-discovered-data',
        'data-dictionary': 'help-data-dictionary',
        'data-entities': 'help-data-entities',
        'environments': 'help-environments',
        'move-principles': 'help-move-principles',
        'score-card': 'help-score-card',
        'admin-project': 'help-admin-project',
        'admin-users': 'help-admin-users',
        'admin-failures': 'help-admin-failures'
    };

    const contextualHelpLink = document.getElementById('contextual-help-link');
    if (contextualHelpLink) {
        contextualHelpLink.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = window.currentHelpSection || helpMapping[window.currentModule] || 'introduction';
            
            // Update active link in sidebar to Help Center
            document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
            const helpLink = document.querySelector('#sidebar a[data-module="help"]');
            if (helpLink) helpLink.parentElement.classList.add('active');
            
            loadModule('help', sectionId);
        });
    }

    window.setHelpSection = (sectionId) => {
        window.currentHelpSection = sectionId;
    };

    async function loadModule(module, context = 'modern') {
        window.currentModule = module;
        window.currentHelpSection = null; // Reset granular help section on module change
        contentArea.innerHTML = '<div class="text-center mt-5"><div class="spinner-border" role="status"></div><p>Loading...</p></div>';
        
        switch(module) {
            case 'discovered-data':
                if (window.renderDiscoveredDataEntities) await window.renderDiscoveredDataEntities();
                break;
            case 'help':
                if (window.renderHelp) window.renderHelp(context !== 'modern' ? context : null);
                break;
            case 'home':
                if (window.renderHome) window.renderHome(context);
                break;
            case 'prepare-old':
                if (window.renderPrepareOld) await window.renderPrepareOld();
                break;
            case 'prepare':
                if (window.renderPrepare) await window.renderPrepare();
                break;
            case 'map':
                if (window.renderMap) await window.renderMap();
                break;
            case 'plan':
                if (window.renderPlan) await window.renderPlan();
                break;
            case 'move':
                if (window.renderMove) await window.renderMove();
                break;
            case 'evaluate':
                if (window.renderEvaluate) await window.renderEvaluate();
                break;
            case 'data-dictionary':
                if (window.renderDataDictionary) await window.renderDataDictionary();
                break;
            case 'environments':
                if (window.renderEnvironments) await window.renderEnvironments();
                break;
            case 'move-principles':
                if (window.renderMovePrinciples) await window.renderMovePrinciples();
                break;
            case 'data-entities':
                if (window.renderDataEntities) await window.renderDataEntities();
                break;
            case 'score-card':
                if (window.renderScoreCard) await window.renderScoreCard();
                break;
            case 'admin-project':
            case 'admin-users':
            case 'admin-failures':
                window.setHelpSection('help-' + module);
                contentArea.innerHTML = `
                    <div class="container-fluid py-5 text-center">
                        <i class="bi bi-tools display-1 text-muted mb-4"></i>
                        <h2>${module.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h2>
                        <p class="lead text-muted">This administrative module is currently under development.</p>
                        <hr class="my-5 w-25 mx-auto">
                        <p>Need help understanding what this module will do? <a href="#" onclick="document.getElementById('contextual-help-link').click(); return false;">View Help Center</a></p>
                    </div>
                `;
                break;
            default:
                contentArea.innerHTML = '<h2>Module not found</h2>';
        }
    }

    // Initial load
    if (window.renderHome) {
        window.currentModule = 'home';
        window.renderHome('modern');
    } else {
        // Fallback if home.js is not loaded yet
        setTimeout(() => {
            if (window.renderHome) {
                window.currentModule = 'home';
                window.renderHome('modern');
            }
        }, 100);
    }
});
