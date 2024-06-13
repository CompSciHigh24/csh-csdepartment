

const observer = new IntersectionObserver((entires)=>{
	entires.forEach((entry)=>{
		if(entry.isIntersecting){
			entry.target.classList.add("show")
		}else{
			entry.target.classList.remove("show")
		}
		
	})
})

const hiddenElements = document.querySelectorAll('.hide');
hiddenElements.forEach((el)=> observer.observe(el))

const swiper = new Swiper('.swiper', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,

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

