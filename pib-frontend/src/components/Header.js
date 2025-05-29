import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/piblogo.png';

function Header() {
  return (
    <header className="header">
      {/* 로고 자리 */}
      <Link to="/" className='header__logo'>
        <img src = {logo} alt = "PIB Logo" />
      </Link>

      {/* 네비게이션 */}
      <nav className="header__nav">
        <Link to="/community" className="header__link">커뮤니티</Link>
        <Link to="/dog" className="header__link">강아지</Link>
        <Link to="/cat" className="header__link">고양이</Link>
      </nav>

      <div className="header__auth">
        <Link to ="/login" className='header__button'>로그인</Link>
        <Link to="/signup" className="header__button">회원가입</Link>
      </div>
    </header>
  );
}

export default Header;