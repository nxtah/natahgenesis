// Minimal admin API helper for client-side to talk to server

export function getStoredAdminKey() {
  return localStorage.getItem('admin_key') || '';
}

export function setStoredAdminKey(key) {
  if (key) localStorage.setItem('admin_key', key);
  else localStorage.removeItem('admin_key');
}

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function authFetch(url, opts = {}) {
  const adminKey = getStoredAdminKey();
  const headers = Object.assign({}, opts.headers || {});
  if (adminKey) headers['x-admin-key'] = adminKey;
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  let res;
  try {
    res = await fetch(fullUrl, Object.assign({}, opts, { headers }));
  } catch (err) {
    // Network-level error (no connection, CORS preflight blocked, DNS, etc.)
    const msg = `Network error: could not reach API at ${fullUrl}. ${err && err.message ? err.message : ''} Ensure the backend server is running and VITE_API_BASE is set correctly.`;
    const e = new Error(msg);
    e.cause = err;
    throw e;
  }

  if (res.status === 404) {
    // try to read body (if any) to give more context
    let bodyText = '';
    try { bodyText = await res.text(); } catch (e) { }
    throw new Error(`API endpoint not found (404) at ${fullUrl}. Response body: ${bodyText || '<empty>'}`);
  }

  if (!res.ok) {
    // include status and url for easier debugging
    let bodyText = '';
    try { bodyText = await res.text(); } catch (e) { }
    const msg = `API error ${res.status} at ${fullUrl}: ${bodyText || res.statusText}`;
    const e = new Error(msg);
    e.status = res.status;
    throw e;
  }
  const text = await res.text();
  let body = text;
  try { body = JSON.parse(text); } catch (e) { /* not json */ }
  if (!res.ok) {
    const err = new Error(body && body.error ? JSON.stringify(body.error) : res.statusText);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export async function pingHealth() {
  return authFetch('/api/health');
}

export async function signUpload({ folder, public_id } = {}) {
  const res = await authFetch('/api/cloudinary/sign', { method: 'POST', body: JSON.stringify({ folder, public_id }), headers: { 'Content-Type': 'application/json' } });
  // Validate sign response
  if (!res || !res.cloud_name || !res.api_key || !res.signature || !res.timestamp) {
    const bodyText = JSON.stringify(res || {});
    throw new Error(`Invalid sign response from server: ${bodyText}. Did you set Cloudinary env vars on the server and restart it?`);
  }
  return res;
}

export function uploadToCloudinary(file, opts = {}, onProgress) {
  // opts: folder
  if (!file) throw new Error('No file provided to uploadToCloudinary');
  const { folder } = opts;

  // detect resource type automatically (video files need resource_type=video)
  const resource_type = (file && file.type && file.type.startsWith('video')) ? 'video' : 'auto';

  return new Promise(async (resolve, reject) => {
    try {
      const sign = await signUpload({ folder, resource_type });
      const { signature, timestamp, api_key, cloud_name } = sign;

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', api_key);
      form.append('timestamp', timestamp);
      form.append('signature', signature);
      if (folder) form.append('folder', folder);
  // Do NOT append resource_type to the form; the endpoint path already encodes it and signing should match the form fields
      const url = `https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload`;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && typeof onProgress === 'function') {
          const percent = Math.round((e.loaded / e.total) * 100);
          try { onProgress(percent); } catch (err) { }
        }
      };

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { const json = JSON.parse(xhr.responseText); resolve(json); } catch (e) { reject(new Error('Invalid JSON from Cloudinary')); }
        } else {
          reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = function () { reject(new Error('Cloudinary upload network error')); };

      xhr.send(form);
    } catch (err) {
      reject(err);
    }
  });
}

export async function fetchProjects() {
  return authFetch('/api/projects');
}

export async function createProject(payload) {
  return authFetch('/api/projects', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
}

export async function updateProject(id, payload) {
  return authFetch(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
}

export async function deleteProject(id) {
  return authFetch(`/api/projects/${id}`, { method: 'DELETE' });
}
