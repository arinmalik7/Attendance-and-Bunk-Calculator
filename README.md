# 🎓 Attendance & Bunk Calculator

A sleek, modern, SaaS-grade academic utility designed to track course lecture attendance, calculate permissible skips (bunks) without falling below required minimums, and determine exact catch-up sessions needed when falling behind.

![HTML5](https://img.shields.io/badge/HTML5-Semantic_Architecture-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Modern_SaaS_Tokens-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## ✨ Features

- **⚡ Real-Time Attendance Analytics**: Computes current attendance percentage dynamically as you type.
- **🛡️ Safe Zone Calculator**: If you are above your target (default 75%), it calculates the exact maximum number of lectures you can safely skip.
- **🚨 Danger Zone Recovery**: If you fall below your target, it calculates the minimum consecutive future sessions you must attend to recover.
- **💾 LocalStorage Persistence**: Automatically bundles and saves all input fields (`attendance_calc_data`) so data persists across refreshes and browser sessions.
- **🎯 100% Semantic HTML5**: Built strictly using semantic tags (`<header>`, `<main>`, `<form>`, `<fieldset>`, `<legend>`, `<label>`, `<input>`, `<output>`, `<progress>`, `<section>`, `<footer>`) with **zero unnecessary `<div>` elements**.
- **📊 Visual Progress & Safety Gauge**: Animated HTML5 `<progress>` bar and color-coded status badges (`Safe` / `Danger Zone`) indicating attendance health at a glance.
- **🛡️ Robust Input Validation**: Inline alerts prevent invalid states (`attended > total`, negative values, division-by-zero, `NaN%`).
- **📱 Fully Responsive**: Built with CSS Grid and Flexbox, featuring fluid typography, 44px+ touch targets, and zero horizontal scrolling on mobile viewports.

---

## 🧮 Mathematical Formulations

### 1. Current Attendance
$$\text{Current \%} = \left(\frac{\text{Attended Sessions}}{\text{Total Sessions}}\right) \times 100$$

### 2. Permissible Skips (Safe Zone)
When $\text{Current \%} \ge \text{Target \%}$:
$$\text{Skippable Sessions} = \max\left(0, \left\lfloor\frac{\text{Attended} - \left(\frac{\text{Target}}{100} \times \text{Total}\right)}{\frac{\text{Target}}{100}}\right\rfloor\right)$$

### 3. Consecutive Recovery Sessions (Danger Zone)
When $\text{Current \%} < \text{Target \%}$, let $N$ be the consecutive classes you must attend:
$$\frac{\text{Attended} + N}{\text{Total} + N} \ge \frac{\text{Target}}{100}$$

Solving for $N$:
$$N = \left\lceil\frac{\left(\frac{\text{Target}}{100} \times \text{Total}\right) - \text{Attended}}{1 - \frac{\text{Target}}{100}}\right\rceil$$

---

## 📂 Project Structure

```text
Web-Dev-Project/
├── index.html       # Pure semantic HTML5 markup & accessible ARIA live regions
├── style.css        # CSS custom properties, SaaS design system, responsive grid
├── script.js        # Mathematical formulas, real-time DOM updates & localStorage
├── .gitignore       # System, IDE, and temporary files exclusion
└── README.md        # Project documentation
```

---

## 🚀 Getting Started

No build tools or external dependencies required.

### 1. Clone the Repository
```bash
git clone https://github.com/arinmalik7/Web-Dev-Project.git
cd Web-Dev-Project
```

### 2. Run the Application
Simply open `index.html` in any modern web browser:
- Double-click `index.html` in your file explorer, or
- In **VS Code**, use the **Live Server** extension (`Right-click index.html > Open with Live Server`).

---

## 🎨 Design System & Palette

| Token | Value | Preview / Usage |
| :--- | :--- | :--- |
| **Canvas Background** | `#f8fafc` | Atmospheric background with radial gradient |
| **Card Surface** | `#ffffff` | Elevated white card with `16px` border radius |
| **Primary Accent** | `#4f46e5` to `#6366f1` | Violet-indigo button gradient & focus rings |
| **Safe Zone** | `#16a34a` / `#ecfdf5` | Soft green badges and progress indicators |
| **Danger Zone** | `#dc2626` / `#fef2f2` | Soft red alert pills and warning badges |
| **Typography** | Inter, sans-serif | Tight tracking (`-0.02em` on headings) |

---

## 🛠️ Usage Guide

1. **Enter Subject**: Input the subject or course code (e.g., *Operating Systems*).
2. **Total Scheduled Sessions**: Input the total number of classes held so far.
3. **Attended Sessions**: Input the count of classes you actually attended.
4. **Target Attendance**: Adjust your required threshold (defaults to `75%`).
5. **View Results**: The calculator will instantly update the percentage, visual progress gauge, and primary action verdict.
6. **Reset / Clear**: Click **Reset / Clear** anytime to wipe both form fields and clear cached `localStorage`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
