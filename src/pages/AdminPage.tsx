import { useState } from 'react';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'hm_gh_token';

const AdminPage = () => {
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
    const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem(STORAGE_KEY));
    const [status, setStatus] = useState<null | 'sending' | 'success' | 'error'>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSaveToken = () => {
        if (!token.trim()) return;
        localStorage.setItem(STORAGE_KEY, token.trim());
        setShowTokenInput(false);
    };

    const handleUpdate = async () => {
        if (password !== '8339') {
            alert('パスワードが間違っています。');
            return;
        }

        const savedToken = localStorage.getItem(STORAGE_KEY);
        if (!savedToken) {
            setShowTokenInput(true);
            alert('アクセストークンが設定されていません。');
            return;
        }

        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch(
                'https://api.github.com/repos/hassaku-music-ch/hassaku-music/actions/workflows/deploy.yml/dispatches',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${savedToken}`,
                        Accept: 'application/vnd.github+json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ref: 'main' }),
                }
            );

            if (res.status === 204) {
                setStatus('success');
                setPassword('');
            } else {
                const data = await res.json().catch(() => ({}));
                setErrorMsg(`[${res.status}] ${data.message || JSON.stringify(data)}`);
                setStatus('error');
            }
        } catch (e: unknown) {
            setErrorMsg(e instanceof Error ? e.message : 'ネットワークエラー');
            setStatus('error');
        }
    };

    const inputStyle: React.CSSProperties = {
        padding: '1rem',
        borderRadius: '12px',
        border: '2px solid var(--border-color)',
        fontSize: '1.1rem',
        textAlign: 'center',
        fontFamily: 'inherit',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        background: 'var(--card-bg)',
        color: 'inherit',
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
                パスワードを入力すると、YouTubeから最新の動画を自動取得して、ウェブサイト全体を最新化します。<br/>
                ※反映されるまでに2〜3分かかります。
            </p>

            {showTokenInput && (
                <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '12px', border: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <p style={{ marginBottom: '0.75rem', fontWeight: 'bold', fontSize: '0.9rem' }}>🔑 GitHubアクセストークンを設定</p>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>一度設定すれば次回から不要です。</p>
                    <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="ghp_xxxx..."
                        style={{ ...inputStyle, fontSize: '0.9rem', marginBottom: '0.75rem' }}
                    />
                    <button
                        onClick={handleSaveToken}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#334155', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        保存する
                    </button>
                </div>
            )}

            {!showTokenInput && (
                <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                    <button
                        onClick={() => setShowTokenInput(true)}
                        style={{ fontSize: '0.75rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        トークンを変更
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                    placeholder="パスワードを入力"
                    style={inputStyle}
                />
                <button
                    onClick={handleUpdate}
                    disabled={status === 'sending'}
                    className="control-btn"
                    style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        justifyContent: 'center',
                        background: status === 'sending' ? '#94a3b8' : 'var(--accent-gradient)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        border: 'none',
                        boxShadow: status === 'sending' ? 'none' : '0 8px 15px rgba(252, 163, 17, 0.3)',
                        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    }}
                >
                    {status === 'sending' ? '📡 更新リクエスト送信中...' : '最新データに更新する'}
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
                    {errorMsg}
                </div>
            )}
        </motion.div>
    );
};

export default AdminPage;
