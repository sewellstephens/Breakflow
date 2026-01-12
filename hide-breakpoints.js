(function () {
    console.log("🚀 Webflow Breakpoint Hider activated...");
    console.log("🔍 Current URL:", window.location.href);
    console.log("🔍 Document ready state:", document.readyState);
    
    // Script loaded - no visual indicator needed
    
    // Remove on-page status function - only use console logging
    
    // Breakpoint selectors to hide
    const breakpointSelectors = [
        '[aria-label*="1920"]',
        '[aria-label*="1440"]',
        '[aria-label*="1280"]'
    ];

    

    function showBreakpoints() {
        console.log('🔍 Showing breakpoint buttons...');
        let totalShown = 0;
        
        breakpointSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);
    
            elements.forEach(element => {
                if (element.style.display === 'none') {
                    element.style.display = 'block';
                    totalShown++;
                    console.log(`🙉 Shown: ${element.getAttribute('aria-label')}`);
                }
            });
        });
    
        if (totalShown > 0) {
            console.log(`✅ Shown ${totalShown} breakpoint buttons`);
        } else {
            console.log("⚠️ No breakpoint buttons found to show");
        }
    }

    function hideBreakpoints() {
        console.log('🔍 Searching for breakpoint buttons...');
        let totalHidden = 0;
        
        // First, let's see what elements with aria-label exist
        const allAriaElements = document.querySelectorAll('[aria-label]');
        console.log(`🔍 Total elements with aria-label: ${allAriaElements.length}`);
        
        // Log first 10 elements for debugging
        allAriaElements.forEach((el, i) => {
            if (i < 10) {
                console.log(`  ${i}: "${el.getAttribute('aria-label')}"`);
            }
        });
        
        breakpointSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);
            
            elements.forEach(element => {
                // Only hide if not already hidden
                if (element.style.display !== 'none') {
                    element.style.display = 'none';
                    totalHidden++;
                    console.log(`🙈 Hidden: ${element.getAttribute('aria-label')}`);
                }
            });
        });
        
        // Also try a broader search for any elements containing "px"
        const pxElements = document.querySelectorAll('[aria-label*="px"]');
        console.log(`🔍 Elements with "px" in aria-label: ${pxElements.length}`);
        
        pxElements.forEach(element => {
            const ariaLabel = element.getAttribute('aria-label');
            console.log(`🔍 Found px element: "${ariaLabel}"`);
            if (ariaLabel && (ariaLabel.includes('1920') || ariaLabel.includes('1440') || ariaLabel.includes('1280'))) {
                if (element.style.display !== 'none') {
                    element.style.display = 'none';
                    totalHidden++;
                    console.log(`🙈 Hidden by px search: ${ariaLabel}`);
                }
            }
        });
        
        if (totalHidden > 0) {
            console.log(`✅ Hidden ${totalHidden} breakpoint buttons`);
        } else {
            console.log("⚠️ No breakpoint buttons found to hide");
        }
    }

    function waitForBreakpoints() {
        const checkInterval = setInterval(() => {
            const hasBreakpoints = breakpointSelectors.some(selector => 
                document.querySelectorAll(selector).length > 0
            );
            
            if (hasBreakpoints) {
                clearInterval(checkInterval);
                console.log('✅ Breakpoint buttons found! Initializing...');
                initialize();
            }
        }, 1000); // Check every 1000ms
        
        // Safety timeout after 30 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            console.log('⚠️ Timeout waiting for breakpoints, initializing anyway...');
            initialize();
        }, 30000);
    }

    waitForBreakpoints();

    function initialize() {
        console.log('🔍 Initializing breakpoint hider...');
        console.log('🔍 Page URL:', window.location.href);
        console.log('🔍 Is Webflow page:', window.location.href.includes('webflow.com'));
        
        // Check Chrome storage
        chrome.storage.local.get('hideBreakpoints', (result) => {
            console.log('🔍 Hide breakpoints from Chrome storage:', result.hideBreakpoints);
            
            if (result.hideBreakpoints === true) {
                console.log('🔍 Setting is ON - hiding breakpoints');
                hideBreakpoints();
            } else {
                console.log('🔍 Setting is OFF or not set - showing breakpoints (default behavior)');
                showBreakpoints();
            }
        });
    }
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'reloadSettings') {
            console.log('🔍 Reloading settings from popup...');
            chrome.storage.local.get('hideBreakpoints', (result) => {
                console.log('🔍 Current hide breakpoints setting:', result.hideBreakpoints);
                
                if (result.hideBreakpoints === true) {
                    console.log('🔍 Setting enabled - hiding breakpoints');
                    hideBreakpoints();
                } else {
                    console.log('🔍 Setting disabled - showing breakpoints');
                    showBreakpoints();
                }
            });
            sendResponse({ success: true });
        } else if (request.action === 'forceHideBreakpoints') {
            hideBreakpoints();
            sendResponse({ success: true });
        }
    });
    
    // Make functions available globally for testing
    window.webflowBreakpointHider = {
        hide: hideBreakpoints,
        show: showBreakpoints,
        init: initialize
    };
    
    console.log("✅ Webflow Breakpoint Hider ready!");
    console.log("🧪 Test functions available: window.webflowBreakpointHider.hide() / show() / init()");
})();