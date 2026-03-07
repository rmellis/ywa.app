# ywa.app | Your WebApp

A centralized distribution hub for 11 high-performance web applications designed for both standalone use and instant deployment via iframes. This project allows users to design, edit, and browse directly on the site or easily embed these tools into their own web projects using provided code snippets.

<img width="1024" alt="image" src="https://github.com/user-attachments/assets/8eacdf16-dc12-45a9-b281-1db1df0ba7a8" />
---

## ✨ Core Features

* **"Jello" Physics Engine:** Draggable windows utilize a custom spring-damping physics engine (0.12 stiffness, 0.6 damping) that creates fluid wobbling, skewing, and stretching effects when moved.
* **Dual-Tier Deployment:** Every application includes an "Open WebApp" option for standalone use and a one-click "Copy Iframe" button for external website integration.
* **Global Dashboard Zoom:** Users can scale the entire dashboard from 50% to 200% for better accessibility or overview.
* **Dynamic Theme Engine:** Supports Light and Dark modes with persistent storage in `localStorage`, automatically switching brand logos and mesh background gradients.
* **Reactive App Dock:** A dynamic dock appears when windows are minimized, featuring hover scaling and active status indicators.
* **Smart Search & Filtering:** A keyword-based search (Press "/" to focus) and category-based sidebar allow for instant navigation across the 11-app suite.
  <img width="1156" height="592" alt="image" src="https://github.com/user-attachments/assets/a7a3f44c-7562-492d-b681-efd044b6c1a3" />

---

## 🚀 Available Applications

| Application | Category | Description |
| :--- | :--- | :--- |
| **Open Publisher** | Publishing | Professional desktop-grade design tool with PDF export, WordArt, and templates. |
| **Gedit Clone** | Editor | A web-based recreation of the classic GNOME Linux text editor. |
| **Notepad++** | Editor | Functional clone for writing and saving code natively. |
| **MS Paint (L/D)** | Graphics | Faithful recreations of Microsoft Paint with themed interfaces. |
| **Browser Suite** | Browser | Proxy-iframe browsers styled after Safari, Chrome, Firefox, Opera, and IE. |

More may have been addded since

---

## 📦 Embedding on Your Project

Each app is designed to be highly portable. You can find the specific snippet in the "Embed Iframe" section of any app card or within the app window itself.

**Standard Embed Template:**
<pre>
&lt;iframe src="https://openpublisher.app" width="100%" height="600px" frameborder="0" allowfullscreen&gt;&lt;/iframe&gt;
</pre>
Note: All windows include internal zoom controls (50%-200%) specifically for the iframe content to ensure they fit perfectly in any container.

## 🛠️ Technical Details

### Physics Configuration
The window movement logic is calculated via a dedicated animation loop:
* **Velocity-Based Skew:** Maximum skew of 20 degrees to maintain a "jello" feel without distortion.
* **Scale Animation:** Windows spring open from a 0.1 scale to 1.0 upon launch.
* **Z-Index Management:** Active windows are dynamically layered using a `highestZIndex` counter.

### File Structure
* **index.html**: Contains the dashboard layout, app metadata, and window templates.
* **style.css**: Manages the glassmorphic theme variables, mesh animations, and responsive grid logic.
* **script.js**: Handles the physics engine, search/filter logic, and the multi-window manager.

---

## 🤝 Support
These WebApps are free and open-source. If you find them useful for your own sites, consider supporting the project to help keep the hosted versions alive.
