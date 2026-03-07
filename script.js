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
});
