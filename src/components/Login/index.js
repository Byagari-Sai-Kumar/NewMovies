import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userNameInput: '', passwordInput: '', errorMessage: ''}

  onUpdateUserName = event => {
    this.setState({userNameInput: event.target.value})
  }

  onUpdatePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onSuccessLogin = jwtToken => {
    const {userNameInput, passwordInput} = this.state

    Cookies.set('jwt_token', jwtToken, {expires: 10, path: '/'})
    Cookies.set('user_name', userNameInput, {expires: 10, path: '/'})
    Cookies.set('password', passwordInput, {expires: 10, path: '/'})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()

    const {userNameInput, passwordInput} = this.state

    const userDetails = {
      username: userNameInput,
      password: passwordInput,
    }

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const jwtToken = data.jwt_token
      this.setState({errorMessage: ''})
      this.onSuccessLogin(jwtToken)
    } else if (data.status_code === 400) {
      this.setState({errorMessage: data.error_msg})
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {userNameInput, passwordInput, errorMessage} = this.state

    return (
      <div testid="Login" className="loginBgOverallContainer">
        <img
          src="https://res.cloudinary.com/dkx0drjah/image/upload/v1691645496/Group_7399_etanfr.png"
          alt="login website logo"
          className="websiteLogoSmDevices"
        />
        <form className="formContainer" onSubmit={this.onSubmitLoginForm}>
          <h1 className="LoginHeading">Login</h1>
          <label htmlFor="username" className="labelElement">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="inputElement"
            placeholder="User Name"
            onChange={this.onUpdateUserName}
            value={userNameInput}
          />
          <label htmlFor="password" className="labelElement">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="inputElement"
            placeholder="Password"
            onChange={this.onUpdatePassword}
            value={passwordInput}
          />
          {errorMessage.length > 0 && (
            <p className="errorMsg">{errorMessage}</p>
          )}
          <button type="submit" className="loginButton">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
