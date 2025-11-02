import { FiGithub, FiMail } from "react-icons/fi";
import "../components/Footer.css";
import { motion } from "framer-motion";


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
          
          {/* Navigation */}
          <div className="footer-column">
            <motion.h3 whileHover={{ x: 5 }} className="footer-title navigation-title">
              Navigation
            </motion.h3>
            <ul className="footer-links">
              {[
                { name: "Home", path: "/home" },
              ].map((item) => (
                <motion.li whileHover={{ x: 5 }} key={item.name} className="footer-link-item">
                  <a href={item.path} className="footer-link">
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Product / EdTech Section */}
          <div className="footer-column">
            <motion.h3 whileHover={{ x: 5 }} className="footer-title resources-title">
              Product / EdTech
            </motion.h3>
            <ul className="footer-links">
              {[
                "AI Study Assistant",
                "Flashcards",
                "Summaries & Exams",
                "ProgressTracker",
                "IA Education",
              ].map((item) => (
                <motion.li whileHover={{ x: 5 }} key={item} className="footer-link-item">
                  <span className="footer-link">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
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

          <p className="made-by">
  Made with ❤️ by 
  <a 
    href="https://www.linkedin.com/in/yosr-joulek" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="highlight footer-name-link"
  >
    &nbsp;Yosr
  </a> 
  &nbsp;&amp;&nbsp; 
  <a 
    href="https://www.linkedin.com/in/nourhene-abbes-3179b4226/" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="highlight footer-name-link"
  >
    Nourhene
  </a>
</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer; 
