/**
 * TaskFlow - Main Application
 * Version: 1.0.0
 */

'use strict';

const App = (() => {
    'use strict';

    // DOM Cache
    const DOM = {
        header: document.getElementById('header'),
        navToggle: document.getElementById('navToggle'),
        navMenu: document.getElementById('navMenu'),
        navLinks: document.querySelectorAll('.nav-links a'),
        themeToggle: document.getElementById('themeToggle'),
        scrollTop: document.getElementById('scrollTop'),
        featuresGrid: document.getElementById('featuresGrid'),
        blogGrid: document.getElementById('blogGrid'),
        contactForm: document.getElementById('contactForm'),
        formSuccess: document.getElementById('formSuccess'),
        submitBtn: document.getElementById('submitBtn'),
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message'),
        nameError: document.getElementById('nameError'),
        emailError: document.getElementById('emailError'),
        subjectError: document.getElementById('subjectError'),
        messageError: document.getElementById('messageError'),
    };

    // State
    const state = {
        isDarkMode: localStorage.getItem('theme') === 'dark',
        isMenuOpen: false,
        isScrolled: false,
        features: [
            {
                icon: 'fa-tasks',
                title: 'Task Management',
                description: 'Organize and prioritize tasks with intuitive drag-and-drop boards and powerful filtering capabilities.'
            },
            {
                icon: 'fa-users',
                title: 'Team Collaboration',
                description: 'Work together seamlessly with real-time updates, comments, and shared project views.'
            },
            {
                icon: 'fa-chart-line',
                title: 'Analytics & Insights',
                description: 'Track team performance with comprehensive dashboards and actionable productivity metrics.'
            },
            {
                icon: 'fa-cloud-upload-alt',
                title: 'Cloud Sync',
                description: 'Access your tasks anywhere with automatic cloud sync across all your devices.'
            },
            {
                icon: 'fa-bell',
                title: 'Smart Notifications',
                description: 'Stay informed with intelligent notifications that prioritize what matters most.'
            },
            {
                icon: 'fa-lock',
                title: 'Enterprise Security',
                description: 'Bank-grade encryption and security features to protect your sensitive business data.'
            }
        ],
        // Blog images from Unsplash
        blogImages: [
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1488590528505-98d2b853aba4?w=400&h=250&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop&crop=center'
        ]
    };

    // Utilities
    const utils = {
        debounce: (fn, delay = 250) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn(...args), delay);
            };
        },

        escapeHTML: (str) => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        truncateText: (text, maxLength = 120) => {
            if (text.length <= maxLength) return text;
            return text.slice(0, maxLength) + '...';
        },

        formatDate: (dateString) => {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(date);
        },

        getBlogImage: (index) => {
            const images = state.blogImages;
            return images[index % images.length];
        }
    };

    // Theme Module
    const Theme = {
        init() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                state.isDarkMode = true;
                document.documentElement.setAttribute('data-theme', 'dark');
                this.updateUI(true);
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                this.updateUI(false);
            }
        },

        toggle() {
            state.isDarkMode = !state.isDarkMode;
            const theme = state.isDarkMode ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            this.updateUI(state.isDarkMode);
            this.updateMetaTheme();
        },

        updateUI(isDark) {
            const icon = DOM.themeToggle?.querySelector('i');
            const text = DOM.themeToggle?.querySelector('.theme-text');
            if (icon && text) {
                if (isDark) {
                    icon.className = 'fas fa-sun';
                    text.textContent = 'Light';
                } else {
                    icon.className = 'fas fa-moon';
                    text.textContent = 'Dark';
                }
            }
        },

        updateMetaTheme() {
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = state.isDarkMode ? '#111827' : '#6366f1';
            }
        }
    };

    // Navigation Module
    const Navigation = {
        init() {
            if (DOM.navToggle) {
                DOM.navToggle.addEventListener('click', this.toggleMenu.bind(this));
            }

            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.closeMenu();
                    }
                });
            });

            document.addEventListener('click', (e) => {
                const isClickInside = DOM.navMenu?.contains(e.target) || 
                                     DOM.navToggle?.contains(e.target);
                if (!isClickInside && state.isMenuOpen) {
                    this.closeMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.isMenuOpen) {
                    this.closeMenu();
                    DOM.navToggle?.focus();
                }
            });

            window.addEventListener('scroll', utils.debounce(this.handleScroll.bind(this), 100));
            this.handleScroll();
            window.addEventListener('scroll', utils.debounce(this.updateActiveLink.bind(this), 150));
        },

        toggleMenu() {
            state.isMenuOpen = !state.isMenuOpen;
            DOM.navToggle?.classList.toggle('active');
            DOM.navMenu?.classList.toggle('active');
            DOM.navToggle?.setAttribute('aria-expanded', state.isMenuOpen);
            document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
        },

        closeMenu() {
            state.isMenuOpen = false;
            DOM.navToggle?.classList.remove('active');
            DOM.navMenu?.classList.remove('active');
            DOM.navToggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        },

        handleScroll() {
            const scrollY = window.scrollY;
            state.isScrolled = scrollY > 50;
            DOM.header?.classList.toggle('scrolled', state.isScrolled);
            DOM.scrollTop?.classList.toggle('visible', scrollY > 400);
        },

        updateActiveLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollY = window.scrollY + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');

                DOM.navLinks.forEach(link => {
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === `#${id}` && 
                        scrollY >= top && scrollY < bottom) {
                        link.setAttribute('aria-current', 'page');
                    }
                });
            });
        }
    };

    // Features Module
    const Features = {
        render() {
            if (!DOM.featuresGrid) return;

            const html = state.features.map((feature) => `
                <article class="feature-card" role="article" aria-label="${feature.title}">
                    <div class="feature-icon" aria-hidden="true">
                        <i class="fas ${feature.icon}"></i>
                    </div>
                    <h3>${utils.escapeHTML(feature.title)}</h3>
                    <p>${utils.escapeHTML(feature.description)}</p>
                </article>
            `).join('');

            DOM.featuresGrid.innerHTML = html;
        }
    };

    // Blog Module with Images
    const Blog = {
        async loadPosts() {
            if (!DOM.blogGrid) return;
            this.showLoading();

            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const posts = await response.json();
                this.renderPosts(posts);
            } catch (error) {
                console.error('Blog load error:', error);
                this.showError('Unable to load posts. Please try again.');
            }
        },

        showLoading() {
            DOM.blogGrid.innerHTML = `
                <div class="loading-state" role="status" aria-live="polite">
                    <div class="loading-spinner" aria-hidden="true"></div>
                    <p>Loading articles...</p>
                </div>
            `;
        },

        showError(message) {
            DOM.blogGrid.innerHTML = `
                <div class="error-state" role="alert" aria-live="assertive">
                    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                    <h3>Failed to Load Posts</h3>
                    <p>${utils.escapeHTML(message)}</p>
                    <button class="btn btn-outline btn-sm" onclick="App.retryLoadPosts()" style="margin-top: 1rem;">
                        <i class="fas fa-sync" aria-hidden="true"></i>
                        Try Again
                    </button>
                </div>
            `;
        },

        renderPosts(posts) {
            const html = posts.map((post, index) => {
                const imageUrl = utils.getBlogImage(index);
                return `
                    <article class="blog-card" role="listitem">
                        <div class="blog-image">
                            <img 
                                src="${imageUrl}" 
                                alt="${utils.escapeHTML(utils.truncateText(post.title, 60))}"
                                loading="lazy"
                                width="400"
                                height="250"
                                onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22250%22><rect width=%22400%22 height=%22250%22 fill=%22%236366f1%22 opacity=%220.1%22/><text x=%22200%22 y=%22125%22 text-anchor=%22middle%22 font-family=%22Inter%22 font-size=%2220%22 fill=%22%23636f1%22>📸</text></svg>'"
                            />
                            <span class="blog-category">Productivity</span>
                        </div>
                        <div class="blog-content">
                            <h3>${utils.escapeHTML(utils.truncateText(post.title, 60))}</h3>
                            <p>${utils.escapeHTML(utils.truncateText(post.body, 120))}</p>
                            <div class="blog-meta">
                                <span>
                                    <i class="fas fa-user-circle" aria-hidden="true"></i>
                                    Admin
                                </span>
                                <span>
                                    <i class="far fa-calendar-alt" aria-hidden="true"></i>
                                    ${utils.formatDate(new Date().toISOString())}
                                </span>
                            </div>
                            <a href="#" class="blog-read-more">
                                Read More <i class="fas fa-arrow-right" aria-hidden="true"></i>
                            </a>
                        </div>
                    </article>
                `;
            }).join('');
            
            DOM.blogGrid.innerHTML = html;
        },

        retry() {
            this.loadPosts();
        }
    };

    // Form Module
    const Form = {
        init() {
            if (!DOM.contactForm) return;

            DOM.name?.addEventListener('blur', () => this.validateField('name'));
            DOM.email?.addEventListener('blur', () => this.validateField('email'));
            DOM.subject?.addEventListener('blur', () => this.validateField('subject'));
            DOM.message?.addEventListener('blur', () => this.validateField('message'));

            DOM.name?.addEventListener('input', () => this.clearError('name'));
            DOM.email?.addEventListener('input', () => this.clearError('email'));
            DOM.subject?.addEventListener('input', () => this.clearError('subject'));
            DOM.message?.addEventListener('input', () => this.clearError('message'));

            DOM.contactForm.addEventListener('submit', this.handleSubmit.bind(this));
        },

        validateField(fieldName) {
            const field = DOM[fieldName];
            const errorEl = DOM[`${fieldName}Error`];
            if (!field || !errorEl) return true;

            const value = field.value.trim();
            let isValid = true;
            let message = '';

            switch (fieldName) {
                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        message = 'Please enter your full name (minimum 2 characters)';
                    } else if (value.length > 100) {
                        isValid = false;
                        message = 'Name is too long (maximum 100 characters)';
                    }
                    break;

                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        message = 'Please enter a valid email address';
                    }
                    break;

                case 'subject':
                    if (value.length < 3) {
                        isValid = false;
                        message = 'Please enter a subject (minimum 3 characters)';
                    } else if (value.length > 200) {
                        isValid = false;
                        message = 'Subject is too long (maximum 200 characters)';
                    }
                    break;

                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        message = 'Please enter a message (minimum 10 characters)';
                    } else if (value.length > 1000) {
                        isValid = false;
                        message = 'Message is too long (maximum 1000 characters)';
                    }
                    break;
            }

            if (!isValid) {
                field.classList.add('error');
                field.setAttribute('aria-invalid', 'true');
                errorEl.textContent = message;
                errorEl.setAttribute('role', 'alert');
            } else {
                this.clearError(fieldName);
            }

            return isValid;
        },

        clearError(fieldName) {
            const field = DOM[fieldName];
            const errorEl = DOM[`${fieldName}Error`];
            if (field) {
                field.classList.remove('error');
                field.removeAttribute('aria-invalid');
            }
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.removeAttribute('role');
            }
        },

        validateAll() {
            const fields = ['name', 'email', 'subject', 'message'];
            let allValid = true;
            fields.forEach(field => {
                if (!this.validateField(field)) {
                    allValid = false;
                }
            });
            return allValid;
        },

        handleSubmit(e) {
            e.preventDefault();

            DOM.formSuccess?.classList.remove('show');
            if (DOM.formSuccess) DOM.formSuccess.textContent = '';

            if (!this.validateAll()) {
                const firstInvalid = DOM.contactForm?.querySelector('.error');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }

            const btn = DOM.submitBtn;
            if (!btn) return;

            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';

            setTimeout(() => {
                if (DOM.contactForm) DOM.contactForm.reset();
                
                if (DOM.formSuccess) {
                    DOM.formSuccess.textContent = '✅ Thank you! Your message has been sent successfully.';
                    DOM.formSuccess.classList.add('show');
                }

                btn.disabled = false;
                btn.innerHTML = originalText;

                ['name', 'email', 'subject', 'message'].forEach(field => {
                    this.clearError(field);
                });

                if (DOM.formSuccess) {
                    DOM.formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1500);
        }
    };

    // Scroll to Top Module
    const ScrollTop = {
        init() {
            if (!DOM.scrollTop) return;

            DOM.scrollTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            DOM.scrollTop.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    };

    // Observer Module
    const Observer = {
        init() {
            if (!('IntersectionObserver' in window)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.feature-card, .pricing-card, .blog-card')
                .forEach(el => observer.observe(el));
        }
    };

    // Theme Toggle Event Listener
    function setupThemeToggle() {
        if (DOM.themeToggle) {
            DOM.themeToggle.addEventListener('click', () => {
                Theme.toggle();
            });
        }
    }

    // Initialization
    function init() {
        Theme.init();
        setupThemeToggle();
        Navigation.init();
        Features.render();
        Blog.loadPosts();
        Form.init();
        ScrollTop.init();
        Observer.init();

        console.log('✅ TaskFlow initialized successfully');
        console.log(`📊 ${state.features.length} features loaded`);
        console.log(`🎨 Theme: ${state.isDarkMode ? 'Dark' : 'Light'}`);
        console.log('💡 Click the moon/sun icon to toggle dark mode');
    }

    return {
        init,
        retryLoadPosts: () => Blog.retry(),
        version: '1.0.0'
    };

})();

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Expose for inline handlers
window.App = App;