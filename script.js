// main-page movie display for top 10 movies from TMDB api. Obtained from Canvas
const apiKey = '1528ea74a96a768b3b55d9ec1a2865d8'; //change api key
const apiUrl = 'https://api.themoviedb.org/3'; //change api url
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'; //change imageBaseUrl
let pageNumber = 1;
let movieParams = "";
let moviePath = "";
let starRating;
let userid = null;
let username = null;
// let genrePageNum = 1;


async function fetchNowPlaying() {
	try {
		const response = await fetch(`${apiUrl}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`);

		const data = await response.json();
		displayMovies(data.results);
		if (document.getElementById("load-more")) {
			document.getElementById("load-more").style.display = "none";
		}

	} catch (error) {
		console.error(error);
	}
}

async function displayMovies(movies) {

	const movieContainer = document.getElementById('movieContainer');
	if (movieContainer == null) {
		return;
	}
	if (pageNumber == 1) {
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




// save a movie to the jsonbin. Needs to be fixed...
async function saveMovie() {
	//userid = 6;

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
		let existingData = await getJSONData();
		const userData = existingData[userid];
		console.log(userid);
		console.log('Existing data:', existingData);

		const myMovies = userData.myMovies;
	


		// Append the new movie data to the existing array
		myMovies.push(jsonData);

		console.log('Updated data:', existingData);

		// Save the updated JSON array to JSONbin.io
		const responsePut = await fetch('https://api.jsonbin.io/v3/b/67166105acd3cb34a89aa6af', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-Master-Key': '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y',
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



window.onclick = function (event) {
	const modal = document.getElementById('myModal');
	if (event.target == modal) {
		modal.style.display = 'none';
	}
}




// Fetch and display top movies when the page loads
window.onload = async function () {
	if (document.getElementById("submit")) {
		document.getElementById("submit").addEventListener("click", fetchMainPageMovies);

	};
	if (document.getElementById("load-more")) {
		document.getElementById("load-more").addEventListener("click", fetchMoreMovies);

	}
	if (document.getElementById("search-bar-button")) {
		document.getElementById("search-bar-button").addEventListener("click", fetchSearchMenuMovies);


	}
	if (document.getElementById("genres")) {
		document.getElementById("genres").addEventListener("click", fetchGenreMovies);
	}
	if (document.getElementById("movies")) {
		document.getElementById("movies").addEventListener("click", fetchMainDropDownMovies);
	}
	if (document.getElementById("logout")) {
		if(userid == null || userid == undefined){
			document.getElementById("logout").style.visibility ="hidden";
			document.getElementById("logout").style.position ="absolute";

			

		}
			
	document.getElementById("logout").addEventListener("click", logout);
	
	}
	
	
	fetchNowPlaying();
	console.log(document.cookie);
	userid = document.cookie
	.split("; ")
	.find((row) => row.startsWith("userid="))
	?.split("=")[1];

	if(userid){
		const data = await getJSONData();
		username = data[userid].Username
		if (document.getElementById("signup")) {
			document.getElementById("signup").style.display = "none";
		}
		document.getElementById("account").innerHTML = `<a class="nav-link" aria-current="page" href="account.html"><img src="circle_account.svg" class="header-icons"><span>${username}</span></a>`
	}

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
function clearTextFields(event) {
	document.getElementById("searchBox").value = "";
	document.getElementById("search-bar-text").value = "";

}

// fetch movies from dropdown genre menu.
function fetchGenreMovies(event) {
	let genreID = event.target.dataset.id;
	pageNumber = 1;
	movieParams = `with_genres=${genreID}`;
	moviePath = "discover/movie";
	fetchMovies(event);
	clearTextFields(event);
}
function fetchMainDropDownMovies(event) {

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

async function signUp() {
	// Function to update data in JSONBin
	const putJSONData = async (updatedData) => {
		const binId = '67166105acd3cb34a89aa6af';
		const url = `https://api.jsonbin.io/v3/b/${binId}`;
		const headers = {
			'Content-Type': 'application/json',
			'X-Master-Key': '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y' // Master Key
		};

		try {

			const response = await fetch(url, {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify(updatedData)
			});

			if (!response.ok) {
				throw new Error('Failed to update data');
			}

			const responseData = await response.json();
			console.log('Data updated successfully:', responseData);
			alert('Sign up successful!');
		} catch (error) {
			console.error('Error updating user data:', error);
			document.getElementById('errorMessage').style.display = 'block';
		}
	};




	const userName = document.getElementById('userName').value;
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;

	if (!userName || !password || !email) {
		alert('All fields are required.');
		return;
	}

	// Fetch existing data and add new user
	let existingData = await getJSONData();
	// Ensure 'record' is an array
	if (!Array.isArray(existingData)) {
		// If it's not an array, initialize it as an empty array
		existingData = [];
	}
	console.log(existingData);

	const newUser = {
		"Username": userName,
		"Password": password,
		"Email": email,
		"myMovies": []
	};

	existingData.push(newUser); // Now this will work if existingData is an array

	// Update JSONBin with new data
	await putJSONData(existingData);

}

async function getJSONData() {


	// Function to fetch existing user data from JSONBin
	const binId = '67166105acd3cb34a89aa6af';
	const url = `https://api.jsonbin.io/v3/b/${binId}`;
	const headers = {
		'X-Master-Key': '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y' // Master Key
	};

	try {
		const response = await fetch(url, { headers: headers });

		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		const data = await response.json();



		return data.record; // Return the record if it's an array
	} catch (error) {
		console.error('Error fetching user data:', error);
		return []; // Return an empty array if there's an error
	}
};

async function login() {
	let existingData = await getJSONData();
	console.log(existingData);
	const userName = document.getElementById('username');
	const password = document.getElementById('password');
	if (!userName || !password) {
		alert('All fields are required.');
		return;
	}
	// Check array for users.
	let user;
	for(let i = 0; i < existingData.length; i++){
		user = existingData[i];
		console.log(user);
		if(user.Username == userName.value && user.Password == password.value){
			document.cookie = `userid=${i};`;
			userid = i; 
			console.log(document.cookie);
			window.location = "account.html";
			return;
		}
		
	}
	alert("Failed to Log in");


}
function logout(event){
	event.preventDefault()
	document.cookie = 'userid=;expires=' + new Date(0).toUTCString();
	userid = null;
	window.location = "index.html";

}

async function displaySavedMovies() {
    try {
        const savedMovies = await getJsonArrayFromJsonBin();
        const savedMovieList = document.getElementById('savedMovieList');
        console.log(savedMovies);

        if (savedMovies.length === 0) {
            console.log("No saved movies found");
			savedMovieList.innerHTML = '<p style="height: calc(100vh - 100px); font-size: 25px; color: white">No Saved Movies Found</p>';
			return;
        }

        // Clear existing saved movie list before displaying new data
        savedMovieList.innerHTML = "";

        savedMovies.forEach((movie, index) => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('col-md-4');
            movieDiv.innerHTML = `
                <div class="card mb-4">
                    <img src="${movie.movieImage}" class="card-img-top" alt="${movie.movieTitle}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.movieTitle}</h5>
                        <p class="card-text">${movie.movieOverview}</p>
                        <p><strong>Release Date:</strong> ${movie.movieReleaseDate}</p>
                        <p><strong>${movie.movieRating}</strong></p>
                        <textarea>${movie.movieComment}</textarea>
                        <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
            `;
            savedMovieList.appendChild(movieDiv);
        });

        // Attach event listeners to the delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', deleteMovie);
        });
    } catch (error) {
        console.error('Error fetching saved movies:', error);
    }
}


async function getJsonArrayFromJsonBin() {
	const userid = document.cookie
		.split("; ")
		.find((row) => row.startsWith("userid="))
		?.split("=")[1];
	const response = await fetch('https://api.jsonbin.io/v3/b/67166105acd3cb34a89aa6af/latest', {
		headers: {
			'X-Master-Key': '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y', //Needs to pull movies from individual user accounts in JSON bin.
		},
	});


	if (!response.ok) {
		throw new Error('Failed to fetch data:', response.statusText);
	}

	const data = await response.json();
	const userData = data.record[userid];
	console.log(userData);
	return userData.myMovies;
}

window.onclick = function (event) {
	const modal = document.getElementById('myModal');
	if (event.target == modal) {
		modal.style.display = 'none';
	}
}

//--CHATGPT--
async function deleteMovie(event) {
    const movieIndex = event.target.getAttribute('data-index'); // Get the index of the movie to delete
    console.log('Deleting movie at index:', movieIndex);

    // Get the user ID from cookies
    const userid = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userid="))
        ?.split("=")[1];

    console.log('User ID from cookie:', userid);

    // Ensure that the user is logged in
    if (!userid) {
        console.error('No user logged in');
        alert('You must be logged in to delete a movie.');
        return;
    }

    // Fetch the existing user data from JSONBin
    let existingData = await getJSONData();

    // Ensure the user data and the myMovies array exist
    const userData = existingData[userid];
    if (!userData || !userData.myMovies) {
        console.error('User data or myMovies array is missing');
        alert('Something went wrong while fetching your saved movies.');
        return;
    }

    const myMovies = userData.myMovies;

    // Ensure the movie index is valid
    if (movieIndex >= 0 && movieIndex < myMovies.length) {
        // Remove the movie from the array
        myMovies.splice(movieIndex, 1);
        console.log('Movie deleted:', myMovies);

        // Update the data on JSONBin
        await updateJsonData(existingData);

        // Re-render the saved movies list
        displaySavedMovies();
    } else {
        console.error('Invalid movie index:', movieIndex);
        alert('Failed to delete movie. Please try again.');
    }
}


//--CHATGPT--
async function updateJsonData(updatedData) {
    const binId = '67166105acd3cb34a89aa6af';  // JSONBin ID
    const url = `https://api.jsonbin.io/v3/b/${binId}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y' // Master Key
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update data');
        }

        const responseData = await response.json();
        console.log('Data updated successfully:', responseData);
    } catch (error) {
        console.error('Error updating user data:', error);
    }
}

//--CHATGPT--
async function getJSONData() {
    const binId = '67166105acd3cb34a89aa6af'; // JSONBin ID
    const url = `https://api.jsonbin.io/v3/b/${binId}`;

    const headers = {
        'X-Master-Key': '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y', // Master Key
    };

    try {
        const response = await fetch(url, { headers: headers });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data.record; // Ensure we're accessing the correct part of the data
    } catch (error) {
        console.error('Error fetching user data:', error);
        return []; // Return an empty array if there's an error
    }
}
