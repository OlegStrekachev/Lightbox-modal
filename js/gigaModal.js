'use strict'

function GigaModalGallery(el, index) {

    // check if gallery already exists
        if(document.getElementById('gigaModal') !== null) {
            console.log('Instance already exists, skipping');
            return;
    }

    // check if image properly wrapped with .Gallery div
        if(el.closest('.Gallery') === null) {
            console.log('Image not wrapped properly, ignoring');
            return;        
    }


    document.body.insertAdjacentHTML("beforeend", `<div id ='gigaModal' class="gigaModalSection">
    <div class="gigaOverlay"> </div>
    <div class="gigaLargePreview">
            <div class="gigaCloseButton">
                <button> </button>
            </div>
            <div class="button Previous">
                <button></button>
            </div>
            <!-- Gallery Image -->
            <div class="image">
                <img id="modalImg" src="" alt="">
            </div>
            <div class="button Next">
                <button></button>
            </div>
    </div>
    <div class="gigaCarouselSlider">
        <div class="gigaSliderContainer">
        </div>
    </div>
    
</div>`);

    const modalDeclarations = {
        index: index,
        el: el,
        carousel: document.querySelector('.gigaSliderContainer'),
        carouselItem: 'Empty',
        modalImage: document.querySelector('#modalImg'),
        buttonPrevious: document.querySelector('.button.Previous button'),
        buttonNext: document.querySelector('.button.Next button'),
        buttonEsc: document.querySelector('.gigaModalSection .gigaCloseButton'),

        //functions

        removeModal: function() {
            document.querySelector('#gigaModal').remove()
            document.body.style.overflow = `auto`;
            document.removeEventListener('keydown', (e))
        },


        activeToggle: function() {
            modalDeclarations.carouselItem[modalDeclarations.index];
               modalDeclarations.carouselItem.forEach((item) => {
                    item.classList.remove('active');
                })
            modalDeclarations.carouselItem[modalDeclarations.index].classList.add('active');
        },

    
        scrollImagetoVPCenter: function(item, index) {
    
            const middleOfTheViewport = document.documentElement.clientWidth / 2; 
            const getLeftEdgeItem = item.getBoundingClientRect().left;
            const carouselItemWidth = item.getBoundingClientRect().width;
            let translate_X_Distance = Math.abs(getLeftEdgeItem + carouselItemWidth /2  - middleOfTheViewport); 
                if (getLeftEdgeItem + carouselItemWidth / 2 > middleOfTheViewport) {
                    translate_X_Distance = - 1 * translate_X_Distance;
                    }
            const prevTranslatexValue = Number(window.getComputedStyle(item.parentElement).transform.split(',')[4]);
            item.parentElement.style.transform = `translateX(${prevTranslatexValue + translate_X_Distance}px)`;

            modalDeclarations.modalImage.src =  modalDeclarations.carouselItem[modalDeclarations.index].getAttribute('src');

            modalDeclarations.activeToggle();
            
        },

        slideLeft: function() {
            if (modalDeclarations.index > 0) {   
                modalDeclarations.index = --modalDeclarations.index;
                modalDeclarations.scrollImagetoVPCenter(modalDeclarations.carouselItem[modalDeclarations.index]);
            }
        },

        slideRight: function() {
            if(modalDeclarations.index < modalDeclarations.carouselItem.length - 1) {
                modalDeclarations.index = ++modalDeclarations.index;
                modalDeclarations.scrollImagetoVPCenter(modalDeclarations.carouselItem[modalDeclarations.index]);
            }
        },

        bindKeyControls: function(e) {
            if (e.key === 'Escape' && document.querySelector('#gigaModal')) {
                 modalDeclarations.removeModal();
            }  else if (e.key === 'ArrowLeft') {
                modalDeclarations.slideLeft()
            } else if (e.key === 'ArrowRight') {
                modalDeclarations.slideRight()
            }
        },

    }

    this.modalExecution = function() {

        // Prevent scroll on modal open

             document.body.style.overflow = `hidden`;

        // Carousel - move images from main gallery to Carousel

          el.parentNode.querySelectorAll('img').forEach(image => {
            modalDeclarations.carousel.insertAdjacentHTML('beforeend', `<img src="${image.getAttribute('src')}" alt="">`)
            })
    
        // Setting up carousel images size
    
           modalDeclarations.carouselItem = document.querySelectorAll('.gigaSliderContainer img')

        // Carousel - initializing carousel position to center
    
            modalDeclarations.scrollImagetoVPCenter(modalDeclarations.carouselItem[modalDeclarations.index]);
    
        // Carousel slide on click
        
           modalDeclarations.carouselItem.forEach((item, index) => {
                item.addEventListener('click', () => {
                    modalDeclarations.index = index;
                    modalDeclarations.scrollImagetoVPCenter(item, index);
                })
            })

        // Passing event into key controls function

            document.addEventListener('keydown', (e) => {
                modalDeclarations.bindKeyControls(e);
            });

        
         // Adding click navigation functionality

            modalDeclarations.buttonPrevious.addEventListener('click', modalDeclarations. slideLeft);
            modalDeclarations.buttonNext.addEventListener('click', modalDeclarations. slideRight);
            modalDeclarations.buttonEsc.addEventListener('click', modalDeclarations.removeModal);

    }

    this.modalExecution()

}