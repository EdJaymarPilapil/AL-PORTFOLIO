// --- Supabase Setup ---
const supaUrl = 'https://csteoeudjuzyhkhjaszo.supabase.co';
const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdGVvZXVkanV6eWhraGphc3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNDg2MDksImV4cCI6MjA4OTgyNDYwOX0.R2IsssIzOYjDMQiu_0Ona6zjI3COy2ui_swbFpFaroU';
const supabase = window.supabase.createClient(supaUrl, supaKey);

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const adminEmail = document.getElementById('adminEmail');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).style.display = 'block';
    });
});

// Check Session
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        adminEmail.textContent = session.user.email;
    } else {
        authSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
    }
}
checkSession();

// Auth Listeners
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') checkSession();
    if (event === 'SIGNED_OUT') checkSession();
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    loginBtn.textContent = 'Authenticating...';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        loginError.textContent = error.message;
        loginBtn.textContent = 'Authenticate Server';
    }
});

logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    loginBtn.textContent = 'Authenticate Server';
});

// Helper for Uploads
async function uploadImage(file) {
    if(!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from('portfolio_images').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('portfolio_images').getPublicUrl(filePath);
    return data.publicUrl;
}

function handleStatus(form, text, isError = false) {
    const status = form.querySelector('.form-status');
    status.textContent = text;
    status.style.color = isError ? "red" : "var(--gold)";
}

// Form Overrides
document.getElementById('form-coaching').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const og = btn.textContent;
    btn.textContent = 'Uploading...';
    try {
        handleStatus(e.target, '');
        const file = document.getElementById('c-image').files[0];
        const publicUrl = await uploadImage(file);
        
        const { error } = await supabase.from('coaching_cards').insert([{
            image_url: publicUrl,
            badge_text: document.getElementById('c-badge').value,
            title: document.getElementById('c-title').value,
            description: document.getElementById('c-desc').value,
            sort_order: document.getElementById('c-sort').value
        }]);
        if (error) throw error;
        handleStatus(e.target, 'Successfully published!');
        e.target.reset();
    } catch(err) { 
        console.error('Coaching Error:', err);
        handleStatus(e.target, `Error: ${err.message}${err.hint ? ' - Hint: ' + err.hint : ''}`, true); 
    }
    finally { btn.textContent = og; }
});

document.getElementById('form-ecosystem').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const og = btn.textContent;
    btn.textContent = 'Uploading...';
    try {
        handleStatus(e.target, '');
        const file = document.getElementById('e-image').files[0];
        const publicUrl = await uploadImage(file);
        
        const { error } = await supabase.from('ecosystem_companies').insert([{
            logo_url: publicUrl,
            name: document.getElementById('e-name').value,
            description: document.getElementById('e-desc').value,
            website_url: document.getElementById('e-url').value,
            sort_order: document.getElementById('e-sort').value
        }]);
        if (error) throw error;
        handleStatus(e.target, 'Successfully published!');
        e.target.reset();
    } catch(err) { handleStatus(e.target, err.message, true); }
    finally { btn.textContent = og; }
});

document.getElementById('form-developers').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const og = btn.textContent;
    btn.textContent = 'Uploading...';
    try {
        handleStatus(e.target, '');
        const file = document.getElementById('d-image').files[0];
        const publicUrl = await uploadImage(file);
        
        const { error } = await supabase.from('developers').insert([{
            logo_url: publicUrl,
            name: document.getElementById('d-name').value,
            website_url: document.getElementById('d-url').value,
            sort_order: document.getElementById('d-sort').value
        }]);
        if (error) throw error;
        handleStatus(e.target, 'Successfully published!');
        e.target.reset();
    } catch(err) { handleStatus(e.target, err.message, true); }
    finally { btn.textContent = og; }
});

document.getElementById('form-news').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const og = btn.textContent;
    btn.textContent = 'Uploading...';
    try {
        handleStatus(e.target, '');
        const file = document.getElementById('n-image').files[0];
        const publicUrl = await uploadImage(file);
        
        const { error } = await supabase.from('news_articles').insert([{
            image_url: publicUrl,
            title: document.getElementById('n-title').value,
            description: document.getElementById('n-desc').value,
            tag: document.getElementById('n-tag').value,
            published_date: document.getElementById('n-date').value
        }]);
        if (error) throw error;
        handleStatus(e.target, 'Successfully published!');
        e.target.reset();
    } catch(err) { handleStatus(e.target, err.message, true); }
    finally { btn.textContent = og; }
});
