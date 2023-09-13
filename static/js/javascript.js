// Function to display image information in a given span
function displayImageInfo(size, type, height, width, specsSpan) {
  // Create a new paragraph element to display image information
  const infoParagraph = document.createElement('p');

  const infoText = document.createTextNode(`Resolution: ${width}x${height}, `);
  const fileSizeKB = Math.round(size / 1024);

  const fileTypeText = document.createTextNode(`Type: ${type}, `);
  const fileSizeText = document.createTextNode(`Size: ${fileSizeKB} KB`);

  // Append text nodes to the paragraph element
  infoParagraph.appendChild(infoText);
  infoParagraph.appendChild(fileTypeText);
  infoParagraph.appendChild(fileSizeText);

  // Append the paragraph to the specified span
  specsSpan.innerHTML = '';
  specsSpan.appendChild(infoParagraph);
};

document.addEventListener("DOMContentLoaded", function () {

  const uploadedImgInput = document.getElementById("uploaded-img");
  const uploadedImgContainer = document.getElementById("uploaded-img-container");

  uploadedImgInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = "Uploaded Image";
        img.className = 'h-full rounded-lg';

        uploadedImgContainer.innerHTML = '';
        uploadedImgContainer.appendChild(img);

        // Display image information for the uploaded image\
        const type = selectedFile.name.split('.').pop();
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          displayImageInfo(selectedFile.size, type, height, width, document.getElementById("original-specs"));
        }
      };

      reader.readAsDataURL(selectedFile);
    }
  });

  const compressedImageContainer = document.getElementById("compressed-img-container");
  const downloadButton = document.getElementById("download-img");

  downloadButton.addEventListener('click', () => {
    // Check if there is an image in the compressedImageContainer
    const image = compressedImageContainer.querySelector('img');

    if (image) {
      // If an image exists, create a download link for it
      const downloadLink = document.createElement('a');
      downloadLink.href = image.src;
      downloadLink.download = "compressed-image"; // Set the desired download file name
      downloadLink.style.display = 'none'; // Hide the download link

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      // If there's no image, display an error message
      alert("Upload and compress Image before!");
    }
  });

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
    "Click on '<i>Click here to Compress</i>'.",
    "Compare Original with compressed image",
    "Click on <i>Download Image</i> if satisfied with the compression"
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
    var compressedImageContainer = document.getElementById("compressed-img-container");

    var formData = new FormData(document.getElementById("settings-form"));
    formData.append("image", imageInput.files[0]);

    var imageXhr = new XMLHttpRequest();
    imageXhr.responseType = "blob";
    imageXhr.open("POST", "/api/compress", true);

    imageXhr.onreadystatechange = function () {
      if (imageXhr.readyState === 4) {
        if (imageXhr.status === 200) {
          const img = document.createElement('img');

          var processedImageBlob = imageXhr.response;
          var processedImageUrl = URL.createObjectURL(processedImageBlob);

          img.src = processedImageUrl
          img.alt = "Compressed Image"
          img.className = 'h-full rounded-lg';

          compressedImageContainer.innerHTML = '';
          compressedImageContainer.appendChild(img);

          var imageDataXhr = new XMLHttpRequest();
          imageDataXhr.open("GET", "/api/image-data", true);
          imageDataXhr.onreadystatechange = function () {
            if (imageDataXhr.readyState === 4) {
              if (imageDataXhr.status === 200) {
                const imgData = JSON.parse(imageDataXhr.response);

                displayImageInfo(imgData.size, imgData.format, imgData.height, imgData.width, document.getElementById("compressed-specs"));
              } else {
                alert("Error: " + imageXhr.status + " - " + imageXhr.statusText);
              }
            }
          }
          imageDataXhr.send();

        } else {
          alert("Error: " + imageXhr.status + " - " + imageXhr.statusText);
        }
  
      }
    };

    imageXhr.send(formData);
  }
});

// Display loading for compressed image div
function loadingContainer() {
  var container = document.getElementById("compressed-img-container");
  container.innerHTML = "Loading... A moment..."
}


// Limit settings
const compressionTypeDropdown = document.getElementById("compression-type");
const imageFormatDropdown = document.getElementById("image-format");

const imageFormatsByCompressionType = {
  Lossless: ["PNG", "BMP"],
  Lossy: ["JPEG", "WebP", "GIF"],
  // , "TIFF", "PPM", "PBM", "PGM", "EPS", "PSD", "ICO", "ICNS", "TGA", "SPIDER", "XBM", "XPM", "IM"
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

const resolutionStatus = document.getElementById("resolution_status");
resolutionStatus.addEventListener("change", function () {
  if (resolutionStatus === "Original") {
    document.getElementById("res1").setAttribute("disabled", true);
    document.getElementById("res2").setAttribute("disabled", true);
  } else {
    document.getElementById("res1").removeAttribute("disabled");
    document.getElementById("res2").removeAttribute("disabled");
  }
})

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

