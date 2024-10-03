
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;

    const updateGallery = () => {
        galleryItems.forEach((item, i) => {
            item.classList.toggle('active', i === currentIndex);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateGallery();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateGallery();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateGallery();
        });
    });

    updateGallery();
});
