chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generate-qr",
    title: "Generate QR Code for selection",
    contexts: ["selection"],
    // Only show the menu on valid web/local pages to avoid chrome:// errors
    documentUrlPatterns: ["http://*/*", "https://*/*", "file://*/*"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generate-qr" && info.selectionText) {
    // SEC-01: Scripting is restricted on chrome:// and other sensitive URLs
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["lib/qrcode.min.js", "content-script.js"]
    }).then(() => {
      chrome.tabs.sendMessage(tab.id, {
        action: "show-qr",
        text: info.selectionText
      });
    }).catch(err => {
      console.error("QR Code Extension: Cannot execute on this page.", err.message);
    });
  }
});
