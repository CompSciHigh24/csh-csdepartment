

const observer = new IntersectionObserver((entires)=>{
	entires.forEach((entry)=>{
		if(entry.isIntersecting){
			entry.target.classList.add("show")
		}	
		// }else{
		// 	entry.target.classList.remove("show")
		// }
		
	})
})

const hiddenElements = document.querySelectorAll('.hide');
hiddenElements.forEach((el)=> observer.observe(el))

const swiper = new Swiper('.swiper-Imgs', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	autoplay: {
		delay: 4500, // Delay between slides in milliseconds (5 seconds)
		disableOnInteraction: false, // Autoplay will not be disabled after user interactions
	},
	speed: 1500,

	// If we need pagination
	pagination: {
		el: '.swiper-pagination',
	},

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	// And if we need scrollbar
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});


const swiperProjects = new Swiper('.swiper-Projects', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	autoplay: {
		delay: 6000, // Delay between slides in milliseconds (5 seconds)
		disableOnInteraction: false, // Autoplay will not be disabled after user interactions
	},
	speed: 1500,

	// If we need pagination
	pagination: {
		el: '.swiper-pagination',
	},

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	// And if we need scrollbar
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});


let currentIndex = 0;
const images = document.querySelectorAll('.swiper-Imgs .swiper-slide img');

function updatePreviews() {
		const prevIndex = (currentIndex - 1 + images.length) % images.length;
		const nextIndex = (currentIndex + 1) % images.length;

		document.getElementById('prev-preview').src = images[prevIndex].src;
		document.getElementById('current-preview').src = images[currentIndex].src;
		document.getElementById('next-preview').src = images[nextIndex].src;
}

function openLightbox(img) {
		document.getElementById('lightbox').classList.remove('hidden');
		const lightboxImg = document.getElementById('lightbox-img');
		lightboxImg.style.opacity = '0';
		setTimeout(() => {
				lightboxImg.src = img.src;
				lightboxImg.style.opacity = '1';
		}, 300);
		currentIndex = Array.from(images).indexOf(img);
		updatePreviews();
}

function closeLightbox() {
		document.getElementById('lightbox').classList.add('hidden');
}

function changeImage(newIndex) {
		const lightboxImg = document.getElementById('lightbox-img');
		lightboxImg.style.opacity = '0';
		setTimeout(() => {
				currentIndex = newIndex;
				lightboxImg.src = images[currentIndex].src;
				lightboxImg.style.opacity = '1';
				updatePreviews();
		}, 300);
}

function prevImage() {
		changeImage((currentIndex - 1 + images.length) % images.length);
}

function nextImage() {
		changeImage((currentIndex + 1) % images.length);
}

// Add click events to preview images
document.getElementById('prev-preview').addEventListener('click', prevImage);
document.getElementById('next-preview').addEventListener('click', nextImage);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
		if (!document.getElementById('lightbox').classList.contains('hidden')) {
				if (e.key === 'ArrowLeft') prevImage();
				if (e.key === 'ArrowRight') nextImage();
				if (e.key === 'Escape') closeLightbox();
		}
});

// Ensure all images are loaded before initializing Swiper
window.addEventListener('load', () => {
		const swiperImgs = new Swiper('.swiper-Imgs', {
				// ... (previous Swiper options remain the same)
		});
});