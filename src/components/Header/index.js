import Popup from 'reactjs-popup'
import {ImCancelCircle} from 'react-icons/im'
import {HiOutlineSearch} from 'react-icons/hi'
import {Link} from 'react-router-dom'
import './index.css'

const Header = () => (
  <nav className="HeaderOverallContainer">
    <div className="logoContainer">
      <Link to="/" className="websiteLogoLink">
        <img
          src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691645496/Group_7399_etanfr.png"
          alt="website logo"
          className="websiteLogo"
        />
      </Link>
      <Link to="/" className="paraLinks home">
        Home
      </Link>
      <Link to="/popular" className="paraLinks home">
        Popular
      </Link>
    </div>
    <div className="headerIconsContainer">
      <Link to="/search" className="searchIconLink">
        <button type="button" testid="searchButton" className="searchButton">
          <HiOutlineSearch color="#ffffff" size={25} />
        </button>
      </Link>

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
)

export default Header
