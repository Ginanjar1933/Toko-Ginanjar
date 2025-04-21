export function checkAuth(allowedRoles = []) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        window.location.href = '/html/auth/login.html';
        return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        window.location.href = '/html/home.html';
        return false;
    }

    return true;
}

// Add to admin pages
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(['admin']);
});

// Add to kasir pages
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(['kasir']);
});
