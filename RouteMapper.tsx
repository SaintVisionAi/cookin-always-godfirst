import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/ui/button';
import { 
  ExternalLink, 
  Home, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Brain,
  Zap,
  Calendar,
  FileText,
  Settings,
  CreditCard,
  Shield,
  Database,
  Cloud,
  Sparkles
} from 'lucide-react';

// ===== SUPERSAL ROUTE MAP - THE MASTER PLAN =====
export const ROUTE_MAP = {
  // Internal App Routes (React Router)
  internal: {
    home: { path: '/', icon: Home, label: 'Home' },
    dashboard: { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    chat: { path: '/chat', icon: MessageSquare, label: 'SuperSal Chat' },
    ai: { path: '/ai', icon: Brain, label: 'AI Assistant' },
    crm: { path: '/crm', icon: Users, label: 'CRM' },
    deals: { path: '/deals', icon: CreditCard, label: 'Deals' },
    contacts: { path: '/contacts', icon: Users, label: 'Contacts' },
    calendar: { path: '/calendar', icon: Calendar, label: 'Calendar' },
    files: { path: '/files', icon: FileText, label: 'Files' },
    settings: { path: '/settings', icon: Settings, label: 'Settings' },
    godmode: { path: '/godmode', icon: Zap, label: 'God Mode' },
    brain: { path: '/brain', icon: Brain, label: 'SuperSal Brain' },
    agents: { path: '/agents', icon: Sparkles, label: 'AI Agents' },
    azure: { path: '/azure', icon: Cloud, label: 'Azure Console' },
    auth: { path: '/auth', icon: Shield, label: 'Authentication' }
  },
  
  // External Links
  external: {
    saintvision: { 
      url: 'https://saintvisionai.com', 
      icon: ExternalLink, 
      label: 'SaintVision AI',
      description: 'Enterprise SAAS Platform'
    },
    cookin: { 
      url: 'https://cookinknowledge.com', 
      icon: ExternalLink, 
      label: 'Cookin Knowledge',
      description: 'Family Business Mastermind'
    },
    azure: { 
      url: 'https://ca-api-4ymud2fh2pbzi.blackbush-62b4ca44.eastus.azurecontainerapps.io', 
      icon: Cloud, 
      label: 'Live Azure API',
      description: 'SuperSal Backend'
    },
    github: { 
      url: 'https://github.com/your-username/cookin-always-godfirst', 
      icon: ExternalLink, 
      label: 'GitHub Repo',
      description: 'Source Code'
    }
  }
};

// ===== SMART ROUTE BUTTON COMPONENT =====
interface RouteButtonProps {
  routeKey: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  showExternal?: boolean;
}

export const RouteButton: React.FC<RouteButtonProps> = ({
  routeKey,
  variant = 'default',
  size = 'md',
  className = '',
  children,
  showIcon = true,
  showExternal = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Find route in internal or external maps
  const internalRoute = Object.entries(ROUTE_MAP.internal).find(([key]) => key === routeKey)?.[1];
  const externalRoute = Object.entries(ROUTE_MAP.external).find(([key]) => key === routeKey)?.[1];
  
  const route = internalRoute || externalRoute;
  const isExternal = !!externalRoute;
  const isActive = internalRoute && location.pathname === internalRoute.path;
  
  if (!route) {
    console.warn(`Route not found: ${routeKey}`);
    return (
      <Button variant="outline" disabled className={className}>
        Route Not Found: {routeKey}
      </Button>
    );
  }
  
  const handleClick = () => {
    if (isExternal && externalRoute) {
      window.open(externalRoute.url, '_blank', 'noopener,noreferrer');
    } else if (internalRoute) {
      navigate(internalRoute.path);
    }
  };
  
  const Icon = route.icon;
  const displayText = children || route.label;
  
  return (
    <Button
      variant={isActive ? 'default' : variant}
      size={size}
      onClick={handleClick}
      className={`${className} ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
    >
      {showIcon && Icon && <Icon className="w-4 h-4 mr-2" />}
      {displayText}
      {isExternal && showExternal && <ExternalLink className="w-3 h-3 ml-2" />}
    </Button>
  );
};

// ===== ROUTE STATUS CHECKER =====
export const checkRouteStatus = (routeKey: string) => {
  const internalRoute = Object.entries(ROUTE_MAP.internal).find(([key]) => key === routeKey)?.[1];
  const externalRoute = Object.entries(ROUTE_MAP.external).find(([key]) => key === routeKey)?.[1];
  
  return {
    exists: !!(internalRoute || externalRoute),
    isInternal: !!internalRoute,
    isExternal: !!externalRoute,
    route: internalRoute || externalRoute,
    path: internalRoute?.path,
    url: externalRoute?.url
  };
};

// ===== BULK ROUTE UPDATER =====
export const updateAllButtonsWithRoutes = () => {
  console.log('🔧 SUPERSAL ROUTE MAPPER: Updating all buttons...');
  
  // Find all buttons that need route connections
  const allButtons = document.querySelectorAll('button[data-route], a[data-route]');
  
  allButtons.forEach((button) => {
    const routeKey = button.getAttribute('data-route');
    if (!routeKey) return;
    
    const status = checkRouteStatus(routeKey);
    
    if (status.exists) {
      console.log(`✅ Connected: ${routeKey} -> ${status.path || status.url}`);
      
      // Update button with proper click handler
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (status.isExternal && status.url) {
          window.open(status.url, '_blank', 'noopener,noreferrer');
        } else if (status.isInternal && status.path) {
          // You'll need to pass navigate function here in a real implementation
          window.location.href = status.path;
        }
      });
      
      // Add visual indicators
      if (status.isExternal) {
        button.classList.add('external-link');
        const icon = button.querySelector('.external-icon');
        if (!icon) {
          const externalIcon = document.createElement('span');
          externalIcon.className = 'external-icon ml-2';
          externalIcon.innerHTML = '↗';
          button.appendChild(externalIcon);
        }
      }
    } else {
      console.warn(`❌ Route not found: ${routeKey}`);
      button.classList.add('route-error');
      button.title = `Route not found: ${routeKey}`;
    }
  });
  
  console.log(`🎯 ROUTE MAPPER: Updated ${allButtons.length} buttons`);
  return allButtons.length;
};

// ===== AUTO-INITIALIZE ON COMPONENT MOUNT =====
export const useRouteMapper = () => {
  React.useEffect(() => {
    // Auto-update all routes when component mounts
    const updateCount = updateAllButtonsWithRoutes();
    console.log(`🚀 SUPERSAL: Auto-mapped ${updateCount} routes`);
    
    // Also update when DOM changes
    const observer = new MutationObserver(() => {
      updateAllButtonsWithRoutes();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);
};

// ===== ROUTE NAVIGATION HELPERS =====
export const useSupersalNavigation = () => {
  const navigate = useNavigate();
  
  const goTo = (routeKey: string) => {
    const status = checkRouteStatus(routeKey);
    
    if (status.isInternal && status.path) {
      navigate(status.path);
    } else if (status.isExternal && status.url) {
      window.open(status.url, '_blank', 'noopener,noreferrer');
    } else {
      console.error(`Route not found: ${routeKey}`);
    }
  };
  
  const isActive = (routeKey: string) => {
    const status = checkRouteStatus(routeKey);
    return status.isInternal && window.location.pathname === status.path;
  };
  
  return { goTo, isActive, ROUTE_MAP };
};

export default RouteButton;
