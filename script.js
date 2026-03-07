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

    // FAQ Toggle Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
