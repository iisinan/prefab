/**
 * Prefab Technologies Limited - Main Core Engineering
 * Unified Logic for Homepage and Service Portals
 */

// --- 1. Preloader Strategy ---
const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
    }
};
window.addEventListener('load', () => setTimeout(hidePreloader, 1000));
setTimeout(hidePreloader, 8000); // Resilience Fallback

// --- 2. Scroll Progress Bar ---
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
});

// --- 3. Navigation Behavior ---
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// --- 4. Scroll Spy ---
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav-links a[href*=' + sectionId + ']');
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
});

// --- 5. Mobile Menu ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.replace('fa-xmark', 'fa-bars');
        });
    });
}

// --- 6. Smooth Scrolling for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// --- 7. Back to Top Button ---
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
});

// --- 8. Counter Animation with Intersection Observer ---
const counters = document.querySelectorAll('.counter');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.innerText = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCounter();
    });
}

if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    counterObserver.observe(counters[0].closest('.stats-section') || counters[0]);
}

// --- 9. Scroll Reveal Animations ---
const revealElements = document.querySelectorAll(
    '.service-card, .project-card, .leader-card, .process-step, .esg-card, .csr-card, .news-card, .highlight-card'
);
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    revealObserver.observe(el);
});

// --- 10. Project Filtering & Modal ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });
}

// --- 11. Project Detail Modal ---
const projectModal = document.getElementById('projectModal');
const projectDetailBtns = document.querySelectorAll('.project-detail-btn');
const projectData = {
    cng: {
        title: 'CNG Bus Transit Systems',
        image: 'assets/images/about_buses.png',
        description: 'Our flagship CNG bus transit program has transformed public transportation across multiple Nigerian states. By deploying modern, compressed natural gas-powered buses, we are reducing carbon emissions by over 40% compared to traditional diesel fleets.',
        timeline: 'Phase 1: 2024 | Phase 2: 2026',
        location: 'Kaduna, Abuja FCT, Lagos',
        scope: '150+ buses deployed across 3 states',
        highlights: [
            '40% reduction in carbon emissions',
            '25% reduction in operational costs',
            'Real-time GPS fleet tracking integration',
            'Automated fare collection systems',
            '500+ direct and indirect jobs created'
        ]
    },
    terminals: {
        title: 'Modern Intercity Terminals',
        image: 'assets/images/project_terminal.png',
        description: 'State-of-the-art intercity bus terminals designed with sustainability at their core. Each terminal features solar energy systems, smart ticketing, retail spaces, and climate-controlled waiting areas that serve as community infrastructure hubs.',
        timeline: 'Phase 1: 2025 | Phase 2: Ongoing',
        location: 'Kaduna, Kano, Abuja',
        scope: '15 terminals designed and under construction',
        highlights: [
            '100% Solar-powered terminal operations',
            'Smart ticketing and passenger tracking',
            'Integrated retail and commercial zones',
            'Green building certification compliant',
            'Accessible design for persons with disabilities'
        ]
    },
    ict: {
        title: 'Automated Fleet ICT Systems',
        image: 'assets/images/project_ict.png',
        description: 'A comprehensive ICT ecosystem that brings real-time intelligence to fleet management. Our cloud-based platform integrates GPS tracking, automated fare collection, predictive maintenance, and revenue analytics into a unified dashboard for transport operators.',
        timeline: 'Deployed: 2025 | Updates: Continuous',
        location: 'Nationwide (Cloud Infrastructure)',
        scope: 'Monitoring 200+ vehicles in real-time',
        highlights: [
            '24/7 real-time fleet monitoring',
            '99.9% system uptime guarantee',
            'Predictive maintenance algorithms',
            'Revenue leakage reduction by 30%',
            'Mobile companion app for passengers'
        ]
    }
};

if (projectModal && projectDetailBtns.length > 0) {
    projectDetailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectKey = btn.getAttribute('data-project');
            const data = projectData[projectKey];
            if (data) {
                const modalBody = document.getElementById('modalBody');
                modalBody.innerHTML = `
                    <img src="${data.image}" alt="${data.title}" class="modal-header-img">
                    <div class="modal-inner">
                        <h2>${data.title}</h2>
                        <div class="modal-grid">
                            <div>
                                <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-light); margin-bottom: 2rem;">${data.description}</p>
                                <h4 style="color: var(--primary-blue); margin-bottom: 1rem;">Key Achievements</h4>
                                <ul style="list-style: none; padding: 0;">
                                    ${data.highlights.map(h => `
                                        <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; color: var(--text-light);">
                                            <i class="fa-solid fa-circle-check" style="color: var(--primary-green); font-size: 1.1rem;"></i>
                                            ${h}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            <div class="modal-meta">
                                <h4>Project Details</h4>
                                <div style="margin-bottom: 1.5rem;">
                                    <p style="font-weight: 600; color: var(--primary-blue); margin-bottom: 4px;"><i class="fa-solid fa-calendar" style="margin-right: 8px;"></i>Timeline</p>
                                    <p style="color: var(--text-light);">${data.timeline}</p>
                                </div>
                                <div style="margin-bottom: 1.5rem;">
                                    <p style="font-weight: 600; color: var(--primary-blue); margin-bottom: 4px;"><i class="fa-solid fa-location-dot" style="margin-right: 8px;"></i>Location</p>
                                    <p style="color: var(--text-light);">${data.location}</p>
                                </div>
                                <div style="margin-bottom: 1.5rem;">
                                    <p style="font-weight: 600; color: var(--primary-blue); margin-bottom: 4px;"><i class="fa-solid fa-expand" style="margin-right: 8px;"></i>Scope</p>
                                    <p style="color: var(--text-light);">${data.scope}</p>
                                </div>
                                <a href="#contact" class="btn btn-primary" style="width: 100%; text-align: center; margin-top: 1rem;" onclick="document.getElementById('projectModal').style.display='none'; document.body.style.overflow='auto';">Start Consultation</a>
                            </div>
                        </div>
                    </div>
                `;
                projectModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close project modal
    const closeProjectModal = projectModal.querySelector('.close-modal');
    if (closeProjectModal) {
        closeProjectModal.addEventListener('click', () => {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// --- 12. Executive Bio Modal ---
const bioModal = document.getElementById('bioModal');
const leaderCards = document.querySelectorAll('.leader-card');
if (bioModal && leaderCards.length > 0) {
    leaderCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const name = card.querySelector('h3').innerText;
            const role = card.querySelector('h5').innerText;
            const img = card.querySelector('img').src;
            const bio = card.getAttribute('data-bio');
            document.getElementById('bioName').innerText = name;
            document.getElementById('bioRole').innerText = role;
            document.getElementById('bioText').innerText = bio;
            document.getElementById('bioImgContainer').innerHTML = `<img src="${img}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            bioModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    const closeBio = document.querySelector('.close-modal-bio');
    if (closeBio) {
        closeBio.onclick = () => {
            bioModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }
    bioModal.addEventListener('click', (e) => {
        if (e.target === bioModal) {
            bioModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// --- 13. Testimonial Slider ---
const testimonialItems = document.querySelectorAll('.testimonial-item');
const prevTestBtn = document.getElementById('prevTest');
const nextTestBtn = document.getElementById('nextTest');
const sliderDots = document.querySelectorAll('.slider-dots .dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
    testimonialItems.forEach((item, i) => {
        item.classList.remove('active');
        item.style.display = 'none';
    });
    if (sliderDots.length > 0) {
        sliderDots.forEach(d => d.classList.remove('active'));
    }
    
    currentTestimonial = (index + testimonialItems.length) % testimonialItems.length;
    testimonialItems[currentTestimonial].style.display = 'block';
    setTimeout(() => {
        testimonialItems[currentTestimonial].classList.add('active');
    }, 10);
    
    if (sliderDots[currentTestimonial]) {
        sliderDots[currentTestimonial].classList.add('active');
    }
}

if (testimonialItems.length > 1) {
    // Initialize - hide all except first
    testimonialItems.forEach((item, i) => {
        if (i !== 0) item.style.display = 'none';
    });

    if (nextTestBtn) {
        nextTestBtn.addEventListener('click', () => {
            showTestimonial(currentTestimonial + 1);
            resetAutoSlide();
        });
    }
    if (prevTestBtn) {
        prevTestBtn.addEventListener('click', () => {
            showTestimonial(currentTestimonial - 1);
            resetAutoSlide();
        });
    }
    
    // Dot navigation
    sliderDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showTestimonial(i);
            resetAutoSlide();
        });
    });

    // Auto-slide
    function startAutoSlide() {
        testimonialInterval = setInterval(() => {
            showTestimonial(currentTestimonial + 1);
        }, 5000);
    }
    function resetAutoSlide() {
        clearInterval(testimonialInterval);
        startAutoSlide();
    }
    startAutoSlide();
}

// --- 14. FAQ Accordion ---
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const parent = question.parentElement;
        const isActive = parent.classList.contains('active');
        
        // Close all others
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current
        if (!isActive) {
            parent.classList.add('active');
        }
    });
});

// --- 15. Digital Tech Canvas ---
const hero = document.getElementById('home');
if (hero) {
    const canvas = document.createElement('canvas');
    canvas.id = 'heroCanvas';
    hero.insertBefore(canvas, hero.firstChild);
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; };
    window.addEventListener('resize', resize);
    resize();
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.velX = (Math.random() - 0.5) * 0.5;
            this.velY = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.velX; this.y += this.velY;
            if (this.x < 0 || this.x > canvas.width) this.velX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.velY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(46, 204, 113, 0.4)';
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    for (let i = 0; i < 60; i++) particles.push(new Particle());
    
    // Draw connecting lines
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(46, 204, 113, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    };
    animate();
}

// --- 16. National Map Infobox ---
const mapContainer = document.querySelector('.map-container-svg');
const hotspots = document.querySelectorAll('.hotspot');
if (mapContainer && hotspots.length > 0) {
    const mapBox = document.createElement('div');
    mapBox.className = 'map-infobox';
    mapContainer.appendChild(mapBox);
    const cityData = {
        "Kaduna": { units: "120 Buses", tech: "Smart Ticketing", status: "Operational", projects: "3 Active" },
        "Abuja FCT": { units: "15 Terminals", tech: "EV Infrastructure", status: "Active", projects: "5 Active" },
        "Lagos": { units: "80 Units", tech: "Telematics", status: "Active", projects: "2 Active" },
        "Kano": { units: "Planning Phase", tech: "CNG Expansion", status: "Upcoming", projects: "1 Planned" },
        "Port Harcourt": { units: "Feasibility Stage", tech: "ICT Portal", status: "Planning", projects: "1 Planned" }
    };
    hotspots.forEach(spot => {
        spot.addEventListener('mouseenter', () => {
            const city = spot.getAttribute('data-city');
            const data = cityData[city] || { units: "Developing", tech: "ICT Portal", status: "Planning", projects: "TBD" };
            mapBox.innerHTML = `
                <h4>${city}</h4>
                <p>Units: <b>${data.units}</b></p>
                <p>Tech: <b>${data.tech}</b></p>
                <p>Status: <b style="color: ${data.status === 'Operational' || data.status === 'Active' ? 'var(--primary-green)' : '#f39c12'}">${data.status}</b></p>
            `;
            mapBox.style.display = 'block';
            const rect = spot.getBoundingClientRect();
            const pRect = mapContainer.getBoundingClientRect();
            mapBox.style.left = (rect.left - pRect.left + 25) + 'px';
            mapBox.style.top = (rect.top - pRect.top - 20) + 'px';
        });
        spot.addEventListener('mouseleave', () => { mapBox.style.display = 'none'; });
    });
}

// --- 17. Theme Toggle ---
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDark ? 'enabled' : 'disabled');
        themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
}

// --- 18. Lightbox ---
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `<span class="close-lightbox">&times;</span><img class="lightbox-img" src="" alt="Enlarged View">`;
document.body.appendChild(lightbox);
document.querySelectorAll('.about-image img, .project-img img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        lightbox.querySelector('img').src = img.src;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});
lightbox.onclick = () => { lightbox.style.display = 'none'; document.body.style.overflow = 'auto'; };

// --- 19. Auto-Year ---
const ySpan = document.getElementById('copyrightYear');
if (ySpan) ySpan.innerText = new Date().getFullYear();

// --- 20. FAQ Search ---
const fInput = document.getElementById('faqSearch');
if (fInput) {
    fInput.addEventListener('input', (e) => {
        const t = e.target.value.toLowerCase();
        document.querySelectorAll('.faq-item').forEach(item => {
            item.style.display = item.innerText.toLowerCase().includes(t) ? 'block' : 'none';
        });
    });
}

// --- 21. Contact Form Handler ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending Message...';
        btn.style.opacity = '0.7';
        btn.disabled = true;

        setTimeout(() => {
            const formSuccess = document.getElementById('formSuccess');
            if (formSuccess) {
                formSuccess.style.display = 'block';
                formSuccess.style.animation = 'fadeInDown 0.5s ease-out';
            }
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
            btn.style.backgroundColor = 'var(--primary-green)';
            contactForm.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.style.backgroundColor = '';
                btn.disabled = false;
                if (formSuccess) {
                    setTimeout(() => { formSuccess.style.display = 'none'; }, 3000);
                }
            }, 2500);
        }, 1500);
    });
}

// --- 22. Newsletter Form ---
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const input = this.querySelector('input');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.style.backgroundColor = '#27ae60';
        input.value = '';
        input.placeholder = 'Subscribed successfully!';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
            input.placeholder = 'Your Email Address';
        }, 3000);
    });
}

// --- 23. Live Carbon Counter Animation ---
const carbonCounter = document.getElementById('liveCarbonValue');
if (carbonCounter) {
    let carbonValue = 4529.345;
    setInterval(() => {
        carbonValue += (Math.random() * 0.05 + 0.01);
        carbonCounter.innerText = carbonValue.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }, 3000);
}

// --- 24. Dynamic News Injection from Admin ---
function injectCustomNews() {
    const customNews = JSON.parse(localStorage.getItem('customNews'));
    const newsGrid = document.querySelector('.news-grid');
    if (customNews && newsGrid) {
        customNews.forEach(article => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-img" style="background-image: url('assets/images/hero_bg.png');"></div>
                <div class="news-content">
                    <div class="news-date">${article.date}</div>
                    <h3>${article.title}</h3>
                    <p>${article.desc}</p>
                    <a href="news.html" class="btn-text">Read More</a>
                </div>
            `;
            newsGrid.prepend(card);
        });
    }
}
document.addEventListener('DOMContentLoaded', injectCustomNews);

// --- 25. Keyboard Accessibility - ESC closes modals ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        if (lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

// --- 26. Typed Hero Text Effect ---
const heroTitle = document.getElementById('heroTitleDisplay');
if (heroTitle) {
    const phrases = [
        'Where Innovation Meets Technology',
        'Building Sustainability for Tomorrow',
        'Powering Nigeria\'s Green Future'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            heroTitle.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            heroTitle.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing after a short delay
    setTimeout(typeEffect, 2500);
}
// --- 28. Parallax Effect for Hero ---
window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        let scrollValue = window.scrollY;
        heroContent.style.transform = `translateY(${scrollValue * 0.4}px)`;
        heroContent.style.opacity = 1 - (scrollValue / 600);
    }
});
// --- 29. Admin Persistence Layer ---
const applyAdminSettings = () => {
    // 1. Hero Settings
    const heroData = JSON.parse(localStorage.getItem('heroForm'));
    const heroTitle = document.getElementById('heroTitleDisplay');
    const heroDesc = document.getElementById('heroDescDisplay');
    const heroSection = document.getElementById('home');
    const customHeroBg = localStorage.getItem('hero_bg_custom');

    if (heroData) {
        if (heroTitle && heroData.heroTitle) heroTitle.innerText = heroData.heroTitle;
        if (heroDesc && heroData.heroDesc) heroDesc.innerText = heroData.heroDesc;
    }
    if (heroSection && customHeroBg) {
        heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${customHeroBg})`;
    }

    // 2. Vision & Values
    const visionData = JSON.parse(localStorage.getItem('visionForm'));
    if (visionData) {
        const missionEl = document.querySelector('.highlight-card:nth-child(1) p');
        const visionEl = document.querySelector('.highlight-card:nth-child(2) p');
        const valuesEl = document.querySelector('.highlight-card:nth-child(3) p');
        if (missionEl && visionData.mission) missionEl.innerText = visionData.mission;
        if (visionEl && visionData.vision) visionEl.innerText = visionData.vision;
        if (valuesEl && visionData.values) valuesEl.innerText = visionData.values;
    }

    // 3. About Us
    const aboutData = JSON.parse(localStorage.getItem('aboutForm'));
    if (aboutData) {
        const aboutH3 = document.querySelector('.about-text h3');
        const aboutP = document.querySelector('.about-text p');
        if (aboutH3 && aboutData.aboutHeading) aboutH3.innerText = aboutData.aboutHeading;
        if (aboutP && aboutData.aboutText) aboutP.innerText = aboutData.aboutText;
    }

    // 4. Services
    const customServices = JSON.parse(localStorage.getItem('customServices')) || [];
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid && customServices.length > 0) {
        customServices.forEach(s => {
            const card = document.createElement('div');
            card.className = 'service-card revealed';
            card.innerHTML = `
                <div class="service-icon"><i class="${s.icon}"></i></div>
                <h3>${s.title}</h3>
                <p>${s.desc}</p>
                <a href="#" class="btn-text">Explore Solutions <i class="fa-solid fa-arrow-right"></i></a>
            `;
            servicesGrid.prepend(card);
        });
    }

    // 5. Strategic Process
    const customProcess = JSON.parse(localStorage.getItem('customProcess')) || [];
    const processGrid = document.querySelector('.process-grid');
    if (processGrid && customProcess.length > 0) {
        customProcess.forEach(p => {
            const step = document.createElement('div');
            step.className = 'process-step revealed';
            step.innerHTML = `
                <div class="step-num">${p.num}</div>
                <div class="step-content">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                </div>
            `;
            processGrid.appendChild(step);
        });
    }

    // 6. Projects & Achievements
    const customProjectsArr = JSON.parse(localStorage.getItem('customProjects')) || [];
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid && customProjectsArr.length > 0) {
        customProjectsArr.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card revealed';
            card.setAttribute('data-category', p.category);
            card.innerHTML = `
                <div class="project-img">
                    <img src="${p.image || 'assets/images/about_buses.png'}" alt="${p.title}">
                </div>
                <div class="project-content">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">View Details</button>
                </div>
            `;
            projectsGrid.prepend(card);
        });
    }

    // 7. Leadership
    const customLeaders = JSON.parse(localStorage.getItem('customLeaders')) || [];
    const leaderGrid = document.querySelector('.leadership-grid');
    if (leaderGrid && customLeaders.length > 0) {
        customLeaders.forEach(l => {
            const card = document.createElement('div');
            card.className = 'leader-card revealed';
            card.setAttribute('data-bio', l.bio);
            card.innerHTML = `
                <div class="leader-img">
                    <img src="${l.image || 'https://ui-avatars.com/api/?name='+encodeURIComponent(l.name)}" alt="${l.name}">
                </div>
                <h3>${l.name}</h3>
                <h5>${l.role}</h5>
            `;
            leaderGrid.appendChild(card);
        });
    }

    // 8. Testimonials
    const customTestimonials = JSON.parse(localStorage.getItem('customTestimonials')) || [];
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider && customTestimonials.length > 0) {
        customTestimonials.forEach(t => {
            const item = document.createElement('div');
            item.className = 'testimonial-item';
            item.innerHTML = `
                <p>"${t.text}"</p>
                <div class="testimonial-author">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}" alt="${t.name}">
                    <div>
                        <h4>${t.name}</h4>
                        <span>${t.org}</span>
                    </div>
                </div>
            `;
            testimonialSlider.insertBefore(item, testimonialSlider.querySelector('.slider-dots'));
        });
    }

    // 9. Strategic Alliances
    const customAlliances = JSON.parse(localStorage.getItem('customAlliances')) || [];
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent && customAlliances.length > 0) {
        customAlliances.forEach(a => {
            const logo = document.createElement('div');
            logo.className = 'partner-logo';
            logo.innerHTML = `<img src="${a.image}" style="height:40px; filter:grayscale(1); opacity:0.7;"> <span>${a.name}</span>`;
            marqueeContent.appendChild(logo);
        });
    }

    // 10. News & Insight
    const customNewsRecords = JSON.parse(localStorage.getItem('customNews')) || [];
    const newsGrid = document.querySelector('.news-grid');
    if (newsGrid && customNewsRecords.length > 0) {
        customNewsRecords.forEach(n => {
            const card = document.createElement('div');
            card.className = 'news-card revealed';
            card.innerHTML = `
                <div class="news-content">
                    <div class="news-date">${n.date || 'LATEST'}</div>
                    <h3>${n.title}</h3>
                    <p>${n.desc}</p>
                    <a href="#" class="btn-text">Read More</a>
                </div>
            `;
            newsGrid.prepend(card);
        });
    }

    // 11. FAQ
    const customFAQ = JSON.parse(localStorage.getItem('customFAQ')) || [];
    const faqAccordion = document.querySelector('.faq-accordion');
    if (faqAccordion && customFAQ.length > 0) {
        customFAQ.forEach(f => {
            const item = document.createElement('div');
            item.className = 'faq-item';
            item.innerHTML = `
                <div class="faq-question">
                    <h3>${f.question}</h3>
                    <i class="fa-solid fa-plus"></i>
                </div>
                <div class="faq-answer">
                    <p>${f.answer}</p>
                </div>
            `;
            faqAccordion.appendChild(item);
        });
    }

    // Stats
    const statsData = JSON.parse(localStorage.getItem('statsForm'));
    if (statsData) {
        const targets = { 'countBuses': statsData.stat1, 'countProjects': statsData.stat2, 'countStates': statsData.stat3, 'countCarbon': statsData.stat4 };
        Object.entries(targets).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && val) el.setAttribute('data-target', val);
        });
    }
};

window.addEventListener('DOMContentLoaded', applyAdminSettings);
