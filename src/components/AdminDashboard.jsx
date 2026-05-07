import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Save, RefreshCw, Trash2, X, Check, AlertTriangle, ShieldCheck, ChevronRight, UtensilsCrossed, Database, Loader, Image } from 'lucide-react';
import { fetchMenuFromDB, saveMenuToDB, getDefaultMenuData, setAdminPassword, getAdminPassword, clearAdminPassword, updateItemPriceLocal, addItemToCategoryLocal, deleteItemLocal } from '../data/menuStore';

const LABEL = 'block text-slate-400 text-[11px] font-semibold uppercase tracking-widest mb-1.5';
const INPUT = 'w-full bg-[#0d0f14] text-white border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder-slate-600';

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
    if (!toast) return null;
    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {toast.type === 'success' ? <Check size={15} /> : <AlertTriangle size={15} />}
            {toast.msg}
        </div>
    );
}

// ── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ icon: Icon, iconColor, title, message, onConfirm, onCancel, confirmLabel, confirmColor }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#161a23] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
                <div className={`w-12 h-12 ${iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={20} className="text-current" />
                </div>
                <h3 className="text-white font-bold mb-1">{title}</h3>
                <p className="text-slate-400 text-sm mb-5">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
                    <button onClick={onConfirm} className={`flex-1 ${confirmColor} text-white font-bold py-2.5 rounded-xl text-sm transition-colors`}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

// ── Add Item Modal ───────────────────────────────────────────────────────────
function AddItemModal({ categories, defaultCatId, onAdd, onClose }) {
    const [catId, setCatId] = useState(defaultCatId || categories[0]?.id);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');
    const [img, setImg] = useState('/images/des9-logo.jpg');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImg(reader.result);
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#161a23] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-white/8">
                    <h3 className="text-white font-bold text-base flex items-center gap-2"><Plus size={16} className="text-emerald-400" />Add New Item</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                    <div><label className={LABEL}>Category</label>
                        <select value={catId} onChange={e => setCatId(e.target.value)} className={INPUT + ' [&>option]:bg-[#161a23]'}>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div><label className={LABEL}>Name <span className="text-red-400">*</span></label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Special Tibs" className={INPUT} />
                    </div>
                    <div><label className={LABEL}>Price (ETB)</label>
                        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 450.00" type="number" min="0" step="0.01" className={INPUT} />
                    </div>
                    <div><label className={LABEL}>Description</label>
                        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description…" className={INPUT} />
                    </div>
                    <div><label className={LABEL}>Image</label>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 relative">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="item-image-upload" />
                                <label htmlFor="item-image-upload" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-pointer flex items-center gap-2 transition-colors">
                                    {uploading ? <Loader size={12} className="animate-spin" /> : <Image size={12} />}
                                    {uploading ? 'Processing...' : 'Upload Image'}
                                </label>
                            </div>
                        </div>
                        <input value={img} onChange={e => setImg(e.target.value)} placeholder="Or paste image URL..." className={INPUT + ' mt-2 font-mono text-[10px] opacity-50'} />
                    </div>
                </div>
                <div className="p-5 pt-0 flex gap-3">
                    <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold py-2.5 rounded-xl text-sm">Cancel</button>
                    <button disabled={!name.trim()} onClick={() => onAdd(catId, { name: name.trim(), price, description: desc, image: img || '/images/des9-logo.jpg' })}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                        <Plus size={14} />Add Item
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
    const [pw, setPw] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setErr('');
        try {
            // Test the password by calling the API with it
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
                body: JSON.stringify({ data: null, ping: true }),
            });
            if (res.status === 401) { setErr('Incorrect password. Try again.'); setLoading(false); return; }
            // 400 is fine — password accepted, just bad body
            setAdminPassword(pw);
            onLogin();
        } catch {
            setErr('Cannot reach server. Check your connection.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg mb-4">
                        <img src="/images/des9-logo.jpg" alt="DES9" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-white text-2xl font-black">DES9 Admin</h1>
                    <p className="text-slate-400 text-sm mt-1">Menu Management Portal</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-[#161a23] border border-white/8 rounded-2xl p-6 shadow-2xl">
                    <label className={LABEL}>Password</label>
                    <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(''); }}
                        placeholder="Enter admin password" autoFocus
                        className={INPUT + (err ? ' border-red-500' : '')} />
                    {err && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertTriangle size={11} />{err}</p>}
                    <button type="submit" disabled={loading || !pw}
                        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                        {loading ? <Loader size={15} className="animate-spin" /> : <ShieldCheck size={16} />}
                        {loading ? 'Checking…' : 'Sign In'}
                    </button>
                </form>
                <p className="text-center text-slate-600 text-xs mt-6">DES9 Restaurant · Admin Only</p>
            </div>
        </div>
    );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [authed, setAuthed] = useState(() => !!getAdminPassword());
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dbEmpty, setDbEmpty] = useState(false);
    const [activeCatId, setActiveCatId] = useState('');
    const [prices, setPrices] = useState({});
    const [showAdd, setShowAdd] = useState(false);
    const [toast, setToast] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showReset, setShowReset] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const showToast = useCallback((type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Load menu from DB
    useEffect(() => {
        if (!authed) return;
        setLoading(true);
        fetchMenuFromDB().then(data => {
            if (!data) {
                setDbEmpty(true);
                const def = getDefaultMenuData();
                setMenuData(def);
                setActiveCatId(def.en[0].id);
            } else {
                setMenuData(data);
                setActiveCatId(data.en[0].id);
                setDbEmpty(false);
            }
            setLoading(false);
        });
    }, [authed]);

    const saveToDb = async (data, successMsg) => {
        setSaving(true);
        try {
            await saveMenuToDB(data, getAdminPassword());
            setMenuData(data);
            setPrices({});
            setDbEmpty(false);
            showToast('success', successMsg);
        } catch (e) {
            showToast('error', e.message || 'Save failed');
        }
        setSaving(false);
    };

    const handleSeedDB = () => saveToDb(getDefaultMenuData(), 'Database initialized with default menu!');

    const handleSaveAll = () => {
        let updated = menuData;
        Object.entries(prices).forEach(([key, price]) => {
            const sep = key.indexOf('||');
            const catId = key.slice(0, sep);
            const idx = parseInt(key.slice(sep + 2));
            updated = updateItemPriceLocal(updated, catId, idx, price);
        });
        saveToDb(updated, `Saved ${Object.keys(prices).length} price change(s)!`);
    };

    const handleAddItem = (catId, item) => {
        const updated = addItemToCategoryLocal(menuData, catId, item);
        setShowAdd(false);
        setActiveCatId(catId);
        saveToDb(updated, `"${item.name}" added!`);
    };

    const handleDeleteConfirm = () => {
        const updated = deleteItemLocal(menuData, deleteTarget.catId, deleteTarget.idx);
        const name = deleteTarget.name;
        setDeleteTarget(null);
        saveToDb(updated, `"${name}" removed.`);
    };

    const handleReset = () => {
        setShowReset(false);
        saveToDb(getDefaultMenuData(), 'Menu reset to original defaults.');
    };

    const handleLogout = () => { clearAdminPassword(); navigate('/'); };

    if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

    if (loading) return (
        <div className="min-h-screen bg-[#0d0f14] flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader size={28} className="animate-spin text-emerald-500" />
            <p className="text-sm">Loading menu from database…</p>
        </div>
    );

    const categories = menuData?.en || [];
    const activeCat = categories.find(c => c.id === activeCatId);
    const dirtyCount = Object.keys(prices).length;
    const pk = (catId, idx) => `${catId}||${idx}`;

    return (
        <div className="min-h-screen bg-[#0d0f14] text-white flex flex-col">
            {/* Top Bar */}
            <header className="bg-[#161a23] border-b border-white/8 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden text-slate-400 hover:text-white p-2">
                        <UtensilsCrossed size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-lg overflow-hidden"><img src="/images/des9-logo.jpg" alt="DES9" className="w-full h-full object-cover" /></div>
                    <div><span className="font-black text-sm text-white">DES9</span><span className="text-emerald-400 font-bold text-sm ml-1">Admin</span></div>
                </div>
                <div className="flex items-center gap-2">
                    {dbEmpty && (
                        <button onClick={handleSeedDB} disabled={saving}
                            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                            <Database size={12} /> Initialize DB
                        </button>
                    )}
                    {dirtyCount > 0 && (
                        <button onClick={handleSaveAll} disabled={saving}
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors">
                            {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                            <span className="hidden sm:inline">Save</span> ({dirtyCount})
                        </button>
                    )}
                    <button onClick={() => setShowAdd(true)}
                        className="flex items-center gap-1.5 bg-white/8 hover:bg-white/15 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-white/10">
                        <Plus size={12} />Add Item
                    </button>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5" title="Logout"><LogOut size={16} /></button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#13161f] border-r border-white/8 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0 top-[52px]' : '-translate-x-full top-[52px]'}`}>
                    <div className="p-4 border-b border-white/8">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Categories</p>
                        {dbEmpty && <p className="text-amber-400 text-[10px] mt-1">⚠ DB not initialized</p>}
                    </div>
                    <nav className="flex-1 overflow-y-auto py-2">
                        {categories.map(cat => {
                            const active = cat.id === activeCatId;
                            return (
                                <button key={cat.id} onClick={() => { setActiveCatId(cat.id); setSidebarOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${active ? 'bg-emerald-600/15 text-emerald-300 border-r-2 border-emerald-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                    <span className="truncate font-medium">{cat.title}</span>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>{cat.items.length}</span>
                                        <ChevronRight size={11} className={active ? 'text-emerald-400' : 'text-slate-600'} />
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                    <div className="p-3 border-t border-white/8 space-y-1.5">
                        <button onClick={() => setShowReset(true)} className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg font-semibold transition-colors">
                            <RefreshCw size={11} />Reset All to Default
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 px-3 py-2 rounded-lg font-semibold transition-colors">
                            <LogOut size={11} />Logout
                        </button>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {activeCat && (
                        <>
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-xl font-black text-white">{activeCat.title}</h2>
                                    <p className="text-slate-500 text-xs mt-0.5">{activeCat.items.length} items · Edit prices then Save</p>
                                </div>
                                {dirtyCount > 0 && (
                                    <button onClick={handleSaveAll} disabled={saving}
                                        className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-xl">
                                        {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                                        Save {dirtyCount} Change{dirtyCount !== 1 ? 's' : ''}
                                    </button>
                                )}
                            </div>

                            <div className="bg-[#161a23] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
                                <div className="grid grid-cols-[1fr_140px_36px] md:grid-cols-[48px_1fr_200px_36px] px-4 py-2.5 border-b border-white/8 bg-white/3">
                                    <span className="hidden md:block text-slate-600 text-[10px] font-bold uppercase tracking-widest">#</span>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Item</span>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Price (ETB)</span>
                                    <span />
                                </div>

                                {activeCat.items.length === 0 ? (
                                    <div className="flex flex-col items-center py-16 text-slate-600">
                                        <UtensilsCrossed size={28} className="mb-3 opacity-40" />
                                        <p className="text-sm">No items yet.</p>
                                        <button onClick={() => setShowAdd(true)} className="mt-2 text-emerald-400 text-sm font-semibold flex items-center gap-1"><Plus size={13} />Add first item</button>
                                    </div>
                                ) : activeCat.items.map((item, idx) => {
                                    const key = pk(activeCat.id, idx);
                                    const val = prices[key] !== undefined ? prices[key] : (item.price || '');
                                    const dirty = prices[key] !== undefined && prices[key] !== (item.price || '');
                                    return (
                                        <div key={idx} className="grid grid-cols-[1fr_140px_36px] md:grid-cols-[48px_1fr_200px_36px] items-center px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 group">
                                            <span className="hidden md:block text-slate-600 text-xs font-mono">{String(idx + 1).padStart(2, '0')}</span>
                                            <div className="min-w-0 pr-2">
                                                <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                                                {item.description && <p className="text-slate-500 text-xs truncate mt-0.5">{item.description}</p>}
                                            </div>
                                            <div className="relative">
                                                <input type="number" min="0" step="0.01" value={val}
                                                    onChange={e => setPrices(p => ({ ...p, [key]: e.target.value }))}
                                                    placeholder="— no price —"
                                                    className={`w-full bg-[#0d0f14] text-sm font-bold border rounded-lg px-3 py-2 outline-none transition-colors
                                                        ${dirty ? 'border-emerald-500 text-emerald-300' : 'border-white/10 text-white focus:border-emerald-500/60'}`} />
                                                {dirty && <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#161a23]" />}
                                            </div>
                                             <button onClick={() => setDeleteTarget({ catId: activeCat.id, idx, name: item.name })}
                                                 className="text-slate-500 hover:text-red-400 transition-colors p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 justify-self-center">
                                                 <Trash2 size={13} />
                                             </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <button onClick={() => setShowAdd(true)}
                                className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-500 hover:text-emerald-400 py-3 rounded-xl text-sm font-semibold transition-all">
                                <Plus size={14} />Add New Item to {activeCat.title}
                            </button>
                        </>
                    )}
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden" />}

            {/* Modals */}
            {showAdd && <AddItemModal categories={categories} defaultCatId={activeCatId} onAdd={handleAddItem} onClose={() => setShowAdd(false)} />}

            {deleteTarget && (
                <ConfirmDialog icon={Trash2} iconColor="bg-red-500/15 text-red-400"
                    title="Delete Item?" confirmLabel="Delete" confirmColor="bg-red-600 hover:bg-red-500"
                    message={<>Remove <strong className="text-white">"{deleteTarget.name}"</strong>? This cannot be undone.</>}
                    onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
            )}

            {showReset && (
                <ConfirmDialog icon={AlertTriangle} iconColor="bg-amber-500/15 text-amber-400"
                    title="Reset Entire Menu?" confirmLabel="Yes, Reset" confirmColor="bg-amber-600 hover:bg-amber-500"
                    message="All price changes and added items will be lost and the menu will return to its original defaults."
                    onConfirm={handleReset} onCancel={() => setShowReset(false)} />
            )}

            <Toast toast={toast} />
        </div>
    );
}
