
'use strict';

// ============================================
// Application Module
// ============================================
const App = (() => {
    'use strict';

    // ============================================
    // DOM Cache
    // ============================================
    const DOM = {
        // Navigation
        header: document.getElementById('header'),
        navToggle: document.getElementById('navToggle'),
        navMenu: document.getElementById('navMenu'),
        navLinks: document.querySelectorAll('.nav-links a'),
        
        // Theme
        themeToggle: document.getElementById('themeToggle'),
        
        // Scroll
        scrollTop: document.getElementById('scrollTop'),
        
        // Sections
        featuresGrid: document.getElementById('featuresGrid'),
        blogGrid: document.getElementById('blogGrid'),
        
        // Form
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

    // ============================================
    // State
    // ============================================
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
        ]
    };

    // ============================================
    // Utilities
    // ============================================
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
        }
    };

    // ============================================
    // Theme Module
    // ============================================
    const Theme = {
        init() {
            if (state.isDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                this.updateUI(true);
            }
        },

        toggle() {
            state.isDarkMode = !state.isDarkMode;
            document.documentElement.setAttribute(
                'data-theme',
                state.isDarkMode ? 'dark' : 'light'
            );
            localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
            this.updateUI(state.isDarkMode);
            this.updateMetaTheme();
        },

        updateUI(isDark) {
            const icon = DOM.themeToggle?.querySelector('i');
            const text = DOM.themeToggle?.querySelector('.theme-text');
            if (icon && text) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
                text.textContent = isDark ? 'Light' : 'Dark';
            }
        },

        updateMetaTheme() {
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = state.isDarkMode ? '#111827' : '#6366f1';
            }
        }
    };

    // ============================================
    // Navigation Module
    // ============================================
    const Navigation = {
        init() {
            // Mobile menu toggle
            DOM.navToggle?.addEventListener('click', this.toggleMenu.bind(this));

            // Close menu on link click
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.closeMenu();
                    }
                });
            });

            // Close menu on outside click
            document.addEventListener('click', (e) => {
                const isClickInside = DOM.navMenu?.contains(e.target) || 
                                     DOM.navToggle?.contains(e.target);
                if (!isClickInside && state.isMenuOpen) {
                    this.closeMenu();
                }
            });

            // Close menu on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.isMenuOpen) {
                    this.closeMenu();
                    DOM.navToggle?.focus();
                }
            });

            // Scroll effects
            window.addEventListener('scroll', utils.debounce(this.handleScroll.bind(this), 100));
            this.handleScroll();

            // Active link update
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

    // ============================================
    // Features Module
    // ============================================
    const Features = {
        render() {
            if (!DOM.featuresGrid) return;

            const html = state.features.map((feature, index) => `
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

    // ============================================
    // Blog Module (API Integration)
    // ============================================
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
            const html = posts.map(post => `
                <article class="blog-card" role="listitem">
                    <h3>${utils.escapeHTML(utils.truncateText(post.title, 60))}</h3>
                    <p>${utils.escapeHTML(utils.truncateText(post.body, 150))}</p>
                    <div class="blog-meta">
                        <i class="far fa-calendar-alt" aria-hidden="true"></i>
                        ${utils.formatDate(new Date().toISOString())}
                    </div>
                </article>
            `).join('');

            DOM.blogGrid.innerHTML = html;
        },

        retry() {
            this.loadPosts();
        }
    };

    // ============================================
    // Form Module
    // ============================================
    const Form = {
        init() {
            if (!DOM.contactForm) return;

            // Real-time validation on blur
            DOM.name?.addEventListener('blur', () => this.validateField('name'));
            DOM.email?.addEventListener('blur', () => this.validateField('email'));
            DOM.subject?.addEventListener('blur', () => this.validateField('subject'));
            DOM.message?.addEventListener('blur', () => this.validateField('message'));

            // Clear errors on input
            DOM.name?.addEventListener('input', () => this.clearError('name'));
            DOM.email?.addEventListener('input', () => this.clearError('email'));
            DOM.subject?.addEventListener('input', () => this.clearError('subject'));
            DOM.message?.addEventListener('input', () => this.clearError('message'));

            // Form submission
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

            // Simulate submission
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

    // ============================================
    // Scroll to Top Module
    // ============================================
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

    // ============================================
    // Observer Module (Intersection Observer)
    // ============================================
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

    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Theme must be first
        Theme.init();
        
        // Then everything else
        Navigation.init();
        Features.render();
        Blog.loadPosts();
        Form.init();
        ScrollTop.init();
        Observer.init();

        console.log('✅ TaskFlow initialized successfully');
        console.log(`📊 ${state.features.length} features loaded`);
        console.log(`🎨 Theme: ${state.isDarkMode ? 'Dark' : 'Light'}`);
    }

    // ============================================
    // Public API
    // ============================================
    return {
        init,
        retryLoadPosts: () => Blog.retry(),
        version: '1.0.0'
    };

})();

// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// ============================================
// Expose for inline handlers
// ============================================
window.App = App;