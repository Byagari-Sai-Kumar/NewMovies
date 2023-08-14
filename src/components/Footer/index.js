import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <footer className="iconsOverallContainer">
    <ul className="footerIconsContainer">
      <li className="iconItem">
        <FaGoogle size={14} />
      </li>
      <li className="iconItem">
        <FaTwitter size={14} />
      </li>
      <li className="iconItem">
        <FaInstagram size={14} />
      </li>
      <li className="iconItem">
        <FaYoutube size={14} />
      </li>
    </ul>
    <p className="contactUs">Contact us</p>
  </footer>
)

export default Footer
