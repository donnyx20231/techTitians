let valueDisplays=document.querySelectorAll('.num')
let interval=1000;
valueDisplays.forEach((valueDisplay)=>{
    let startValue=0;
    let endValue= parseInt(valueDisplay.getAttribute("data-val"));
    console.log(endValue);
    let duration=Math.floor(interval/endValue);
    let counter= setInterval(function(){
        startValue+=1;
        valueDisplay.textContent=startValue;
        if(startValue==endValue){
            clearInterval(counter);
        }

    }, duration)
})




let swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  centeredSlides: false,
  slidesPerGroupSkip: 2,
  grabCursor: true,
  keyboard: {
    enabled: true,
  },
  breakpoints: {
    769: {
      slidesPerView: 1,
      slidesPerGroup: 1,
    },
  },
  scrollbar: {
    el: ".swiper-scrollbar",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
