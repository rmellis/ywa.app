document.addEventListener('DOMContentLoaded', () => {
    
    const zoomWrapper = document.getElementById('zoomWrapper');
    const searchInput = document.getElementById('searchInput');
    const appCards = document.querySelectorAll('.app-card');
    const appCountDisplay = document.querySelector('.app-count');
    const navItems = document.querySelectorAll('#sidebarNav .nav-item:not(.external)');
    const categoryTitle = document.getElementById('categoryTitle');
    const heroSection = document.querySelector('.hero-section');
    
    const themeToggleBtn = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
    const body = document.body;

    // --- LOGO REFERENCES ---
    const sidebarLogo = document.getElementById('sidebarLogo');
    const LOGO_DARK = "https://proxy.duckduckgo.com/iu/?u=https://i.imgur.com/hUjqV40.png";
    const LOGO_LIGHT = "https://proxy.duckduckgo.com/iu/?u=https://i.imgur.com/DP6sSZn.png";

    const windowContainer = document.getElementById('windowContainer');
    const windowTemplate = document.getElementById('windowTemplate');
    const osDock = document.getElementById('osDock');
    const launchBtns = document.querySelectorAll('.launch-modal-btn');
    
    let windowCounter = 0;
    let highestZIndex = 1000;
    let activeDragWindow = null;

    // --- GLOBAL DASHBOARD ZOOM LOGIC ---
    let currentZoom = 1;

    function applyZoom() {
        if(zoomWrapper) {
            zoomWrapper.style.zoom = currentZoom;
            zoomLevelDisplay.textContent = Math.round(currentZoom * 100) + '%';
            document.documentElement.style.setProperty('--zoom', currentZoom);
        }
    }

    if(zoomInBtn) { zoomInBtn.addEventListener('click', () => { if (currentZoom < 2.0) { currentZoom += 0.1; applyZoom(); } }); }
    if(zoomOutBtn) { zoomOutBtn.addEventListener('click', () => { if (currentZoom > 0.5) { currentZoom -= 0.1; applyZoom(); } }); }
    if(zoomLevelDisplay) { zoomLevelDisplay.addEventListener('click', () => { currentZoom = 1; applyZoom(); }); }

    // --- THEME TOGGLE LOGIC ---
    const savedTheme = localStorage.getItem('ywa-theme');
    
    // Initial Load Setup
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        if(sidebarLogo) sidebarLogo.src = LOGO_LIGHT; // NEW: Set Light Logo on Load
        if(moonIcon && sunIcon) { moonIcon.classList.add('hidden'); sunIcon.classList.remove('hidden'); }
    } else {
        if(sidebarLogo) sidebarLogo.src = LOGO_DARK; // NEW: Ensure Dark Logo is set explicitly
    }

    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('ywa-theme', 'light');
                if(sidebarLogo) sidebarLogo.src = LOGO_LIGHT; // NEW: Switch to Light Logo
                moonIcon.classList.add('hidden'); sunIcon.classList.remove('hidden');
            } else {
                localStorage.setItem('ywa-theme', 'dark');
                if(sidebarLogo) sidebarLogo.src = LOGO_DARK; // NEW: Switch to Dark Logo
                moonIcon.classList.remove('hidden'); sunIcon.classList.add('hidden');
            }
        });
    }

    // --- SIDEBAR FILTERING ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
            if(searchInput) searchInput.value = '';
            
            const filterValue = e.currentTarget.getAttribute('data-filter');
            if(categoryTitle) categoryTitle.textContent = e.currentTarget.getAttribute('data-title');

            if (heroSection) {
                if (filterValue === 'all') {
                    heroSection.classList.remove('hidden');
                } else {
                    heroSection.classList.add('hidden');
                }
            }

            let visibleCount = 0;
            appCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.classList.remove('hidden'); visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });
            if(appCountDisplay) appCountDisplay.textContent = visibleCount === 1 ? '1 App' : `${visibleCount} Apps`;
        });
    });

    // --- SEARCH FUNCTIONALITY ---
    if(searchInput) {
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement === document.body) {
                e.preventDefault(); searchInput.focus();
            }
        });

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            navItems.forEach(nav => nav.classList.remove('active'));
            const allBtn = document.querySelector('[data-filter="all"]');
            if(allBtn) allBtn.classList.add('active');
            if(categoryTitle) categoryTitle.textContent = searchTerm ? `Search Results for "${searchTerm}"` : 'All Applications';

            if (heroSection) {
                if (searchTerm === '') {
                    heroSection.classList.remove('hidden');
                } else {
                    heroSection.classList.add('hidden');
                }
            }

            let visibleCount = 0;
            appCards.forEach(card => {
                const tags = card.getAttribute('data-tags').toLowerCase();
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                if (tags.includes(searchTerm) || title.includes(searchTerm)) {
                    card.classList.remove('hidden'); visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });
            if(appCountDisplay) appCountDisplay.textContent = visibleCount === 1 ? '1 App' : `${visibleCount} Apps`;
        });
    }

    // --- OS DOCK LOGIC ---
    function updateDockVisibility() {
        if (!osDock) return;
        if (osDock.children.length > 0) {
            osDock.classList.remove('hidden');
        } else {
            osDock.classList.add('hidden');
        }
    }


    // --- EXACT COMPIZ FUSION "JELLO" PHYSICS ENGINE ---
    const SPRING_STIFFNESS = 0.12; 
    const SPRING_DAMPING = 0.6;    
    const WOBBLE_FACTOR = 0.08;

    function startWobble(win, startX, startY, targetX, targetY) {
        
        win.physics = { 
            x: startX, y: startY, 
            targetX: targetX, targetY: targetY, 
            vx: 0, vy: 0, 
            scale: 0.1, targetScale: 1, scaleV: 0, 
            isDragging: false, dragOffsetX: 0, dragOffsetY: 0
        };

        win.style.transformOrigin = "center center";

        function loop() {
            if (win.classList.contains('minimized-state') || win.classList.contains('maximized')) {
                win.animationFrameId = requestAnimationFrame(loop);
                return;
            }

            const p = win.physics;

            // Position 
            const ax = -SPRING_STIFFNESS * (p.x - p.targetX) - SPRING_DAMPING * p.vx;
            const ay = -SPRING_STIFFNESS * (p.y - p.targetY) - SPRING_DAMPING * p.vy;
            p.vx += ax;
            p.vy += ay;
            p.x += p.vx;
            p.y += p.vy;

            // Scaling 
            const as = -SPRING_STIFFNESS * (p.scale - p.targetScale) - SPRING_DAMPING * p.scaleV;
            p.scaleV += as;
            p.scale += p.scaleV;

            // Skew
            const maxSkew = 20; 
            let skewX = -p.vx * WOBBLE_FACTOR * 5; 
            let skewY = -p.vy * WOBBLE_FACTOR * 5; 
            skewX = Math.max(Math.min(skewX, maxSkew), -maxSkew);
            skewY = Math.max(Math.min(skewY, maxSkew), -maxSkew);

            // Stretch
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const maxStretch = 0.1;
            const stretchFactor = Math.min(speed * 0.005, maxStretch);
            const stretchX = 1 + Math.abs(p.vx) * 0.005 - Math.abs(p.vy) * 0.002;
            const stretchY = 1 + Math.abs(p.vy) * 0.005 - Math.abs(p.vx) * 0.002;

            const finalScaleX = p.scale * stretchX;
            const finalScaleY = p.scale * stretchY;

            let renderX = p.x;
            let renderY = p.y;
            if (Math.abs(p.vx) < 0.01 && Math.abs(p.vy) < 0.01 && !p.isDragging) {
                renderX = Math.round(p.x);
                renderY = Math.round(p.y);
            }

            win.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) skew(${skewX}deg, ${skewY}deg) scale(${finalScaleX}, ${finalScaleY})`;
            
            win.animationFrameId = requestAnimationFrame(loop);
        }
        
        loop();
    }


    // --- MULTI-WINDOW OS MANAGER ---
    function openAppWindow(appName, targetUrl, appIcon, cardRect) {
        if(!windowTemplate || !windowContainer) return;

        const winFragment = windowTemplate.content.cloneNode(true);
        const win = winFragment.querySelector('.os-window');
        
        win.querySelector('.macos-title').textContent = appName;
        win.querySelector('iframe').src = targetUrl;
        win.querySelector('.new-tab-btn').href = targetUrl;
        win.querySelector('.copy-embed-btn').setAttribute('data-url', targetUrl);

        highestZIndex++;
        win.style.zIndex = highestZIndex;
        win.addEventListener('mousedown', () => {
            highestZIndex++;
            win.style.zIndex = highestZIndex;
        });

        const targetWidth = Math.min(1200, window.innerWidth * 0.9);
        const targetHeight = Math.min(750, window.innerHeight * 0.9);
        const offset = (windowCounter % 5) * 30; 
        
        const targetLeft = Math.round((window.innerWidth - targetWidth) / 2 + offset);
        const targetTop = Math.round((window.innerHeight - targetHeight) / 2 + offset);

        let startX = window.innerWidth / 2;
        let startY = window.innerHeight / 2;

        if (cardRect) {
            startX = (cardRect.left + (cardRect.width / 2)) * currentZoom - (targetWidth / 2);
            startY = (cardRect.top + (cardRect.height / 2)) * currentZoom - (targetHeight / 2);
        }

        win.style.width = targetWidth + 'px';
        win.style.height = targetHeight + 'px';
        windowContainer.appendChild(win);
        
        startWobble(win, startX, startY, targetLeft, targetTop);

        let winZoom = 1;
        const baseWidth = targetWidth;
        const baseHeight = targetHeight;
        const wZoomIn = win.querySelector('.w-zoom-in');
        const wZoomOut = win.querySelector('.w-zoom-out');
        const wZoomDisplay = win.querySelector('.w-zoom-display');

        function applyWinZoom() {
            win.style.width = Math.round(baseWidth * winZoom) + 'px';
            win.style.height = Math.round(baseHeight * winZoom) + 'px';
            
            const iframe = win.querySelector('iframe');
            
            iframe.style.width = `${100 / winZoom}%`;
            iframe.style.height = `${100 / winZoom}%`;
            iframe.style.minWidth = `${100 / winZoom}%`;
            iframe.style.minHeight = `${100 / winZoom}%`;
            
            iframe.style.transform = `scale(${winZoom})`;
            iframe.style.transformOrigin = 'top left';
            
            wZoomDisplay.textContent = Math.round(winZoom * 100) + '%';
        }

        wZoomIn.addEventListener('click', () => { if (winZoom < 2.0) { winZoom += 0.1; applyWinZoom(); } });
        wZoomOut.addEventListener('click', () => { if (winZoom > 0.5) { winZoom -= 0.1; applyWinZoom(); } });
        wZoomDisplay.addEventListener('click', () => { winZoom = 1; applyWinZoom(); });

        const closeBtn = win.querySelector('.close');
        const minBtn = win.querySelector('.minimize');
        const maxBtn = win.querySelector('.maximize');
        const copyBtn = win.querySelector('.copy-embed-btn');

        closeBtn.addEventListener('click', () => { 
            cancelAnimationFrame(win.animationFrameId); 
            win.remove(); 
            updateDockVisibility(); 
        });

        minBtn.addEventListener('click', () => {
            win.style.transition = 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.3s';
            win.classList.add('minimized-state');
            
            const dockWrapper = document.createElement('div');
            dockWrapper.className = 'dock-item-wrapper';
            dockWrapper.title = appName;

            const dockBtn = document.createElement('div');
            dockBtn.className = 'dock-item';
            
            if(appIcon) {
                dockBtn.innerHTML = `<img src="${appIcon}" alt="${appName}">`;
            } else {
                dockBtn.textContent = appName.charAt(0).toUpperCase();
                dockBtn.style.background = 'linear-gradient(135deg, var(--accent), #d946ef)';
            }
            
            const dot = document.createElement('div');
            dot.className = 'dock-dot';
            
            dockWrapper.appendChild(dockBtn);
            dockWrapper.appendChild(dot);
            
            dockWrapper.addEventListener('click', () => {
                win.style.transition = 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.3s';
                win.classList.remove('minimized-state');
                highestZIndex++;
                win.style.zIndex = highestZIndex;
                dockWrapper.remove();
                updateDockVisibility();
                
                setTimeout(() => { win.style.transition = 'none'; }, 400);
            });
            
            osDock.appendChild(dockWrapper);
            updateDockVisibility();
        });

        let isMaximized = false;
        let preMaxTargetX, preMaxTargetY;

        // --- NEW: BLINK ENGINE OPEN PUBLISHER AUTO-MAXIMIZE HACK ---
        const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
        if (appName.trim() === "Open Publisher" && !isFirefox) {
            // Force the window state to be maximized immediately to bypass Chrome rendering lag
            isMaximized = true;
            preMaxTargetX = targetLeft; // Store center screen coordinates so it un-maximizes properly
            preMaxTargetY = targetTop;
            
            // Override the physics start values instantly
            win.physics.x = targetLeft;
            win.physics.y = targetTop;
            win.physics.scale = 1;
            
            win.classList.add('maximized');
        }

        maxBtn.addEventListener('click', () => {
            win.style.transition = 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
            if (!isMaximized) {
                preMaxTargetX = win.physics.targetX;
                preMaxTargetY = win.physics.targetY;
                isMaximized = true;
                win.classList.add('maximized');
            } else {
                isMaximized = false;
                win.classList.remove('maximized');
                win.physics.targetX = preMaxTargetX;
                win.physics.targetY = preMaxTargetY;
            }
            setTimeout(() => { win.style.transition = 'none'; }, 300);
        });

        copyBtn.addEventListener('click', (e) => {
            const url = e.currentTarget.getAttribute('data-url');
            const code = `<iframe src="${url}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`;
            copySnippet(code, e.currentTarget);
        });

        const header = win.querySelector('.macos-header');
        header.addEventListener('mousedown', (e) => {
            if(e.target.closest('.macos-traffic-lights') || e.target.closest('.modal-top-right-actions') || win.classList.contains('maximized')) return;
            
            e.preventDefault(); 

            win.querySelector('iframe').style.pointerEvents = 'none';
            highestZIndex++;
            win.style.zIndex = highestZIndex;
            
            win.style.transition = 'none'; 
            win.physics.isDragging = true;
            
            win.physics.dragOffsetX = e.clientX - win.physics.x;
            win.physics.dragOffsetY = e.clientY - win.physics.y;
            
            activeDragWindow = win;
        });

        windowCounter++;
    }

    document.addEventListener('mousemove', (e) => {
        if (!activeDragWindow) return;
        e.preventDefault();
        
        activeDragWindow.physics.targetX = e.clientX - activeDragWindow.physics.dragOffsetX;
        activeDragWindow.physics.targetY = e.clientY - activeDragWindow.physics.dragOffsetY;
    });

    document.addEventListener('mouseup', () => {
        if (activeDragWindow) {
            activeDragWindow.physics.isDragging = false;
            activeDragWindow.querySelector('iframe').style.pointerEvents = 'auto'; 
            activeDragWindow = null;
        }
    });

    if(launchBtns) {
        launchBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); 
                const targetUrl = btn.getAttribute('href');
                let appName = "WebApp";
                let appIcon = "";
                let cardRect = null;
                
                const card = btn.closest('.app-card');
                if (card) { 
                    // FIXED: trim() prevents invisible spaces from breaking conditions
                    appName = card.querySelector('.card-title').textContent.trim(); 
                    appIcon = card.getAttribute('data-icon');
                    cardRect = card.getBoundingClientRect();
                } else if (btn.hasAttribute('data-app-name')) {
                    appName = btn.getAttribute('data-app-name').trim();
                    appIcon = btn.getAttribute('data-app-icon') || "";
                    cardRect = btn.getBoundingClientRect();
                } else { 
                    const heroTitle = document.querySelector('.hero-title');
                    const heroElement = document.querySelector('.hero-section');
                    if(heroTitle) {
                        // FIXED: Trim removes the massive newlines generated by the <img> tag in the hero header
                        appName = heroTitle.textContent.trim(); 
                        appIcon = "https://proxy.duckduckgo.com/iu/?u=https://i.imgur.com/IHlwr0B.png";
                        cardRect = heroElement.getBoundingClientRect();
                    }
                }
                
                openAppWindow(appName, targetUrl, appIcon, cardRect);
            });
        });
    }
});

function copySnippet(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = btnElement.innerHTML;
        const checkSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        
        const span = btnElement.querySelector('.copy-text-span');
        if (span) {
            btnElement.innerHTML = `${checkSVG}<span class="copy-text-span" style="color:#22c55e;">Copied!</span>`;
        } else {
            btnElement.innerHTML = checkSVG;
        }

        btnElement.style.borderColor = "#22c55e";
        btnElement.style.color = "#22c55e";
        const isLight = document.body.classList.contains('light-theme');
        btnElement.style.background = isLight ? "#dcfce7" : "rgba(34, 197, 94, 0.15)";
        
        setTimeout(() => {
            btnElement.innerHTML = originalHTML;
            btnElement.style.borderColor = "";
            btnElement.style.background = "";
            btnElement.style.color = "";
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy snippet to clipboard.');
    });
}