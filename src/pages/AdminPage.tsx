import { useState } from 'react';
import { motion } from 'framer-motion';

const AdminPage = () => {
    const [password, setPassword] = useState('');


    const handleUpdate = async () => {
        // パスワードは「8339」
        if (password !== '8339') {
            alert('パスワードが間違っています。');
            return;
        }

        // 待たずに即座にGitHubの画面へジャンプする
        window.location.href = 'https://github.com/hassaku-music-v1/hassaku-music/actions/workflows/deploy.yml';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', padding: '0 2rem' }}
        >
            <h2 className="page-title">SYSTEM UPDATE</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
                パスワードを入力すると、YouTubeから最新の動画を自動取得して、ウェブサイト全体を最新化（再デプロイ）します。<br/>
                ※リクエスト後、反映されるまでに2〜3分かかります。
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワードを入力 (数字)"
                    style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1.2rem',
                        textAlign: 'center',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
                <button
                    onClick={handleUpdate}
                    className="control-btn"
                    style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        justifyContent: 'center',
                        background: 'var(--accent-gradient)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        border: 'none',
                        boxShadow: '0 8px 15px rgba(252, 163, 17, 0.3)',
                        cursor: 'pointer'
                    }}
                >
                    最新データに更新する
                </button>
            </div>
        </motion.div>
    );
};

export default AdminPage;
