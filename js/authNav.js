const authNavInit = () => {
    const currentUserJson = localStorage.getItem('currentUser');
    const loginEl = document.getElementById('navLoginLink');
    const getStartedEl = document.getElementById('navGetStartedLink');
    const adminContainer = document.getElementById('navAdminLinkContainer');
    const logoutContainer = document.getElementById('navLogoutLinkContainer');

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
