const loadingEl = document.getElementById('loading');
const contentEl = document.getElementById('content');
const filmContainer = document.getElementById('films');

const ageMap = {
    "SIX": 6,
    "TWELVE": 12,
    "SIXTEEN": 16,
    "EIGHTEEN": 18,
};

// Fetch data from API
fetch('https://parkcinema-data-eta.vercel.app/landing')
    .then(response => response.json())
    .then(filmList => {
        console.log(filmList);
        displayFilms(filmList);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
    });

// Render film cards
function displayFilms(filmData) {
    let htmlOutput = '';

    for (let i = 0; i < filmData.length; i++) {
        const film = filmData[i];

        let langIcons = film.languages.map(language => {
            const langLower = language.toLowerCase();
            return `
                <div class="w-6 h-6">
                    <img alt="${langLower}-flag" loading="lazy" width="280" height="410"
                        class="w-full h-full"
                        src="img/${langLower}-flag.svg"
                        style="color: transparent;" />
                </div>
            `;
        }).join('');

        const preSaleLabel = film.preSale
            ? `<div class="absolute top-7 -right-12 bg-red-600 text-white text-sm sm:text-sm md:text-base font-bold rotate-[45deg] w-40 sm:w-36 md:w-48 h-6 sm:h-8 md:h-10 flex items-center justify-center shadow-lg z-10 max-sm:text-[12px] md:text-[14px] max-md:!text-[12px] max-md:-translate-y-2 max-md:-translate-x-3 max-sm:-translate-x-1 max-sm:translate-y-0">Öncədən satış</div>`
            : '';

        const imageUrl = `https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F${film.image}&w=640&q=75`;

        const screeningDate = film.firstScreeningDate.split("T")[0].replace(/-/g, ".");

        htmlOutput += `
            <li class="w-full">
                <a href="info.html?id=${film.id}">
                    <div class="aspect-[290/480] max-sm:w-full rounded-[18px] shadow-box relative cursor-pointer flex items-center overflow-hidden">
                        <div class="absolute top-0 left-0 bg-gradient-to-b from-[#00000000] via-[#0000004E] to-[#000000] z-[10] w-full h-full"></div>
                        ${preSaleLabel}
                        <img width="300" height="300" class="absolute top-0 left-0 object-cover scale-100 duration-300 z-0 w-full h-full"
                            src="${imageUrl}" alt="${film.name}" />
                        <div class="absolute bottom-0 left-0 w-full px-3 pb-4 z-10">
                            <h2 class="mb-3 text-white text-[22px] font-semibold">${film.name}</h2>
                            <div class="text-[#D9DADB] text-[14px]">${screeningDate}</div>
                            <div class="flex items-center justify-between">
                                <div class="text-[#D9DADB]">${ageMap[film.ageLimit]}+</div>
                                <div class="flex items-center gap-2">
                                    ${langIcons}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </li>
        `;
    }

    filmContainer.innerHTML = htmlOutput;
}
