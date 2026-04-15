document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link[data-panel]');
    const panels = document.querySelectorAll('.panel');
    const panelTitle = document.getElementById('panelTitle');
    const panelDescription = document.getElementById('panelDesc');

    const panelMeta = {
        overview: { title: 'Dashboard Overview', desc: 'Welcome back, Admin. Here\'s what\'s happening today.' },
        hero: { title: 'Hero Section Settings', desc: 'Update the main headline, description and background image.' },
        vision: { title: 'Mission & Vision', desc: 'Define your corporate core purpose and values.' },
        about: { title: 'About Prefab Tech', desc: 'Manage the company description and main about image.' },
        services: { title: 'Service Offerings', desc: 'List and manage the specialized services provided.' },
        process: { title: 'Strategic Process', desc: 'Manage the methodology steps shown on the homepage.' },
        projects: { title: 'Project Portfolio', desc: 'Showcase your latest achievements and modern infrastructure projects.' },
        leadership: { title: 'Executive Team', desc: 'Manage profiles for your executive leadership board.' },
        testimonials: { title: 'Client Feedback', desc: 'Manage trust signals and corporate validations.' },
        alliances: { title: 'Strategic Alliances', desc: 'Manage partner logos and corporate relationships.' },
        newsPanel: { title: 'News & Insights', desc: 'Publish and manage the latest insights from Prefab Technologies.' },
        faq: { title: 'FAQ Management', desc: 'Control the frequently asked questions center.' },
        stats: { title: 'Live Statistics', desc: 'Update the counters that display your company impact.' },
        preview: { title: 'Website Snapshot', desc: 'Visualize the impact of your updates.' }
    };

    // --- Panel Switching Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPanel = link.getAttribute('data-panel');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            panels.forEach(p => p.classList.remove('active'));
            const activePanel = document.getElementById(targetPanel);
            if (activePanel) {
                activePanel.classList.add('active');
                if (panelMeta[targetPanel]) {
                    panelTitle.innerText = panelMeta[targetPanel].title;
                    panelDescription.innerText = panelMeta[targetPanel].desc;
                }
            }
            if (window.innerWidth <= 1024) document.getElementById('sidebar').classList.remove('open');
        });
    });

    // --- Toast Notification System ---
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMessage');
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.className = 'toast' + (type === 'error' ? ' error' : '') + ' show';
        const icon = toast.querySelector('i');
        if (icon) icon.className = type === 'error' ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check';
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // --- Image Preview & Base64 Logic ---
    function setupImageUpload(inputId, previewId, storageKey) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (!input || !preview) return;

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    preview.querySelector('img').src = base64;
                    localStorage.setItem(storageKey, base64);
                    showToast('Image uploaded successfully!');
                };
                reader.readAsDataURL(file);
            }
        });

        // Load saved
        const saved = localStorage.getItem(storageKey);
        if (saved) preview.querySelector('img').src = saved;
    }

    setupImageUpload('heroImageInput', 'heroImagePreview', 'hero_bg_custom');

    // --- CRUD Helper Function ---
    function renderCRUD(storageKey, containerId, templateFn) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const items = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        if (items.length === 0) {
            container.innerHTML = '<p style="color:var(--admin-text-light); padding:1rem;">No items found. Add your first one below.</p>';
            return;
        }

        container.innerHTML = '';
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'admin-list-card';
            div.innerHTML = `
                <div class="admin-card-info">
                    ${templateFn(item)}
                </div>
                <div class="admin-card-actions">
                    <button class="btn-admin-action btn-admin-edit" data-index="${index}" title="Edit Item">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn-admin-action btn-admin-delete" data-index="${index}" title="Delete Item">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(div);
        });

        // Edit Logic
        container.querySelectorAll('.btn-admin-edit').forEach(btn => {
            btn.onclick = () => {
                const idx = btn.getAttribute('data-index');
                const item = items[idx];
                const panel = container.closest('.panel');
                const form = panel.querySelector('form');
                
                // Populate form
                Object.entries(item).forEach(([key, val]) => {
                    const el = form.querySelector(`[name="${key}"]`);
                    if (el && el.type !== 'file') el.value = val;
                });
                
                // Set edit state
                form.setAttribute('data-edit-index', idx);
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';
                submitBtn.style.background = '#f39c12';
                
                form.scrollIntoView({ behavior: 'smooth' });
                showToast('Editing: ' + (item.title || item.name || 'selected item'));
            };
        });

        // Delete Logic
        container.querySelectorAll('.btn-admin-delete').forEach(btn => {
            btn.onclick = () => {
                if (confirm('Are you sure you want to delete this item?')) {
                    const idx = btn.getAttribute('data-index');
                    const currentItems = JSON.parse(localStorage.getItem(storageKey)) || [];
                    currentItems.splice(idx, 1);
                    localStorage.setItem(storageKey, JSON.stringify(currentItems));
                    renderAllCRUDs();
                    showToast('Item deleted.');
                }
            };
        });
    }

    function renderAllCRUDs() {
        renderCRUD('customServices', 'servicesList', item => `
            <div class="activity-icon"><i class="${item.icon}"></i></div>
            <div><p><strong>${item.title}</strong></p><small>${item.desc.substring(0, 50)}...</small></div>
        `);
        renderCRUD('customProcess', 'processList', item => `
            <div class="activity-icon">${item.num}</div>
            <div><p><strong>${item.title}</strong></p><small>${item.desc.substring(0, 50)}...</small></div>
        `);
        renderCRUD('customProjects', 'projectsList', item => `
            <div class="activity-icon"><i class="fa-solid fa-building"></i></div>
            <div><p><strong>${item.title}</strong></p><small>${item.category} | ${item.desc.substring(0, 50)}...</small></div>
        `);
        renderCRUD('customLeaders', 'leaderList', item => `
            <img src="${item.image || 'https://ui-avatars.com/api/?name='+encodeURIComponent(item.name)}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
            <div><p><strong>${item.name}</strong></p><small>${item.role}</small></div>
        `);
        renderCRUD('customTestimonials', 'testimonialList', item => `
            <div class="activity-icon"><i class="fa-solid fa-quote-left"></i></div>
            <div><p><strong>${item.name}</strong> (${item.org})</p><small>${item.text.substring(0, 50)}...</small></div>
        `);
        renderCRUD('customAlliances', 'allianceList', item => `
            <img src="${item.image || ''}" style="width:60px; height:30px; object-fit:contain; background:#eee; border-radius:4px;">
            <div><p><strong>${item.name}</strong></p></div>
        `);
        renderCRUD('customNews', 'newsList', item => `
            <div class="activity-icon"><i class="fa-solid fa-newspaper"></i></div>
            <div><p><strong>${item.title}</strong></p><small>${item.date}</small></div>
        `);
        renderCRUD('customFAQ', 'faqList', item => `
            <div class="activity-icon"><i class="fa-solid fa-question"></i></div>
            <div><p><strong>${item.question}</strong></p><small>${item.answer.substring(0, 50)}...</small></div>
        `);
    }

    // --- Form Handling ---
    async function setupForm(formId, storageKey, isList = false, fileInputName = null) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.getAttribute('data-original-text') || btn.innerHTML;
            if (!btn.getAttribute('data-original-text')) btn.setAttribute('data-original-text', originalText);
            
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            btn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const editIndex = form.getAttribute('data-edit-index');

            // Handle file upload within list items
            if (fileInputName && formData.get(fileInputName) && formData.get(fileInputName).size > 0) {
                const file = formData.get(fileInputName);
                data[fileInputName] = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            } else if (fileInputName && editIndex !== null) {
                // If editing, preserve old image if new one not provided
                const items = JSON.parse(localStorage.getItem(storageKey)) || [];
                if (items[editIndex]) data[fileInputName] = items[editIndex][fileInputName];
            } else if (fileInputName) {
                delete data[fileInputName];
            }

            if (isList) {
                const items = JSON.parse(localStorage.getItem(storageKey)) || [];
                if (editIndex !== null) {
                    items[editIndex] = data;
                    form.removeAttribute('data-edit-index');
                } else {
                    items.push(data);
                }
                localStorage.setItem(storageKey, JSON.stringify(items));
            } else {
                localStorage.setItem(storageKey, JSON.stringify(data));
            }

            setTimeout(() => {
                showToast(editIndex !== null ? 'Item updated successfully!' : 'Changes published successfully!');
                btn.innerHTML = originalText;
                btn.style.background = ''; // reset color if it was changed
                btn.disabled = false;
                if (isList) {
                    form.reset();
                    renderAllCRUDs();
                }
            }, 800);
        };

        // Load non-list forms
        if (!isList) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    Object.entries(data).forEach(([key, val]) => {
                        const el = form.querySelector(`[name="${key}"]`);
                        if (el && el.type !== 'file') el.value = val;
                    });
                } catch(e){}
            }
        }
    }

    setupForm('heroForm', 'heroForm');
    setupForm('visionForm', 'visionForm');
    setupForm('aboutForm', 'aboutForm');
    setupForm('statsForm', 'statsForm');
    
    setupForm('serviceAddForm', 'customServices', true);
    setupForm('processAddForm', 'customProcess', true);
    setupForm('projectAddForm', 'customProjects', true, 'image');
    setupForm('leaderAddForm', 'customLeaders', true, 'image');
    setupForm('testimonialAddForm', 'customTestimonials', true);
    setupForm('allianceAddForm', 'customAlliances', true, 'image');
    setupForm('newsAddForm', 'customNews', true);
    setupForm('faqAddForm', 'customFAQ', true);

    renderAllCRUDs();

    // --- Dashboard Chart ---
    const ctx = document.getElementById('growthChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Infrastructure Projects',
                    data: [12, 19, 15, 25, 22, 30],
                    borderColor: '#0056b3',
                    backgroundColor: 'rgba(0, 86, 179, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: true
                }]
            },
            options: { responsive: true }
        });
    }

    // --- Mobile Sidebar ---
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.onclick = () => sidebar.classList.toggle('open');
    }

    // --- Live Preview Logic ---
    const previewContainer = document.getElementById('iframeContainer');
    if (previewContainer) {
        const iframe = document.createElement('iframe');
        iframe.src = 'index.html';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = '1px solid var(--admin-border)';
        iframe.style.borderRadius = '12px';
        previewContainer.appendChild(iframe);
    }

    const deviceBtns = document.querySelectorAll('.device-btn');
    if (deviceBtns && previewContainer) {
        deviceBtns.forEach(btn => {
            btn.onclick = () => {
                const width = btn.getAttribute('data-width');
                previewContainer.style.width = width;
                deviceBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
        });
    }
});
