// main-page movie display for top 10 movies from TMDB api. Obtained from Canvas
const apiKey = '1528ea74a96a768b3b55d9ec1a2865d8'; //change api key
const apiUrl = 'https://api.themoviedb.org/3'; //change api url
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'; //change imageBaseUrl
let pageNumber = 1;
let movieParams = "";
let moviePath = "";
let starRating;
// let genrePageNum = 1;


async function fetchNowPlaying() {
	try {
		const response = await fetch(`${apiUrl}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`);

		const data = await response.json();
		displayMovies(data.results);
		document.getElementById("load-more").style.display = "none";

	} catch (error) {
		console.error(error);
	}
}

async function displayMovies(movies) {
	const movieContainer = document.getElementById('movieContainer');
	if(pageNumber == 1){
		movieContainer.innerHTML = "";
	}
	for (const movie of movies) {
		const movieDiv = document.createElement('div');
		movieDiv.classList.add('movie');

		const movieTitle = document.createElement('p');
		movieTitle.classList.add('movie-title');
		movieTitle.textContent = movie.title;

		const movieImage = document.createElement('img');
		movieImage.src = `${imageBaseUrl}${movie.poster_path}`;
		movieImage.alt = movie.title;

		// Add event listener to open modal when clicking on the movie image
		movieImage.addEventListener('click', function () {
			openModal(movie);
		});

		movieDiv.appendChild(movieImage);
		movieDiv.appendChild(movieTitle);

		movieContainer.appendChild(movieDiv);
	}
}

function openModal(movie) {
	const modal = document.getElementById('myModal');
	const modalTitle = document.getElementById('modalTitle');
	const modalImage = document.getElementById('modalImage');
	const modalOverview = document.getElementById('modalOverview');
	const modalReleaseDate = document.getElementById('modalReleaseDate');
	// const modalRating = document.getElementById('modalRating');
	// const modalStars = document.getElementById('modalStars');


	

	modalTitle.textContent = movie.title;
	modalImage.src = `${imageBaseUrl}${movie.poster_path}`;
	modalOverview.textContent = movie.overview; 
	modalReleaseDate.textContent = `${movie.release_date}`;
	// modalRating.innerHTML = `${movie.vote_average}/10`;
	// modalStars.innerHTML = toStars(movie.vote_average);


	modal.style.display = 'block';
}

function closeModal() {
	const modal = document.getElementById('myModal');
	modal.style.display = 'none';
}

// save a movie to the jsonbin
async function saveMovie() {
	
	const modalTitle = document.getElementById('modalTitle').textContent;
	const modalImage = document.getElementById('modalImage').src;
	const modalOverview = document.getElementById('modalOverview').textContent;
	const modalReleaseDate = document.getElementById('modalReleaseDate').textContent;
	const modalRating = document.getElementById('output').textContent;
	const modalComment = document.getElementById('modalComment').value;
	
	
	const jsonData = {
		movieTitle: modalTitle,
		movieImage: modalImage,
		movieOverview: modalOverview,
		movieReleaseDate: modalReleaseDate,
		movieRating: modalRating,
		movieComment: modalComment
	};

	try {
		console.log('Attempting to save movie to library...');

		// Get the existing JSON array from JSONbin.io
		let existingData = await getJsonArrayFromJsonBin();

		console.log('Existing data:', existingData);

		// Append the new movie data to the existing array
		existingData.push(jsonData);

		console.log('Updated data:', existingData);

		// Save the updated JSON array to JSONbin.io
		const responsePut = await fetch('https://api.jsonbin.io/v3/b/66009ac7c15d220e439a53a0', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-Master-Key': '$2b$10$zhqQdXWQew55ytBi6tw5teLZTtv2I49Bx0K2R7XG.8DdZ.tlirKxC',
			},
			body: JSON.stringify(existingData),
		});

		if (responsePut.ok) {
			console.log('Data saved successfully.');
			alert('Movie saved to library successfully!');
		} else {
			console.error('Failed to save data:', responsePut.statusText);
			alert('Failed to save movie to library. Please try again later.');
		}
	} catch (error) {
		console.error('Error saving movie to library:', error);
		alert('Failed to save movie to library. Please try again later.');
	}
}

async function getJsonArrayFromJsonBin() {
	const response = await fetch('https://api.jsonbin.io/v3/b/66009ac7c15d220e439a53a0/latest', {
		headers: {
			'X-Master-Key': '$2b$10$zhqQdXWQew55ytBi6tw5teLZTtv2I49Bx0K2R7XG.8DdZ.tlirKxC',
		},
	});


	if (!response.ok) {
		throw new Error('Failed to fetch data:', response.statusText);
	}

	const data = await response.json();
	console.log(data);
	return data.record;
}

window.onclick = function (event) {
	const modal = document.getElementById('myModal');
	if (event.target == modal) {
		modal.style.display = 'none';
	}
}




// Fetch and display top movies when the page loads
window.onload = function () {
	document.getElementById("submit").addEventListener("click", fetchMainPageMovies);
	document.getElementById("load-more").addEventListener("click", fetchMoreMovies);
	document.getElementById("search-bar-button").addEventListener("click", fetchSearchMenuMovies);
	document.getElementById("genres").addEventListener("click", fetchGenreMovies);
	document.getElementById("movies").addEventListener("click", fetchMainDropDownMovies);
	fetchNowPlaying();

};

// fetches movies when searched.
async function fetchMainPageMovies(event) {
		pageNumber = 1;
		const movieName = document.getElementById("searchBox").value;
		movieParams = `query=${movieName}`;
		moviePath = "search/movie";
		fetchMovies(event);
		clearTextFields(event);
	
	
}
// fetch additional movie pages.
async function fetchMoreMovies(event) {
		pageNumber++;
		fetchMovies(event);
			
}

async function fetchMovies(event) {
	try {
		event.preventDefault();
		document.getElementById("load-more").style.display = "block";

		// console.log(event);
		// console.log(movieName);

		// const response = await fetch(`${apiUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreID}`);

		// const response = await fetch(`${apiUrl}/search/movie?query=${movieName}&api_key=${apiKey}&language=en-US&page=${pageNumber}`);
		const response = await fetch(`${apiUrl}/${moviePath}?api_key=${apiKey}&${movieParams}&language=en-US&page=${pageNumber}`);
		
		// console.log(response);
		const data = await response.json();
		// const genreData = await genreResponse.json();
		// console.log(data);
		displayMovies(data.results);
		// displayMovies(genreResponse.results)

	} catch (error) {
		console.error(error);
	}
}

// fetch movies search box.
async function fetchSearchMenuMovies(event) {
	pageNumber = 1;
	const movieName = document.getElementById("search-bar-text").value;
	movieParams = `query=${movieName}`;
	moviePath = "search/movie";
	fetchMovies(event);
	clearTextFields(event);

}
// clear search field text boxes.
function clearTextFields(event)
{
	document.getElementById("searchBox").value = "";
	document.getElementById("search-bar-text").value = "";

}

// fetch movies from dropdown genre menu.
function fetchGenreMovies(event){
	let genreID = event.target.dataset.id;
	pageNumber = 1;
	movieParams = `with_genres=${genreID}`;
	moviePath = "discover/movie";
	fetchMovies(event);
	clearTextFields(event);
}
function fetchMainDropDownMovies(event){

	let menuID = event.target.dataset.id;
	moviePath = `movie/${menuID}`;
	console.log(menuID);
	pageNumber = 1;
	fetchMovies(event);
	clearTextFields(event);

}


/* obtained via https://www.geeksforgeeks.org/star-rating-using-html-css-and-javascript/ */
// To access the stars
// Funtion to update rating
function gfg(n) {
	let stars = 
	document.getElementsByClassName("star");
let output = 
	document.getElementById("output");
	remove();
	// To remove the pre-applied styling
function remove() {
	let i = 0;
	while (i < 5) {
		stars[i].className = "star";
		i++;
	}
}
	for (let i = 0; i < n; i++) {
		if (n == 1) cls = "one";
		else if (n == 2) cls = "two";
		else if (n == 3) cls = "three";
		else if (n == 4) cls = "four";
		else if (n == 5) cls = "five";
		stars[i].className = "star " + cls;
	}
	output.innerText = "Rating: " + n + "/5";
	
}
