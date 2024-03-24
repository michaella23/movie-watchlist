const searchBarEl = document.getElementById("search-bar")
const searchBtnEl = document.getElementById("search-btn")

const mainEl = document.getElementById("main-el")
const watchlistEl = document.getElementById("watchlist")

let watchlist = JSON.parse(localStorage.getItem("movies"))

function searchDatabase() {
    if (searchBarEl.value) {
        mainEl.classList.remove("initial")
        mainEl.innerHTML = ""
        let movieDetails = ""
        fetch(`https://www.omdbapi.com/?apikey=90750739&s=${searchBarEl.value}&type=movie`)
            .then(res => res.json())
            .then(data => data.Search.map((item) => {
                fetch(`https://www.omdbapi.com/?apikey=90750739&i=${item.imdbID}`)
                    .then(res => res.json())
                    .then(item => {
                        const {Poster, Title, Ratings, Runtime, Genre, Plot, imdbID} = item
                        movieDetails +=
                        `<div class="result-item flex">
                            <img src="${Poster}"/>
                            <div class="details">
                                <div class="flex title-el">
                                    <h2>${Title}</h2>
                                    <div class="rating-el">
                                        <i class="fa-solid fa-star"></i>
                                        <span class="rating">${Ratings[0].Value.substr(0,3)}</span>
                                    </div>
                                </div>
                                <div class="flex info-el">
                                    <p>${Runtime}</p>
                                    <p>${Genre}</p>
                                    <div class="flex watchlist-add" id="${imdbID}">
                                        <button class="watchlist-add-btn" onclick="addToWatchlist(event)">+</button>
                                        <p>Watchlist</p>
                                    </div>
                                </div>
                                <p>${Plot}</p>
                            </div>
                        </div>`
                        mainEl.innerHTML = movieDetails
                        })
                }))  
                searchBarEl.value = ""
    } else {
        mainEl.innerHTML = `<h2>Please enter the name of a movie.</h2>`
    }
}

function addToWatchlist(event) {
    const parentEl = event.target.parentElement
    const parentId = parentEl.id
    fetch(`https://www.omdbapi.com/?apikey=90750739&i=${parentId}`)
        .then(res => res.json())
        .then(data => {
            if (watchlist === null) {
                watchlist = []
            }
            watchlist.push(data)
            localStorage.setItem("movies", JSON.stringify(watchlist))
        })
}

function renderWatchlist() {
    if (watchlistEl) {
    const display = watchlist.map(item => 
        `<div class="result-item flex">
            <img src="${item.Poster}"/>
            <div class="details">
                <div class="flex title-el">
                    <h2>${item.Title}</h2>
                    <div class="rating-el">
                        <i class="fa-solid fa-star"></i>
                        <span class="rating">${item.Ratings[0].Value.substr(0,3)}</span>
                    </div>
                </div>
                <div class="flex info-el">
                    <p>${item.Runtime}</p>
                    <p>${item.Genre}</p>
                    <div class="flex watchlist-rmv" id="${item.imdbID}">
                        <button class="watchlist-rmv-btn" onclick="removeItem(event)">-</button>
                        <p>Watchlist</p>
                    </div>
                </div>
                <p>${item.Plot}</p>
            </div>
        </div>`
    )    
    watchlistEl.innerHTML = display
    }  
}


// console.log(JSON.parse(localStorage.getItem("movies")))
// localStorage.clear()

if (watchlist !== null) {
    renderWatchlist()   
}

function removeItem(event) {
    const parentEl = event.target.parentElement
    const parentId = parentEl.id
    const toRemove = watchlist.find(item => item.imdbID === parentId)
    watchlist.splice(watchlist.indexOf(toRemove), 1)
    localStorage.setItem("movies", JSON.stringify(watchlist))
    renderWatchlist()   
}