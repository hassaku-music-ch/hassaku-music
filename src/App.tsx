import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import VideoListPage from './pages/VideoListPage';
import LinksPage from './pages/LinksPage';

import ViewCounter from './components/ViewCounter';
import playlistData from './data.json';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<VideoListPage title="SINGLE" videos={playlistData.singles} />} />
          <Route path="/singles" element={<Navigate to="/" replace />} />
          <Route path="/albums" element={<VideoListPage title="ALBUM" videos={playlistData.albums} />} />
          <Route path="/specials" element={<VideoListPage title="企画もの" videos={playlistData.specials} />} />
          <Route path="/links" element={<LinksPage />} />
        </Routes>
      </main>
      <footer>
        <ViewCounter />
        <div style={{ marginTop: '1rem' }}>
          &copy; {new Date().getFullYear()} 八朔 MUSIC CHANNEL. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
