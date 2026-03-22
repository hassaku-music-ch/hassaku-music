import { useState } from 'react';
import { motion } from 'framer-motion';

const AdminPage = () => {
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<null | 'sending' | 'success' | 'error'>(null);

    const handleUpdate = async () => {
        // パスワードは「839（ハッサク）」
        if (password !== '839') {
            alert('パスワードが間違っています。');
            return;
        }

        setStatus('sending');
        try {
            // ユーザー指定のNetlify Build Hook URL
            const response = await fetch('https://api.netlify.com/build_hooks/69bfc01d1e80d0638bc2447a', {
                method: 'POST'
            });
            
            if (response.ok) {
                setStatus('success');
                setPassword('');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
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
                    disabled={status === 'sending'}
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
                        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                        opacity: status === 'sending' ? 0.7 : 1
                    }}
                >
                    {status === 'sending' ? '📡 リクエスト送信中...' : '最新データに更新する'}
                </button>
            </div>

            {status === 'success' && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#dcfce7', color: '#166534', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <strong>✅ 更新リクエストを送信しました！</strong><br/>
                    約2〜3分後にサイトを再読み込みしてください。
                </div>
            )}
            {status === 'error' && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', border: '1px solid #fecaca' }}>
                    <strong>❌ エラーが発生しました。</strong><br/>
                    通信状況を確認してください。
                </div>
            )}
        </motion.div>
    );
};

export default AdminPage;
