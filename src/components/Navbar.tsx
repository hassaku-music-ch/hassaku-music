import { NavLink, Link } from 'react-router-dom';
import { Music } from 'lucide-react';

const Navbar = () => {
    return (
        <header>
            <div className="nav-content">
                <Link to="/" className="logo">
                    <Music size={24} color="#fca311" />
                    八朔 <span>MUSIC CHANNEL</span>
                    <a href="https://suno.com/@dissonantmultimedia0314" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }} onClick={(e) => e.stopPropagation()} title="Suno">
                        <img src="/task_01k9hxc69peb1v46mt7z5す8aaca_1762611635_img_0.webp" alt="Suno" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    </a>
                </Link>
                <nav className="nav-links">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                        シングル
                    </NavLink>
                    <NavLink to="/albums" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        アルバム
                    </NavLink>
                    <NavLink to="/specials" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        企画もの
                    </NavLink>
                    <NavLink to="/links" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        LINK
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
