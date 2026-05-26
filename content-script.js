(function() {
  if (window.qrCodeModalInitialized) return;
  window.qrCodeModalInitialized = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "show-qr") {
      showModal(request.text);
    }
  });

  function showModal(text) {
    let container = document.getElementById('qr-code-extension-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'qr-code-extension-container';
      document.body.appendChild(container);
    }

    const shadow = container.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2147483647;
          font-family: sans-serif;
        }
        .modal {
          background: #001122;
          color: #ffffff;
          padding: 32px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          max-width: 90%;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          position: relative;
          border: 2px solid #0ABF53;
        }
        .close-btn {
          position: absolute;
          top: 8px;
          right: 12px;
          border: none;
          background: none;
          font-size: 32px;
          cursor: pointer;
          color: #0ABF53;
          line-height: 1;
          opacity: 0.8;
        }
        .close-btn:hover {
          opacity: 1;
          transform: scale(1.1);
        }
        #qrcode-content {
          padding: 12px;
          background: white;
          border: 4px solid #0ABF53;
          border-radius: 4px;
          margin-top: 10px;
        }
        .policy-text {
          font-size: 14px;
          color: #ffffff;
          font-weight: 500;
        }
        .char-count {
          font-size: 12px;
          color: #99aabb;
        }
      </style>
      <div class="overlay">
        <div class="modal">
          <button class="close-btn" title="Close">&times;</button>
          <div id="qrcode-content"></div>
          <div class="char-count">Characters: ${text.length}</div>
          <div class="policy-text">Scan this with your device</div>
        </div>
      </div>
    `;

    const qrcodeContent = shadow.getElementById('qrcode-content');
    const closeBtn = shadow.querySelector('.close-btn');
    const overlay = shadow.querySelector('.overlay');

    new QRCode(qrcodeContent, {
      text: text,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    const close = () => {
      container.remove();
    };

    closeBtn.onclick = close;
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };
  }
})();
