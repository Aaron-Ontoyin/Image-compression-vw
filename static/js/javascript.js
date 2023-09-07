document.addEventListener("DOMContentLoaded", function () {
  const uploadedImgInput = document.getElementById('uploaded-img');
  const uploadedImgContainer = document.getElementById('uploaded-img-container');

  uploadedImgInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'h-full rounded-lg';

        uploadedImgContainer.innerHTML = '';
        uploadedImgContainer.appendChild(img);
      };

      reader.readAsDataURL(selectedFile);
    }
  });


  const videoElement = document.getElementById('termsandconditionsgif');

  videoElement.addEventListener('mouseenter', () => {
    videoElement.play();
  });

  videoElement.addEventListener('mouseleave', () => {
    videoElement.pause();
  });

  var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };

  TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function () {
      that.tick();
    }, delta);
  };

  window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    var dataValues = [
      "Select Compression Settings",
      "Click on <i>Choose file</i> to upload Image",
      "After which, '<i>Upload an image and click here!</i>' would  change to '<i>Compress Image</i>'",
      "Clicl on <i>Compress Image</i>",
      "Clicl on <i>Download Image</i> if satisfied with the compression"
    ];
    var jsonData = JSON.stringify(dataValues);

    elements[0].setAttribute("data-type", jsonData);

    for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
  };

  // Close navbar on small screens
  const mobileMenuButton = document.querySelector('[aria-controls="mobile-menu"]');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.add('hidden');

  mobileMenuButton.addEventListener('click', () => {
    const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';

    if (expanded) {
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('hidden');
    } else {
      mobileMenuButton.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.remove('hidden');
    }
  });

  // Click to compress
  document.getElementById("compress-btn").addEventListener('click', function (e) {
    e.preventDefault();
    loadingContainer();


    var imageInput = document.getElementById("uploaded-img");

    if (imageInput.files.length === 0) {
      alert("Upload an image before clicking the button!");
    } else {
      // Show loading message
      var compressedImageContainer = document.getElementById("compressed-img-container");

      var formData = new FormData(document.getElementById("settings-form"));
      formData.append("image", imageInput.files[0]);

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/compress", true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const img = document.createElement('img');
            img.src = this.response.image_url; // NOTE:  
            img.alt = "Compressed Image"
            img.className = 'h-full rounded-lg';

            compressedImageContainer.innerHTML = '';
            compressedImageContainer.appendChild(img);
          } else {
            alert("Error: " + xhr.status + " - " + xhr.statusText);
          }
        }
      };

      xhr.send(formData);
    }
  });

});

// Display loading for compressed image div
function loadingContainer() {
  var container = document.getElementById("compressed-img-container");
  container.innerHTML = "Loading..."
}


// Limit settings
const compressionTypeDropdown = document.getElementById("compression-type");
const imageFormatDropdown = document.getElementById("image-format");

const imageFormatsByCompressionType = {
  Lossless: ["JPEG", "PNG", "BMP", "TIFF", "PPM", "PBM", "PGM", "EPS", "PSD", "PDF", "ICO", "ICNS", "TGA", "SPIDER", "XBM", "XPM", "IM"],
  Lossy: ["JPEG", "WebP", "GIF", "PPM", "PBM", "PGM", "EPS", "PSD", "PDF", "ICO", "ICNS", "TGA", "SPIDER", "XBM", "XPM", "IM"]
};

function updateImageFormats() {
  const selectedCompressionType = compressionTypeDropdown.value;
  const availableImageFormats = imageFormatsByCompressionType[selectedCompressionType];

  imageFormatDropdown.innerHTML = "";

  availableImageFormats.forEach(format => {
    const option = document.createElement("option");
    option.style.backgroundColor = "aliceblue";
    option.value = format;
    option.textContent = format;
    imageFormatDropdown.appendChild(option);
  });

  const compressionMagnitude = document.getElementById("compression-magnitude");
  const metaDataPreservation = document.getElementById("meta-data-preservation");
  const optimizationLevel = document.getElementById("optimization-level");

  if (selectedCompressionType === 'Lossless') {
    compressionMagnitude.setAttribute("disabled", true);
    metaDataPreservation.setAttribute("disabled", true);
    optimizationLevel.setAttribute("disabled", true);
  } else {
    compressionMagnitude.removeAttribute("disabled");
    metaDataPreservation.removeAttribute("disabled");
    optimizationLevel.removeAttribute("disabled");
  }
}

compressionTypeDropdown.addEventListener("change", updateImageFormats);


function changeButtonText(newText, id) {
  const button = document.getElementById(id);
  button.innerHTML = newText + `
      <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
      </svg>`;
};


function scrollTo(to) {
  const targetSection = document.getElementById(to);
  targetSection.scrollIntoView({ behavior: 'smooth' });
};

