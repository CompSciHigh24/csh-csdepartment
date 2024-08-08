

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

