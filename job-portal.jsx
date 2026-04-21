import { useState, useEffect, useCallback } from "react";

const INITIAL_JOBS = [
  { id: 1, title: "Frontend Developer", company: "TechCorp India", location: "Chennai", category: "Engineering", experience: "2-4 years", salary: "₹8-12 LPA", skills: ["React", "JavaScript", "CSS"], description: "Build responsive UIs for our SaaS platform. Work with a fast-paced team using modern React.", posted: "2026-04-15", employerId: 2, status: "active" },
  { id: 2, title: "Data Analyst", company: "Infosys", location: "Bangalore", category: "Analytics", experience: "1-3 years", salary: "₹6-9 LPA", skills: ["Python", "SQL", "Tableau"], description: "Analyze large datasets and build dashboards to drive business insights.", posted: "2026-04-14", employerId: 2, status: "active" },
  { id: 3, title: "Java Backend Engineer", company: "Zoho", location: "Chennai", category: "Engineering", experience: "3-6 years", salary: "₹12-18 LPA", skills: ["Spring Boot", "MySQL", "REST APIs"], description: "Design and build robust backend microservices using Spring Boot.", posted: "2026-04-13", employerId: 2, status: "active" },
  { id: 4, title: "UX Designer", company: "Freshworks", location: "Remote", category: "Design", experience: "2-5 years", salary: "₹10-15 LPA", skills: ["Figma", "Prototyping", "User Research"], description: "Create delightful user experiences for enterprise software products.", posted: "2026-04-12", employerId: 2, status: "active" },
  { id: 5, title: "DevOps Engineer", company: "HCL Technologies", location: "Hyderabad", category: "Engineering", experience: "4-7 years", salary: "₹15-22 LPA", skills: ["Docker", "Kubernetes", "AWS"], description: "Manage CI/CD pipelines and cloud infrastructure at scale.", posted: "2026-04-10", employerId: 2, status: "active" },
];

const INITIAL_USERS = [
  { id: 1, name: "Priya Ramesh", email: "priya@email.com", password: "pass123", role: "student", skills: ["React", "JavaScript", "CSS"], experience: "2 years", location: "Chennai", bio: "Frontend enthusiast with a passion for clean UIs.", resume: "priya_resume.pdf" },
  { id: 2, name: "TechCorp Recruiter", email: "hr@techcorp.com", password: "pass123", role: "employer", company: "TechCorp India", location: "Chennai" },
  { id: 3, name: "Admin", email: "admin@portal.com", password: "admin123", role: "admin" },
];

const INITIAL_APPLICATIONS = [
  { id: 1, jobId: 1, userId: 1, appliedDate: "2026-04-16", status: "shortlisted", coverNote: "I have strong React experience and am excited about this role." },
  { id: 2, jobId: 2, userId: 1, appliedDate: "2026-04-17", status: "pending", coverNote: "My Python and SQL skills align perfectly with this position." },
];

const CATEGORIES = ["All", "Engineering", "Analytics", "Design", "Management", "Marketing"];
const LOCATIONS = ["All", "Chennai", "Bangalore", "Hyderabad", "Remote", "Mumbai"];
const EXPERIENCES = ["All", "0-1 years", "1-3 years", "2-4 years", "3-6 years", "4-7 years"];
const STATUS_COLORS = { pending: "#c2700e", shortlisted: "#0f6e56", rejected: "#a32d2d", active: "#185fa5" };
const STATUS_BG = { pending: "#faeeda", shortlisted: "#e1f5ee", rejected: "#fcebeb", active: "#e6f1fb" };

export default function JobPortal() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");
  const [authMode, setAuthMode] = useState("login");
  const [notification, setNotification] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", role: "student" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", role: "student", company: "", location: "", skills: "", bio: "" });
  const [jobFilters, setJobFilters] = useState({ search: "", category: "All", location: "All", experience: "All" });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [coverNote, setCoverNote] = useState("");
  const [jobForm, setJobForm] = useState({ title: "", company: "", location: "", category: "Engineering", experience: "1-3 years", salary: "", skills: "", description: "" });
  const [editingJob, setEditingJob] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [selectedApplicants, setSelectedApplicants] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = () => {
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setView("app");
      setActiveTab("dashboard");
      notify(`Welcome back, ${user.name}!`);
    } else {
      notify("Invalid email or password", "error");
    }
  };

  const handleRegister = () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      notify("Please fill all required fields", "error"); return;
    }
    if (users.find(u => u.email === registerForm.email)) {
      notify("Email already registered", "error"); return;
    }
    const newUser = {
      id: users.length + 1, ...registerForm,
      skills: registerForm.skills ? registerForm.skills.split(",").map(s => s.trim()) : [],
      resume: null
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setView("app");
    setActiveTab("dashboard");
    notify(`Account created! Welcome, ${newUser.name}!`);
  };

  const handleLogout = () => { setCurrentUser(null); setView("login"); setLoginForm({ email: "", password: "", role: "student" }); };

  const filteredJobs = jobs.filter(j => {
    if (j.status !== "active") return false;
    if (jobFilters.search && !j.title.toLowerCase().includes(jobFilters.search.toLowerCase()) && !j.company.toLowerCase().includes(jobFilters.search.toLowerCase())) return false;
    if (jobFilters.category !== "All" && j.category !== jobFilters.category) return false;
    if (jobFilters.location !== "All" && j.location !== jobFilters.location) return false;
    if (jobFilters.experience !== "All" && j.experience !== jobFilters.experience) return false;
    return true;
  });

  const userApplications = applications.filter(a => a.userId === currentUser?.id);
  const employerJobs = jobs.filter(j => j.employerId === currentUser?.id);

  const handleApply = () => {
    if (applications.find(a => a.jobId === applyModal.id && a.userId === currentUser.id)) {
      notify("You've already applied to this job", "error"); setApplyModal(null); return;
    }
    const newApp = { id: applications.length + 1, jobId: applyModal.id, userId: currentUser.id, appliedDate: new Date().toISOString().split("T")[0], status: "pending", coverNote };
    setApplications(prev => [...prev, newApp]);
    setApplyModal(null); setCoverNote("");
    notify("Application submitted successfully!");
  };

  const handlePostJob = () => {
    if (!jobForm.title || !jobForm.description || !jobForm.salary) { notify("Fill all required fields", "error"); return; }
    if (editingJob) {
      setJobs(prev => prev.map(j => j.id === editingJob.id ? { ...j, ...jobForm, skills: jobForm.skills.split(",").map(s => s.trim()) } : j));
      notify("Job updated!");
    } else {
      const newJob = { id: jobs.length + 1, ...jobForm, skills: jobForm.skills.split(",").map(s => s.trim()), posted: new Date().toISOString().split("T")[0], employerId: currentUser.id, status: "active" };
      setJobs(prev => [...prev, newJob]);
      notify("Job posted successfully!");
    }
    setShowJobForm(false); setEditingJob(null); setJobForm({ title: "", company: currentUser?.company || "", location: "", category: "Engineering", experience: "1-3 years", salary: "", skills: "", description: "" });
  };

  const handleDeleteJob = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "deleted" } : j));
    notify("Job removed.");
  };

  const handleUpdateStatus = (appId, status) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    notify(`Application ${status}`);
  };

  const handleSaveProfile = () => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...profileForm, skills: typeof profileForm.skills === "string" ? profileForm.skills.split(",").map(s => s.trim()) : profileForm.skills } : u));
    setCurrentUser(prev => ({ ...prev, ...profileForm, skills: typeof profileForm.skills === "string" ? profileForm.skills.split(",").map(s => s.trim()) : profileForm.skills }));
    setProfileEdit(false); notify("Profile updated!");
  };

  const statsForAdmin = {
    totalJobs: jobs.filter(j => j.status === "active").length,
    totalUsers: users.filter(u => u.role === "student").length,
    totalApps: applications.length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
  };

  const statsForStudent = {
    applied: userApplications.length,
    shortlisted: userApplications.filter(a => a.status === "shortlisted").length,
    pending: userApplications.filter(a => a.status === "pending").length,
    rejected: userApplications.filter(a => a.status === "rejected").length,
  };

  const statsForEmployer = {
    posted: employerJobs.filter(j => j.status === "active").length,
    totalApps: applications.filter(a => employerJobs.some(j => j.id === a.jobId)).length,
    shortlisted: applications.filter(a => employerJobs.some(j => j.id === a.jobId) && a.status === "shortlisted").length,
  };

  const S = styles;

  if (view === "login") {
    return (
      <div style={S.authPage}>
        {notification && <div style={{ ...S.notif, background: notification.type === "error" ? "#fcebeb" : "#e1f5ee", color: notification.type === "error" ? "#a32d2d" : "#0f6e56" }}>{notification.msg}</div>}
        <div style={S.authCard}>
          <div style={S.authLogo}>
            <div style={S.logoMark}>JP</div>
            <div>
              <div style={S.logoText}>JobPortal</div>
              <div style={S.logoSub}>Find your next opportunity</div>
            </div>
          </div>
          <div style={S.authTabs}>
            <button style={{ ...S.authTab, ...(authMode === "login" ? S.authTabActive : {}) }} onClick={() => setAuthMode("login")}>Sign In</button>
            <button style={{ ...S.authTab, ...(authMode === "register" ? S.authTabActive : {}) }} onClick={() => setAuthMode("register")}>Register</button>
          </div>
          {authMode === "login" ? (
            <div style={S.formGroup}>
              <div style={S.quickLogins}>
                <div style={S.quickLabel}>Quick demo access:</div>
                <div style={S.quickBtns}>
                  {[{ label: "Student", email: "priya@email.com", pass: "pass123" }, { label: "Employer", email: "hr@techcorp.com", pass: "pass123" }, { label: "Admin", email: "admin@portal.com", pass: "admin123" }].map(q => (
                    <button key={q.label} style={S.quickBtn} onClick={() => { setLoginForm({ email: q.email, password: q.pass }); setTimeout(() => { const user = users.find(u => u.email === q.email); if (user) { setCurrentUser(user); setView("app"); setActiveTab("dashboard"); } }, 100); }}>{q.label}</button>
                  ))}
                </div>
              </div>
              <input style={S.input} type="email" placeholder="Email address" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} />
              <input style={S.input} type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} />
              <button style={S.btnPrimary} onClick={handleLogin}>Sign In</button>
            </div>
          ) : (
            <div style={S.formGroup}>
              <div style={S.roleSelect}>
                {["student", "employer"].map(r => (
                  <button key={r} style={{ ...S.roleBtn, ...(registerForm.role === r ? S.roleBtnActive : {}) }} onClick={() => setRegisterForm(p => ({ ...p, role: r }))}>{r === "student" ? "Job Seeker" : "Employer"}</button>
                ))}
              </div>
              <input style={S.input} placeholder="Full Name *" value={registerForm.name} onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))} />
              <input style={S.input} type="email" placeholder="Email *" value={registerForm.email} onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))} />
              <input style={S.input} type="password" placeholder="Password *" value={registerForm.password} onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))} />
              {registerForm.role === "employer" && <input style={S.input} placeholder="Company Name" value={registerForm.company} onChange={e => setRegisterForm(p => ({ ...p, company: e.target.value }))} />}
              {registerForm.role === "student" && <input style={S.input} placeholder="Skills (comma separated)" value={registerForm.skills} onChange={e => setRegisterForm(p => ({ ...p, skills: e.target.value }))} />}
              <input style={S.input} placeholder="Location" value={registerForm.location} onChange={e => setRegisterForm(p => ({ ...p, location: e.target.value }))} />
              <button style={S.btnPrimary} onClick={handleRegister}>Create Account</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const navItems = currentUser?.role === "student"
    ? [{ id: "dashboard", label: "Dashboard" }, { id: "jobs", label: "Browse Jobs" }, { id: "applications", label: "My Applications" }, { id: "profile", label: "My Profile" }]
    : currentUser?.role === "employer"
    ? [{ id: "dashboard", label: "Dashboard" }, { id: "post-job", label: "Post Job" }, { id: "my-jobs", label: "My Jobs" }, { id: "applicants", label: "Applicants" }]
    : [{ id: "dashboard", label: "Dashboard" }, { id: "all-jobs", label: "All Jobs" }, { id: "all-users", label: "All Users" }, { id: "all-apps", label: "Applications" }];

  return (
    <div style={S.app}>
      {notification && <div style={{ ...S.notif, background: notification.type === "error" ? "#fcebeb" : "#e1f5ee", color: notification.type === "error" ? "#a32d2d" : "#0f6e56" }}>{notification.msg}</div>}

      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <div style={S.logoMark}>JP</div>
          <div>
            <div style={S.logoText}>JobPortal</div>
            <div style={{ ...S.logoSub, color: "rgba(255,255,255,0.5)" }}>Management System</div>
          </div>
        </div>
        <div style={S.userInfo}>
          <div style={S.avatar}>{currentUser?.name?.charAt(0)}</div>
          <div>
            <div style={S.userName}>{currentUser?.name}</div>
            <div style={S.userRole}>{currentUser?.role}</div>
          </div>
        </div>
        <nav style={S.nav}>
          {navItems.map(item => (
            <button key={item.id} style={{ ...S.navItem, ...(activeTab === item.id ? S.navItemActive : {}) }} onClick={() => { setActiveTab(item.id); setSelectedJob(null); setSelectedApplicants(null); setShowJobForm(false); }}>
              {item.label}
            </button>
          ))}
        </nav>
        <button style={S.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>

      {/* Main Content */}
      <div style={S.main}>

        {/* STUDENT DASHBOARD */}
        {currentUser?.role === "student" && activeTab === "dashboard" && (
          <div style={S.content}>
            <div style={S.pageHeader}>
              <h1 style={S.h1}>Welcome back, {currentUser.name.split(" ")[0]} 👋</h1>
              <p style={S.subtitle}>Here's your job search overview</p>
            </div>
            <div style={S.statsGrid}>
              {[{ label: "Jobs Applied", value: statsForStudent.applied, color: "#185fa5", bg: "#e6f1fb" }, { label: "Shortlisted", value: statsForStudent.shortlisted, color: "#0f6e56", bg: "#e1f5ee" }, { label: "Pending", value: statsForStudent.pending, color: "#c2700e", bg: "#faeeda" }, { label: "Rejected", value: statsForStudent.rejected, color: "#a32d2d", bg: "#fcebeb" }].map(s => (
                <div key={s.label} style={{ ...S.statCard, background: s.bg }}>
                  <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
                  <div style={{ ...S.statLabel, color: s.color }}>{s.label}</div>
                </div>
              ))}
            </div>
            {userApplications.filter(a => a.status === "shortlisted").length > 0 && (
              <div style={S.alertBox}>
                🎉 You have been shortlisted for {userApplications.filter(a => a.status === "shortlisted").length} job(s)! Check your Applications tab.
              </div>
            )}
            <h2 style={S.h2}>Recent Job Listings</h2>
            <div style={S.jobGrid}>
              {jobs.filter(j => j.status === "active").slice(0, 3).map(job => <JobCard key={job.id} job={job} onView={() => { setSelectedJob(job); setActiveTab("jobs"); }} applied={applications.some(a => a.jobId === job.id && a.userId === currentUser.id)} />)}
            </div>
          </div>
        )}

        {/* BROWSE JOBS */}
        {currentUser?.role === "student" && activeTab === "jobs" && !selectedJob && (
          <div style={S.content}>
            <div style={S.pageHeader}>
              <h1 style={S.h1}>Browse Jobs</h1>
              <p style={S.subtitle}>{filteredJobs.length} opportunities available</p>
            </div>
            <div style={S.filterBar}>
              <input style={{ ...S.input, flex: 2 }} placeholder="Search by title or company..." value={jobFilters.search} onChange={e => setJobFilters(p => ({ ...p, search: e.target.value }))} />
              <select style={{ ...S.input, flex: 1 }} value={jobFilters.category} onChange={e => setJobFilters(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select style={{ ...S.input, flex: 1 }} value={jobFilters.location} onChange={e => setJobFilters(p => ({ ...p, location: e.target.value }))}>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
              <select style={{ ...S.input, flex: 1 }} value={jobFilters.experience} onChange={e => setJobFilters(p => ({ ...p, experience: e.target.value }))}>
                {EXPERIENCES.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            {filteredJobs.length === 0 ? <div style={S.empty}>No jobs found matching your filters.</div> : (
              <div style={S.jobGrid}>
                {filteredJobs.map(job => <JobCard key={job.id} job={job} onView={() => setSelectedJob(job)} applied={applications.some(a => a.jobId === job.id && a.userId === currentUser.id)} onApply={() => { setApplyModal(job); }} />)}
              </div>
            )}
          </div>
        )}

        {/* JOB DETAIL */}
        {currentUser?.role === "student" && activeTab === "jobs" && selectedJob && (
          <div style={S.content}>
            <button style={S.backBtn} onClick={() => setSelectedJob(null)}>← Back to Jobs</button>
            <div style={S.jobDetail}>
              <div style={S.jobDetailHeader}>
                <div>
                  <h1 style={S.h1}>{selectedJob.title}</h1>
                  <div style={S.jobMeta}>{selectedJob.company} · {selectedJob.location} · {selectedJob.experience}</div>
                </div>
                <div>
                  <div style={S.salary}>{selectedJob.salary}</div>
                  {applications.some(a => a.jobId === selectedJob.id && a.userId === currentUser.id)
                    ? <div style={{ ...S.badge, background: STATUS_BG.shortlisted, color: STATUS_COLORS.shortlisted }}>Applied</div>
                    : <button style={S.btnPrimary} onClick={() => setApplyModal(selectedJob)}>Apply Now</button>}
                </div>
              </div>
              <div style={S.divider} />
              <h3 style={S.h3}>Job Description</h3>
              <p style={S.jobDesc}>{selectedJob.description}</p>
              <h3 style={S.h3}>Required Skills</h3>
              <div style={S.skillsRow}>{selectedJob.skills.map(s => <span key={s} style={S.skillBadge}>{s}</span>)}</div>
              <div style={S.divider} />
              <div style={S.infoRow}>
                <div><span style={S.infoLabel}>Category</span><span style={S.infoVal}>{selectedJob.category}</span></div>
                <div><span style={S.infoLabel}>Posted</span><span style={S.infoVal}>{selectedJob.posted}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* MY APPLICATIONS */}
        {currentUser?.role === "student" && activeTab === "applications" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>My Applications</h1><p style={S.subtitle}>Track your job applications</p></div>
            {userApplications.length === 0 ? <div style={S.empty}>You haven't applied to any jobs yet. <button style={S.linkBtn} onClick={() => setActiveTab("jobs")}>Browse Jobs</button></div> : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead><tr>{["Job Title", "Company", "Applied Date", "Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {userApplications.map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      return job ? (
                        <tr key={app.id} style={S.tr}>
                          <td style={S.td}><button style={S.linkBtn} onClick={() => { setSelectedJob(job); setActiveTab("jobs"); }}>{job.title}</button></td>
                          <td style={S.td}>{job.company}</td>
                          <td style={S.td}>{app.appliedDate}</td>
                          <td style={S.td}><span style={{ ...S.badge, background: STATUS_BG[app.status] || "#f1efe8", color: STATUS_COLORS[app.status] || "#5f5e5a" }}>{app.status}</span></td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* STUDENT PROFILE */}
        {currentUser?.role === "student" && activeTab === "profile" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>My Profile</h1></div>
            <div style={S.profileCard}>
              <div style={S.profileHeader}>
                <div style={{ ...S.avatar, width: 64, height: 64, fontSize: 24 }}>{currentUser.name.charAt(0)}</div>
                <div>
                  <div style={S.h2}>{currentUser.name}</div>
                  <div style={S.jobMeta}>{currentUser.location || "Location not set"}</div>
                </div>
                <button style={S.btnOutline} onClick={() => { setProfileEdit(true); setProfileForm({ ...currentUser, skills: Array.isArray(currentUser.skills) ? currentUser.skills.join(", ") : currentUser.skills }); }}>Edit Profile</button>
              </div>
              {profileEdit ? (
                <div style={S.formGroup}>
                  <div style={S.divider} />
                  <input style={S.input} placeholder="Full Name" value={profileForm.name || ""} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
                  <input style={S.input} placeholder="Location" value={profileForm.location || ""} onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))} />
                  <input style={S.input} placeholder="Experience" value={profileForm.experience || ""} onChange={e => setProfileForm(p => ({ ...p, experience: e.target.value }))} />
                  <input style={S.input} placeholder="Skills (comma separated)" value={profileForm.skills || ""} onChange={e => setProfileForm(p => ({ ...p, skills: e.target.value }))} />
                  <textarea style={{ ...S.input, minHeight: 80, resize: "vertical" }} placeholder="Bio" value={profileForm.bio || ""} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={S.btnPrimary} onClick={handleSaveProfile}>Save Changes</button>
                    <button style={S.btnOutline} onClick={() => setProfileEdit(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={S.divider} />
                  <div style={S.profileSection}><div style={S.infoLabel}>Bio</div><div style={S.infoVal}>{currentUser.bio || "No bio added yet."}</div></div>
                  <div style={S.profileSection}><div style={S.infoLabel}>Experience</div><div style={S.infoVal}>{currentUser.experience || "Not specified"}</div></div>
                  <div style={S.profileSection}>
                    <div style={S.infoLabel}>Skills</div>
                    <div style={S.skillsRow}>{(currentUser.skills || []).map(s => <span key={s} style={S.skillBadge}>{s}</span>)}</div>
                  </div>
                  <div style={S.profileSection}>
                    <div style={S.infoLabel}>Resume</div>
                    <div>
                      {currentUser.resume ? <span style={{ color: "#185fa5" }}>📎 {currentUser.resume}</span> : "No resume uploaded"}
                      <label style={{ ...S.btnOutline, marginLeft: 12, cursor: "pointer", fontSize: 13 }}>
                        Upload Resume
                        <input type="file" style={{ display: "none" }} accept=".pdf,.doc,.docx" onChange={e => { if (e.target.files[0]) { setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, resume: e.target.files[0].name } : u)); setCurrentUser(prev => ({ ...prev, resume: e.target.files[0].name })); notify("Resume uploaded!"); } }} />
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* EMPLOYER DASHBOARD */}
        {currentUser?.role === "employer" && activeTab === "dashboard" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>Employer Dashboard</h1><p style={S.subtitle}>{currentUser.company}</p></div>
            <div style={S.statsGrid}>
              {[{ label: "Jobs Posted", value: statsForEmployer.posted, color: "#185fa5", bg: "#e6f1fb" }, { label: "Total Applicants", value: statsForEmployer.totalApps, color: "#534ab7", bg: "#eeedfe" }, { label: "Shortlisted", value: statsForEmployer.shortlisted, color: "#0f6e56", bg: "#e1f5ee" }].map(s => (
                <div key={s.label} style={{ ...S.statCard, background: s.bg }}>
                  <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
                  <div style={{ ...S.statLabel, color: s.color }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button style={S.btnPrimary} onClick={() => { setActiveTab("post-job"); setShowJobForm(true); }}>+ Post New Job</button>
              <button style={S.btnOutline} onClick={() => setActiveTab("applicants")}>View All Applicants</button>
            </div>
          </div>
        )}

        {/* POST JOB */}
        {currentUser?.role === "employer" && activeTab === "post-job" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>{editingJob ? "Edit Job" : "Post New Job"}</h1></div>
            <div style={S.formCard}>
              <div style={S.formRow}>
                <div style={S.formCol}>
                  <label style={S.label}>Job Title *</label>
                  <input style={S.input} placeholder="e.g. Senior React Developer" value={jobForm.title} onChange={e => setJobForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div style={S.formCol}>
                  <label style={S.label}>Company</label>
                  <input style={S.input} placeholder="Company name" value={jobForm.company || currentUser.company || ""} onChange={e => setJobForm(p => ({ ...p, company: e.target.value }))} />
                </div>
              </div>
              <div style={S.formRow}>
                <div style={S.formCol}>
                  <label style={S.label}>Location *</label>
                  <select style={S.input} value={jobForm.location} onChange={e => setJobForm(p => ({ ...p, location: e.target.value }))}>
                    <option value="">Select location</option>
                    {LOCATIONS.filter(l => l !== "All").map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div style={S.formCol}>
                  <label style={S.label}>Category</label>
                  <select style={S.input} value={jobForm.category} onChange={e => setJobForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={S.formRow}>
                <div style={S.formCol}>
                  <label style={S.label}>Experience Required</label>
                  <select style={S.input} value={jobForm.experience} onChange={e => setJobForm(p => ({ ...p, experience: e.target.value }))}>
                    {EXPERIENCES.filter(e => e !== "All").map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div style={S.formCol}>
                  <label style={S.label}>Salary Range *</label>
                  <input style={S.input} placeholder="e.g. ₹8-12 LPA" value={jobForm.salary} onChange={e => setJobForm(p => ({ ...p, salary: e.target.value }))} />
                </div>
              </div>
              <label style={S.label}>Required Skills (comma separated)</label>
              <input style={S.input} placeholder="e.g. React, Node.js, SQL" value={jobForm.skills} onChange={e => setJobForm(p => ({ ...p, skills: e.target.value }))} />
              <label style={S.label}>Job Description *</label>
              <textarea style={{ ...S.input, minHeight: 120, resize: "vertical" }} placeholder="Describe the role, responsibilities, and requirements..." value={jobForm.description} onChange={e => setJobForm(p => ({ ...p, description: e.target.value }))} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button style={S.btnPrimary} onClick={handlePostJob}>{editingJob ? "Update Job" : "Post Job"}</button>
                {editingJob && <button style={S.btnOutline} onClick={() => { setEditingJob(null); setJobForm({ title: "", company: currentUser.company || "", location: "", category: "Engineering", experience: "1-3 years", salary: "", skills: "", description: "" }); }}>Cancel Edit</button>}
              </div>
            </div>
          </div>
        )}

        {/* MY JOBS (EMPLOYER) */}
        {currentUser?.role === "employer" && activeTab === "my-jobs" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>My Job Listings</h1><button style={S.btnPrimary} onClick={() => { setEditingJob(null); setJobForm({ title: "", company: currentUser.company || "", location: "", category: "Engineering", experience: "1-3 years", salary: "", skills: "", description: "" }); setActiveTab("post-job"); }}>+ Post New</button></div>
            {employerJobs.filter(j => j.status === "active").length === 0 ? <div style={S.empty}>No jobs posted yet.</div> : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead><tr>{["Title", "Location", "Experience", "Salary", "Applicants", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {employerJobs.filter(j => j.status === "active").map(job => {
                      const appCount = applications.filter(a => a.jobId === job.id).length;
                      return (
                        <tr key={job.id} style={S.tr}>
                          <td style={S.td}>{job.title}</td>
                          <td style={S.td}>{job.location}</td>
                          <td style={S.td}>{job.experience}</td>
                          <td style={S.td}>{job.salary}</td>
                          <td style={S.td}><span style={{ ...S.badge, background: "#e6f1fb", color: "#185fa5" }}>{appCount} applied</span></td>
                          <td style={S.td}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button style={S.actionBtn} onClick={() => { setEditingJob(job); setJobForm({ ...job, skills: job.skills.join(", ") }); setActiveTab("post-job"); }}>Edit</button>
                              <button style={{ ...S.actionBtn, color: "#a32d2d", borderColor: "#f09595" }} onClick={() => handleDeleteJob(job.id)}>Delete</button>
                              <button style={S.actionBtn} onClick={() => { setSelectedApplicants(job); setActiveTab("applicants"); }}>Applicants</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* APPLICANTS (EMPLOYER) */}
        {currentUser?.role === "employer" && activeTab === "applicants" && (
          <div style={S.content}>
            <div style={S.pageHeader}>
              <h1 style={S.h1}>{selectedApplicants ? `Applicants: ${selectedApplicants.title}` : "All Applicants"}</h1>
              {selectedApplicants && <button style={S.backBtn} onClick={() => setSelectedApplicants(null)}>← All Applicants</button>}
            </div>
            {(() => {
              const relevantApps = applications.filter(a => {
                const job = jobs.find(j => j.id === a.jobId);
                if (!job || job.employerId !== currentUser.id) return false;
                if (selectedApplicants && a.jobId !== selectedApplicants.id) return false;
                return true;
              });
              return relevantApps.length === 0 ? <div style={S.empty}>No applicants yet.</div> : (
                <div style={S.tableWrap}>
                  <table style={S.table}>
                    <thead><tr>{["Applicant", "Job", "Applied", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {relevantApps.map(app => {
                        const user = users.find(u => u.id === app.userId);
                        const job = jobs.find(j => j.id === app.jobId);
                        return (
                          <tr key={app.id} style={S.tr}>
                            <td style={S.td}>
                              <div style={{ fontWeight: 500 }}>{user?.name}</div>
                              <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{user?.skills?.join(", ")}</div>
                            </td>
                            <td style={S.td}>{job?.title}</td>
                            <td style={S.td}>{app.appliedDate}</td>
                            <td style={S.td}><span style={{ ...S.badge, background: STATUS_BG[app.status] || "#f1efe8", color: STATUS_COLORS[app.status] || "#5f5e5a" }}>{app.status}</span></td>
                            <td style={S.td}>
                              <div style={{ display: "flex", gap: 6 }}>
                                {app.status !== "shortlisted" && <button style={{ ...S.actionBtn, color: "#0f6e56", borderColor: "#5dcaa5" }} onClick={() => handleUpdateStatus(app.id, "shortlisted")}>Shortlist</button>}
                                {app.status !== "rejected" && <button style={{ ...S.actionBtn, color: "#a32d2d", borderColor: "#f09595" }} onClick={() => handleUpdateStatus(app.id, "rejected")}>Reject</button>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {currentUser?.role === "admin" && activeTab === "dashboard" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>Admin Dashboard</h1><p style={S.subtitle}>System Overview</p></div>
            <div style={S.statsGrid}>
              {[{ label: "Active Jobs", value: statsForAdmin.totalJobs, color: "#185fa5", bg: "#e6f1fb" }, { label: "Registered Students", value: statsForAdmin.totalUsers, color: "#534ab7", bg: "#eeedfe" }, { label: "Total Applications", value: statsForAdmin.totalApps, color: "#c2700e", bg: "#faeeda" }, { label: "Shortlisted", value: statsForAdmin.shortlisted, color: "#0f6e56", bg: "#e1f5ee" }].map(s => (
                <div key={s.label} style={{ ...S.statCard, background: s.bg }}>
                  <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
                  <div style={{ ...S.statLabel, color: s.color }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={S.adminCharts}>
              <div style={S.chartCard}>
                <h3 style={S.h3}>Applications by Status</h3>
                {["pending", "shortlisted", "rejected"].map(status => {
                  const count = applications.filter(a => a.status === status).length;
                  const pct = applications.length ? Math.round((count / applications.length) * 100) : 0;
                  return (
                    <div key={status} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, textTransform: "capitalize" }}>{status}</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{count}</span>
                      </div>
                      <div style={{ height: 8, background: "var(--color-background-secondary)", borderRadius: 4 }}>
                        <div style={{ height: 8, width: `${pct}%`, background: STATUS_COLORS[status], borderRadius: 4 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={S.chartCard}>
                <h3 style={S.h3}>Jobs by Category</h3>
                {CATEGORIES.filter(c => c !== "All").map(cat => {
                  const count = jobs.filter(j => j.category === cat && j.status === "active").length;
                  return count > 0 ? (
                    <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                      <span style={{ fontSize: 13 }}>{cat}</span>
                      <span style={{ ...S.badge, background: "#e6f1fb", color: "#185fa5" }}>{count}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN ALL JOBS */}
        {currentUser?.role === "admin" && activeTab === "all-jobs" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>All Job Listings</h1></div>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead><tr>{["Title", "Company", "Location", "Category", "Posted", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {jobs.filter(j => j.status !== "deleted").map(job => (
                    <tr key={job.id} style={S.tr}>
                      <td style={S.td}>{job.title}</td>
                      <td style={S.td}>{job.company}</td>
                      <td style={S.td}>{job.location}</td>
                      <td style={S.td}>{job.category}</td>
                      <td style={S.td}>{job.posted}</td>
                      <td style={S.td}><span style={{ ...S.badge, background: STATUS_BG[job.status] || "#f1efe8", color: STATUS_COLORS[job.status] || "#5f5e5a" }}>{job.status}</span></td>
                      <td style={S.td}><button style={{ ...S.actionBtn, color: "#a32d2d", borderColor: "#f09595" }} onClick={() => handleDeleteJob(job.id)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADMIN ALL USERS */}
        {currentUser?.role === "admin" && activeTab === "all-users" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>All Users</h1></div>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead><tr>{["Name", "Email", "Role", "Location", "Apps"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={S.tr}>
                      <td style={S.td}><div style={{ fontWeight: 500 }}>{user.name}</div></td>
                      <td style={S.td}>{user.email}</td>
                      <td style={S.td}><span style={{ ...S.badge, background: user.role === "admin" ? "#fcebeb" : user.role === "employer" ? "#eeedfe" : "#e6f1fb", color: user.role === "admin" ? "#a32d2d" : user.role === "employer" ? "#534ab7" : "#185fa5" }}>{user.role}</span></td>
                      <td style={S.td}>{user.location || "—"}</td>
                      <td style={S.td}>{applications.filter(a => a.userId === user.id).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADMIN ALL APPLICATIONS */}
        {currentUser?.role === "admin" && activeTab === "all-apps" && (
          <div style={S.content}>
            <div style={S.pageHeader}><h1 style={S.h1}>All Applications</h1></div>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead><tr>{["Applicant", "Job", "Company", "Date", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {applications.map(app => {
                    const user = users.find(u => u.id === app.userId);
                    const job = jobs.find(j => j.id === app.jobId);
                    return (
                      <tr key={app.id} style={S.tr}>
                        <td style={S.td}>{user?.name}</td>
                        <td style={S.td}>{job?.title}</td>
                        <td style={S.td}>{job?.company}</td>
                        <td style={S.td}>{app.appliedDate}</td>
                        <td style={S.td}><span style={{ ...S.badge, background: STATUS_BG[app.status] || "#f1efe8", color: STATUS_COLORS[app.status] || "#5f5e5a" }}>{app.status}</span></td>
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button style={{ ...S.actionBtn, color: "#0f6e56", borderColor: "#5dcaa5" }} onClick={() => handleUpdateStatus(app.id, "shortlisted")}>Shortlist</button>
                            <button style={{ ...S.actionBtn, color: "#a32d2d", borderColor: "#f09595" }} onClick={() => handleUpdateStatus(app.id, "rejected")}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* APPLY MODAL */}
      {applyModal && (
        <div style={S.modalOverlay} onClick={() => setApplyModal(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={S.h2}>Apply for {applyModal.title}</h2>
            <div style={S.jobMeta}>{applyModal.company} · {applyModal.location}</div>
            <div style={S.divider} />
            <label style={S.label}>Cover Note (optional)</label>
            <textarea style={{ ...S.input, minHeight: 100, resize: "vertical", marginBottom: 12 }} placeholder="Tell the employer why you're a great fit..." value={coverNote} onChange={e => setCoverNote(e.target.value)} />
            <div style={S.formCol}>
              <label style={S.label}>Resume</label>
              <div style={{ fontSize: 13, marginBottom: 12 }}>{currentUser?.resume ? <span style={{ color: "#185fa5" }}>📎 {currentUser.resume} (will be attached)</span> : <span style={{ color: "#a32d2d" }}>No resume uploaded. Go to My Profile to upload one.</span>}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnPrimary} onClick={handleApply}>Submit Application</button>
              <button style={S.btnOutline} onClick={() => setApplyModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onView, applied, onApply }) {
  const S = styles;
  return (
    <div style={S.jobCard}>
      <div style={S.jobCardHeader}>
        <div>
          <div style={S.jobTitle}>{job.title}</div>
          <div style={S.jobCompany}>{job.company}</div>
        </div>
        {applied && <span style={{ ...S.badge, background: "#e1f5ee", color: "#0f6e56" }}>Applied</span>}
      </div>
      <div style={S.jobCardMeta}>
        <span style={S.metaItem}>📍 {job.location}</span>
        <span style={S.metaItem}>💼 {job.experience}</span>
        <span style={S.metaItem}>💰 {job.salary}</span>
      </div>
      <div style={S.skillsRow}>{job.skills.slice(0, 3).map(s => <span key={s} style={S.skillBadge}>{s}</span>)}</div>
      <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 12 }}>
        <button style={S.btnOutline} onClick={onView}>View Details</button>
        {!applied && onApply && <button style={S.btnPrimary} onClick={onApply}>Apply</button>}
      </div>
    </div>
  );
}

const styles = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)" },
  authPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0c447c 0%, #185fa5 50%, #378add 100%)", padding: 16 },
  authCard: { background: "var(--color-background-primary)", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  authLogo: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  logoMark: { width: 40, height: 40, background: "linear-gradient(135deg, #185fa5, #378add)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 },
  logoText: { fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" },
  logoSub: { fontSize: 12, color: "var(--color-text-secondary)" },
  authTabs: { display: "flex", background: "var(--color-background-secondary)", borderRadius: 8, padding: 4, marginBottom: 20 },
  authTab: { flex: 1, padding: "8px 0", border: "none", background: "transparent", cursor: "pointer", borderRadius: 6, fontSize: 14, color: "var(--color-text-secondary)" },
  authTabActive: { background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  quickLogins: { background: "var(--color-background-secondary)", borderRadius: 8, padding: 12, marginBottom: 16 },
  quickLabel: { fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" },
  quickBtns: { display: "flex", gap: 8 },
  quickBtn: { flex: 1, padding: "6px 0", fontSize: 12, border: "0.5px solid var(--color-border-secondary)", borderRadius: 6, cursor: "pointer", background: "var(--color-background-primary)", color: "#185fa5", fontWeight: 500 },
  roleSelect: { display: "flex", gap: 8, marginBottom: 16 },
  roleBtn: { flex: 1, padding: "10px 0", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, cursor: "pointer", background: "transparent", fontSize: 14, color: "var(--color-text-secondary)" },
  roleBtnActive: { background: "#e6f1fb", color: "#185fa5", borderColor: "#85b7eb", fontWeight: 500 },
  sidebar: { width: 240, background: "#0c447c", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 },
  sidebarLogo: { display: "flex", alignItems: "center", gap: 10, padding: "0 20px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" },
  userInfo: { display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" },
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "#378add", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  userName: { fontSize: 13, fontWeight: 500, color: "#fff" },
  userRole: { fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "capitalize" },
  nav: { flex: 1, padding: "12px 0" },
  navItem: { display: "block", width: "100%", padding: "10px 20px", border: "none", background: "transparent", color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer", textAlign: "left", transition: "all 0.15s" },
  navItemActive: { background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 500, borderLeft: "3px solid #85b7eb" },
  logoutBtn: { margin: "0 16px", padding: "10px 0", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13 },
  main: { flex: 1, overflow: "auto" },
  content: { padding: 32, maxWidth: 1000, margin: "0 auto" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  h1: { fontSize: 24, fontWeight: 700, margin: "0 0 4px", color: "var(--color-text-primary)" },
  h2: { fontSize: 18, fontWeight: 600, margin: "0 0 16px", color: "var(--color-text-primary)" },
  h3: { fontSize: 15, fontWeight: 600, margin: "0 0 12px", color: "var(--color-text-primary)" },
  subtitle: { fontSize: 14, color: "var(--color-text-secondary)", margin: 0 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 },
  statCard: { borderRadius: 12, padding: 16, textAlign: "center" },
  statValue: { fontSize: 32, fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: 12, marginTop: 4, fontWeight: 500 },
  alertBox: { background: "#e1f5ee", border: "0.5px solid #5dcaa5", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#0f6e56", marginBottom: 24 },
  jobGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  jobCard: { background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: 20, display: "flex", flexDirection: "column", gap: 10 },
  jobCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  jobTitle: { fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" },
  jobCompany: { fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 },
  jobCardMeta: { display: "flex", flexWrap: "wrap", gap: 8 },
  metaItem: { fontSize: 12, color: "var(--color-text-secondary)" },
  filterBar: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  input: { padding: "9px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, fontSize: 14, color: "var(--color-text-primary)", background: "var(--color-background-primary)", width: "100%", boxSizing: "border-box", marginBottom: 12 },
  formGroup: { display: "flex", flexDirection: "column", gap: 0 },
  formCard: { background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: 24 },
  formRow: { display: "flex", gap: 12 },
  formCol: { flex: 1 },
  label: { display: "block", fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" },
  btnPrimary: { padding: "10px 20px", background: "#185fa5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 },
  btnOutline: { padding: "9px 16px", background: "transparent", color: "#185fa5", border: "0.5px solid #85b7eb", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 },
  actionBtn: { padding: "5px 12px", background: "transparent", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 6, cursor: "pointer", fontSize: 12 },
  linkBtn: { background: "none", border: "none", color: "#185fa5", cursor: "pointer", fontSize: 14, padding: 0, fontWeight: 500 },
  backBtn: { background: "none", border: "none", color: "#185fa5", cursor: "pointer", fontSize: 13, padding: "0 0 16px", display: "block" },
  badge: { display: "inline-block", padding: "2px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500 },
  skillBadge: { display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 12, background: "#eeedfe", color: "#534ab7" },
  skillsRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  tableWrap: { background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderBottom: "0.5px solid var(--color-border-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" },
  td: { padding: "12px 16px", fontSize: 14, borderBottom: "0.5px solid var(--color-border-tertiary)", color: "var(--color-text-primary)" },
  tr: { transition: "background 0.1s" },
  profileCard: { background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: 24 },
  profileHeader: { display: "flex", alignItems: "center", gap: 16 },
  profileSection: { marginBottom: 16 },
  infoLabel: { fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, display: "block" },
  infoVal: { fontSize: 14, color: "var(--color-text-primary)" },
  divider: { borderTop: "0.5px solid var(--color-border-tertiary)", margin: "16px 0" },
  jobDetail: { background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: 28 },
  jobDetailHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  jobMeta: { fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4 },
  salary: { fontSize: 18, fontWeight: 700, color: "#185fa5", marginBottom: 8, textAlign: "right" },
  jobDesc: { fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)", marginBottom: 16 },
  infoRow: { display: "flex", gap: 32 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 },
  modal: { background: "var(--color-background-primary)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480 },
  notif: { position: "fixed", top: 16, right: 16, padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500, zIndex: 200, border: "0.5px solid currentColor" },
  empty: { textAlign: "center", padding: 48, color: "var(--color-text-secondary)", fontSize: 15 },
  adminCharts: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 },
  chartCard: { background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: 20 },
};
