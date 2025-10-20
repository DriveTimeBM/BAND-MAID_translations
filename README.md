# BAND-MAID Translation Comparison Tool 🎸

This is a browser-based tool for comparing **human** and **machine** translations of BAND-MAID video subtitles, stored in `.txt` files within this repository. It helps assess the quality of translations and record preferences.

🔗 **View the comparison tool here:**

[https://drivetimebm.github.io/BAND-MAID_translations/](https://drivetimebm.github.io/BAND-MAID_translations/)

---

## Translations

- **Machine Translations for folder AI-2025-10**  
  Transcription: [TurboScribe](https://turboscribe.ai)
  Translation: [Unofficial BAND-MAID GPT](https://chatgpt.com/g/g-68db200d63cc819190a84f2ff7cbf58f-unofficial-band-maid-gpt)

- **Human Translations**  
  [u/t-shinji on reddit](https://www.reddit.com/user/t-shinji/)

## 🚀 Features

- **Side-by-side translation view**  
  Compare human (left) and AI-generated (right) subtitles for each video.

- **Scrollable video list**  
  View and select from all available video IDs in a sidebar.

- **Search and filter**  
  - 🔍 Search by video ID  
  - 🟡 Filter to show only unrated videos  
  - ⏭️ Jump to next unrated entry

- **Rate translations**  
  Mark which translation is better:  
  - `H` for Human  
  - `M` for Machine  
  - `-` for No Choice

- **Persistent local ratings**  
  Ratings are saved in your browser’s local storage.

- **Export & reset**  
  - ⬇️ Download your ratings as a JSON file  
  - ♻️ Reset all ratings to unrated

---

## 📁 Folder Structure

/
├── index.html ← Main app UI
├── script.js ← JavaScript logic
├── manifest.json ← Lists available video IDs
├── human/ ← Human translations
│ └── <videoId>.txt
├── AI-YYYY-MM/ ← Machine translations by folder
│ └── <videoId>.txt

---

## 🧠 How It Works

- On load, the app reads `manifest.json` to determine which video IDs are available.
- Users can choose which AI folder (e.g., `AI-2025-10`) to compare with human translations.
- If a translation file is missing, a `"No translation"` message is shown.
- Users can browse and rate translations, with results stored locally and downloadable as `ratings.json`.

---

## 🛠 How to Use

1. **Open the app**  
   Navigate to the GitHub Pages site for this repository:  

2. **Browse translations**  
Use the sidebar to scroll or search through video IDs.

3. **Select and compare**  
Click a video ID to view human vs. machine translations.

4. **Rate the translation**  
Use the buttons to indicate which version is better.

5. **Export your results**  
Use the ⬇️ button to download your ratings as JSON.

6. **Reset if needed**  
Click ♻️ to clear all ratings and start over.

---

## 📦 Manifest Generator (owner note)

To generate a new `manifest.json` locally using PowerShell:

```powershell
Generate-TranslationManifest -RootPath "C:\<location>\BAND-MAID_translations" -OutputFile "manifest.json"
