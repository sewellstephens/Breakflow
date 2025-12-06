(function () {
    console.log("🚀 Webflow Px to Rem Converter activated...");
    
    let isActive = false;
    
    // Function to convert existing pixel value to rem
    function convertPxToRem() {
        const activeElement = document.activeElement;
        if (!activeElement || (activeElement.tagName !== 'INPUT')) {
            console.log('⚠️ No active input field found');
            return;
        }
        
        const currentValue = activeElement.value;
        console.log('🔍 Current input value:', currentValue);
        
        // Extract numeric value (more flexible regex)
        const match = currentValue.match(/(\d+(?:\.\d+)?)/);
        if (!match) {
            console.log('⚠️ No numeric value found in input');
            return;
        }
        
        const pxValue = parseFloat(match[1]);
        console.log('🔍 Extracted px value:', pxValue);
        
        // Get current root font size
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        console.log('🔍 Root font size:', rootFontSize);
        
        // Calculate rem value
        const remValue = pxValue / rootFontSize;
        console.log('🔍 Calculated rem value:', remValue);
        
        // Update input with rem value and trigger change event
        activeElement.value = remValue.toFixed(3) + 'rem';
        
        // Trigger input and change events to ensure Webflow recognizes the change
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('✅ Updated input with rem value:', activeElement.value);
    }
    
    // Enhanced keydown handler for Ctrl+Space
    function handleKeydown(event) {
        if (event.code === 'Space' && event.ctrlKey) {
            const target = event.target;
            if (target && target.tagName === 'INPUT' && (target.type === 'text' || target.type === 'number' || !target.type)) {
                event.preventDefault();
                event.stopPropagation();
                convertPxToRem();
            }
        }
    }
    
    // Toggle the spacing feature
    function toggleSpacingFeature() {
        if (isActive) {
            document.removeEventListener('keydown', handleKeydown, true);
            isActive = false;
            console.log("🔴 Px to Rem converter deactivated");
        } else {
            document.addEventListener('keydown', handleKeydown, true);
            isActive = true;
            console.log("🟢 Px to Rem converter activated - Press Ctrl+Space to convert px to rem");
        }
        saveOptions();
    }
    
    // Save options to Chrome storage
    function saveOptions() {
        chrome.storage.local.set({ spacingEnabled: isActive }, () => {
            console.log('💾 Spacing enabled saved to Chrome storage:', isActive);
        });
    }
    
    // Load options from Chrome storage
    function loadOptions() {
        chrome.storage.local.get('spacingEnabled', (result) => {
            console.log('🔍 Spacing enabled from Chrome storage:', result.spacingEnabled);
            if (result.spacingEnabled === true) {
                isActive = true;
                document.addEventListener('keydown', handleKeydown, true);
                console.log("📂 Spacing tool activated from Chrome storage");
            } else {
                console.log("📂 Spacing tool disabled from Chrome storage");
            }
        });
    }
    
    // Initialize
    loadOptions();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'reloadSettings') {
            loadOptions();
            sendResponse({ success: true });
        }
    });
    
    // Expose functions globally
    window.webflowSpacingTool = {
        toggle: toggleSpacingFeature,
        isActive: () => isActive,
        convert: convertPxToRem
    };

    console.log("✅ Webflow Px to Rem Converter ready!");
})();
