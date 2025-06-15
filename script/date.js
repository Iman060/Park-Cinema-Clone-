const copy = document.getElementById('copy')
function getDate() {
    let kod = ''
    let date = new Date().getFullYear()
    kod = `&copy; Park Cinema, ${date}`
    copy.innerHTML = kod
}
getDate()