import {Component} from 'react'
import {parseISO, format} from 'date-fns'
import getYear from 'date-fns/getYear'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieItemDetails extends Component {
  state = {movieDetailsApiStatus: apiStatusConstants.initial, movieDetails: {}}

  componentDidMount() {
    this.getMovieDetailsData()
  }

  getMovieDetailsData = async () => {
    this.setState({movieDetailsApiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = {
        id: data.movie_details.id,
        backdropPath: data.movie_details.backdrop_path,
        title: data.movie_details.title,
        runtime: data.movie_details.runtime,
        isAdult: data.movie_details.adult,
        year: getYear(new Date(data.movie_details.release_date)),
        overview: data.movie_details.overview,
        ratingCount: data.movie_details.vote_count,
        ratingAverage: data.movie_details.vote_average,
        budget: data.movie_details.budget,
        releaseDate: data.movie_details.release_date,
        genres: data.movie_details.genres.map(eachGenre => ({
          id: eachGenre.id,
          name: eachGenre.name,
        })),
        audioLanguages: data.movie_details.spoken_languages.map(
          eachLanguage => ({
            id: eachLanguage.id,
            language: eachLanguage.english_name,
          }),
        ),
        similarMovies: data.movie_details.similar_movies.map(eachMovie => ({
          similarId: eachMovie.id,
          similarPosterPath: eachMovie.poster_path,
          similarTitle: eachMovie.title,
        })),
      }

      this.setState({
        movieDetailsApiStatus: apiStatusConstants.success,
        movieDetails: updatedData,
      })
    } else {
      this.setState({movieDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderMovieDetailsLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderMovieDetailsSuccessView = () => {
    const {movieDetails} = this.state

    const {
      backdropPath,
      title,
      runtime,
      isAdult,
      year,
      overview,
      ratingCount,
      ratingAverage,
      budget,
      releaseDate,
      genres,
      audioLanguages,
      similarMovies,
    } = movieDetails

    const hours = Math.floor(runtime / 60)
    const minutes = Math.floor(runtime % 60)
    const convertedRuntime = `${hours}h ${minutes}m`

    const inputDate = releaseDate
    const parsedDate = parseISO(inputDate)
    const formattedDate = format(parsedDate, 'do MMMM yyyy')

    return (
      <>
        <div
          className="bannerContainer"
          style={{backgroundImage: `url(${backdropPath})`}}
        >
          <Header />
          <div className="movieDetailsContainer">
            <h1 className="movieName">{title}</h1>
            <div className="movieTimeAndYearContainer">
              <p key={convertedRuntime}>{convertedRuntime}</p>
              <p key={isAdult} className="certificate">
                {isAdult ? 'A' : 'U/A'}
              </p>
              <p key={year} className="year">
                {year}
              </p>
            </div>
            <div className="descriptionContainer">
              <p className="description">{overview}</p>
            </div>
            <button type="button" className="playButton">
              Play
            </button>
          </div>
        </div>
        <div className="movieDetailsGenreContainer">
          <div className="movieGenreUnorderedList">
            <h1 className="genreName">Genres</h1>
            {genres.map(eachGenre => (
              <p key={eachGenre.id} className="genreText">
                {eachGenre.name}
              </p>
            ))}
          </div>

          <div className="movieGenreUnorderedList">
            <h1 className="genreName">Audio Available</h1>
            {audioLanguages.map(eachLanguage => (
              <p key={eachLanguage.id} className="genreText">
                {eachLanguage.language}
              </p>
            ))}
          </div>

          <div className="movieGenreUnorderedList">
            <h1 className="genreName">Rating Count</h1>
            <p key={ratingCount} className="genreText">
              {ratingCount}
            </p>
            <h1 className="genreName">Rating Average</h1>
            <p key={ratingAverage} className="genreText">
              {ratingAverage}
            </p>
          </div>

          <div className="movieGenreUnorderedList">
            <h1 className="genreName">Budget</h1>
            <p key={budget} className="genreText">
              {budget}
            </p>
            <h1 className="genreName">Release Date</h1>
            <p key={formattedDate} className="genreText">
              {formattedDate}
            </p>
          </div>
        </div>
        <h1 className="moreLikeThis">More like this</h1>
        <ul className="similarMoviesContainer">
          {similarMovies.map(eachMovie => (
            <li key={eachMovie.similarId} className="similarMovieCard">
              <img
                src={eachMovie.similarPosterPath}
                alt={eachMovie.similarTitle}
                className="similarMovieImage"
              />
            </li>
          ))}
        </ul>
        <Footer />
      </>
    )
  }

  renderMovieDetailsFailureView = () => (
    <div className="failureOverallContainer">
      <Header />
      <div className="failureView">
        <img
          src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691762004/Background-Complete_dfha4q.png"
          alt="failure view"
          className="failureImage"
        />
        <p className="failurePara">Something went wrong. Please try again</p>
        <button
          type="button"
          className="tryAgainButton"
          onClick={this.getMovieDetailsData}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  renderMovieDetailsView = () => {
    const {movieDetailsApiStatus} = this.state

    switch (movieDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderMovieDetailsLoadingView()
      case apiStatusConstants.success:
        return this.renderMovieDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderMovieDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div
        testid="movieItemDetails"
        className="movieItemDetailsOverallBgContainer"
      >
        {this.renderMovieDetailsView()}
      </div>
    )
  }
}

export default MovieItemDetails
