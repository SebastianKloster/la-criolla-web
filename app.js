const config = window.LA_CRIOLLA;
const wa = text => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;

document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = wa(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
});

document.getElementById('directions').href = config.maps;
const dialog = document.getElementById('menu-dialog');

document.querySelectorAll('[data-menu]').forEach(a => {
    const label = a.dataset.menu === 'cartaTe' ? 'Casa de Té' : 'Parrilla';

    if (config[a.dataset.menu]) {
        a.href = config[a.dataset.menu];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
    } else {
        a.href = '#carta';
        a.setAttribute('aria-haspopup', 'dialog');
        a.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('dialog-title').textContent = `Carta de ${label}`;
            document.getElementById('request-menu').href = wa(`Hola, ¿me podrían enviar la carta de ${label}?`);
            dialog.showModal();
        });
    }
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());

dialog.addEventListener('click', e => {
    if (e.target === dialog) {
        const r = dialog.getBoundingClientRect();

        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
            dialog.close();
    }
});

const slides = [
    ['04', 'Un laberinto entre el verde', 'Laberinto vegetal de La Criolla'],
    ['03', 'Senderos para ir sin apuro', 'Sendero arbolado en el parque de La Criolla'],
    ['07', 'La calma del jardín', 'Jardín con flores y senderos de La Criolla'],
    ['17', 'Una pausa, rodeados de naturaleza', 'Galería de La Criolla rodeada de flores'],
    ['12', 'Cuando cae la tarde', 'La Criolla iluminada al atardecer']
];

let index = 0;

function showSlide(change) {
    index = (index + change + slides.length) % slides.length;
    const [file, title, alt] = slides[index];
    const img = document.getElementById('gallery-image');
    img.src = `assets/photo-${file}.jpg`;
    img.alt = alt;
    document.getElementById('gallery-title').textContent = title;
    document.getElementById('gallery-count').textContent = `${String(index + 1).padStart(2, '0')} / 05`;
}

document.getElementById('previous').addEventListener('click', () => showSlide(-1));
document.getElementById('next').addEventListener('click', () => showSlide(1));

const gallery = document.querySelector('.gallery');

gallery.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        showSlide(e.key === 'ArrowLeft' ? -1 : 1);
    }
});

let touchStart = null;

gallery.addEventListener('touchstart', e => {
    touchStart = e.changedTouches[0].clientX;
}, { passive: true });

gallery.addEventListener('touchend', e => {
    if (touchStart !== null) {
        const diff = e.changedTouches[0].clientX - touchStart;

        if (Math.abs(diff) > 50)
            showSlide(diff < 0 ? 1 : -1);

        touchStart = null;
    }
}, { passive: true });
