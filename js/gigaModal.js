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
            <div class="button Previous">
                <button></button>
            </div>
            <!-- Gallery Image -->
            <div class="image">
                <div class="gigaCloseButton">
                <button> </button>
                </div>
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
        deviceType: undefined,
        pointerDown: 'up',
        lastPos: undefined,
        pointerDownStamp: undefined,
        pointerUpStamp: undefined,
        previousMoveDistance: [],

        //functions

        removeModal: function() {
            document.querySelector('#gigaModal').remove()
            document.body.style.overflow = `auto`;
            // document.removeEventListener('keydown', (e))
        },


        activeToggle: function() {
            modalDeclarations.carouselItem[modalDeclarations.index];
               modalDeclarations.carouselItem.forEach((item) => {
                    item.classList.remove('active');
                })
            modalDeclarations.carouselItem[modalDeclarations.index].classList.add('active');
        },

        initializeState: function () {
            modalDeclarations.previousMoveDistance = [];
            modalDeclarations.pointerDown = 'up';
            modalDeclarations.modalImage.style.opacity =  1;
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


    
        // Pointer events related to navigation of the carousel mini-gallery on the bottom

        modalDeclarations.carousel.addEventListener('pointerdown', e => {

        // Disables default drag-and-drop behaviour

            e.preventDefault();

        // Differentiates clicks from slides

            modalDeclarations.pointerDownStamp = e.timeStamp
            modalDeclarations.pointerDown = 'down';
            modalDeclarations.carousel.style.transition = `transform 0s`;
        })

        modalDeclarations.carousel.addEventListener('pointerup', e => {
            modalDeclarations.pointerUpStamp = e.timeStamp;

            if (modalDeclarations.pointerUpStamp - modalDeclarations.pointerDownStamp < 200) {

                modalDeclarations.carouselItem.forEach((item, index) => {
                    if (item == e.target) {
                        modalDeclarations.index = index;
                        modalDeclarations.scrollImagetoVPCenter(item, index);
                    }
                });
            };

            modalDeclarations.pointerDown = 'up';
            modalDeclarations.carousel.style.transition = `transform 0.4s ease-in-out`;
            modalDeclarations.scrollImagetoVPCenter(modalDeclarations.carouselItem[modalDeclarations.index]);
            modalDeclarations.lastPos = undefined;
        })
   
      
        modalDeclarations.carousel.addEventListener('pointermove', e => {
              
            if (typeof modalDeclarations.lastPos !== "undefined" && modalDeclarations.pointerDown == 'down' ) {
                let moveDistance = e.clientX - modalDeclarations.lastPos;
                modalDeclarations.lastPos = e.clientX;
                modalDeclarations.carousel.style.transform = `translateX(${Number(window.getComputedStyle(modalDeclarations.carousel).transform.split(',')[4]) + moveDistance}px)`;
                const middleOfTheViewport = document.documentElement.clientWidth / 2; 

                modalDeclarations.carouselItem.forEach((item, index) => {
                const getLeftEdgeItem = item.getBoundingClientRect().left;
                const carouselItemWidth = item.getBoundingClientRect().width;

                if (Math.abs(getLeftEdgeItem + carouselItemWidth /2  - middleOfTheViewport) < carouselItemWidth / 3 &&  modalDeclarations.index !== index) {
                    modalDeclarations.index = index;
                    modalDeclarations.modalImage.src =  modalDeclarations.carouselItem[modalDeclarations.index].getAttribute('src');
                    modalDeclarations.activeToggle();
                } 
            })} else {
                modalDeclarations.lastPos = e.clientX;
            }
        })

        // Pointer events related to navigation of the big preview image.

        // Enables touch swipe behaviour only when touch is supported by the device

            window.addEventListener("pointerdown", detectInputType);
                function detectInputType(event) {
                    switch(event.pointerType) {
                        case "touch":
                            modalDeclarations.deviceType = 'touch';
                            /* touch input detected */
                            break;
                    }
                }

            modalDeclarations.modalImage.addEventListener('pointerdown', e => {
                 e.preventDefault();
                modalDeclarations.pointerDown = 'down';
            });

            modalDeclarations.modalImage.addEventListener('pointermove', e => {


                if (modalDeclarations.pointerDown === 'down' && modalDeclarations.deviceType == 'touch') {
                    console.log('pointer down state');
                    if (typeof modalDeclarations.lastPos== 'undefined') {
                        modalDeclarations.lastPos= e.clientX;
                    }
                    let pointerMoveDistance = e.clientX - modalDeclarations.lastPos;
                    modalDeclarations.previousMoveDistance.push(pointerMoveDistance);
                    modalDeclarations.lastPos= e.clientX;
                    const moveDistanceSum = modalDeclarations.previousMoveDistance.reduce(
                        (accumulator, currentValue) => {return accumulator + currentValue}, 0);
                    // modalDeclarations.modalImage.style.opacity =  1 - (Math.abs(moveDistanceSum) * 0.01);
                        if (moveDistanceSum > window.innerWidth / 10) {
                            modalDeclarations.initializeState();
                            modalDeclarations.slideRight();
                    
                        } else if (moveDistanceSum < - window.innerWidth / 10) {
                            modalDeclarations.initializeState();
                            modalDeclarations.slideLeft();
                        }
                }
            });

            modalDeclarations.modalImage.addEventListener('pointerup', e => {
                modalDeclarations.lastPos= undefined;
                modalDeclarations.pointerDown = 'up';
                modalDeclarations.modalImage.style.opacity =  1;
            });

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