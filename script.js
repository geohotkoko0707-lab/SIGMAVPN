document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mockup card active server switching simulation
    const servers = document.querySelectorAll('.server-item');
    let currentIndex = 2; // Start with the active one

    // This creates a fake "connecting" feeling
    setInterval(() => {
        servers.forEach(server => {
            server.classList.remove('active-server');
            const statusIndicator = server.querySelector('.status-indicator');
            const pingText = server.querySelector('.ping');

            if (statusIndicator) {
                // Change back to ping text
                const pingValue = server.dataset.ping || Math.floor(Math.random() * 50 + 10) + ' MS';
                server.innerHTML = server.innerHTML.replace('<span class="status-indicator"></span>', `<span class="ping">${pingValue}</span>`);
            }
        });

        // Pick a random server to be active next
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * servers.length);
        } while (nextIndex === currentIndex);

        currentIndex = nextIndex;
        const activeServer = servers[currentIndex];
        activeServer.classList.add('active-server');

        // Save current ping before replacing
        const currentPing = activeServer.querySelector('.ping');
        if (currentPing) {
            activeServer.dataset.ping = currentPing.textContent;
            activeServer.innerHTML = activeServer.innerHTML.replace(currentPing.outerHTML, '<span class="status-indicator"></span>');
        }
    }, 4000); // Switch every 4 seconds

    // Add subtle parallax effect on mouse move for the mockup card
    const mockup = document.querySelector('.mockup-card');
    const hero = document.querySelector('.hero');

    if (mockup && hero) {
        hero.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            mockup.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        hero.addEventListener('mouseleave', () => {
            mockup.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
        });
    }

    // FAQ Toggle Logic - using event delegation for better reliability
    document.addEventListener('click', (e) => {
        const question = e.target.closest('.faq-question');
        if (!question) return;

        const currentItem = question.closest('.faq-item');
        if (!currentItem) return;

        // Find all FAQ items
        const allItems = document.querySelectorAll('.faq-item');

        // Toggle current
        const isActive = currentItem.classList.contains('active');

        // Close all
        allItems.forEach(item => {
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            if (answer) answer.style.maxHeight = null;
        });

        // Open current if it wasn't active
        if (!isActive) {
            currentItem.classList.add('active');
            const answer = currentItem.querySelector('.faq-answer');
            if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });

    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#5c3cf6", "#00d2ff", "#ffffff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.4, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 },
                "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 180, "line_linked": { "opacity": 0.3 } },
                    "push": { "particles_nb": 3 }
                }
            },
            "retina_detect": true
        });
    }

    // Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // Custom Cursor Logic
    const cursor = document.getElementById('magic-cursor');
    const follower = document.getElementById('magic-cursor-follower');

    if (cursor && follower) {
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            // Cursor moves instantly
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        });

        // Follower trailing animation
        const animateFollower = () => {
            followerX += (cursorX - followerX) * 0.15;
            followerY += (cursorY - followerY) * 0.15;

            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Add hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .faq-question, .server-item, .logo');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                follower.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                follower.classList.remove('hovering');
            });
        });
    }

    // Typing Effect Logic
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const words = ['Свободному', 'Быстрому', 'Безопасному', 'Анонимному'];
        let wordIndex = 0;
        let charIndex = words[0].length; // Start with the first word fully typed
        let isDeleting = true;

        const typeEffect = () => {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000; // Pause at the end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing new word
            }

            setTimeout(typeEffect, typingSpeed);
        };

        // Start effect after an initial delay
        setTimeout(typeEffect, 3000);
    }
});
