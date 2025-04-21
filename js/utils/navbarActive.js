function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href) {
            // Tangani kasus khusus untuk home
            if (href === 'home.html' && (currentPath.endsWith('/') || currentPath.endsWith('/home.html'))) {
                link.classList.add('active');
            }
            // Tangani kasus untuk halaman tentang
            else if (href === 'home.html#about' && currentPath.includes('tentang.html')) {
                link.classList.add('active');
            }
            // Tangani kasus untuk halaman kontak
            else if (href === 'home.html#contact' && currentPath.includes('kontak.html')) {
                link.classList.add('active');
            }
            // Tangani kasus untuk halaman lain
            else if (currentPath.includes(href)) {
                link.classList.add('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);
