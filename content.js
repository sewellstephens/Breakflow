(function () {
    console.log("🚀 Webflow Breakpoint Cleaner running...");

     // Show status in the page
     function showStatus(message, type = 'info') {
      // Remove existing status if any
      const existingStatus = document.getElementById('webflow-spacing-status');
      if (existingStatus) {
          existingStatus.remove();
      }
      
      // Create status element
      const status = document.createElement('div');
      status.id = 'webflow-spacing-status';
      status.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 300px;
          word-wrap: break-word;
      `;
      status.textContent = message;
      
      document.body.appendChild(status);
      
      // Auto-remove after 3 seconds
      setTimeout(() => {
          if (status.parentNode) {
              status.remove();
          }
      }, 3000);
  }
  
    // Find all style overrides (blue background highlight)
    const blueProps = document.querySelectorAll("[style*='--colors-blue-background']");
  
    if (blueProps.length === 0) {
      console.warn("⚠️ No overrides found on this breakpoint.");
      return;
    }
  
    blueProps.forEach((label, i) => {

      // Try multiple selectors to find the edit button
      const editBtn = document.querySelectorAll("button[aria-label='Edit']")[i + 1];

      if (!editBtn) {
        console.warn("⚠️ No Edit button found for", label);
        console.log("🔍 Debug - Label element:", label);
        console.log("🔍 Debug - Label parent:", label.parentElement);
        console.log("🔍 Debug - Label closest div:", label.closest("button"));
        showStatus("⚠️ No Edit button found for override #" + (i + 1));
        return;
      }
      else {}
  
      // Stagger actions so menus don't overlap
      setTimeout(() => {
        // Step 1: click the Edit button
        editBtn.click();
        console.log(`✏️ Opened Edit menu for override #${i + 1}`);
  
        // Step 2: wait a moment, then click the Delete button
        setTimeout(() => {
          const deleteBtn = document.querySelectorAll("[aria-label='Delete']")[0];
          
          if (deleteBtn) {
            deleteBtn.click();
            console.log(`🗑️ Deleted override #${i + 1}`);
            showStatus(`✅ Deleted override #${i + 1}`);
          } else {
            console.warn("⚠️ Delete button not found after Edit click.");
            console.log("🔍 Debug - Available buttons:", document.querySelectorAll("button"));
            showStatus("⚠️ Delete button not found after Edit click.");
          }
        }, 250);
      }, i * 2000); // stagger each override by ~600ms
    });
  
    console.log("✅ Cleanup sequence queued.");
  })();
  