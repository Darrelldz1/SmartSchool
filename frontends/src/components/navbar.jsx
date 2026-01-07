import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar container-centered">
      <div className="nav-left">
        <img src="/images/logo.png" alt="Smart School" className="logo" />
      </div>

      <div className="nav-center">
        <ul className="menu">
          <li><a href="#">Beranda</a></li>
          <li><a href="#">Profil</a></li>
          <li><a href="#">Galeri</a></li>
          <li><a href="#">Pengumuman</a></li>
          <li><a href="#">visi &misi</a></li>
          <li><a href="#">Daftar</a></li>
        </ul>
      </div>

      <div className="nav-right">
        <button className="btn-login">MASUK</button>
      </div>
    </nav>
  );
}
