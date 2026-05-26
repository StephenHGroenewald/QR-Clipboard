document.addEventListener('DOMContentLoaded', async () => {
  // SEC-04 Compliance: All data is kept in-memory; no storage (LocalStorage/IndexDB) is used.
  const qrcodeElement = document.getElementById('qrcode');
  const statusElement = document.getElementById('status-message');
  const charCountElement = document.getElementById('char-count');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      statusElement.textContent = "No active tab found.";
      return;
    }

    // SEC-01 Compliance: Executed locally via Scripting API. No external network requests made.
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });

    const selectedText = results[0]?.result?.trim();

    if (!selectedText) {
      statusElement.textContent = "Please highlight text on the page first.";
      return;
    }

    // FR-05: Character limit validation to ensure scanability
    const charLimit = 2000;
    const textLength = selectedText.length;
    charCountElement.textContent = `Characters: ${textLength}`;

    if (textLength > charLimit) {
      statusElement.innerHTML = `<span class="warning">Warning: Selection exceeds 2,000 characters. QR code may be difficult to scan.</span>`;
    }

    // SEC-02 Compliance: Using locally bundled lib/qrcode.min.js
    new QRCode(qrcodeElement, {
      text: selectedText,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

  } catch (error) {
    console.error(error);
    statusElement.textContent = "Cannot access this page. Try a standard website.";
  }
});
