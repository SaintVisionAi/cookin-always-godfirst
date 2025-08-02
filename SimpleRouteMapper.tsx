// 🚀 SUPERSAL SIMPLE ROUTE MAPPER - NO DEPENDENCIES!
// This fixes ALL your button wiring issues INSTANTLY

interface Route {
  path?: string;
  url?: string;
  label: string;
  icon?: string;
}

export const SUPERSAL_ROUTES: Record<string, Route> = {
  // Internal Routes
  home: { path: '/', label: 'Home', icon: '🏠' },
  dashboard: { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  chat: { path: '/chat', label: 'SuperSal Chat', icon: '💬' },
  ai: { path: '/ai', label: 'AI Assistant', icon: '🧠' },
  crm: { path: '/crm', label: 'CRM', icon: '👥' },
  deals: { path: '/deals', label: 'Deals', icon: '💳' },
  contacts: { path: '/contacts', label: 'Contacts', icon: '📇' },
  calendar: { path: '/calendar', label: 'Calendar', icon: '📅' },
  files: { path: '/files', label: 'Files', icon: '📁' },
  settings: { path: '/settings', label: 'Settings', icon: '⚙️' },
  godmode: { path: '/godmode', label: 'God Mode', icon: '⚡' },
  brain: { path: '/brain', label: 'SuperSal Brain', icon: '🧠' },
  
  // External Links
  saintvision: { 
    url: 'https://saintvisionai.com', 
    label: 'SaintVision AI', 
    icon: '🚀' 
  },
  cookin: { 
    url: 'https://cookinknowledge.com', 
    label: 'Cookin Knowledge', 
    icon: '👨‍🍳' 
  },
  azure: { 
    url: 'https://ca-api-4ymud2fh2pbzi.blackbush-62b4ca44.eastus.azurecontainerapps.io', 
    label: 'Azure API', 
    icon: '☁️' 
  }
};

// Simple button creator that WORKS
export function createRouteButton(routeKey: string, text?: string): string {
  const route = SUPERSAL_ROUTES[routeKey];
  if (!route) return `<button disabled>Route ${routeKey} not found</button>`;
  
  const displayText = text || route.label;
  const icon = route.icon || '🔗';
  
  if (route.url) {
    return `<button onclick="window.open('${route.url}', '_blank')" class="supersal-btn external">
      ${icon} ${displayText} ↗
    </button>`;
  } else if (route.path) {
    return `<button onclick="window.location.href='${route.path}'" class="supersal-btn internal">
      ${icon} ${displayText}
    </button>`;
  }
  
  return `<button disabled>Invalid route: ${routeKey}</button>`;
}

// Auto-fix ALL buttons on page
export function fixAllButtons() {
  console.log('🔧 SUPERSAL: Fixing all buttons...');
  
  // Find all buttons with data-route attribute
  const buttons = document.querySelectorAll('[data-route]');
  let fixedCount = 0;
  
  buttons.forEach((button) => {
    const routeKey = button.getAttribute('data-route');
    if (!routeKey) return;
    
    const route = SUPERSAL_ROUTES[routeKey];
    if (!route) {
      console.warn(`Route not found: ${routeKey}`);
      return;
    }
    
    // Add click handler
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (route.url) {
        window.open(route.url, '_blank');
      } else if (route.path) {
        window.location.href = route.path;
      }
    });
    
    // Add styling
    button.classList.add('supersal-btn');
    if (route.url) button.classList.add('external');
    if (route.path) button.classList.add('internal');
    
    fixedCount++;
  });
  
  console.log(`✅ Fixed ${fixedCount} buttons!`);
  return fixedCount;
}

// CSS for buttons
export const SUPERSAL_BUTTON_CSS = `
.supersal-btn {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-family: system-ui, -apple-system, sans-serif;
}

.supersal-btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

.supersal-btn.external {
  border-color: #0066cc;
  color: #0066cc;
}

.supersal-btn.internal {
  border-color: #22c55e;
  color: #22c55e;
}

.supersal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  // Add CSS
  const style = document.createElement('style');
  style.textContent = SUPERSAL_BUTTON_CSS;
  document.head.appendChild(style);
  
  // Fix buttons when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllButtons);
  } else {
    fixAllButtons();
  }
  
  // Also fix when new content is added
  const observer = new MutationObserver(fixAllButtons);
  observer.observe(document.body, { childList: true, subtree: true });
}

export default { SUPERSAL_ROUTES, createRouteButton, fixAllButtons };
