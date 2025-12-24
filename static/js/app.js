document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#sidebar a[data-module]');
    const contentArea = document.getElementById('main-area');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const module = link.getAttribute('data-module');
            
            // Update active link
            document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            loadModule(module);
        });
    });

    async function loadModule(module) {
        contentArea.innerHTML = '<div class="text-center mt-5"><div class="spinner-border" role="status"></div><p>Loading...</p></div>';
        
        switch(module) {
            case 'home':
                if (window.renderHome) window.renderHome();
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
            case 'data-entities':
                if (window.renderDataEntities) await window.renderDataEntities();
                break;
            case 'raw-data':
                if (window.renderRawDataEntities) await window.renderRawDataEntities();
                break;
            default:
                contentArea.innerHTML = '<h2>Module not found</h2>';
        }
    }

    // Initial load
    if (window.renderHome) {
        window.renderHome();
    } else {
        // Fallback if home.js is not loaded yet
        setTimeout(() => {
            if (window.renderHome) window.renderHome();
        }, 100);
    }
});
