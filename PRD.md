# Product Requirement Document (PRD)

## Document Control
* **Product Name:** Secure Local QR Code Generator Extension
* **Target Release:** Q3 2026
* **Document Version:** 1.1 (Amended: Chrome Only)
* **Author:** [Your Name/Title]
* **Status:** Draft
* **Security Classification:** Restricted - Internal Bank Use Only

---

## 1. Executive Summary & Objective

### 1.1 Objective
The objective is to build a secure, lightweight, and completely air-gapped web browser extension exclusively for Google Chrome on enterprise bank workstations. The extension will allow users to highlight any text on a webpage (such as transaction IDs, account numbers, URLs, or routing strings) and instantly transform it into a scannable QR code. 

### 1.2 The Problem
Bank employees frequently need to transfer text strings, testing URLs, or reference numbers from their secure desktop workstations to corporate-managed mobile devices for testing, validation, or mobile workflows. Manually typing long alpha-numeric strings is slow and error-prone. Standard web-based QR generators send data to third-party servers, presenting an unacceptable data exfiltration and compliance risk within a banking environment.

### 1.3 The Solution
A Manifest V3 browser extension built specifically for Google Chrome that executes 100% locally on the user's machine. It will capture selected text directly from the active tab and render a QR code using a bundled JavaScript library. It will request zero network permissions, ensuring zero data egress.

---

## 2. Security & Compliance Requirements (Critical)

Because this software will be deployed on bank workstations, it must comply with strict InfoSec guidelines:

| Req ID | Requirement Description | Compliance Mapping |
| :--- | :--- | :--- |
| **SEC-01** | **Zero Network Access:** The extension must not request `host_permissions` or make any external network requests (`fetch`, `XMLHttpRequest`, WebSockets). | Data Exfiltration Prevention |
| **SEC-02** | **No Third-Party CDNs:** All assets, scripts (including the QR generation library), and styles must be bundled locally within the extension package. | Supply Chain Security |
| **SEC-03** | **Content Security Policy (CSP):** Must strictly adhere to Manifest V3 CSP. No execution of arbitrary strings via `eval()` or `new Function()`. | Anti-XSS / Code Injection |
| **SEC-04** | **Zero Persistence:** The extension must not store highlighted text in `chrome.storage`, cookies, IndexDB, or LocalStorage. Text stays in memory only while the popup is open. | Data Minimization |
| **SEC-05** | **Auditability:** The codebase must be kept minimal, clean, and unminified (except for well-known open-source dependencies) to facilitate immediate InfoSec line-by-line review. | Enterprise Governance |

---

## 3. User Personas

* **Persona A (Quality Assurance / Mobile Tester):** Needs to open deep links and testing URLs on mobile test devices quickly without typing 100-character tokens manually into Google Chrome on Android/iOS.
* **Persona B (Operations Support Specialist):** Needs to scan reference/ticket IDs from their desktop Google Chrome browser using a corporate mobile app to track workflows on the go.

---

## 4. Functional Requirements & Features

### 4.1 Feature Flow Matrix

| ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | Highlight Capture (Popup) | When clicking the extension icon, the extension automatically grabs the active tab's currently highlighted text. | P0 |
| **FR-02** | Local QR Generation | Converts the captured text into a visual QR code inside the popup window using a bundled library (`qrcode.js` or `bwip-js`). | P0 |
| **FR-03** | Text Validation & Error State | If no text is selected, display a clear, user-friendly prompt: *"Please highlight text on the page first."* | P0 |
| **FR-04** | Context Menu Integration | Right-clicking highlighted text exposes a Google Chrome context menu item: *"Generate QR Code for this selection"*, which opens a dedicated modal/overlay. | P1 |
| **FR-05** | Character Limit Indicator | Warns the user if the selected text exceeds the structural limits of a standard QR code (typically ~2,000–4,000 characters depending on error correction). | P1 |
| **FR-06** | Policy Warning Banner | Displays a subtle text disclaimer in the popup reminding employees of internal data classification rules (e.g., *"Ensure target mobile device is bank-authorized"*). | P2 |

---

## 5. Technical Architecture & Constraints

### 5.1 Architecture Diagram (Conceptual)
```text
[ Google Chrome (Active Tab) ] 
       │
       │ (User highlights text & clicks extension)
       ▼
[ Content Script / Scripting API ] ──► window.getSelection().toString()
       │
       │ (In-Memory Message Passing)
       ▼
[ Extension Popup Logic (popup.js) ]
       │
       │ (Passes text string locally)
       ▼
[ Bundled QR Library (local engine) ] ──► Compiles to Canvas / SVG
       │
       ▼
[ UI View (popup.html) ] ──► Renders QR Code on Monitor Screen