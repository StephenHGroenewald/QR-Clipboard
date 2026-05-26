# Secure Local QR Code Generator

A secure, lightweight, and completely air-gapped Google Chrome extension designed for enterprise environments. This tool allows users to instantly transform highlighted text into scannable QR codes for easy transfer to mobile devices without any data leaving the local machine.

## Features
- **100% Local Execution:** No network requests, no data egress, and no third-party CDNs.
- **Multiple Workflows:**
  - **Popup:** Click the extension icon to generate a QR code for the current selection.
  - **Context Menu:** Right-click highlighted text to show a QR code overlay directly on the page.
- **Security Compliant:** Built using Manifest V3 and Shadow DOM for isolation.

## Installation Instructions (Developer Mode)

To install this extension in Google Chrome:

1. **Download/Clone** this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. In the top right corner, toggle **Developer mode** to **ON**.
4. Click the **Load unpacked** button that appears in the top left.
5. Select the root folder of this project (the one containing `manifest.json`).
6. The extension should now appear in your list and be ready for use!

## How to Use

1. **Highlight** any text on a webpage (e.g., a URL, transaction ID, or account number).
2. **Right-click** the highlighted text and select **"Generate QR Code for selection"**.
3. Alternatively, click the **Extension Icon** in your browser toolbar to view the QR code in the popup.
4. Scan the generated code with your authorized mobile device.

## Author

Made by **Stephen Groenewald**
- **LinkedIn:** [stephengroenewald](https://www.linkedin.com/in/stephengroenewald/)
- **GitHub:** [StephenHGroenewald](https://github.com/StephenHGroenewald/)
