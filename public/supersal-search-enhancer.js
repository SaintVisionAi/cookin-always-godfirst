// 🔥 SUPERSAL SEARCH BAR INTEGRATION SCRIPT
// Drop this anywhere to add SuperSal AI to existing search bars!

(function() {
  'use strict';
  
  // Configuration
  const SUPERSAL_API = 'https://ca-api-4ymud2fh2pbzi.blackbush-62b4ca44.eastus.azurecontainerapps.io/api/chat';
  const FALLBACK_API = 'https://cookin-knowledge-saintsal.vercel.app/api/chat';
  
  console.log('🔥 SUPERSAL: Enhancing search bars with AI...');
  
  // Find and enhance existing search inputs
  function enhanceSearchBars() {
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="search" i]',
      'input[placeholder*="find" i]',
      '.search-input',
      '#search',
      '.search-box input',
      '[role="searchbox"]'
    ];
    
    searchSelectors.forEach(selector => {
      const searchInputs = document.querySelectorAll(selector);
      searchInputs.forEach(input => enhanceSearchInput(input));
    });
  }
  
  // Enhance individual search input
  function enhanceSearchInput(input) {
    if (input.supersalEnhanced) return; // Don't enhance twice
    input.supersalEnhanced = true;
    
    console.log('🎯 SUPERSAL: Enhancing search input:', input);
    
    // Add SuperSal indicator
    const indicator = document.createElement('div');
    indicator.innerHTML = '🧠 AI';
    indicator.style.cssText = `
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(45deg, #ea580c, #f97316);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      z-index: 1000;
      cursor: pointer;
    `;
    
    // Position the input container
    const container = input.parentElement;
    if (container && getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    container.appendChild(indicator);
    
    // Add SuperSal functionality
    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        await handleSuperSalSearch(input.value, input);
      }
    });
    
    indicator.addEventListener('click', () => {
      if (input.value.trim()) {
        handleSuperSalSearch(input.value, input);
      }
    });
    
    // Add tooltip
    indicator.title = 'Ctrl+Enter for SuperSal AI search';
  }
  
  // Handle SuperSal AI search
  async function handleSuperSalSearch(query, input) {
    if (!query.trim()) return;
    
    console.log('🔥 SUPERSAL: Processing AI search:', query);
    
    // Show loading
    showSearchResult(input, '🧠 SuperSal is thinking...', true);
    
    try {
      // Try main API first
      let response = await fetch(SUPERSAL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: query,
          userId: 'WebsiteUser',
          searchMode: true
        })
      });
      
      if (!response.ok) {
        // Fallback to Vercel API
        response = await fetch(FALLBACK_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, userId: 'WebsiteUser' })
        });
      }
      
      if (response.ok) {
        const data = await response.json();
        showSearchResult(input, data.response || data.message, false);
      } else {
        throw new Error('API failed');
      }
      
    } catch (error) {
      console.error('SuperSal search error:', error);
      showSearchResult(input, `🎯 SuperSal found: "${query}" - Try our business services for more info!`, false);
    }
  }
  
  // Show search result
  function showSearchResult(input, result, isLoading) {
    let resultBox = document.getElementById('supersal-result-' + Date.now());
    if (!resultBox) {
      resultBox = document.createElement('div');
      resultBox.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(17, 24, 39, 0.98);
        border: 1px solid rgba(234, 88, 12, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-top: 5px;
        color: white;
        font-size: 14px;
        line-height: 1.5;
        z-index: 1001;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      `;
      
      const container = input.parentElement;
      container.appendChild(resultBox);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (resultBox.parentElement) {
          resultBox.remove();
        }
      }, 10000);
    }
    
    resultBox.innerHTML = isLoading 
      ? '<div style="text-align: center;">🧠 SuperSal AI is searching...</div>'
      : `<div><strong>🔥 SuperSal AI:</strong><br>${result}</div>`;
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceSearchBars);
  } else {
    enhanceSearchBars();
  }
  
  // Also run after a delay to catch dynamically added search bars
  setTimeout(enhanceSearchBars, 2000);
  
  console.log('🚀 SUPERSAL: Search bar enhancement loaded! Use Ctrl+Enter or click 🧠 AI for SuperSal search');
  
})();
