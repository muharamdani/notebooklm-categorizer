# 📚 NotebookLM Project Categorizer

**NotebookLM Project Categorizer** is a userscript that adds smart **category filter buttons** to the [NotebookLM](https://notebooklm.google.com/) project list.
It detects project titles and automatically groups them into categories like "Tutorial", "Finance", "General", and more.

It also handles **Single-Page Application (SPA)** navigation seamlessly, no need to reload manually when moving around!

---

## Preview

<img width="1187" alt="image" src="https://github.com/user-attachments/assets/dca59bcc-bf98-484a-aac7-c9d1fe0a2ab9" />
<img width="1212" alt="image" src="https://github.com/user-attachments/assets/83176a49-8e72-4468-b023-8bcf1e03072b" />

---

## ✨ Features

- 🗂️ Auto-categorizes your projects based on title keywords
- 🎛️ Adds a filter button UI above your project list
- 🚀 Works with NotebookLM’s dynamic SPA navigation
- 💾 Remembers your last selected filter even after page reloads
- 🌟 Clean, native-looking design

---

## 📥 Installation

1. Install a userscript manager browser extension (like tampermonkey, Violentmonkey, etc.). I’m using Tampermonkey as the userscript manager. You can install it using the link below:
   - [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Create a **new userscript**:
   - Click the Tampermonkey icon ➔ *Create a new script*.

3. Replace the default code with the [**NotebookLM Project Categorizer** script](script.js).

4. Save the script.

5. Visit [https://notebooklm.google.com/](https://notebooklm.google.com/).

6. ✨ **Done!** The category filter buttons will appear automatically when the page loads.

---

## ⚙️ How It Works

- **Auto-detection:** Based on project titles and keywords
- **Real-time updating:** Listens for dynamic page changes with [arrive.js](https://github.com/uzairfarooq/arrive)
- **Styling:** Lightweight custom CSS for clean, minimal look
- **Persistence:** Saves active filter across sessions using `GM_setValue` and `GM_getValue`

---

## ❓ FAQ

**Q:** I don't see any buttons after installing?

**A:** Make sure:

- You are on [https://notebooklm.google.com/](https://notebooklm.google.com/)
- Tampermonkey is active
- The script is enabled and saved
- Wait a few seconds if the project list is still loading

**Q:** Can I change the categories or keywords?

**A:** Yes!
Inside the script, edit the `categories` section like this:

```javascript
const categories = {
    'All': [],
    'My Custom Category': ['Keyword1', 'Keyword2'],
    ...
};
```

---

## 🛠️ Contributing

If you have suggestions or improvements, feel free to fork the repo and submit a pull request!

---

## ☕ Support

If you find this project useful, you can support its development:

- Buy Me a Coffee
   [![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://buymeacoffee.com/muharamdani)

- Ko-fi
   [![Ko-fi](https://cdn.ko-fi.com/cdn/kofi3.png?v=3)](https://ko-fi.com/muharamdani)

---

## 📜 License

MIT [License](LICENSE)
