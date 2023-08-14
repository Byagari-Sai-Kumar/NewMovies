import {Component} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
}

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    trendingApiStatus: apiStatusConstants.initial,
    trendingList: [],
    originalsApiStatus: apiStatusConstants.initial,
    originalsList: [],
    bannerApiStatus: apiStatusConstants.initial,
    bannerMovie: {},
  }

  componentDidMount() {
    this.getTrendingVideosData()
    this.getOriginalsVideosData()
  }

  getOriginalsVideosData = async () => {
    this.setState({
      originalsApiStatus: apiStatusConstants.inProgress,
      bannerApiStatus: apiStatusConstants.inProgress,
    })

    const url = 'https://apis.ccbp.in/movies-app/originals'
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

      const bannerItem =
        updatedData[Math.floor(Math.random() * updatedData.length)]

      const updatedBannerData = {
        title: bannerItem.title,
        overview: bannerItem.overview,
        backdropPath: bannerItem.backdropPath,
      }

      this.setState({
        originalsApiStatus: apiStatusConstants.success,
        originalsList: updatedData,
        bannerApiStatus: apiStatusConstants.success,
        bannerMovie: updatedBannerData,
      })
    } else {
      this.setState({
        originalsApiStatus: apiStatusConstants.failure,
        bannerApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderBannerLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderBannerSuccessView = () => {
    const {bannerMovie} = this.state
    const {title, overview} = bannerMovie

    return (
      <>
        <h1 className="bannerMovieHeading">{title}</h1>
        <div className="bannerDescriptionContainer">
          <p className="bannerMovieDescription">{overview}</p>
        </div>
        <button type="button" className="playButton">
          Play
        </button>
      </>
    )
  }

  renderBannerFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691669478/alert-triangle_p8unqh.png"
        alt="failure view"
        className="failureImage"
      />
      <p className="failureDescription">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        testid="tryButton"
        className="tryAgainButton"
        onClick={this.getOriginalsVideosData}
      >
        Try Again
      </button>
    </div>
  )

  renderBannerViews = () => {
    const {bannerApiStatus} = this.state

    switch (bannerApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderBannerLoadingView()
      case apiStatusConstants.success:
        return this.renderBannerSuccessView()
      case apiStatusConstants.failure:
        return this.renderBannerFailureView()
      default:
        return null
    }
  }

  renderOriginalsLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderOriginalsSuccessView = () => {
    const {originalsList} = this.state

    return (
      <Slider {...settings} className="slider">
        {originalsList.map(eachLogo => {
          const {id, title, posterPath} = eachLogo
          return (
            <Link to={`/movies/${id}`} className="slick-item" key={id}>
              <img className="logo-image" src={posterPath} alt={title} />
            </Link>
          )
        })}
      </Slider>
    )
  }

  renderOriginalsFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691669478/alert-triangle_p8unqh.png"
        alt="failure view"
        className="trendingFailureImage"
      />
      <p className="failureDescription">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="tryAgainButton"
        onClick={this.getOriginalsVideosData}
      >
        Try Again
      </button>
    </div>
  )

  renderOriginalsViews = () => {
    const {originalsApiStatus} = this.state

    switch (originalsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderOriginalsLoadingView()
      case apiStatusConstants.success:
        return this.renderOriginalsSuccessView()
      case apiStatusConstants.failure:
        return this.renderOriginalsFailureView()
      default:
        return null
    }
  }

  getTrendingVideosData = async () => {
    this.setState({trendingApiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)

    if (response.ok) {
      const updatedData = data.results.map(eachMovie => ({
        id: eachMovie.id,
        title: eachMovie.title,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        backdropPath: eachMovie.backdrop_path,
      }))

      this.setState({
        trendingApiStatus: apiStatusConstants.success,
        trendingList: updatedData,
      })
    } else {
      this.setState({trendingApiStatus: apiStatusConstants.failure})
    }
  }

  renderTrendingLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderTrendingSuccessView = () => {
    const {trendingList} = this.state

    return (
      <Slider {...settings} className="slider">
        {trendingList.map(eachLogo => {
          const {id, title, posterPath} = eachLogo
          return (
            <Link to={`/movies/${id}`} className="slick-item" key={id}>
              <img className="logo-image" src={posterPath} alt={title} />
            </Link>
          )
        })}
      </Slider>
    )
  }

  renderTrendingFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691669478/alert-triangle_p8unqh.png"
        alt="failure view"
        className="trendingFailureImage"
      />
      <p className="failureDescription">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="tryAgainButton"
        onClick={this.getTrendingVideosData}
      >
        Try Again
      </button>
    </div>
  )

  renderTrendingViews = () => {
    const {trendingApiStatus} = this.state

    switch (trendingApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderTrendingLoadingView()
      case apiStatusConstants.success:
        return this.renderTrendingSuccessView()
      case apiStatusConstants.failure:
        return this.renderTrendingFailureView()
      default:
        return null
    }
  }

  render() {
    const {bannerMovie} = this.state

    const {backdropPath} = bannerMovie

    return (
      <div testid="home" className="homeBgOverallContainer">
        <div
          className="topContainer"
          style={{
            backgroundImage: `url(${backdropPath})`,
            backgroundSize: 'cover',
          }}
        >
          <Header />
          <div className="bannerMovieDetailsContainer">
            {this.renderBannerViews()}
          </div>
        </div>
        <div className="bottomContainer ">
          <h1 className="heading">Trending Now</h1>
          <div className="reactSlickContainer">
            {this.renderTrendingViews()}
          </div>
          <h1 className="heading">Originals</h1>
          <div className="reactSlickContainer">
            {this.renderOriginalsViews()}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
