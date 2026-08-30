/* ============================================
   SHREE PUSHPA SALON & ACADEMY - script.js
   ============================================ */

(function() {
    'use strict';

    // ===== DOM Elements =====
    const header = document.getElementById('header');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const logo = document.getElementById('logo');
    const bookForm = document.getElementById('bookForm');
    const revTrack = document.getElementById('revTrack');
    const revPrev = document.getElementById('revPrev');
    const revNext = document.getElementById('revNext');
    const revDots = document.getElementById('revDots');
    const marquee = document.getElementById('marquee');

    // ==========================================
    // MOBILE MENU
    // ==========================================
    function toggleMenu() {
        const isOpen = navLinks.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        navLinks.classList.add('open');
        navOverlay.classList.add('show');
        header.classList.add('menu-open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        hamburgerBtn.setAttribute('aria-label', 'Close menu');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navLinks.classList.remove('open');
        navOverlay.classList.remove('show');
        header.classList.remove('menu-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
    }

    // Attach event to hamburger
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }

    // Attach event to overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when any nav link is clicked
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
                // Remove active class from all, add to clicked
                navLinks.querySelectorAll('a').forEach(function(a) {
                    a.classList.remove('active');
                });
                link.classList.add('active');
            });
        });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 960) {
            closeMenu();
        }
    });

    // ==========================================
    // STICKY HEADER
    // ==========================================
    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Trigger on page load
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    }

    // ==========================================
    // ACTIVE NAV LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('nav.links a[href^="#"]');

    function updateActiveNav() {
        let currentSection = '';
        const scrollPos = window.scrollY + 120;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        navAnchors.forEach(function(anchor) {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === currentSection) {
                anchor.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);

    // ==========================================
    // BOOKING FORM -> WHATSAPP
    // ==========================================
    if (bookForm) {
        // Set min date to today
        const dateInput = document.getElementById('bDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        bookForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const getVal = function(id) {
                const el = document.getElementById(id);
                return el ? el.value.trim() : '';
            };

            const name = getVal('bName');
            const phone = getVal('bPhone');
            const service = getVal('bService');
            const date = getVal('bDate');
            const time = getVal('bTime');
            const note = getVal('bNote');

            // Basic validation
            if (!name || !phone || !service || !date || !time) {
                alert('Please fill in all required fields (Name, Phone, Service, Date, and Time).');
                return;
            }

            if (phone.replace(/[^0-9+]/g, '').length < 10) {
                alert('Please enter a valid phone number.');
                return;
            }

            const msg = 'Hello Shree Pushpa Salon! I would like to book an appointment.\n\n' +
                '👤 Name: ' + name + '\n' +
                '📞 Phone: ' + phone + '\n' +
                '💇‍♀️ Service: ' + service + '\n' +
                '📅 Date: ' + date + '\n' +
                '🕐 Time: ' + time +
                (note ? '\n📝 Note: ' + note : '');

            const waUrl = 'https://wa.me/919828158508?text=' + encodeURIComponent(msg);
            window.open(waUrl, '_blank');
        });
    }

    // ==========================================
    // MARQUEE DUPLICATE FOR SEAMLESS LOOP
    // ==========================================
    if (marquee) {
        const originalContent = marquee.innerHTML;
        marquee.innerHTML = originalContent + originalContent;
    }

    // ==========================================
    // REVIEWS CAROUSEL
    // ==========================================
    (function() {
        if (!revTrack || !revDots || !revPrev || !revNext) return;

        const slides = revTrack.children.length;
        if (slides === 0) return;

        let currentIndex = 0;
        let autoTimer = null;
        const AUTOPLAY_INTERVAL = 4500;

        // Create dots
        for (let d = 0; d < slides; d++) {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', 'Go to review ' + (d + 1));
            dot.addEventListener('click', function() {
                goToSlide(d);
                restartAutoPlay();
            });
            revDots.appendChild(dot);
        }

        function goToSlide(n) {
            currentIndex = (n + slides) % slides;
            revTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

            // Update dots
            revDots.querySelectorAll('button').forEach(function(dot, idx) {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function restartAutoPlay() {
            if (autoTimer) {
                clearInterval(autoTimer);
            }
            autoTimer = setInterval(function() {
                goToSlide(currentIndex + 1);
            }, AUTOPLAY_INTERVAL);
        }

        // Navigation
        revPrev.addEventListener('click', function() {
            goToSlide(currentIndex - 1);
            restartAutoPlay();
        });

        revNext.addEventListener('click', function() {
            goToSlide(currentIndex + 1);
            restartAutoPlay();
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        revTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        revTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    goToSlide(currentIndex + 1); // Swipe left -> next
                } else {
                    goToSlide(currentIndex - 1); // Swipe right -> prev
                }
                restartAutoPlay();
            }
        }, { passive: true });

        // Initialize
        goToSlide(0);
        restartAutoPlay();

        // Pause on hover
        const carousel = document.querySelector('.rev-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', function() {
                if (autoTimer) clearInterval(autoTimer);
            });
            carousel.addEventListener('mouseleave', restartAutoPlay);
        }
    })();

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerOffset = 70;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // IMAGE LAZY LOADING FALLBACK
    // ==========================================
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading - no action needed
    } else {
        // Fallback: load all images eagerly
        document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            img.loading = 'eager';
        });
    }

    // ==========================================
    // PREVENT BODY SCROLL WHEN MENU OPEN
    // ==========================================
    // Already handled in openMenu/closeMenu functions

    console.log('Shree Pushpa Salon & Academy - Website Loaded Successfully');
    console.log('📍 Sanganer, Jaipur | 📞 098281 58508 | ⭐ 5.0 Rating');
})();