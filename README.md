# **🛡️ Auto-Filler Pro (Stealth Edition)**

> "I choose a lazy person to do a hard job. Because a lazy person will find an easy way to do it." - Bill Gates

A robust, developer-focused Chrome Extension designed to **automate the repetitive task of job applications**.

Unlike standard autofill tools, this is engineered to **bypass complex DOM structures, Shadow DOMs, and messy HTML** on notoriously difficult sites like **Workday, Lever, and Google Forms**.

![Logo](icon.png)

## **🚀 Key Features**

* **Stealth Mode UI:** A custom **Dark Mode interface** designed for long coding sessions and high contrast.
* **React State Override:** Uses **event bubbling** (`input`, `change`, `blur`) to force modern frameworks (React/Angular) to recognize programmatic data entry.
* **Deep DOM Traversal:** A heuristic engine that detects labels in **Parent and Grandparent elements** (fixing Material UI detection issues).
* **Google Forms Bypass:** Specifically engineered to handle **`aria-labelledby` hidden links** that break most scripts.
* **One-Click Fill:** Instantly populates **Personal Info, Education, Links, and Gender dropdowns**.

## **🛠️ Installation (Developer Mode)**

Since this is a custom tool, you install it via **Developer Mode**:

1.  **Clone this repository:**
    `git clone https://github.com/Rishushukla157/Job-Auto-Filler-Extension.git`
2.  Open Chrome and go to `chrome://extensions/`
3.  Toggle **Developer mode** (top right switch).
4.  Click **Load unpacked**.
5.  Select the **folder you just cloned**.

## **💻 Tech Stack**

* **JavaScript (ES6):** Core logic and heuristic matching.
* **Chrome Extension API (Manifest V3):** Using `storage` and `scripting` permissions.
* **MutationObservers:** To detect and fill **dynamic/slow-loading forms** inside iFrames.

## **🤝 Contributing**

This was built to solve a personal pain point during the job hunt. If you want to add features (like **AI Cover Letter generation**), feel free to fork and submit a PR.

**Keep building stuffs.** 🛠️
