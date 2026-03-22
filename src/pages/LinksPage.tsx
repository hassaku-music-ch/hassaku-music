import { motion } from 'framer-motion';
import { Youtube, Twitter } from 'lucide-react';

const LinksPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="page-title">LINK</h2>

            <div className="links-container">
                <a
                    href="https://www.youtube.com/@Hassaku_Plus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-card youtube"
                >
                    <Youtube size={64} className="icon" />
                    <div>
                        <h3>YouTube</h3>
                        <p>@Hassaku_Plus</p>
                    </div>
                </a>

                <a
                    href="https://x.com/UCanyouhear"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-card x"
                >
                    <Twitter size={64} className="icon" />
                    <div>
                        <h3>X (Twitter)</h3>
                        <p>@UCanyouhear</p>
                    </div>
                </a>

                <a
                    href="https://suno.com/@dissonantmultimedia0314"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-card suno"
                >
                    <img src="/task_01k9hxc69peb1v46mt7z5す8aaca_1762611635_img_0.webp" alt="Suno" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                        <h3>Suno</h3>
                        <p>@dissonantmultimedia0314</p>
                    </div>
                </a>
            </div>
        </motion.div>
    );
};

export default LinksPage;
