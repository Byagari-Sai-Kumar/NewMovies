import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="notFoundOverallBgContainer">
    <h1 className="lostHeading">Lost Your Way</h1>
    <p className="lostPara">
      we are sorry, the page you requested could not be found Please go back to
      the homepage.
    </p>
    <Link to="/" className="linkButton">
      <button type="button" testid="goToHomeButton" className="homeButton">
        Go to Home
      </button>
    </Link>
  </div>
)

export default NotFound
