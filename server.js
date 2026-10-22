const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data', 'projects.json');
const PUBLIC_DATA_FILE = path.join(__dirname, 'public', 'projects.json');
const INQUIRIES_FILE = path.join(__dirname, 'data', 'inquiries.json');

// Ensure inquiries file exists
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
}

// Helpers
function getProjects() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading projects:', err);
  }
  return [];
}

function saveProjects(projects) {
  try {
    const json = JSON.stringify(projects, null, 2);
    fs.writeFileSync(DATA_FILE, json, 'utf8');
    fs.writeFileSync(PUBLIC_DATA_FILE, json, 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving projects:', err);
    return false;
  }
}

function getInquiries() {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      return JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading inquiries:', err);
  }
  return [];
}

function saveInquiries(inquiries) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving inquiries:', err);
    return false;
  }
}

// REST API Endpoints

// 1. Get projects
app.get('/api/projects', (req, res) => {
  let list = getProjects();
  const { category, search } = req.query;

  if (category && category !== 'All') {
    list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: list.length, data: list });
});

// 2. Get single project
app.get('/api/projects/:id', (req, res) => {
  const list = getProjects();
  const project = list.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
});

// 3. Create project
app.post('/api/projects', (req, res) => {
  const { title, category, description, video, image, photos, client, year, tags } = req.body;
  if (!title || !category) {
    return res.status(400).json({ success: false, message: 'Title and Category are required.' });
  }

  const list = getProjects();
  const newProject = {
    id: 'tsh-' + Date.now().toString(36),
    title: title.trim(),
    category: category.trim(),
    description: description || '',
    video: video || '',
    image: image || (photos && photos[0]) || '',
    photos: Array.isArray(photos) ? photos : (image ? [image] : []),
    client: client || 'Tech Shutter Hub Client',
    year: year || new Date().getFullYear().toString(),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(s => s.trim()) : [])
  };

  list.unshift(newProject);
  saveProjects(list);
  res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
});

// 4. Update project
app.put('/api/projects/:id', (req, res) => {
  const list = getProjects();
  const idx = list.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Project not found' });

  const existing = list[idx];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id // preserve ID
  };

  list[idx] = updated;
  saveProjects(list);
  res.json({ success: true, message: 'Project updated successfully', data: updated });
});

// 5. Delete project
app.delete('/api/projects/:id', (req, res) => {
  let list = getProjects();
  const initialLength = list.length;
  list = list.filter(p => p.id !== req.params.id);
  if (list.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  saveProjects(list);
  res.json({ success: true, message: 'Project removed successfully' });
});

// 6. Submit Client Inquiry / Project Booking
app.post('/api/inquire', (req, res) => {
  const { name, email, phone, projectType, date, budget, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and Email are required.' });
  }

  const inquiries = getInquiries();
  const newInquiry = {
    id: 'inq-' + Date.now().toString(36),
    name: name.trim(),
    email: email.trim(),
    phone: phone || '',
    projectType: projectType || 'General Inquiry',
    date: date || '',
    budget: budget || '',
    message: message || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  saveInquiries(inquiries);
  console.log(`[INQUIRY RECEIVED] From: ${newInquiry.name} (${newInquiry.email}) - Type: ${newInquiry.projectType}`);

  res.status(201).json({
    success: true,
    message: 'Thank you! Your project inquiry has been received by Tech Shutter Hub. We will be in touch shortly.',
    data: newInquiry
  });
});

// 7. Get all inquiries (for admin review)
app.get('/api/inquiries', (req, res) => {
  const inquiries = getInquiries();
  res.json({ success: true, count: inquiries.length, data: inquiries });
});

// 8. Stats endpoint
app.get('/api/stats', (req, res) => {
  const projects = getProjects();
  const inquiries = getInquiries();
  const categories = [...new Set(projects.map(p => p.category))];
  res.json({
    success: true,
    totalProjects: projects.length,
    totalCategories: categories.length,
    totalInquiries: inquiries.length,
    categories
  });
});

// Fallback routing to index.html for SPA feel
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TECH SHUTTER HUB Immersive 3D Platform Live!`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
