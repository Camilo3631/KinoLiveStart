const themeSwitch = () => {
    const themeToggleButton = document.getElementById('themeSwitch');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.add('light-theme');
    }

    themeToggleButton.addEventListener('change', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
};



// Arrow function para el setupSlider
const setupSlider = () => {
    const slider = document.querySelector('.movie-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX  - slider.offsetLeft; 
        const walk = (x - startX) * 2;
       slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener('wheel', (e) => {
        e.preventDefault();
        slider.scrollLeft += e.deltaY;  
    });
};

// Invocamos las funciones cuando carge la página
document.addEventListener('DOMContentLoaded', () => {
    themeSwitch();
    setupSlider();
});


