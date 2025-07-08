import { motion } from "framer-motion";
import { FiGithub, FiMail, FiFigma, FiTwitter, FiLinkedin } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  const socialLinks = [
    {
      icon: <FiGithub />,
      name: "GitHub",
      url: "https://github.com/ynitylearn"
    },
    {
      icon: <FiMail />,
      name: "Email",
      url: "mailto:contact@ynitylearn.com"
    },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-accent-bar"></div>

      <div className="footer-content">
        <div className="footer-columns">
          {/* Navigation column */}
          <div className="footer-column">
            <motion.h3 whileHover={{ x: 5 }} className="footer-title navigation-title">
              Navigation
            </motion.h3>
            <ul className="footer-links">
              {[
                { name: 'Home', path: '/home' },
                { name: 'Features', path: '/features' },
              ].map((item) => (
                <motion.li whileHover={{ x: 5 }} key={item.name} className="footer-link-item">
                  <a href={item.path} className="footer-link">
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div className="footer-column">
            <motion.h3 whileHover={{ x: 5 }} className="footer-title resources-title">
              Resources
            </motion.h3>
            <ul className="footer-links">
              {[
                { name: 'API', path: '/api' },
                { name: 'Tracking Usage', path: '/UsageTracking' },

              ].map((item) => (
                <motion.li whileHover={{ x: 5 }} key={item.name} className="footer-link-item">
                  <a href={item.path} className="footer-link">
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="footer-column">
            <motion.h3 whileHover={{ x: 5 }} className="footer-title contact-title">
              Contact Us
            </motion.h3>
            <div className="social-icons">
              {socialLinks.map((social) => (
                <motion.a
                  whileHover={{ y: -3 }}
                  href={social.url}
                  key={social.name}
                  className="social-icon"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <a href="mailto:ynitylearn@gmail.com" className="contact-email">
              ynitylearn@gmail.com
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} YnityLearn. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
