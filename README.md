# URL Param Injector

A browser extension to automatically inject URL parameters based on user-defined rules. This is particularly useful for developers and testers who frequently use feature flags or other query parameters.

## Features

- Define rules based on domain names.
- Inject multiple key-value parameter pairs for each rule.
- A simple popup to view active rules for the current page.
- An options page to add, remove, and manage your injection rules.
- Rules are automatically applied to main-frame page loads.

## Getting Started

### Installation from Release

**Recommended for most users:**

1. Go to the [Latest Release](https://github.com/moollaza/inject-url-param/releases/latest) page
2. Download the `inject-url-param.zip` file from the Assets section
3. Extract the zip file to a folder on your computer
4. Open your browser and navigate to the extensions page:
   - **Chrome/Edge**: `chrome://extensions/`
   - **Firefox**: `about:addons`
5. Enable "Developer mode" (toggle in the top right)
6. Click "Load unpacked" (Chrome/Edge) or "Install Add-on From File" (Firefox)
7. Select the extracted folder containing the extension files
8. The extension should now be installed and ready to use!

### Development Installation

For developers who want to build from source:

1.  Clone or download this repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running in Development

To run the extension in development mode, which will open a new browser instance with the extension loaded and support hot-reloading:

```bash
npm run dev
```

By default, this will run in Chrome. To use a different browser (e.g., Firefox), you can specify it:

```bash
npm run dev -- --browser=firefox
```

### Building for Production

To build the extension for production, creating a distributable `zip` file in the `dist/` directory:

```bash
npm run build
```

## How to Use

1.  Once the extension is loaded, right-click the extension icon and select "Options", or find the extension in your browser's extension management page and click "Options".
2.  On the Options page, you can add new rules. Each rule consists of a domain and one or more URL parameter pairs (key and value).
    - The extension comes with a default rule for `use-serp-dev-testing8.duck.co`.
3.  When you navigate to a website whose domain matches a rule, the specified parameters will be automatically added to the URL.
4.  Click the extension icon in your browser toolbar to see which rules are currently active for the page you are on.
