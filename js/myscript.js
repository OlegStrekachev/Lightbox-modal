 'use strict'

document.querySelectorAll('.Gallery').forEach((gallery) => {
    gallery.querySelectorAll('img').forEach((el, index) => {
        el.addEventListener('click', function() {
            console.log(`I am clicked`, index);
            new GigaModalGallery(el, index);
        })
    })
    
})

