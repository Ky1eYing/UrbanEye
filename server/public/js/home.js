document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        root: null, // use the viewport as the root
        rootMargin: '0px', // no margin
        threshold: 0.1 // when the element is 10% in the viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // once the animation is triggered, stop observing the element
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // observe all feature cards
    document.querySelectorAll('.grid-item').forEach(item => {
        observer.observe(item);
    });
}); 