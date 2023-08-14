import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const Account = props => {
  const userName = Cookies.get('user_name')
  const userPassword = Cookies.get('password')
  const maskedPassword = '*'.repeat(userPassword.length)

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    Cookies.remove('user_name')
    Cookies.remove('password')

    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="accountOverallBgContainer">
      <Header />
      <div className="accountDetailsContainer">
        <h1 className="accountHeading">Account</h1>
        <hr className="hrLine" />
        <div className="detailsContainer">
          <p className="userNameHeading">Member ship</p>
          <p className="userName">: {userName}</p>
        </div>
        <div className="detailsContainer">
          <p className="userNameHeading">Password</p>
          <p className="userName">: {maskedPassword}</p>
        </div>
        <hr className="hrLine" />
        <div className="detailsContainer">
          <p className="userNameHeading">Plan details</p>
          <p className="userName">: Premium</p>
          <p className="userName"> Ultra HD</p>
        </div>
        <hr className="hrLine" />
        <button type="button" className="logoutButton" onClick={onClickLogout}>
          Logout
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default Account
