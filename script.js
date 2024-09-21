// main-page movie display for top 10 movies from TMDB api. Obtained from Canvas
const apiKey = '0d8f53c6f0a9bdfd2bc45e9543884d5b'; //change api key
	const apiUrl = 'https://api.themoviedb.org/3'; //change api url
	const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'; //change imageBaseUrl

	async function fetchTopMovies() {
	  try {
		const response = await fetch(`${apiUrl}/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`);
		const data = await response.json();
		displayMovies(data.results);
	  } catch (error) {
		console.error(error);
	  }
	}

	async function displayMovies(movies) {
	  const movieContainer = document.getElementById('movieContainer');

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
		movieImage.addEventListener('click', function() {
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
			const modalRating = document.getElementById('modalRating');
	  
			modalTitle.textContent = movie.title;
			modalImage.src = `${imageBaseUrl}${movie.poster_path}`;
			modalOverview.textContent = movie.overview;
			modalReleaseDate.textContent = `Release Date: ${movie.release_date}`;
			modalRating.textContent = `Rating: ${movie.vote_average}/10`;
	  
			modal.style.display = 'block';
		  }
		  
		  function closeModal() {
			const modal = document.getElementById('myModal');
			modal.style.display = 'none';
		  }
	  
		  async function saveMovie() {
			const modalTitle = document.getElementById('modalTitle').textContent;
			const modalImage = document.getElementById('modalImage').src;
			const modalOverview = document.getElementById('modalOverview').textContent;
			const modalReleaseDate = document.getElementById('modalReleaseDate').textContent;
			const modalRating = document.getElementById('modalRating').textContent;
	  
			const jsonData = {
			  movieTitle: modalTitle,
			  movieImage: modalImage,
			  movieOverview: modalOverview,
			  movieReleaseDate: modalReleaseDate,
			  movieRating: modalRating
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
			return data.record;
		  }
	  
		  window.onclick = function(event) {
			const modal = document.getElementById('myModal');
			if (event.target == modal) {
			  modal.style.display = 'none';
			}
		  }
	  
		  // Fetch and display top movies when the page loads
		  window.onload = function() {
			fetchTopMovies();
		  };