# 📚 NotebookLM Categorizer

**NotebookLM Categorizer** is a browser extension that adds smart **category filter buttons** to the [NotebookLM](https://notebooklm.google.com/) list. It detects titles and automatically groups them into categories like "Tutorial", "Finance", "General", and more.

It also handles **Single-Page Application (SPA)** navigation seamlessly, no need to reload manually when moving around!

---

## Preview (extension)

<img width="2168" height="1146" alt="image" src="https://github.com/user-attachments/assets/50aab499-c287-41bb-b69f-00dccd9409b1" />
<img width="2168" height="1146" alt="image" src="https://github.com/user-attachments/assets/2b8039a7-18a8-4f2c-aa76-a38a88b4cfc0" />
<img width="2161" height="840" alt="image" src="https://github.com/user-attachments/assets/bb11c4c3-c5f3-4707-ac05-4dc91eff89a8" />


## Preview (userscript)

<img width="1187" alt="image" src="https://github.com/user-attachments/assets/dca59bcc-bf98-484a-aac7-c9d1fe0a2ab9" />
<img width="1212" alt="image" src="https://github.com/user-attachments/assets/83176a49-8e72-4468-b023-8bcf1e03072b" />

---

## ✨ Features

- 🗂️ Auto-categorizes based on title keywords
- 🎛️ Adds a filter button UI
- 🚀 Works with NotebookLM's dynamic SPA navigation
- 💾 Remembers your last selected filter even after page reloads
- 🌟 Clean, native-looking design
- ⚙️ Customizable categories and keywords
- 🔧 Category management modal for easy configuration

---

## 📥 Installation

### Option 1: Firefox Extension

#### Method A: Install from Firefox Add-ons (Recommended)

1. Visit the **[NotebookLM Categorizer page on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/notebooklm-categorizer/)**
2. Click **"Add to Firefox"**
3. Confirm the installation in the popup
4. Visit [NotebookLM](https://notebooklm.google.com/) and the category filters will appear automatically

#### Method B: Manual Installation with XPI file

1. **Download the `notebooklm-categorizer-1.2.0.xpi` file** from the `extensions/firefox/` folder
2. **Open Firefox** and go to `about:addons`
3. Drag and drop the `.xpi` file into the Firefox window, **or** click the **gear icon ⚙️** and select **"Install Add-on From File..."**
4. **Select the downloaded `.xpi` file**
5. **Confirm installation** when prompted
6. **Visit [NotebookLM](https://notebooklm.google.com/)** to see the filters in action

### Option 2: Chrome Extension (Manual Installation)

Since this extension is not published on the Chrome Web Store (to avoid publication fees), you can install it manually:

1. **Download or clone this repository**
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** in the top-right corner
4. **Click "Load unpacked"** and select the `extensions/chrome/` folder
5. **The extension will be installed** and you'll see the NotebookLM Categorizer icon in your toolbar
6. **Visit [NotebookLM](https://notebooklm.google.com/)** and the category filters will appear automatically

### Option 3: Userscript (Tampermonkey)

1. Install a userscript manager browser extension:
   - [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Create a **new userscript**:
   - Click the Tampermonkey icon ➔ *Create a new script*.

3. Replace the default code with the [**NotebookLM Categorizer** script](script.js).

4. Save the script.

5. Visit [https://notebooklm.google.com/](https://notebooklm.google.com/).

6. ✨ **Done!** The category filter buttons will appear automatically when the page loads.

---

## ⚙️ How It Works

- **Auto-detection:** Based on titles and keywords
- **Real-time updating:** Listens for dynamic page changes with [arrive.js](https://github.com/uzairfarooq/arrive)
- **Styling:** Lightweight custom CSS for clean, minimal look
- **Persistence:** Saves active filter across sessions using browser storage
- **Customizable:** Easy category management through built-in modal

---

## 🎯 Using the Extension

### Default Categories

- **All**: Shows all notebooks
- **Tutorial**: Matches "How to", "Course", "Lecture", "Tutorial"
- **Finance**: Matches "Investing", "Gold", "Stocks", "Bonds", "Funds"  
- **Other**: Automatically catches all unmatched notebooks

### Customizing Categories

1. Click the **gear icon (⚙️)** in the filter bar
2. Add, edit, or remove categories in the management modal
3. Set keywords as comma-separated values
4. Click "Save and Close" to apply changes

---

## ❓ FAQ

**Q:** I don't see any buttons after installing?

**A:** Make sure:

- You are on [https://notebooklm.google.com/](https://notebooklm.google.com/)
- The extension/userscript is active and enabled
- Wait a few seconds if the list is still loading

**Q:** Can I change the categories or keywords?

**A:** Yes! Click the gear icon in the filter bar to open the category manager, or edit the categories directly in the script/extension files.

**Q:** Why isn't this on the Chrome Web Store?

**A:** Google charges a one-time $5 developer fee to publish extensions, which is why this is available as a manual installation or userscript. However, it's available on Firefox Add-ons for free!

**Q:** Is this safe to use?

**A:** Yes! The extension only runs on notebooklm.google.com, doesn't collect any personal data, and all code is open source for transparency.

---

## 🛠️ Contributing

If you have suggestions or improvements, feel free to fork the repo and submit a pull request!

---

## ☕ Support

If you find this project useful, you can support its development:

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://buymeacoffee.com/muharamdani)

[![Ko-fi](https://cdn.ko-fi.com/cdn/kofi3.png?v=3)](https://ko-fi.com/muharamdani)

---

## 📜 License

MIT [License](LICENSE)
