// 🚀 SUPERSAL BUTTON WIRING - PURE JAVASCRIPT
// This script fixes ALL button routing issues INSTANTLY!

(function() {
  'use strict';
  
  // Route definitions
  const SUPERSAL_ROUTES = {
    // Internal Routes
    home: { path: '/', label: 'Home' },
    dashboard: { path: '/dashboard', label: 'Dashboard' },
    chat: { path: '/chat', label: 'SuperSal Chat' },
    ai: { path: '/ai', label: 'AI Assistant' },
    crm: { path: '/crm', label: 'CRM' },
    deals: { path: '/deals', label: 'Deals' },
    contacts: { path: '/contacts', label: 'Contacts' },
    calendar: { path: '/calendar', label: 'Calendar' },
    files: { path: '/files', label: 'Files' },
    settings: { path: '/settings', label: 'Settings' },
    godmode: { path: '/godmode', label: 'God Mode' },
    brain: { path: '/brain', label: 'SuperSal Brain' },
    
    // External Links
    saintvision: { 
      url: 'https://saintvisionai.com', 
      label: 'SaintVision AI' 
    },
    cookin: { 
      url: 'https://cookinknowledge.com', 
      label: 'Cookin Knowledge' 
    },
    azure: { 
      url: 'https://ca-api-4ymud2fh2pbzi.blackbush-62b4ca44.eastus.azurecontainerapps.io', 
      label: 'Azure API' 
    }
  };
  
  // Fix all buttons function
  function fixAllButtons() {
    console.log('🔧 SUPERSAL: Fixing all buttons...');
    
    const buttons = document.querySelectorAll('[data-route]');
    let fixedCount = 0;
    
    buttons.forEach(function(button) {
      const routeKey = button.getAttribute('data-route');
      if (!routeKey) return;
      
      const route = SUPERSAL_ROUTES[routeKey];
      if (!route) {
        console.warn('Route not found: ' + routeKey);
        return;
      }
      
      // Remove existing click handlers
      button.onclick = null;
      
      // Add new click handler
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🎯 Routing to: ' + routeKey);
        
        if (route.url) {
          window.open(route.url, '_blank', 'noopener,noreferrer');
        } else if (route.path) {
          window.location.href = route.path;
        }
      });
      
      // Add visual styling
      button.style.cursor = 'pointer';
      if (route.url) {
        button.classList.add('external-link');
      }
      
      fixedCount++;
    });
    
    console.log('✅ Fixed ' + fixedCount + ' buttons!');
    return fixedCount;
  }
  
  // Auto-initialize
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixAllButtons);
    } else {
      fixAllButtons();
    }
    
    // Also fix when new content is added
    if (window.MutationObserver) {
      const observer = new MutationObserver(fixAllButtons);
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }
  }
  
  // Start the magic!
  initialize();
  
  // Make functions globally available
  window.SuperSalRoutes = {
    fixAllButtons: fixAllButtons,
    routes: SUPERSAL_ROUTES
  };
  
  console.log('🚀 SUPERSAL BUTTON WIRING LOADED!');
})();
