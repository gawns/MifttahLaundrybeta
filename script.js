// ===== THEME TOGGLE =====
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const html = document.documentElement;
    
    let currentTheme = localStorage.getItem('miftahTheme') || 'light';
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeLabel.textContent = 'Gelap';
    } else {
        html.removeAttribute('data-theme');
        themeLabel.textContent = 'Terang';
    }

    themeToggle.addEventListener('click', function() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem('miftahTheme', 'light');
            themeLabel.textContent = 'Terang';
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('miftahTheme', 'dark');
            themeLabel.textContent = 'Gelap';
        }
    });
})();

// ===== LAZY LOADING IMAGES =====
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const wrapper = img.closest('.lazy-wrapper');
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                        if (wrapper) {
                            wrapper.classList.add('loaded');
                        }
                    });
                    
                    img.addEventListener('error', () => {
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f4f8"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%238a9aa8" text-anchor="middle" dy=".3em"%3EGagal Memuat%3C/text%3E%3C/svg%3E';
                        img.classList.add('loaded');
                        if (wrapper) {
                            wrapper.classList.add('loaded');
                        }
                    });
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            const wrapper = img.closest('.lazy-wrapper');
            if (wrapper) {
                wrapper.classList.add('loaded');
            }
        });
    }
});

// ===== NAVBAR HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeNav() {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function openNav() {
    navLinks.classList.add('active');
    hamburger.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
        closeNav();
    } else {
        openNav();
    }
});

navOverlay.addEventListener('click', closeNav);

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeNav);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeNav();
    }
});

// ===== NAVBAR ACTIVE LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a:not(.theme-toggle a)');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== ORDER BUTTON =====
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const card = this.closest('.card');
        const serviceName = this.dataset.service;
        const basePrice = parseInt(card.dataset.basePrice);
        const unit = card.dataset.unit;
        const min = parseInt(card.dataset.min);
        const max = parseInt(card.dataset.max);
        const isExpress = card.dataset.express === 'true';
        
        const orderData = {
            service: serviceName,
            basePrice: basePrice,
            unit: unit,
            min: min,
            max: max,
            isExpress: isExpress
        };
        localStorage.setItem('miftahOrder', JSON.stringify(orderData));
        
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            fillContactForm(orderData);
        }, 800);
    });
});

// ===== FILL CONTACT FORM =====
function fillContactForm(data) {
    const serviceSelect = document.getElementById('serviceSelect');
    const sliderContainer = document.getElementById('sliderContainer');
    const slider = document.getElementById('quantitySlider');
    const sliderValueDisplay = document.getElementById('sliderValueDisplay');
    const sliderUnitDisplay = document.getElementById('sliderUnitDisplay');
    const sliderMinLabel = document.getElementById('sliderMinLabel');
    const sliderMaxLabel = document.getElementById('sliderMaxLabel');
    const priceInput = document.getElementById('estimatedPrice');
    
    if (serviceSelect) {
        serviceSelect.value = data.service;
        serviceSelect.dispatchEvent(new Event('change'));
    }
    
    if (slider) {
        slider.min = data.min;
        slider.max = data.max;
        slider.value = data.min;
        
        const unitLabel = data.isExpress ? 'jam' : data.unit;
        sliderMinLabel.textContent = data.min + (data.isExpress ? ' jam' : ' ' + data.unit);
        sliderMaxLabel.textContent = data.max + (data.isExpress ? ' jam' : ' ' + data.unit);
        sliderUnitDisplay.textContent = unitLabel;
        sliderValueDisplay.textContent = data.min;
        
        sliderContainer.style.display = 'block';
        updateSliderProgress();
        updatePrice();
    }
    
    const form = document.querySelector('.contact-form');
    form.style.transition = 'box-shadow 0.3s ease';
    form.style.boxShadow = '0 0 0 4px rgba(25, 118, 210, 0.2)';
    setTimeout(() => {
        form.style.boxShadow = '';
    }, 2000);
}

// ===== SLIDER PROGRESS BAR =====
function updateSliderProgress() {
    const slider = document.getElementById('quantitySlider');
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const val = parseInt(slider.value);
    const percentage = ((val - min) / (max - min)) * 100;
    
    const progress = document.getElementById('sliderProgress');
    if (progress) {
        progress.style.width = percentage + '%';
    }
    
    const thumbValue = document.getElementById('sliderThumbValue');
    if (thumbValue) {
        thumbValue.textContent = val;
        thumbValue.style.left = percentage + '%';
    }
}

// ===== DROPDOWN & SLIDER LOGIC =====
const serviceSelect = document.getElementById('serviceSelect');
const sliderContainer = document.getElementById('sliderContainer');
const slider = document.getElementById('quantitySlider');
const sliderValueDisplay = document.getElementById('sliderValueDisplay');
const sliderUnitDisplay = document.getElementById('sliderUnitDisplay');
const sliderMinLabel = document.getElementById('sliderMinLabel');
const sliderMaxLabel = document.getElementById('sliderMaxLabel');
const priceInput = document.getElementById('estimatedPrice');

const serviceData = {
    'Cuci & Lipat': { base: 7000, unit: 'kg', min: 1, max: 8, express: false },
    'Dry Cleaning': { base: 15000, unit: 'kg', min: 1, max: 8, express: false },
    'Setrika': { base: 5000, unit: 'kg', min: 1, max: 8, express: false },
    'Cuci Sepatu': { base: 35000, unit: 'pasang', min: 1, max: 4, express: false },
    'Bed Cover': { base: 20000, unit: 'pcs', min: 1, max: 4, express: false },
    'Express Laundry': { base: 5000, unit: 'jam', min: 2, max: 24, express: true }
};

function updateSlider() {
    const selected = serviceSelect.value;
    if (!selected || !serviceData[selected]) {
        sliderContainer.style.display = 'none';
        priceInput.value = 'Rp 0';
        return;
    }
    
    const data = serviceData[selected];
    sliderContainer.style.display = 'block';
    
    slider.min = data.min;
    slider.max = data.max;
    slider.value = data.min;
    
    const unitLabel = data.express ? 'jam' : data.unit;
    sliderMinLabel.textContent = data.min + (data.express ? ' jam' : ' ' + data.unit);
    sliderMaxLabel.textContent = data.max + (data.express ? ' jam' : ' ' + data.unit);
    sliderUnitDisplay.textContent = unitLabel;
    sliderValueDisplay.textContent = data.min;
    
    updateSliderProgress();
    updatePrice();
}

function updatePrice() {
    const selected = serviceSelect.value;
    if (!selected || !serviceData[selected]) {
        priceInput.value = 'Rp 0';
        return;
    }
    
    const data = serviceData[selected];
    const quantity = parseInt(slider.value);
    let total = data.base * quantity;
    
    if (data.express) {
        const maxHours = data.max;
        const minHours = data.min;
        const maxFactor = maxHours - minHours + 1;
        const factor = (maxHours - quantity + 1) / maxFactor;
        total = Math.round(data.base * maxHours * factor);
        if (total < data.base * 2) total = data.base * 2;
    }
    
    priceInput.value = 'Rp ' + total.toLocaleString('id-ID');
}

serviceSelect.addEventListener('change', updateSlider);
slider.addEventListener('input', () => {
    const selected = serviceSelect.value;
    if (selected && serviceData[selected]) {
        sliderValueDisplay.textContent = slider.value;
        updateSliderProgress();
        updatePrice();
    }
});

// ===== CHECK LOCALSTORAGE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    const savedOrder = localStorage.getItem('miftahOrder');
    if (savedOrder) {
        const data = JSON.parse(savedOrder);
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            setTimeout(() => {
                fillContactForm(data);
            }, 500);
        }
    }
    
    updateSliderProgress();
});

// ===== CONTACT FORM WITH FONNTE API =====
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const serviceSelect = document.getElementById('serviceSelect');
    const quantitySlider = document.getElementById('quantitySlider');
    const orderNote = document.getElementById('orderNote');
    const priceInput = document.getElementById('estimatedPrice');
    
    let isValid = true;
    
    const nameValue = nameInput.value.trim();
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameValue || !nameRegex.test(nameValue)) {
        nameInput.classList.add('error');
        nameError.classList.add('show');
        isValid = false;
    } else {
        nameInput.classList.remove('error');
        nameError.classList.remove('show');
    }
    
    // Validasi No HP
    const phoneValue = phoneInput.value.trim();
    const phoneRegex = /^62\d+$/;
    if (!phoneValue || !phoneRegex.test(phoneValue)) {
        phoneInput.classList.add('error');
        phoneError.classList.add('show');
        isValid = false;
    } else {
        phoneInput.classList.remove('error');
        phoneError.classList.remove('show');
    }
    
    if (!isValid) return;
    
    // Data pesanan
    const service = serviceSelect.value;
    const quantity = quantitySlider.value;
    const price = priceInput.value;
    const note = orderNote.value.trim();
    
    const btn = e.target.querySelector('.btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    btn.disabled = true;
    
    // Format pesan WhatsApp
    const message = `*🧺 MIFTAH LAUNDRY - PESANAN BARU*
    
👤 *Nama:* ${nameValue}
📱 *Telepon:* ${phoneValue}
📦 *Layanan:* ${service}
📊 *Jumlah:* ${quantity} ${serviceData[service]?.unit || ''}
💰 *Estimasi Harga:* ${price}
📝 *Catatan:* ${note || 'Tidak ada catatan'}

Terima kasih telah memesan di Miftah Laundry! ✨`;
    
    // NOMOR TUJUAN DIUBAH KE NOMOR SENDIRI (6282227034955)
    const targetNumber = '6282227034955';
    
    try {
        // ===== FONNTE API CONFIG =====
        const FONNTE_API_KEY = '5Ni1egcsX8oFnB7Hqc7a';
        const FONNTE_URL = 'https://api.fonnte.com/send';
        
        const response = await fetch(FONNTE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': FONNTE_API_KEY
            },
            body: JSON.stringify({
                target: targetNumber,  // MENGIRIM KE NOMOR SENDIRI
                message: message,
                countryCode: '62'
            })
        });
        
        const result = await response.json();
        
        if (result.status) {
            btn.innerHTML = '<i class="fas fa-check"></i> Pesanan Terkirim!';
            btn.style.background = '#2e7d32';
            
            localStorage.removeItem('miftahOrder');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                e.target.reset();
                sliderContainer.style.display = 'none';
                priceInput.value = 'Rp 0';
                document.getElementById('sliderProgress').style.width = '0%';
                nameInput.classList.remove('error');
                phoneInput.classList.remove('error');
                nameError.classList.remove('show');
                phoneError.classList.remove('show');
            }, 2000);
        } else {
            throw new Error(result.message || 'Gagal mengirim');
        }
    } catch (error) {
        console.error('Error:', error);
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal Kirim';
        btn.style.background = '#c62828';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }
});

// ===== GALLERY LIGHTBOX =====
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const src = img.getAttribute('src');
        if (!src || src.includes('svg+xml')) return;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
            padding: 40px;
            animation: fadeIn 0.3s ease;
        `;
        overlay.innerHTML = `
            <img src="${src}" style="
                max-width: 90%;
                max-height: 90%;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                object-fit: contain;
            ">
        `;
        document.body.style.overflow = 'hidden';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => {
            overlay.remove();
            document.body.style.overflow = '';
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.parentNode) {
                overlay.remove();
                document.body.style.overflow = '';
            }
        });
    });
});

// ===== ADD FADEIN ANIMATION =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);