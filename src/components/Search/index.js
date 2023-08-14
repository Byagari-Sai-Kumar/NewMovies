import {Component} from 'react'
import Popup from 'reactjs-popup'
import {ImCancelCircle} from 'react-icons/im'
import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Search extends Component {
  state = {
    searchUserInput: '',
    searchApiStatus: apiStatusConstants.initial,
    searchResultList: [],
  }

  componentDidMount() {
    this.getSearchResultData()
  }

  getSearchResultData = async () => {
    this.setState({searchApiStatus: apiStatusConstants.inProgress})

    const {searchUserInput} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchUserInput}`
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
        posterPath: eachMovie.poster_path,
      }))

      this.setState({
        searchApiStatus: apiStatusConstants.success,
        searchResultList: updatedData,
      })
    } else {
      this.setState({searchApiStatus: apiStatusConstants.failure})
    }
  }

  onUpdateSearch = event => {
    this.setState({searchUserInput: event.target.value})
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getSearchResultData()
    }
  }

  renderSearchLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSearchSuccessView = () => {
    const {searchUserInput, searchResultList} = this.state

    return searchResultList.length > 0 ? (
      <ul className="searchResultsUnorderedList">
        {searchResultList.map(eachSearchMovie => (
          <Link
            to={`/movies/${eachSearchMovie.id}`}
            key={eachSearchMovie.id}
            className="linkItem"
          >
            <li className="movieCardList" key={eachSearchMovie.id}>
              <img
                src={eachSearchMovie.posterPath}
                alt={eachSearchMovie.title}
                className="searchMovie"
              />
            </li>
          </Link>
        ))}
      </ul>
    ) : (
      <div className="noResultsContainer">
        <img
          src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691984455/Layer_2_wai9j8.png"
          alt="no movies"
          className="noSearchResultImage"
        />
        <p className="noSearchPara">
          Your search for {searchUserInput} did not find any matches.
        </p>
      </div>
    )
  }

  renderSearchFailureView = () => (
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
        onClick={this.getSearchResultData}
      >
        Try Again
      </button>
    </div>
  )

  renderSearchViews = () => {
    const {searchApiStatus} = this.state

    switch (searchApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderSearchLoadingView()
      case apiStatusConstants.success:
        return this.renderSearchSuccessView()
      case apiStatusConstants.failure:
        return this.renderSearchFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchUserInput} = this.state

    return (
      <div testid="search" className="searchOverallBgContainer">
        <nav className="HeaderOverallContainer">
          <div className="logoContainer">
            <Link to="/" className="websiteLogoLink">
              <img
                src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691645496/Group_7399_etanfr.png"
                alt="website logo"
                className="websiteLogo"
              />
            </Link>
            <Link to="/" className="paraLinks">
              <p className="home">Home</p>
            </Link>
            <Link to="/popular" className="paraLinks">
              <p className="home">Popular</p>
            </Link>
          </div>
          <div className="iconsContainer">
            <div className="searchInputAndButtonContainer">
              <input
                type="search"
                placeholder="Search"
                className="searchBox"
                onChange={this.onUpdateSearch}
                onKeyDown={this.onEnterSearch}
                value={searchUserInput}
              />
              <button
                type="button"
                testid="searchButton"
                className="searchButton"
                onClick={this.getSearchResultData}
              >
                <HiOutlineSearch color="#ffffff" size={18} />
              </button>
            </div>

            <div className="popUp">
              <Popup
                modal
                trigger={
                  <button type="button" className="optionsButton">
                    <img
                      src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691652656/add-to-queue_1Header_sscqyx.png"
                      alt="addIcon"
                      className="addIconImage"
                    />
                  </button>
                }
                position="top left"
                className="popup-content"
              >
                {close => (
                  <div className="popUpOptionsContainer">
                    <ImCancelCircle className="close" onClick={() => close()} />
                    <Link to="/" className="popupLinkItem">
                      Home
                    </Link>
                    <Link to="/popular" className="popupLinkItem">
                      Popular
                    </Link>
                    <Link to="/search" className="popupLinkItem">
                      Search
                    </Link>
                    <Link to="/account" className="popupLinkItem">
                      Account
                    </Link>
                  </div>
                )}
              </Popup>
            </div>

            <Link to="/account" className="profileImageLink">
              <img
                src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691652856/Avatar_oceezs.png"
                alt="profile"
                className="profileImage"
              />
            </Link>
          </div>
        </nav>
        <div className="searchContainer">{this.renderSearchViews()}</div>
      </div>
    )
  }
}

export default Search
