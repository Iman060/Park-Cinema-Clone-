const slideImg = document.querySelector('#slide > img')
const slide = document.getElementById('slide') 
const nextBtn = document.getElementById('nextBtn')
let x = 0
renderImg()
nextBtn.onclick = renderImg



function renderImg() {
    x++
    if (x <= 7) {
        slideImg.src = `img/swipe${x}.webp`
    }
    else {
        x = 1
        slideImg.src = `img/swipe${x}.webp`
    }

}