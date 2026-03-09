document.addEventListener('DOMContentLoaded', () => {
    // === TELEGRAM INIT ===
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    // === DOM ELEMENTS ===
    const els = {
        userAvatar: document.getElementById('userAvatar'),
        usernameDisplay: document.getElementById('usernameDisplay'),
        statusBadge: document.getElementById('statusBadge'),
        daysLeftDisplay: document.getElementById('daysLeftDisplay'),
        daysLabelDisplay: document.getElementById('daysLabelDisplay'),
        subLinkDisplay: document.getElementById('subLinkDisplay'),
        copyBtn: document.getElementById('copyBtn'),
        copyIcon: document.getElementById('copyIcon'),
        connectIosBtn: document.getElementById('connectIosBtn'),
        connectAndroidBtn: document.getElementById('connectAndroidBtn'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        progressCircle: document.getElementById('progressCircle'),
        serverCountDisplay: document.getElementById('serverCountDisplay'),
        payBtn: document.getElementById('payBtn'),
        trialBtn: document.getElementById('trialBtn'),
        refCard: document.getElementById('refCard'),
        refCountDisplay: document.getElementById('refCountDisplay'),
        refBonusDisplay: document.getElementById('refBonusDisplay'),
        shareRefBtn: document.getElementById('shareRefBtn'),
        statsCard: document.getElementById('statsCard'),
        usageHits: document.getElementById('usageHits'),
        usageDevices: document.getElementById('usageDevices'),
        usageCountries: document.getElementById('usageCountries'),
        usageLastSeen: document.getElementById('usageLastSeen'),
        pingCount: document.getElementById('pingCount'),
        pingLocations: document.getElementById('pingLocations'),
        promoInput: document.getElementById('promoInput'),
        promoBtn: document.getElementById('promoBtn'),
        supportBtn: document.getElementById('supportBtn'),
        tariffModal: document.getElementById('tariffModal'),
        closeTariffBtn: document.getElementById('closeTariffBtn')
    };

    // === STATE ===
    const urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('user');
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        username = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.id.toString();
    }

    if (!username) {
        showError("Пользователь не найден.");
        return;
    }

    els.usernameDisplay.textContent = `@${username}`;
    els.userAvatar.textContent = username.charAt(0).toUpperCase();

    // Replace with actual worker domain
    const API_BASE = "https://sub.sigmavpn.space";
    const subLink = `${API_BASE}/${username}`;
    els.subLinkDisplay.textContent = "..." + subLink.slice(-18); // Shortened visual

    let botUsername = "SIGMAVPN1BOT"; // Fallback

    // === FETCH DATA ===
    async function loadStatus() {
        showLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/userStatus?user=${username}`);
            if (!res.ok) throw new Error("API Fetch Failed");
            const data = await res.json();
            updateUI(data);
        } catch (error) {
            console.error(error);
            // Fallback
            updateUI({ status: "active", daysLeft: "—", serverCount: 0, refCount: 0 });
        } finally {
            showLoading(false);
        }
    }

    // === UPDATE UI ===
    function updateUI(data) {
        const { status, daysLeft, serverCount, serverLocations, botUsername: apiBot, refCount, refBonus, usage } = data;

        if (apiBot) botUsername = apiBot;

        els.statusBadge.className = "status-badge";

        // Servers
        els.serverCountDisplay.textContent = serverCount ? `${serverCount} Серверов онлайн` : "Сеть активна";
        els.pingCount.textContent = serverCount || "0";
        if (serverLocations && serverLocations.length > 0) {
            els.pingLocations.textContent = serverLocations.join(", ");
        }

        // Usage Stats
        if (usage) {
            els.statsCard.style.display = 'block';
            els.usageDevices.textContent = usage.devices;
            els.usageCountries.textContent = usage.countries;

            if (usage.lastSeen !== "—") {
                const lsDate = new Date(usage.lastSeen);
                if (!isNaN(lsDate)) {
                    els.usageLastSeen.textContent = lsDate.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
                } else els.usageLastSeen.textContent = usage.lastSeen;
            }
        }

        // Referrals
        if (refCount !== undefined) {
            els.refCard.style.display = 'block';
            els.refCountDisplay.textContent = refCount;
            els.refBonusDisplay.textContent = `+${refBonus || 0} дн.`;
        }

        // Status & Progress Ring
        let ringPercentage = 0;

        if (status === "active" || parseInt(daysLeft) > 0 || daysLeft === "—" || daysLeft === "∞") {
            els.statusBadge.classList.add("active");
            els.statusBadge.textContent = "АКТИВНА";

            if (daysLeft === "—" || daysLeft === "∞") {
                els.daysLeftDisplay.textContent = "∞";
                els.daysLabelDisplay.textContent = "Навсегда";
                ringPercentage = 100;
                setRingColor(true);
            } else {
                els.daysLeftDisplay.textContent = daysLeft;
                els.daysLabelDisplay.textContent = getDaysString(daysLeft);
                // Assume 30 days is 100% for the visual ring
                ringPercentage = Math.min(100, (daysLeft / 30) * 100);
                setRingColor(true);
            }
        } else {
            els.statusBadge.classList.add("expired");
            els.statusBadge.textContent = "ИСТЕКЛА";
            els.daysLeftDisplay.textContent = "0";
            els.daysLabelDisplay.textContent = "дней";
            ringPercentage = 0;
            setRingColor(false);
            els.trialBtn.style.display = 'flex'; // Show trial button
        }

        // Show pay button ALWAYS unless it's Lifetime
        const isLifetime = (daysLeft === "—" || daysLeft === "∞" || status === "lifetime");
        if (isLifetime) {
            els.payBtn.style.display = 'none';
        } else {
            els.payBtn.style.display = 'flex';
        }

        setProgressRing(ringPercentage);
    }

    // === HELPERS ===
    function setProgressRing(percent) {
        const radius = els.progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        els.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;

        const offset = circumference - (percent / 100) * circumference;
        els.progressCircle.style.strokeDashoffset = offset;
    }

    function setRingColor(isActive) {
        els.progressCircle.style.stroke = isActive ? "url(#gradientActive)" : "url(#gradientDanger)";
    }

    function getDaysString(n) {
        let text = 'дней';
        if (n % 10 === 1 && n % 100 !== 11) text = 'день';
        else if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) text = 'дня';
        return text;
    }

    function showError(msg) {
        els.statusBadge.className = "status-badge expired";
        els.statusBadge.textContent = "Ошибка";
        els.daysLeftDisplay.textContent = "!";
        els.daysLabelDisplay.textContent = "ошибка";
        els.subLinkDisplay.textContent = "—";
        setProgressRing(0);
        setRingColor(false);
    }

    function showLoading(show) {
        if (show) els.loadingOverlay.classList.add('active');
        else els.loadingOverlay.classList.remove('active');
    }

    // === EVENT LISTENERS ===
    console.log("SigmaVPN App Logic v2 Initialized. User:", username);

    // Copy Key
    els.copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(subLink).then(() => {
            const originalIcon = els.copyIcon.innerHTML;
            els.copyIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            tg.HapticFeedback.notificationOccurred('success');

            setTimeout(() => {
                els.copyIcon.innerHTML = originalIcon;
            }, 2000);
        }).catch(() => tg.showAlert('Не удалось скопировать ключ.'));
    });

    // Connect iOS
    els.connectIosBtn.addEventListener('click', () => {
        const connectUrl = `${API_BASE}/connect/v2raytun/${username}`;
        tg.openLink(connectUrl, { try_instant_view: false });
    });

    // Connect Android
    els.connectAndroidBtn.addEventListener('click', () => {
        const connectUrl = `${API_BASE}/connect/v2raytun/${username}`; // Reusing logic, android intercepts it usually
        tg.openLink(connectUrl, { try_instant_view: false });
    });

    // Payment Modal
    els.payBtn.addEventListener('click', () => {
        els.tariffModal.classList.add('active');
    });

    els.closeTariffBtn.addEventListener('click', () => {
        els.tariffModal.classList.remove('active');
    });

    // Close modal on outside click
    els.tariffModal.addEventListener('click', (e) => {
        if (e.target === els.tariffModal) {
            els.tariffModal.classList.remove('active');
        }
    });

    // Handle payment buttons inside modal
    const payBtnsYk = document.querySelectorAll('.btn-pay-yk, .btn-pay-fk');
    const payBtnsStars = document.querySelectorAll('.btn-pay-stars');

    console.log("Attached YK buttons:", payBtnsYk.length);

    payBtnsYk.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const targetBtn = e.target.closest('.btn-pay-yk');
            if (targetBtn) {
                const days = targetBtn.getAttribute('data-days');
                showLoading(true);
                try {
                    const res = await fetch(`${API_BASE}/api/pay/yookassa?user=${username}&days=${days}`);
                    const data = await res.json();
                    if (data.ok && data.url) {
                        tg.openLink(data.url);
                    } else {
                        tg.showAlert("❌ " + (data.error || "Ошибка создания платежа"));
                    }
                } catch (err) {
                    tg.showAlert("❌ Ошибка соединения с сервером");
                } finally {
                    showLoading(false);
                }
            }
        });
    });

    payBtnsStars.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.btn-pay-stars');
            if (targetBtn) {
                const action = targetBtn.getAttribute('data-action');
                tg.openTelegramLink(`https://t.me/${botUsername}?start=` + action);
                tg.close();
            }
        });
    });

    // Trial Button
    els.trialBtn.addEventListener('click', async () => {
        const confirmStr = "Активировать бесплатный тестовый период на 24 часа?";
        tg.showConfirm(confirmStr, async (confirmed) => {
            if (confirmed) {
                showLoading(true);
                try {
                    const res = await fetch(`${API_BASE}/api/trial?user=${username}`);
                    const data = await res.json();
                    if (data.ok) {
                        tg.showAlert("✅ " + data.message, () => {
                            window.location.reload();
                        });
                    } else {
                        tg.showAlert("❌ " + data.error);
                    }
                } catch (e) {
                    tg.showAlert("❌ Ошибка связи с сервером.");
                } finally {
                    showLoading(false);
                }
            }
        });
    });

    // Promo Button
    els.promoBtn.addEventListener('click', async () => {
        const code = els.promoInput.value.trim();
        if (!code) return tg.showAlert("Введите промокод.");

        showLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/promo?user=${username}&code=${encodeURIComponent(code)}`);
            const data = await res.json();
            if (data.ok) {
                tg.showAlert("✅ " + data.message, () => {
                    els.promoInput.value = "";
                    window.location.reload();
                });
            } else {
                tg.showAlert("❌ " + data.error);
            }
        } catch (e) {
            tg.showAlert("❌ Ошибка при проверке кода.");
        } finally {
            showLoading(false);
        }
    });

    // Support Button
    els.supportBtn.addEventListener('click', () => {
        // Use deep link instead of sendData which is restricted in inline web apps
        tg.openTelegramLink(`https://t.me/${botUsername}?start=support`);
        tg.close();
    });

    // Referrals Share
    els.shareRefBtn.addEventListener('click', () => {
        const refLink = `https://t.me/${botUsername}?start=ref_${username}`;
        const text = `Попробуй SigmaVPN — быстрый, безопасный и работает везде! Держи приглашение:`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`;
        tg.openTelegramLink(shareUrl);
    });

    // Start fetching
    setTimeout(loadStatus, 500); // Slight delay for animation smoothness
});
