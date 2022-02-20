let slidePosition = 0;
const slides = document.querySelectorAll('div.photo-item');
const totalSlides = slides.length;

document.querySelector('#carousel_button_next').addEventListener('click', function () {
    nextSlide();
});

document.querySelector('#carousel_button_prev').addEventListener('click', function () {
    prevSlide();
});

function updateSlidePos() {
    console.log(slidePosition);
    console.log(slides);

    for (let slide of slides) {
        slide.classList.remove('carousel_item_visible');
        slide.classList.add('carousel_item_hidden');
    }
    slides[slidePosition].classList.add('carousel_item_visible');
}

function nextSlide() {
    console.log('next');
    if (slidePosition === totalSlides - 1) {
        slidePosition = 0;
    } else {
        slidePosition++;
    }
    updateSlidePos();
}

function prevSlide() {
    console.log('prev');
    if (slidePosition === 0) {
        slidePosition = totalSlides - 1;
    } else {
        slidePosition--;
    }
    updateSlidePos();
}