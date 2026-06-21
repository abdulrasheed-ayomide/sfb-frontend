import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo />
          <p className="text-sm mt-4" style={{ maxWidth: '320px' }}>
            Spring Financial Bank is committed to secure, transparent digital
            banking — built for individuals and businesses who expect more
            from their bank.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/#about">About SFB</a></li>
            <li><a href="/#features">Features</a></li>
            <li><a href="/#contact">Contact</a></li>
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/register">Open an account</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms and Conditions</Link></li>
            <li><Link to="/admin/login">Admin Portal</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <ul className="footer-social">
            <li><a href="#" aria-label="SFB on X (Twitter)">X (Twitter)</a></li>
            <li><a href="#" aria-label="SFB on LinkedIn">LinkedIn</a></li>
            <li><a href="#" aria-label="SFB on Instagram">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Spring Financial Bank. All rights reserved.</span>
        <span className="text-xs">SFB is a licensed digital banking platform. Deposits insured up to applicable limits.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
