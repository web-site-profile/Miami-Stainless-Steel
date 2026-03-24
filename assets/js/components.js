document.addEventListener("DOMContentLoaded", () => {
    // Determine base path from body attribute, default to current dir
    const basePath = document.body.dataset.basepath || "./";
    
    // Helper to fix URLs in the loaded HTML
    const fixPaths = (html) => {
        return html.replace(/(href|src)=["']([^"']*)["']/g, (match, attr, url) => {
            // Ignore absolute URLs and hash links that shouldn't change
            if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) {
                return match;
            }
            // Remove leading slash, ./ or ../ if any to normalize
            // assuming our components use paths relative to the root like "index.html" or "assets/..."
            let cleanUrl = url.replace(/^[./]+/, ''); 
            // Also remove leading slash just in case
            cleanUrl = cleanUrl.replace(/^\//, '');

            // Special handling for the hash link to the quote section if not on home page
            if (url.startsWith('#')) {
                if(basePath === "./") {
                   return match; // On home page, leave hash as is
                } else {
                   return `${attr}="${basePath}index.html${url}"`; // On other pages, point to index
                }
            }

            return `${attr}="${basePath}${cleanUrl}"`;
        });
    };

    // Load Header
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
        fetch(`${basePath}components/header.html`)
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = fixPaths(data);
                initHeaderScripts();
                setActiveLink();
            })
            .catch(err => console.error("Error loading header:", err));
    }

    // Load Footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch(`${basePath}components/footer.html`)
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = fixPaths(data);
            })
            .catch(err => console.error("Error loading footer:", err));
    }
    
    // Initialize specific header functionality
    function initHeaderScripts() {
        // Mobile Menu Toggle logic
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if(mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                // Optional: Change icon (burger to X)
                const svgPath = mobileMenu.classList.contains('hidden') 
                    ? '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>'
                    : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
                mobileMenuBtn.querySelector('svg').innerHTML = svgPath;
            });
            // Close menu on click link
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenuBtn.querySelector('svg').innerHTML = '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>';
                });
            });
        }
    }

    // Dynamic active link 
    function setActiveLink() {
        const bodyId = document.body.id; 
        const linkMap = {
            "page-home": "link-home",
            "page-products": "link-products",
            "page-contact": "link-contact"
        };
        
        // Reset all links first
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.remove('text-primary', 'text-glow');
            l.classList.add('text-gray-300');
        });

        // Set active 
        const activeClass = linkMap[bodyId];
        if (activeClass) {
            document.querySelectorAll('.' + activeClass).forEach(l => {
                l.classList.remove('text-gray-300');
                l.classList.add('text-primary', 'text-glow');
            });
        }
    }

    // Scroll effect for header
    document.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(4, 4, 4, 0.9)';
                header.classList.add('backdrop-blur-md');
            } else {
                header.style.backgroundColor = 'transparent';
                header.classList.remove('backdrop-blur-md');
            }
        }
    });

});
