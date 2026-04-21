# 💼 Job Portal — React App

A full-featured job portal built with React, supporting three user roles: **Student (Job Seeker)**, **Employer**, and **Admin**. Includes job listings, applications, filtering, profile management, and an admin dashboard.

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above recommended)
- [Git](https://git-scm.com/)
- npm (comes with Node.js)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Place the Component File

If the project uses a custom setup, ensure `job-portal.jsx` is in the correct location:

```
src/
└── App.jsx       ← rename or import job-portal.jsx here
```

Or if you're creating a fresh Vite project (recommended):

```bash
npm create vite@latest job-portal -- --template react
cd job-portal
npm install
```

Then replace the contents of `src/App.jsx` with the code from `job-portal.jsx`.

---

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## 🔐 Demo Login Credentials

Use these accounts to test all three roles:

| Role     | Email               | Password  |
|----------|---------------------|-----------|
| Student  | priya@email.com     | pass123   |
| Employer | hr@techcorp.com     | pass123   |
| Admin    | admin@portal.com    | admin123  |

You can also register a new Student or Employer account from the login page.

---

## ✨ Features

### 👩‍🎓 Student (Job Seeker)
- Browse and search job listings
- Filter by category, location, and experience
- View full job details
- Apply to jobs with a cover note
- Track application status (Pending / Shortlisted / Rejected)
- Edit profile (skills, bio, location)

### 🏢 Employer
- Post new job listings
- Edit or delete existing jobs
- View applicants for each job
- Update applicant status (shortlist / reject)

### 🛠️ Admin
- View all users, jobs, and applications
- Dashboard with platform statistics
- Manage and monitor all activity

---

## 📁 Project Structure

```
job-portal/
├── public/
├── src/
│   ├── App.jsx          ← Main job portal component
│   └── main.jsx         ← Entry point
├── index.html
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose              |
|------------|----------------------|
| React      | UI framework         |
| useState   | Local state management |
| useEffect  | Side effects         |
| Inline CSS (JS styles) | Styling |
| Vite       | Dev server & bundler |

> No external UI libraries or backend required — fully self-contained.

---

## 📦 Build for Production

To generate a production-ready build:

```bash
npm run build
```

The output will be in the `dist/` folder. You can serve it with:

```bash
npm run preview
```

---

## 🌐 Deploy (Optional)

You can deploy the production build to any static hosting platform:

- **Vercel** — `vercel deploy`
- **Netlify** — drag and drop the `dist/` folder
- **GitHub Pages** — use `gh-pages` package

---

## ⚠️ Notes

- All data is stored in **React state** (in-memory). Data resets on page refresh — there is no database or backend.
- To persist data across sessions, integrate `localStorage` or a backend API (e.g., Firebase, Supabase).
- This project is intended for **demo and learning purposes**.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
