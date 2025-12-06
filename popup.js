document.addEventListener('DOMContentLoaded', function() {
    const removeBtn = document.getElementById('removeBreakpoints');
    const checkBtn = document.getElementById('checkStatus');
    const copyFontBtn = document.getElementById('copyFontCSS');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const spacingEnabledCheckbox = document.getElementById('spacingEnabled');
    const breakpointsHiddenCheckbox = document.getElementById('breakpointsHidden');
    const statusDiv = document.getElementById('status');
    const confirmDiv = document.getElementById('confirmDialog');
    const confirmMessageDiv = document.getElementById('confirmMessage');
    const btnConfirmDiv = document.getElementById('btnConfirm');

    
    // Show status message
    function showStatus(message, type = 'info') {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        
        // Auto-hide after 3 seconds for success/info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }

    function showConfirm(message) {
        confirmMessageDiv.textContent = message;
        confirmDiv.style.display = 'block';
        
        return new Promise((resolve) => {
            // Create Yes and No buttons
            const yesBtn = document.createElement('button');
            yesBtn.textContent = 'Yes';
            yesBtn.className = 'btn-linker';
            const noBtn = document.createElement('button');
            noBtn.textContent = 'No';
            noBtn.className = 'btn-linker';
            
            btnConfirmDiv.appendChild(yesBtn);
            btnConfirmDiv.appendChild(noBtn);
            
            yesBtn.addEventListener('click', () => {
                confirmDiv.style.display = 'none';
                confirmDiv.innerHTML = '';
                resolve(true);
            });
            
            noBtn.addEventListener('click', () => {
                confirmDiv.style.display = 'none';
                confirmDiv.innerHTML = '';
                resolve(false);
            });
        });
    }
    
    // Remove breakpoint overrides
    removeBtn.addEventListener('click', async function() {
        const promptRemoval = showConfirm('Are you sure you want to remove all breakpoint overrides? This is a destructive action.');
        const userConfirmed = await promptRemoval;
        
        if (!userConfirmed) {
            showStatus('❌ Breakpoint removal cancelled', 'info');
            return;
        }
        try {
            showStatus('Removing breakpoint overrides...', 'info');
            
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.id) {
                showStatus('Error: No active tab found', 'error');
                return;
            }
            
            // Check if we're on a Webflow page
            if (!tab.url.includes('webflow.com')) {
                showStatus('Please navigate to a Webflow Designer page first', 'error');
                return;
            }
            
            // Execute the content script for breakpoint override removal
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            });
            
            showStatus('✅ Breakpoint overrides removal initiated!', 'success');
            
        } catch (error) {
            console.error('Error removing breakpoints:', error);
            showStatus('Error: Failed to remove breakpoints', 'error');
        }
    });
    
    // Check for overrides
    checkBtn.addEventListener('click', async function() {
        try {
            showStatus('Checking for overrides...', 'info');
            
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.id) {
                showStatus('Error: No active tab found', 'error');
                return;
            }
            
            // Check if we're on a Webflow page
            if (!tab.url.includes('webflow.com')) {
                showStatus('Please navigate to a Webflow Designer page first', 'error');
                return;
            }
            
            // Execute a script to count overrides
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const blueProps = document.querySelectorAll("[style*='--colors-blue-background']");
                    return blueProps.length;
                }
            });
            
            const overrideCount = results[0].result;
            
            if (overrideCount === 0) {
                showStatus('✅ No breakpoint overrides found', 'success');
            } else {
                showStatus(`Found ${overrideCount} breakpoint override${overrideCount === 1 ? '' : 's'}`, 'info');
            }
            
        } catch (error) {
            console.error('Error checking overrides:', error);
            showStatus('Error: Failed to check for overrides', 'error');
        }
    });
    
    // Copy Font Scaling CSS
    copyFontBtn.addEventListener('click', async function() {
        const fontCSS = `<style>
/* Crisper fonts */
 	body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
	}
/* Fixes horizontal scrolling issues */
	body {
    overflow-x: hidden;
    overflow-y: auto;
  }
/* Fixes font scaling issues between breakpoints */
  :root {
    --font-from-0: 12;
    --font-to-0: 16;
    --vw-from-0: calc(1 / 100);
    --vw-to-0: calc(479 / 100);
    --coefficient-0: calc((var(--font-to-0) - var(--font-from-0)) / (var(--vw-to-0) - var(--vw-from-0)));
    --base-0: calc((var(--font-from-0) - var(--vw-from-0) * var(--coefficient-0)) / 16);

    --font-from-1: 14;
    --font-to-1: 16;
    --vw-from-1: calc(479 / 100);
    --vw-to-1: calc(1440 / 100);
    --coefficient-1: calc((var(--font-to-1) - var(--font-from-1)) / (var(--vw-to-1) - var(--vw-from-1)));
    --base-1: calc((var(--font-from-1) - var(--vw-from-1) * var(--coefficient-1)) / 16);

    --font-from-2: 16;
    --font-to-2: 18;
    --vw-from-2: calc(1440 / 100);
    --vw-to-2: calc(1920 / 100);
    --coefficient-2: calc((var(--font-to-2) - var(--font-from-2)) / (var(--vw-to-2) - var(--vw-from-2)));
    --base-2: calc((var(--font-from-2) - var(--vw-from-2) * var(--coefficient-2)) / 16);

    --font-from-3: 18;
    --font-to-3: 20;
    --vw-from-3: calc(1920 / 100);
    --vw-to-3: calc(2400 / 100);
    --coefficient-3: calc((var(--font-to-3) - var(--font-from-3)) / (var(--vw-to-3) - var(--vw-from-3)));
    --base-3: calc((var(--font-from-3) - var(--vw-from-3) * var(--coefficient-3)) / 16);
  }

  html { font-size: calc(var(--base-3) * 1rem + var(--coefficient-3) * 1vw); }
  @media screen and (max-width:1920px) { html { font-size: calc(var(--base-2) * 1rem + var(--coefficient-2) * 1vw); } }
  @media screen and (max-width:1440px) { html { font-size: calc(var(--base-1) * 1rem + var(--coefficient-1) * 1vw); } }
  @media screen and (max-width:479px) { html { font-size: calc(var(--base-0) * 1rem + var(--coefficient-0) * 1vw); } }
</style>`;

        try {

            await navigator.clipboard.writeText(fontCSS);
            showStatus('✅ Font scaling CSS copied to clipboard!', 'success');
        } catch (error) {
            console.error('Error copying CSS:', error);
            showStatus('Error: Failed to copy CSS', 'error');
        }
    });
    
    
    
    // Load settings from Chrome storage
    async function loadSettings() {
        try {
            // Load spacing setting from Chrome storage
            const spacingResult = await chrome.storage.local.get('spacingEnabled');
            spacingEnabledCheckbox.checked = spacingResult.spacingEnabled || false;
            
            // Load breakpoint setting from Chrome storage
            const result = await chrome.storage.local.get('hideBreakpoints');
            breakpointsHiddenCheckbox.checked = result.hideBreakpoints || false;
            
            
            console.log('📂 Loaded settings from Chrome storage');
            console.log('📂 Spacing enabled:', spacingEnabledCheckbox.checked);
            console.log('📂 Hide breakpoints:', result.hideBreakpoints);
        } catch (error) {
            console.warn('⚠️ Error loading settings from Chrome storage:', error);
        }
    }
    
    // Save settings to localStorage and apply them
    async function saveSettings() {
        try {
            // Save spacing setting using Chrome storage
            await chrome.storage.local.set({ spacingEnabled: spacingEnabledCheckbox.checked });
            
            // Save breakpoint setting using Chrome storage
            await chrome.storage.local.set({ hideBreakpoints: breakpointsHiddenCheckbox.checked });
            
            
            console.log('💾 Settings saved to Chrome storage');
            console.log('💾 Spacing enabled:', spacingEnabledCheckbox.checked);
            console.log('💾 Breakpoints hidden:', breakpointsHiddenCheckbox.checked);
            
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.id) {
                showStatus('Error: No active tab found', 'error');
                return;
            }
            
            // Check if we're on a Webflow page
            if (!tab.url.includes('webflow.com')) {
                return;
            }
            
            // Send message to content scripts to reload settings
            try {
                await chrome.tabs.sendMessage(tab.id, { action: 'reloadSettings' });
            } catch (error) {
                console.log('Content script not ready, settings will be applied on next page load');
            }
            
            showStatus('✅ Settings saved and applied successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving/applying settings:', error);
            showStatus('Error: Failed to save or apply settings', 'error');
        }
    }

    
    
            // Save settings button
            saveSettingsBtn.addEventListener('click', saveSettings);
            
    
    
    
    // Load settings on popup open
    loadSettings();
    
            // Check if we're on a Webflow page on popup open
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs[0] && !tabs[0].url.includes('webflow.com')) {
                    showStatus('⚠️ Please navigate to a Webflow Designer page to use this extension', 'error');
                } else {
                    // Test if content scripts are working
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'test' }, function(response) {
                        if (chrome.runtime.lastError) {
                            console.log('Content scripts not ready yet');
                        } else {
                            console.log('Content scripts are working:', response);
                        }
                    });
                }
            });
});
