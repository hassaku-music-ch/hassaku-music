import { useState } from 'react';
import { motion } from 'framer-motion';

// トークンはこの端末のブラウザにだけ、パスワードで暗号化して保存する。
// パスワード自体はどこにも保存しない（コードにも書かない）。
const ENC_KEY = 'hm_gh_token_enc';
const OLD_PLAIN_KEY = 'hm_gh_token';
const PBKDF2_ITERATIONS = 250000;

type EncryptedToken = { salt: string; iv: string; data: string };

const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

const deriveKey = async (password: string, salt: Uint8Array) => {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
        base,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

const encryptToken = async (token: string, password: string): Promise<EncryptedToken> => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(token));
    return { salt: toB64(salt), iv: toB64(iv), data: toB64(new Uint8Array(data)) };
};

// パスワードが違うと復号に失敗して null を返す
const decryptToken = async (enc: EncryptedToken, password: string): Promise<string | null> => {
    try {
        const key = await deriveKey(password, fromB64(enc.salt));
        const plain = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: fromB64(enc.iv) as BufferSource },
            key,
            fromB64(enc.data) as BufferSource
        );
        return new TextDecoder().decode(plain);
    } catch {
        return null;
    }
};

const loadEncrypted = (): EncryptedToken | null => {
    try {
        const raw = localStorage.getItem(ENC_KEY);
        return raw ? (JSON.parse(raw) as EncryptedToken) : null;
    } catch {
        return null;
    }
};

const readOldPlainToken = () => {
    try {
        return localStorage.getItem(OLD_PLAIN_KEY) || '';
    } catch {
        return '';
    }
};

const AdminPage = () => {
    const [password, setPassword] = useState('');
    // 旧方式で平文保存されていたトークンがあれば入力欄に入れておく（保存時に暗号化し、平文は消す）
    const [token, setToken] = useState(readOldPlainToken);
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [showTokenInput, setShowTokenInput] = useState(() => !loadEncrypted());
    const [status, setStatus] = useState<null | 'sending' | 'success' | 'error'>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSaveToken = async () => {
        if (!token.trim()) {
            alert('アクセストークンを入力してください。');
            return;
        }
        if (newPassword.length < 6) {
            alert('パスワードは6文字以上にしてください。');
            return;
        }
        if (newPassword !== newPassword2) {
            alert('確認用のパスワードが一致しません。');
            return;
        }
        try {
            const enc = await encryptToken(token.trim(), newPassword);
            localStorage.setItem(ENC_KEY, JSON.stringify(enc));
            localStorage.removeItem(OLD_PLAIN_KEY);
        } catch {
            alert('保存できませんでした（ブラウザの保存が無効になっている可能性があります）。');
            return;
        }
        setToken('');
        setNewPassword('');
        setNewPassword2('');
        setShowTokenInput(false);
    };

    const handleUpdate = async () => {
        const enc = loadEncrypted();
        if (!enc) {
            setShowTokenInput(true);
            alert('アクセストークンが設定されていません。');
            return;
        }

        setStatus('sending');
        setErrorMsg('');

        const savedToken = await decryptToken(enc, password);
        if (!savedToken) {
            setStatus(null);
            alert('パスワードが間違っています。');
            return;
        }

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
                const hint =
                    res.status === 401
                        ? '（トークンの期限切れの可能性があります。「トークンを変更」から設定し直してください）'
                        : '';
                setErrorMsg(`[${res.status}] ${data.message || JSON.stringify(data)} ${hint}`);
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

    const smallInput: React.CSSProperties = { ...inputStyle, fontSize: '0.9rem', marginBottom: '0.75rem' };

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
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
                        ここで決めるパスワードで暗号化して、この端末にだけ保存します。次回からはパスワードだけで更新できます。
                    </p>
                    <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="github_pat_xxxx..."
                        autoComplete="off"
                        style={smallInput}
                    />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="新しいパスワード（6文字以上）"
                        autoComplete="new-password"
                        style={smallInput}
                    />
                    <input
                        type="password"
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.target.value)}
                        placeholder="新しいパスワード（確認）"
                        autoComplete="new-password"
                        style={smallInput}
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
