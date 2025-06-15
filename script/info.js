const urlParams = new URLSearchParams(location.search);
const id = urlParams.get('id');

const ui = {
    main: document.querySelector('main'),
    loading: document.getElementById('loading'),
    content: document.getElementById('content'),
    cover: document.getElementById('filmCover'),
    title: document.getElementById('filmName'),
    genreList: document.getElementById('genres'),
    languageList: document.getElementById('langs'),
    subtitleList: document.getElementById('subtitles'),
    info: document.getElementById('genInfo'),
    cast: document.getElementById('actorsInfo'),
    description: document.getElementById('desc'),
    trailer: document.getElementById('yotubeVideo'),
    table: document.querySelector('table'),
};

const ageValues = {
    "SIX": 6,
    "TWELVE": 12,
    "SIXTEEN": 16,
    "EIGHTEEN": 18,
};

// Fetch data and display film
fetch('https://parkcinema-data-eta.vercel.app/detail')
    .then(r => r.json())
    .then(allFilms => {
        const foundFilm = allFilms.find(item => item.movie.id == id);
        console.log(foundFilm);
        showFilmInfo(foundFilm);
        showSession(foundFilm);
        ui.loading.classList.add('hidden');
        ui.content.classList.remove('hidden');
    });

function showFilmInfo(filmData) {
    if (!filmData) {
        ui.main.innerHTML = `<div class="flex justify-center items-center w-full h-screen text-center my-5 text-[#d52b1e] text-3xl">
                                Məlumat Bazasında Film haqqinda melumat yoxdu! <br /> -_- 
                            </div>`;
        return;
    }

    const m = filmData.movie;

    ui.cover.innerHTML = `<img width="500" height="500" class="w-full h-full object-cover" 
        src="https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F${m.image}&w=640&q=75" 
        alt="${m.name}" />`;

    ui.title.textContent = m.name;

    // Genres
    let genreStr = '';
    for (let g of m.genres) {
        genreStr += `<span>${g.title}</span>`;
    }
    ui.genreList.innerHTML = genreStr;

    // Languages
    let langStr = '';
    for (let lang of m.languages) {
        langStr += `<li><img alt="${lang}-flag" src="img/${lang.toLowerCase()}-flag.svg" /></li>`;
    }
    ui.languageList.innerHTML = langStr;

    // Subtitles
    if (m.subtitles && m.subtitles.length) {
        let subStr = '';
        for (let sub of m.subtitles) {
            subStr += `<li><img alt="${sub}-flag" src="img/${sub.toLowerCase()}-flag.svg" /></li>`;
        }
        ui.subtitleList.innerHTML = subStr;
    } else {
        ui.subtitleList.innerHTML = `<li class="text-red-700 !text-[12px] font-semibold">Altyazı yoxdur</li>`;
    }

    // Duration, year, country, director
    const hrs = Math.floor(m.duration / 60).toString().padStart(2, '0');
    const mins = (m.duration % 60).toString().padStart(2, '0');

    ui.info.innerHTML = `
        <p class="text-[#D9DADB] !text-[16px] font-normal"><span class="!text-[16px] font-semibold">Müddət:</span> ${hrs}:${mins}:00</p>
        <p class="text-[#D9DADB] !text-[16px] font-normal"><span class="!text-[16px] font-semibold">İl:</span> ${m.year}</p>
        <p class="text-[#D9DADB] !text-[16px] font-normal"><span class="!text-[16px] font-semibold">Ölkə:</span> ${m.country}</p>
        <p class="text-[#D9DADB] !text-[16px] font-normal"><span class="!text-[16px] font-semibold">Rejissor:</span> ${m.director}</p>
    `;

    // Actors, Age, Date
    const actors = m.actors.join(", ");
    const [yr, mo, dy] = m.firstScreeningDate.split("T")[0].split("-");
    ui.cast.innerHTML = `
        <p class="text-[#D9DADB] font-normal"><span class="text-[16px] font-semibold">Aktyorlar : </span>${actors}</p>
        <p class="text-[#D9DADB] !text-[16px] font-normal"><span class="!text-[16px] font-semibold">Yaş Həddi:</span> ${ageValues[m.ageLimit]}+</p>
        <p class="text-[#D9DADB] !text-[16px] font-normal"><span class="!text-[16px] font-semibold">Nümayiş Tarixi:</span> ${dy}.${mo}.${yr}</p>
    `;

    // Description
    ui.description.innerHTML = `<h2 class="text-[#D9DADB]">${m.description}</h2>`;

    // YouTube Video
    const ytID = m.youtubeUrl?.split("v=")[1];
    if (ytID) {
        ui.trailer.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytID}" title="YouTube video player" width="100%" height="100%" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`;
    }
}

function showSession(filmData) {
    const f = filmData;

    const subInfo = f.subtitle 
        ? `<span class="text-[12px] max-xs:text-[10px] max-xxs:text-[8px] text-wrap whitespace-pre">${f.subtitle}</span>`
        : '<span class="text-[12px] max-xs:text-[10px] max-xxs:text-[8px] text-wrap whitespace-pre">NO</span>';

    const row = `
        <tr class="border-b border-[#D9DADB] bg-[#383838] transition">
            <td class="py-4 px-2 text-sm max-sm:p-1 text-[#FFFFFF]">${f.time}</td>
            <td class="py-4 px-2 text-sm max-sm:p-1 text-[#FFFFFF] max-sm:hidden"></td>
            <td class="py-4 px-2 text-sm max-sm:p-1 text-[#FFFFFF] max-sm:text-[12px]">
                <div class="flex justify-center items-center gap-2">
                    <span class="max-xxs:text-[8px]">${f.theatreTitle} | ${f.hallTitle}</span>
                </div>
            </td>
            <td class="py-4 px-2 text-sm max-sm:p-1 text-[#FFFFFF]">
                <div class="flex flex-col leading-none gap-1">${f.type.split("_")[1]}</div>
            </td>
            <td class="py-4 px-2 max-sm:p-1 text-center">
                <img alt="flag" loading="lazy" width="24" height="24" src="img/${f.language.toLowerCase()}-flag.svg" />
            </td>
            <td class="py-4 px-2 text-sm text-[#FFFFFF] max-sm:p-1">
                <div class="flex items-center justify-center">
                    <div class="border border-solid border-[#D9DADB] min-h-[40px] rounded-[10px] flex flex-col gap-1 p-0.5 max-xxs:px-[1px] py-1 min-w-[20px] max-md:leading-[13px] md:leading-[16px] max-w-[100px] justify-center items-center w-max px-4">
                        ${subInfo}
                        <span class="max-xxs:text-[6px] text-[10px] max-xs:text-[8px] leading-none">sub</span>
                    </div>
                </div>
            </td>
            <td class="py-4 px-2 text-end max-sm:p-1">
                <a class="md:w-max inline-block text-end" href="/ticket.html?id=${f.id}">
                    <button class="flex items-center justify-center opacity-65 hover:opacity-100 duration-200 rounded-[20px] h-[36px] px-4 py-2 bg-[#C02020] text-white text-sm hover:bg-[#A81A1A] transition md:w-[160px] w-[100px] max-sm:w-[60px] max-sm:p-0 max-sm:text-[12px] max-sm:leading-3">Bilet Al</button>
                </a>
            </td>
        </tr>
    `;
    ui.table.innerHTML = row;
}
