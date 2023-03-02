# Lightbox-modal
Dynamically created modal gallery window.

![Alt Text](https://i.imgur.com/0syuGBP.gif)

This modal gallery is dynamycally created and populated with your existing gallery images.
The modal window deletes itself from the page upon closure.

What works:

- Click navigation functionality;
- Keyboard key navigation functionality;

How to use:

1. Your gallery should have the following structure:

 ```
 <div class="Gallery">
          <img src="img1" alt="">
          <img src="img2" alt="">
          <img src="img3" alt="">
          ...
      </div>
  </div>
```

2. Paste this JS code to initiate the modal window.

```
document.querySelectorAll('.Gallery').forEach((gallery) => {
    gallery.querySelectorAll('img').forEach((el, index) => {
        el.addEventListener('click', function() {
            new GigaModalGallery(el, index);
        })
    })
})

```

3. Paste gigaModal.js to your js folder and add it to the html as a script source.

 ```
  <script src="js/myscript.js"></script>
  <script src="js/gigaModal.js"></script>
  ```
