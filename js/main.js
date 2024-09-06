
function Slider(sliderSelector, config = {}) {
    this.sliderList = document.querySelector(sliderSelector);
    this.slides = this.sliderList.querySelectorAll(".slider");
    this.currentIndex = 0;
    this.config = Object.assign({
        interval: 5000,
        showIndicators: true,
        showControls: true,
    }, config);
    this.autoSlide = null;
    this.paused = false;

    this.updateIndicators = function () {
        if (!this.indicators) return;
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        this.indicators[this.currentIndex].classList.add('active');
    };

    this.moveSlider = function (index) {
        const slideWidth = this.slides[0].clientWidth;
        this.sliderList.style.transform = `translateX(-${index * slideWidth}px)`;
        this.currentIndex = index;
        this.updateIndicators();
    };

    this.startSlide = function () {
        if (this.autoSlide) clearInterval(this.autoSlide);
        this.autoSlide = setInterval(() => {
            this.currentIndex = (this.currentIndex < this.slides.length - 1) ? this.currentIndex + 1 : 0;
            this.moveSlider(this.currentIndex);
        }, this.config.interval);
    };

    this.stopSlide = function () {
        clearInterval(this.autoSlide);
        this.autoSlide = null;
    };

    this.handleKeyboard = function (event) {
        switch (event.key) {
            case "ArrowLeft":
                this.prevSlide();
                break;
            case "ArrowRight":
                this.nextSlide();
                break;
            default:
                break;
        }
    };

    this.prevSlide = function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.moveSlider(this.currentIndex);
        }
        this.stopSlide();
        if (!this.paused) this.startSlide();
    };

    this.nextSlide = function () {
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
            this.moveSlider(this.currentIndex);
        }
        this.stopSlide();
        if (!this.paused) this.startSlide();
    };

    this.init = function () {
        document.addEventListener("keydown", this.handleKeyboard.bind(this));
        if (this.config.showControls) this.createControls();
        if (this.config.showIndicators) this.createIndicators();
        this.startSlide();
    };

    this.init();
}


Slider.prototype.createControls = function () {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls';

    this.prevButton = document.createElement('button');
    this.prevButton.className = 'prev';
    this.prevButton.textContent = 'Previous';
    controlsContainer.appendChild(this.prevButton);

    this.nextButton = document.createElement('button');
    this.nextButton.className = 'next';
    this.nextButton.textContent = 'Next';
    controlsContainer.appendChild(this.nextButton);

    this.pauseButton = document.createElement('button');
    this.pauseButton.className = 'pause';
    this.pauseButton.textContent = 'Pause';
    controlsContainer.appendChild(this.pauseButton);

    document.body.appendChild(controlsContainer);

    this.bindControlEvents();
};

Slider.prototype.bindControlEvents = function () {
    this.prevButton.addEventListener("click", () => this.prevSlide());
    this.nextButton.addEventListener("click", () => this.nextSlide());

    this.pauseButton.addEventListener("click", () => {
        if (this.paused) {
            this.startSlide();
            this.pauseButton.textContent = 'Pause';
        } else {
            this.stopSlide();
            this.pauseButton.textContent = 'Play';
        }
        this.paused = !this.paused;
    });
};


Slider.prototype.createIndicators = function () {
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'slider-indicator';

    this.indicators = [];
    this.slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        indicator.textContent = index + 1;
        indicator.setAttribute('data-index', index);
        indicatorContainer.appendChild(indicator);
        this.indicators.push(indicator);
    });

    document.body.appendChild(indicatorContainer);
    this.bindIndicatorEvents();
};

Slider.prototype.bindIndicatorEvents = function () {
    this.indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
            this.stopSlide();
            this.moveSlider(index);
            if (!this.paused) this.startSlide();
        });
    });
};


const slider = new Slider(".slider-list", {
    interval: 3000,
    showIndicators: true,
    showControls: true
});


