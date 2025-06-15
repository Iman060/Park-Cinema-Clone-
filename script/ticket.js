const params = new URLSearchParams(location.search)
const filmId =  params.get('id')
const content = document.getElementById('content')
const loading = document.getElementById('loading')
const filmInfo = document.getElementById('filmInfo')
const price = document.getElementById('price')
const totalPrice = document.getElementById('totalPrice')
const places = document.getElementById('places')
const placesInfo = document.getElementById('placesInfo')


fetch('https://parkcinema-data-eta.vercel.app/detail')
.then(res => res.json())
.then(data => {
    let selectedFilm = data.find(filmDetails => filmDetails.id == filmId)
    renderFilmInfo(selectedFilm)
    renderPlaces()
    loading.classList.toggle('hidden')
    content.classList.toggle('hidden')
})

function renderFilmInfo(selectedFilm) {
    let kod = ''
    let filmPrice = selectedFilm.price[0].price
    let [year, month, day] = selectedFilm.calendarDate.split("T")[0].split("-")
    let hours = Math.floor(selectedFilm.movie.duration / 60)
    let mins = Math.floor(selectedFilm.movie.duration % 60)
    kod = `
        <div class="flex flex-col max-md:gap-2 md:gap-3 max-sm:text-[15px]">
            <h2 class="text-nowrap truncate">Təhlükəli döngə</h2>
            <div class="flex items-center gap-3">
                <div class="text-[18px] mt-[1px] font-semibold">
                    <div>
                        ${selectedFilm.type.split("_")[1]}
                    </div>
                </div>
            </div>
            <p class="flex items-center gap-2">
                <img alt="date" width="20" height="20" class="w-[14px]" src="/img/date.svg" />
                ${day}.${month}.${year}
            </p>
            <p class="flex items-center gap-2">
                <img alt="date" width="20" height="20" class="w-[14px]" src="/img/time.svg" />
                ${selectedFilm.time}
            </p>
        </div>
        <div class="flex flex-col max-md:gap-1 md:gap-2  max-sm:text-[13px]">
            <p class="text-[#D9DADB] !text-[16px] font-semibold">
                <span class="!text-[16px] font-semibold">Dil:</span>
                ${selectedFilm.language}
            </p>
            <p class="text-[#D9DADB] !text-[16px] font-semibold">
                <span class="!text-[16px] font-semibold">Kinoteatr:</span>
                ${selectedFilm.theatreTitle}
            </p>
            <p class="text-[#D9DADB] !text-[16px] font-semibold">
                <span class="!text-[16px] font-semibold">Zal:</span>
                ${selectedFilm.hallTitle.match(/Zal:\s*(\d+)/i)[1]}
            </p>
            <p class="text-[#D9DADB] !text-[16px] font-semibold">
                <span class="!text-[16px] font-semibold">Müddət:</span>
                0${hours}:${mins}:00
            </p>
        </div>  
    `
    price.innerHTML = ' ' + filmPrice + 'AZN'
    filmInfo.innerHTML = kod 
}
function renderPlaces() {
    let kod = ''
    for (let i = 10; i >= 1; i--) {
        kod += `<div class="w-full  max-lg:px-3 lg:px-28 mx-auto h-max flex max-lg:p-3 lg:p-8 items-center md:justify-start flex-wrap justify-center gap-3 [zoom:0.3] md:[zoom:1]">
                        <span class="select-none text-white !important text-[20px] pe-10">${i}</span>`
        for (let j = 1; j <= 10; j++) {
            kod += `<div onclick="openParams(this, ${i}, ${j})" class="p-4 relative flex rounded-lg duration-200 justify-center items-center text-xs cursor-pointer bg-[#C7C7C7] text-[#353535]" style="width: 40px; font-size: 20px; height: 40px;">${j}
                        <div class="hidden absolute duration-200 text-black bg-[#FFFFFFCC] dark:bg-[#FFFFFFCC] backdrop-blur-sm rounded-lg flex-col gap-4 opacity-100 visible z-10 bottom-full">
                            <p class="text-base text-center py-3 px-8 rounded-lg hover:bg-[#D52B1E] hover:text-white">Böyük</p>
                            <p class="text-base text-center py-3 px-8 rounded-lg hover:bg-[#D52B1E] hover:text-white">Aile</p>
                        </div>
                    </div>`
        }
        kod += `</div>`
    }
    places.innerHTML = kod
}
let selectedPlaces = []

function openParams(elm, row, col) {
    const aileCount = selectedPlaces.filter(seat => seat.type === 'Aile').length;
    const allCount = selectedPlaces.length;
    let elemParams = elm.querySelector(`div`)
    let options = elemParams.querySelectorAll('p')
    elemParams.classList.toggle('hidden')
    elemParams.classList.toggle('flex')
    if (allCount < 10) {
        options[0].onclick = () => {
            if (!elm.classList.contains('text-white')) elm.classList.add('text-white')
            elm.classList.add('!bg-[#D52B1E]')
        
            if (selectedPlaces && selectedPlaces.find(seat => seat.row == row && seat.col == col && seat.type == options[0].textContent)) {
                selectedPlaces.splice(selectedPlaces.findIndex(seat => seat.row == row && seat.col == col && seat.type == options[0].textContent), 1)
                elm.classList.remove('!bg-[#D52B1E]')
                elm.classList.remove('text-white')
            }
            else if (selectedPlaces && selectedPlaces.find(seat => seat.row == row && seat.col == col && seat.type !== options[0].textContent)) {
                selectedPlaces.splice(selectedPlaces.findIndex(seat => seat.row == row && seat.col == col && seat.type == options[1].textContent), 1)
                elm.classList.remove('!bg-[#FF9C10]')
                selectedPlaces.push({
                    row: `${row}`,
                    col: `${col}`,
                    type: `${options[0].textContent}`
                });
            }
            else {
                selectedPlaces.push({
                    row: `${row}`,
                    col: `${col}`,
                    type: `${options[0].textContent}`
                });
            }
        }
        if (aileCount < 4) {
            options[1].onclick = () => {
                if (elm.classList.contains('!bg-[#D52B1E]')) elm.classList.remove('!bg-[#D52B1E]')
                if (!elm.classList.contains('text-white')) elm.classList.add('text-white')
                elm.classList.add('!bg-[#FF9C10]')
                if (selectedPlaces && selectedPlaces.find((seat, i) => seat.row == row && seat.col == col && seat.type == options[1].textContent)) {
                    selectedPlaces.splice(selectedPlaces.findIndex(seat => seat.row == row && seat.col == col && seat.type == options[1].textContent), 1)
                    elm.classList.remove('!bg-[#FF9C10]')
                    elm.classList.remove('text-white')
                }
                else if (selectedPlaces && selectedPlaces.find(seat => seat.row == row && seat.col == col && seat.type !== options[1].textContent)) {
                    selectedPlaces.splice(selectedPlaces.findIndex(seat => seat.row == row && seat.col == col && seat.type == options[0].textContent), 1)
                    elm.classList.remove('!bg-[#D52B1E]')
                    selectedPlaces.push({
                        row: `${row}`,
                        col: `${col}`,
                        type: `${options[1].textContent}`
                    });
                }
                else {
                    selectedPlaces.push({
                        row: `${row}`,
                        col: `${col}`,
                        type: `${options[1].textContent}`
                    });
                }
            }
        }
    }
    renderSeats(aileCount, allCount)
}


function renderSeats(aileCount, allCount) {
    let kod = '' 
    console.log(selectedPlaces);
    
    for (const seat of selectedPlaces) {
        kod += `<span>Sıra ${seat.row}, Yer ${seat.col} (${seat.type})</span>`
    }
    let sum = aileCount * 6 + (allCount - aileCount) * 7
    totalPrice.innerHTML = 'Ümumi: ' + sum + ' AZN'
    placesInfo.innerHTML = kod
}
