import { useEffect, useState, useRef } from 'react';
import '../css/admin.css';
import { getStoredAdminKey, setStoredAdminKey, uploadToCloudinary, createProject, pingHealth } from '../utils/adminApi';

export default function Admin() {
  const [adminKey, setAdminKeyState] = useState(getStoredAdminKey());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ title: '', description: '', src: '', cloudinary_public_id: '' });
  const [serverStatus, setServerStatus] = useState('unknown');
  const [serverPublic, setServerPublic] = useState(false);

  async function checkServer() {
    setServerStatus('checking');
    setError('');
    try {
      const res = await pingHealth();
      // Accept explicit ok=true, or any plain object, or string 'OK'
      if (
        (res && typeof res === 'object' && (res.ok === true || Object.keys(res).length > 0)) ||
        (typeof res === 'string' && res.toLowerCase().includes('ok'))
      ) {
        setServerStatus('ok');
        setSuccess('Server reachable');
        // detect public admin flag
        if (res && typeof res === 'object' && res.publicAdmin === true) setServerPublic(true);
        else setServerPublic(false);
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setServerStatus('down');
        const bodyText = typeof res === 'string' ? res : JSON.stringify(res);
        const msg = `Server returned unexpected response: ${bodyText}`;
        setError(msg);
        console.warn('checkServer unexpected response', res);
      }
    } catch (err) {
      setServerStatus('down');
      // Show detailed message if possible
      const detail = err && err.message ? err.message : String(err);
      setError(detail);
      console.error('checkServer error', err);
    }
  }
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const objectUrlRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (adminKey) setStoredAdminKey(adminKey);
    else setStoredAdminKey('');
  }, [adminKey]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) { }
        objectUrlRef.current = null;
      }
    };
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setPreviewUrl(form.src || '');
      return;
    }
    if (objectUrlRef.current) {
      try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) { }
    }
    const url = URL.createObjectURL(f);
    objectUrlRef.current = url;
    setPreviewUrl(url);
    setError('');
    setSuccess('');
  }

  // drag & drop handlers
  function onDragOver(e) { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; e.currentTarget.classList && e.currentTarget.classList.add('hover'); }
  function onDragLeave(e) { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList && e.currentTarget.classList.remove('hover'); }
  async function onDrop(e) {
    e.preventDefault(); e.stopPropagation();
    e.currentTarget.classList && e.currentTarget.classList.remove('hover');
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      if (fileRef.current) fileRef.current.files = e.dataTransfer.files;
      onFileChange({ target: { files: e.dataTransfer.files } });
    }
  }

  async function onPublish(e) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    setProgress(0);
    try {
      let uploaded = null;
      const file = fileRef.current && fileRef.current.files && fileRef.current.files[0];
      if (file) {
        // use progress-enabled upload
        uploaded = await uploadToCloudinary(file, { folder: 'projects' }, (pct) => { setProgress(pct); });
      }

      const payload = {
        title: (form.title || '').trim(),
        description: (form.description || '').trim(),
        src: uploaded ? uploaded.secure_url : (form.src || '').trim(),
        cloudinary_public_id: uploaded ? uploaded.public_id : (form.cloudinary_public_id || '') ,
        is_published: true
      };

      if (!payload.title || !payload.src) {
        throw new Error('Judul dan sumber media (file atau URL) diperlukan.');
      }

      await createProject(payload);

      // notify projects list to refresh
      try { window.dispatchEvent(new Event('projects-updated')); } catch (e) { }

      setSuccess('Project berhasil dipublikasikan');
      setForm({ title: '', description: '', src: '', cloudinary_public_id: '' });
      if (fileRef.current) fileRef.current.value = null;
      if (objectUrlRef.current) { try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) { } objectUrlRef.current = null; }
      setPreviewUrl('');
      setProgress(100);
      setTimeout(() => setProgress(0), 700);
    } catch (err) {
      setError(err.message || 'Publish failed');
      setProgress(0);
    } finally { setLoading(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <h1 className="admin-title">Projects — Admin</h1>
        </header>

        <div className="admin-login" style={{ marginBottom: 12, alignItems: 'center', display: 'flex', gap: 8 }}>
          <label style={{ opacity: 0.8 }}>Admin key:</label>
          {!serverPublic ? (
            <input type="password" placeholder="Masukkan admin key (x-admin-key)" value={adminKey} onChange={(e) => setAdminKeyState(e.target.value)} />
          ) : (
            <div style={{ color: 'var(--muted)' }}>Public mode: admin key not required</div>
          )}

          <button type="button" className="button ghost" onClick={() => checkServer()} style={{ marginLeft: 6 }}>Check server</button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className={`status-badge status-${serverStatus}`} aria-hidden>{serverStatus === 'ok' ? 'OK' : serverStatus === 'checking' ? 'Checking' : serverStatus === 'down' ? 'Down' : 'Unknown'}</div>
          </div>
        </div>

        {error && <div style={{ color: '#ff8b8b', marginBottom: 10 }} role="alert">{error}</div>}
        {success && <div style={{ color: '#a7f3d0', marginBottom: 10 }} role="status">{success}</div>}

        <main style={{ maxWidth: 700 }}>
          <form className="admin-form admin-card" onSubmit={onPublish}>
            <label>Judul</label>
            <textarea name="title" value={form.title} onChange={onChange} rows={2} className="small-textarea" required />

            <label>Deskripsi</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={4} />

            <div className="form-section">
              <label>Media</label>

              <div className={`dropzone`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => fileRef.current && fileRef.current.click()}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <strong style={{ color: 'var(--white)' }}>{previewUrl ? 'Preview ready' : 'Drag & drop file atau klik untuk pilih'}</strong>
                  <small style={{ color: 'var(--muted)' }}>Video akan diupload otomatis saat Publish</small>
                  {previewUrl && <div style={{ width: '100%', maxWidth: 480, marginTop: 8 }}><video src={previewUrl} controls className="preview-video" /></div>}
                </div>
                <input ref={fileRef} onChange={onFileChange} type="file" accept="video/*,video/mp4,video/webm,image/*" style={{ display: 'none' }} />
              </div>

              <label style={{ marginTop: 8 }}>atau gunakan URL (jika sudah upload manual)</label>
              <textarea name="src" value={form.src} onChange={onChange} rows={2} className="small-textarea" placeholder="https://..." />

              {progress > 0 && (
                <div className="progress-bar" aria-hidden>
                  <i style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>

            <div className="actions">
              <button type="submit" className="button primary" disabled={loading}>{loading ? `Publishing${progress ? ` ${progress}%` : '…'}` : 'Publish'}</button>
            </div>

            <div className="admin-help">Form minimal: Judul, Deskripsi, Media (upload otomatis ke Cloudinary) atau masukkan URL manual lalu tekan Publish.</div>
          </form>
        </main>

        {success && <div className="toast">{success}</div>}
        {error && <div className="toast" style={{ borderColor: 'rgba(255,80,80,0.14)' }}>{error}</div>}
      </div>
    </div>
  );
}
