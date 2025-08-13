# 🌌 AIverse – Frontend Platform

**AIverse** is a modern, AI-powered platform built with **Next.js** that provides a **central hub** for multiple AI tools, including:

- 📸 Instagram Caption Generator
- 🎙 Voice Cloning & TTS
- 🧠 More AI tools coming soon...

This frontend connects seamlessly to the **AIverse backend microservices** and delivers a fast, responsive, and user-friendly experience for exploring AI capabilities.

---

## 🚀 Features

- **Multi-Tool AI Platform** – All AI tools accessible from a single dashboard.
- **Instagram Caption Generator** – Upload an image, choose a vibe, get captions & matching music suggestions.
- **Voice Cloning & TTS** – Clone a voice from a sample and generate speech in multiple languages.
- **Scalable & Modular** – Built to add more AI tools without disrupting the UI.
- **Responsive Design** – Fully optimized for desktop, tablet, and mobile.

---

## 📂 Project Structure

```

AIverse-Frontend/
├── app/                # App router pages & layouts (Next.js 14+)
├── components/         # Reusable UI components
├── contexts/           # React context for global state
├── hooks/              # Custom React hooks
├── lib/                # Utility functions & API clients
├── public/             # Static assets
├── styles/             # Global & Tailwind styles
├── templates/          # Prebuilt UI templates for tools/pages
├── .env.example        # Environment variable template
├── components.json     # UI component configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration

````

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/AIverse-Frontend.git
cd AIverse-Frontend
````

### **2. Install Dependencies**

```bash
npm install
```

(You can also use `pnpm install` or `yarn install` if preferred.)

### **3. Configure Environment Variables**

Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### **4. Run the Development Server**

```bash
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 Backend Connection

This frontend communicates with **AIverse backend microservices**:

| Tool                | Backend Endpoint(s)                                |
| ------------------- | -------------------------------------------------- |
| Instagram Caption   | `/api/generate-captions`, `/api/music-suggestions` |
| Voice Cloning & TTS | `/upload`, `/generate`                             |

Update `NEXT_PUBLIC_BACKEND_URL` in `.env.local` to match your backend's base URL.

---

## 🛠 Technologies Used

* **Next.js 14** – Full-stack React framework
* **Tailwind CSS** – Utility-first styling
* **TypeScript** – Type safety
* **Framer Motion** – Smooth animations
* **React Context API** – State management
* **Vercel Ready** – Instant deployment

---

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
npm run build
vercel deploy
```

### **Netlify**

```bash
npm run build
netlify deploy
```

---

## 📜 License

MIT License – Free to use, modify, and distribute.

