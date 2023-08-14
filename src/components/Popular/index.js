import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Popular extends Component {
  state = {popularApiStatus: apiStatusConstants.initial, popularMoviesList: []}

  componentDidMount() {
    this.getPopularMoviesData()
  }

  getPopularMoviesData = async () => {
    this.setState({popularApiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = data.results.map(eachMovie => ({
        id: eachMovie.id,
        title: eachMovie.title,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        backdropPath: eachMovie.backdrop_path,
      }))

      this.setState({
        popularApiStatus: apiStatusConstants.success,
        popularMoviesList: updatedData,
      })
    } else {
      this.setState({
        popularApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderPopularMoviesLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPopularMoviesSuccessView = () => {
    const {popularMoviesList} = this.state

    return (
      <ul className="popularMoviesUnorderedList">
        {popularMoviesList.map(eachMovie => (
          <Link
            to={`/movies/${eachMovie.id}`}
            key={eachMovie.id}
            className="popularMovieLinkItem"
          >
            <li className="popularMovieCard">
              <img
                src={eachMovie.posterPath}
                alt={eachMovie.title}
                className="popularMovieImage"
              />
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderPopularMoviesFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691669478/alert-triangle_p8unqh.png"
        alt="failure view"
        className="popularFailureImage"
      />
      <p className="failureDescription">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="tryAgainButton"
        onClick={this.getPopularMoviesData}
      >
        Try Again
      </button>
    </div>
  )

  renderPopularMoviesView = () => {
    const {popularApiStatus} = this.state

    switch (popularApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderPopularMoviesLoadingView()
      case apiStatusConstants.success:
        return this.renderPopularMoviesSuccessView()
      case apiStatusConstants.failure:
        return this.renderPopularMoviesFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div testid="popular" className="popularOverallBgContainer">
        <Header />
        <div className="popularMoviesContainer">
          {this.renderPopularMoviesView()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Popular
