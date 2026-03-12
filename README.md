# Anirudh - Digital EPK

A bespoke, brutalist, high-contrast Digital Electronic Press Kit designed for DJs and Producers. This site requires no build steps and is completely data-driven via a single JSON file.

## 📁 Directory Structure
Make sure your files map to this layout:

- `index.html` (The Main Page)
- `content.json` (The Brain - edit this to change site content)
- `assets/`
  - `style.css` (Custom brutalist CSS)
  - `app.js` (DOM generation & interactivity)
  - `images/` (Drop your gig posters and press photos here)
  - `videos/` (Drop your lo-fi background loops here)
  - `downloads/` (Drop ZIP files for the Promoter Toolbox here)

## 🛠 How to Update Content

All content is managed inside `content.json`. Open `content.json` in any text editor to modify the data.

### 1. Changing the Hero Video
1. Place your new `.mp4` loop inside `assets/videos/`.
2. Open `content.json`, find the `"hero"` section, and update `"video": "assets/videos/your-new-video.mp4"`.

### 2. Updating Tour Dates (Gigs)
Add a new object inside the `"gigs"` array:
```json
{
  "date": "YYYY-MM-DD",
  "venue": "Venue Name",
  "location": "City, Country",
  "image": "assets/images/poster-name.jpg"
}
```
*Note: Make sure your new `poster-name.jpg` is inside the `assets/images/` folder.*

### 3. Updating the Interaction Genre Crate (SoundCloud Mixes)
Modify the objects within the `"mixes"` array. 
- You must provide a **SoundCloud Embed URL**, *not* a standard track link.
- To get an embed URL: Go to your track on SoundCloud -> Share -> Embed -> Copy the src URL inside the `<iframe>`.

```json
{
  "id": "new-genre",
  "genre": "New Genre Name",
  "color": "#FF00FF",
  "soundcloudUrl": "https://w.soundcloud.com/player/?url=..."
}
```

### 4. Updating the Promoter Toolbox (Downloads)
1. Compress your files and name them clearly (e.g., `Ani_PressKit_2026.zip`).
2. Move the ZIP into `assets/downloads/`.
3. Update the matching key under `"promoter"` in `content.json` with the exact path (`assets/downloads/Ani_PressKit_2026.zip`).

### 5. Updating the Media Gallery
Add the relative paths to your new photos to the `"gallery"` array:
```json
"gallery": [
  "assets/images/press1.jpg",
  "assets/images/press2.jpg",
  "assets/images/new-press-photo.jpg"
]
```

## 🎨 Theme & Colors
The Global default neon color is defined in `content.json` -> `"theme" -> "defaultAccent"`. Change this HEX value to alter the landing page aesthetic.
