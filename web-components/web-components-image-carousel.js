// web-components-image-carousel.js
class WebComponentsImageCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.images = [
      'https://placekitten.com/300/200',
      'https://placekitten.com/301/200',
      'https://placekitten.com/302/200',
      'https://placekitten.com/304/200',
      'https://placekitten.com/307/200',
      // Add more image URLs as needed
    ];
    this.selectedImage = 0;
    this.isPaused = false;
  }

  connectedCallback() {
    this.render();
    this.startAnimation();
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .carousel {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .main-carousel {
          display: flex;
        }
        .main-image {
          width: 300px;
          height: 200px;
        }
        img {
          width: 300px;
          height: 200px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: border-color 0.3s ease-in-out;
        }
        img.selected {
          border-color: blue;
        }
        .image-preview {
          width: 50px;
          height: 30px;
          cursor: pointer;
          border: 1px solid #ccc;
          transition: border-color 0.3s ease-in-out;
        }
        .image-preview-container {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        button {
          font-size: 16px;
          cursor: pointer;
        }
        .arrow {  
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
        }
        
        .arrow:hover {
          color: blue;
        }
      </style>
      <div class="carousel">
        <div class="main-carousel">
          <button class="arrow prev-btn">&lt;</button>
          <img class="main-image" src="${this.images[this.selectedImage]}" alt="Selected Image" />
          <button class="arrow next-btn">&gt;</button>
        </div>
        <div class="image-preview-container">
          ${this.images
            .map(
              (_, index) =>
                `<img src="${this.images[index]}" alt="Image ${index}" class="image-preview ${index ===
                this.selectedImage && !this.isPaused
                  ? 'selected'
                  : ''}" data-index="${index}" />`
            )
            .join('')}
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.querySelectorAll('.image-preview').forEach((img) => {
      img.addEventListener('click', () => this.handleImageClick(img.dataset.index));
    });

    this.shadowRoot.querySelector('.prev-btn').addEventListener('click', () => this.handlePrev());
    this.shadowRoot.querySelector('.next-btn').addEventListener('click', () => this.handleNext());
  }

  startAnimation() {
    this.interval = setInterval(() => {
      if (!this.isPaused) {
        this.selectedImage = (this.selectedImage + 1) % this.images.length;
        this.updateImage();
      }
    }, 2000);
  }

  handlePrev() {
    this.selectedImage = (this.selectedImage - 1 + this.images.length) % this.images.length;
    this.isPaused = true;
    this.render();
    setTimeout(() => (this.isPaused = false), 5000);
  }

  handleNext() {
    this.selectedImage = (this.selectedImage + 1) % this.images.length;
    this.isPaused = true;
    this.render();
    setTimeout(() => (this.isPaused = false), 5000);
  }

  handleImageClick(index) {
    this.selectedImage = index;
    this.isPaused = true;
    this.render();
    setTimeout(() => (this.isPaused = false), 5000);
  }

  updateImage() {
    const imgElements = this.shadowRoot.querySelectorAll('.image-previews img');
    if (imgElements) {
      imgElements.forEach((img, index) => {
        if (index === this.selectedImage) {
          img.classList.add('selected');
        } else {
          img.classList.remove('selected');
        }
      });
    }

    const mainImage = this.shadowRoot.querySelector('.main-image');
    if (mainImage) {
      mainImage.src = this.images[this.selectedImage];
    }
  }
}

customElements.define('web-components-image-carousel', WebComponentsImageCarousel);
