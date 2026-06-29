const authNavInit = () => {
    const currentUserJson = localStorage.getItem('currentUser');
    const loginEl = document.getElementById('navLoginLink');
    const getStartedEl = document.getElementById('navGetStartedLink');
    const adminContainer = document.getElementById('navAdminLinkContainer');
    const logoutContainer = document.getElementById('navLogoutLinkContainer');

    const nav = document.querySelector('nav');

    if (nav) {
        const mobileButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!mobileButton && !mobileMenu) {
            const actionContainer = loginEl?.parentElement || nav.querySelector('div.flex.items-center.gap-4');
            if (actionContainer) {
                const button = document.createElement('button');
                button.id = 'mobileMenuButton';
                button.type = 'button';
                button.setAttribute('aria-label', 'Toggle navigation menu');
                button.setAttribute('aria-expanded', 'false');
                button.setAttribute('data-mobile-menu-bound', 'true');
                button.className = 'md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary shadow-sm';
                button.innerHTML = '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>';
                actionContainer.insertBefore(button, actionContainer.firstChild);

                const menu = document.createElement('div');
                menu.id = 'mobileMenu';
                menu.className = 'md:hidden hidden mt-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm';
                menu.innerHTML = `
                    <div class="flex flex-col gap-2">
                        <a href="index.html" class="px-2 py-2 text-on-surface text-sm font-medium hover:text-primary">Home</a>
                        <a href="features.html" class="px-2 py-2 text-on-surface text-sm font-medium hover:text-primary">Features</a>
                        <a href="report-incident.html" class="px-2 py-2 text-on-surface text-sm font-medium hover:text-primary">Report Incident</a>
                        <a href="resources.html" class="px-2 py-2 text-on-surface text-sm font-medium hover:text-primary">Resources</a>
                        <a href="about-us.html" class="px-2 py-2 text-on-surface text-sm font-medium hover:text-primary">About Us</a>
                        <a href="login.html" class="px-2 py-2 text-primary text-sm font-medium">Login</a>
                        <a href="get-started.html" class="px-2 py-2 text-primary text-sm font-medium">Get Started</a>
                    </div>
                `;
                nav.appendChild(menu);
            }
        }

        const menuButton = document.getElementById('mobileMenuButton');
        const menu = document.getElementById('mobileMenu');

        if (menuButton && menu && menuButton.getAttribute('data-mobile-menu-bound') !== 'true') {
            menuButton.setAttribute('data-mobile-menu-bound', 'true');
            menuButton.addEventListener('click', () => {
                const isHidden = menu.classList.contains('hidden');
                menu.classList.toggle('hidden', !isHidden);
                menuButton.setAttribute('aria-expanded', String(isHidden));
            });
        }
    }

    if (!currentUserJson) {
        return;
    }

    const user = JSON.parse(currentUserJson);

    if (loginEl) {
        loginEl.remove();
    }
    if (getStartedEl) {
        getStartedEl.remove();
    }

    if (adminContainer) {
        adminContainer.classList.remove('hidden');
        if (user?.role === 'admin') {
            adminContainer.innerHTML = `<a href="admin-dashboard.html" class="text-primary text-sm font-medium hover:text-on-primary-container">Admin Panel</a>`;
        } else {
            adminContainer.innerHTML = `<a href="victim-dashboard.html" class="text-primary text-sm font-medium hover:text-on-primary-container">My Dashboard</a>`;
        }
    }

    if (logoutContainer) {
        logoutContainer.classList.remove('hidden');
        logoutContainer.innerHTML = `<button id="navLogoutBtn" class="text-sm font-medium text-on-surface hover:text-primary">Logout</button>`;
        const logoutBtn = document.getElementById('navLogoutBtn');
        logoutBtn?.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberMe');
            window.location.href = 'index.html';
        });
    }
};

window.addEventListener('DOMContentLoaded', authNavInit);
