import { useEffect, useState } from "react";
import axios from "axios";

const Characters = () => {

    const baseURL = import.meta.env.VITE_BASE_URL;
    const API = `${baseURL}/api/character`;

    const [characters, setCharacters] = useState([]);
    const [search, setSearch] = useState("");

    // Add character
    const [name, setName] = useState("");
    const [profileLink, setProfileLink] = useState("");
    const [renderLink, setRenderLink] = useState("");

    // Edit character (inline in card)
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editProfile, setEditProfile] = useState("");
    const [editRender, setEditRender] = useState("");

    // Forms modal
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [formName, setFormName] = useState("");
    const [formImage, setFormImage] = useState("");
    const [formRender, setFormRender] = useState("");
    const [editingFormId, setEditingFormId] = useState(null);
    const [editFormName, setEditFormName] = useState("");
    const [editFormImage, setEditFormImage] = useState("");
    const [editFormRender, setEditFormRender] = useState("");

    // History modal — text-based lore/story entries (NOT moments)
    const [historyCharacter, setHistoryCharacter] = useState(null);
    const [historyTitle, setHistoryTitle] = useState("");
    const [historyContent, setHistoryContent] = useState("");
    const [historyFormId, setHistoryFormId] = useState("");
    const [editingHistoryId, setEditingHistoryId] = useState(null);
    const [editHistoryTitle, setEditHistoryTitle] = useState("");
    const [editHistoryContent, setEditHistoryContent] = useState("");
    const [editHistoryFormId, setEditHistoryFormId] = useState("");

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const res = await axios.get(`${API}/all`);
            setCharacters(res.data.characters || []);
        } catch (err) {
            console.log(err);
        }
    };

    // ── CHARACTER CRUD ──────────────────────────────────────────────

    const addCharacter = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/add`, { name, profileLink, renderLink });
            setCharacters([res.data.character, ...characters]);
            setName(""); setProfileLink(""); setRenderLink("");
        } catch (err) { console.log(err); }
    };

    const deleteCharacter = async (id) => {
        try {
            await axios.delete(`${API}/${id}`);
            setCharacters(characters.filter((c) => c._id !== id));
            if (activeCharacter?._id === id) setActiveCharacter(null);
            if (historyCharacter?._id === id) setHistoryCharacter(null);
        } catch (err) { console.log(err); }
    };

    const startEdit = (char) => {
        setEditingId(char._id);
        setEditName(char.name);
        setEditProfile(char.profileLink);
        setEditRender(char.renderLink);
    };

    const updateCharacter = async (id) => {
        try {
            const res = await axios.put(`${API}/${id}`, {
                name: editName, profileLink: editProfile, renderLink: editRender
            });
            setCharacters(characters.map((c) => c._id === id ? res.data.character : c));
            setEditingId(null);
        } catch (err) { console.log(err); }
    };

    // ── FORMS ───────────────────────────────────────────────────────

    const addForm = async (charId) => {
        try {
            await axios.post(`${API}/${charId}/form`, {
                name: formName, image: formImage, renderLink: formRender
            });
            const newForm = { _id: Date.now().toString(), name: formName, image: formImage, renderLink: formRender };
            const updated = characters.map((c) =>
                c._id === charId ? { ...c, forms: [...(c.forms || []), newForm] } : c
            );
            setCharacters(updated);
            if (activeCharacter?._id === charId) {
                setActiveCharacter({ ...activeCharacter, forms: [...(activeCharacter.forms || []), newForm] });
            }
            setFormName(""); setFormImage(""); setFormRender("");
        } catch (err) { console.log(err); }
    };

    const startEditForm = (form) => {
        setEditingFormId(form._id);
        setEditFormName(form.name);
        setEditFormImage(form.image);
        setEditFormRender(form.renderLink || "");
    };

    const updateForm = async (charId, formId) => {
        try {
            await axios.put(`${API}/${charId}/form/${formId}`, {
                name: editFormName, image: editFormImage, renderLink: editFormRender
            });
            const updatedForm = { _id: formId, name: editFormName, image: editFormImage, renderLink: editFormRender };
            const updated = characters.map((c) =>
                c._id === charId
                    ? { ...c, forms: c.forms.map((f) => f._id === formId ? updatedForm : f) }
                    : c
            );
            setCharacters(updated);
            if (activeCharacter?._id === charId) {
                setActiveCharacter({ ...activeCharacter, forms: activeCharacter.forms.map((f) => f._id === formId ? updatedForm : f) });
            }
            setEditingFormId(null);
        } catch (err) { console.log(err); }
    };

    const deleteForm = async (charId, formId) => {
        try {
            await axios.delete(`${API}/${charId}/form/${formId}`);
            const updated = characters.map((c) =>
                c._id === charId ? { ...c, forms: c.forms.filter((f) => f._id !== formId) } : c
            );
            setCharacters(updated);
            if (activeCharacter?._id === charId) {
                setActiveCharacter({ ...activeCharacter, forms: activeCharacter.forms.filter((f) => f._id !== formId) });
            }
        } catch (err) { console.log(err); }
    };

    // ── HISTORY (text lore/story entries, per character or per form) ─

    const addHistoryEntry = async (charId) => {
        if (!historyTitle.trim() || !historyContent.trim()) return;
        try {
            await axios.post(`${API}/${charId}/history`, {
                title: historyTitle,
                content: historyContent,
                formId: historyFormId
            });
            const newEntry = {
                _id: Date.now().toString(),
                title: historyTitle,
                content: historyContent,
                formId: historyFormId
            };
            const updated = characters.map((c) =>
                c._id === charId ? { ...c, history: [...(c.history || []), newEntry] } : c
            );
            setCharacters(updated);
            if (historyCharacter?._id === charId) {
                setHistoryCharacter({ ...historyCharacter, history: [...(historyCharacter.history || []), newEntry] });
            }
            setHistoryTitle(""); setHistoryContent(""); setHistoryFormId("");
        } catch (err) { console.log(err); }
    };

    const startEditHistory = (entry) => {
        setEditingHistoryId(entry._id);
        setEditHistoryTitle(entry.title || "");
        setEditHistoryContent(entry.content || "");
        setEditHistoryFormId(entry.formId || "");
    };

    const updateHistoryEntry = async (charId, historyId) => {
        try {
            await axios.put(`${API}/${charId}/history/${historyId}`, {
                title: editHistoryTitle,
                content: editHistoryContent,
                formId: editHistoryFormId
            });
            const updatedEntry = {
                _id: historyId,
                title: editHistoryTitle,
                content: editHistoryContent,
                formId: editHistoryFormId
            };
            const updated = characters.map((c) =>
                c._id === charId
                    ? { ...c, history: c.history.map((h) => h._id === historyId ? updatedEntry : h) }
                    : c
            );
            setCharacters(updated);
            if (historyCharacter?._id === charId) {
                setHistoryCharacter({
                    ...historyCharacter,
                    history: historyCharacter.history.map((h) => h._id === historyId ? updatedEntry : h)
                });
            }
            setEditingHistoryId(null);
        } catch (err) { console.log(err); }
    };

    const deleteHistoryEntry = async (charId, historyId) => {
        try {
            await axios.delete(`${API}/${charId}/history/${historyId}`);
            const updated = characters.map((c) =>
                c._id === charId ? { ...c, history: c.history.filter((h) => h._id !== historyId) } : c
            );
            setCharacters(updated);
            if (historyCharacter?._id === charId) {
                setHistoryCharacter({ ...historyCharacter, history: historyCharacter.history.filter((h) => h._id !== historyId) });
            }
        } catch (err) { console.log(err); }
    };

    const filteredCharacters = characters.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 text-white">

            <h1 className="text-3xl font-bold mb-6">Characters Admin</h1>

            {/* ADD CHARACTER */}
            <form onSubmit={addCharacter} className="flex gap-3 mb-8 flex-wrap">
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800 p-2 rounded" required />
                <input placeholder="Profile Image" value={profileLink} onChange={(e) => setProfileLink(e.target.value)}
                    className="bg-gray-800 p-2 rounded" required />
                <input placeholder="Render Image" value={renderLink} onChange={(e) => setRenderLink(e.target.value)}
                    className="bg-gray-800 p-2 rounded" required />
                <button className="bg-green-500 px-4 rounded">Add</button>
            </form>

            {/* SEARCH */}
            <input placeholder="Search characters..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-800 p-2 rounded w-full mb-6" />

            {/* CHARACTER GRID */}
            <div className="grid grid-cols-4 gap-6">
                {filteredCharacters.map((char) => {
                    const isEditing = editingId === char._id;
                    return (
                        <div key={char._id} className="bg-gray-900 p-4 rounded-lg shadow">
                            <img src={isEditing ? editProfile : char.profileLink}
                                className="w-full h-40 object-cover rounded mb-2" />

                            {isEditing ? (
                                <>
                                    <input value={editName} onChange={(e) => setEditName(e.target.value)}
                                        className="bg-gray-800 p-1 rounded w-full mb-2" placeholder="Name" />
                                    <input value={editProfile} onChange={(e) => setEditProfile(e.target.value)}
                                        className="bg-gray-800 p-1 rounded w-full mb-2" placeholder="Profile Image" />
                                    <input value={editRender} onChange={(e) => setEditRender(e.target.value)}
                                        className="bg-gray-800 p-1 rounded w-full mb-2" placeholder="Render Image" />
                                    <div className="flex gap-2 mt-1">
                                        <button onClick={() => updateCharacter(char._id)}
                                            className="flex-1 py-1.5 text-xs rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition">
                                            ✓ Save
                                        </button>
                                        <button onClick={() => setEditingId(null)}
                                            className="flex-1 py-1.5 text-xs rounded bg-gray-700 text-gray-400 hover:bg-gray-600 transition">
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-center font-semibold mb-3">{char.name}</p>
                                    <div className="text-xs text-gray-500 text-center mb-3">
                                        {(char.forms?.length || 0)} form{char.forms?.length !== 1 ? "s" : ""}
                                        {" · "}
                                        {char.history?.length || 0} history entr{char.history?.length !== 1 ? "ies" : "y"}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => startEdit(char)}
                                            className="py-1.5 text-xs font-medium rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition">
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => deleteCharacter(char._id)}
                                            className="py-1.5 text-xs font-medium rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition">
                                            🗑 Delete
                                        </button>
                                        <button onClick={() => setActiveCharacter(char)}
                                            className="py-1.5 text-xs font-semibold rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition">
                                            ⚡ Forms
                                        </button>
                                        <button onClick={() => setHistoryCharacter(char)}
                                            className="py-1.5 text-xs font-semibold rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition">
                                            📜 History
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── FORMS MODAL ──────────────────────────────────── */}
            {activeCharacter && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 w-[720px] p-6 rounded-lg max-h-[85vh] overflow-y-auto">

                        <h2 className="text-2xl font-bold mb-4">⚡ Forms — {activeCharacter.name}</h2>

                        {/* ADD FORM */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            <input placeholder="Form Name" value={formName}
                                onChange={(e) => setFormName(e.target.value)} className="bg-gray-800 p-2 rounded" />
                            <input placeholder="Form Image" value={formImage}
                                onChange={(e) => setFormImage(e.target.value)} className="bg-gray-800 p-2 rounded" />
                            <input placeholder="Render Image" value={formRender}
                                onChange={(e) => setFormRender(e.target.value)} className="bg-gray-800 p-2 rounded" />
                            <button onClick={() => addForm(activeCharacter._id)}
                                className="bg-green-500 px-4 rounded hover:bg-green-400 transition">Add</button>
                        </div>

                        {/* FORM GRID */}
                        <div className="grid grid-cols-3 gap-4">
                            {activeCharacter.forms?.map((form) => (
                                <div key={form._id} className="bg-gray-800 rounded-lg overflow-hidden">

                                    {editingFormId === form._id ? (
                                        <div className="p-3 flex flex-col gap-2">
                                            <input value={editFormName} onChange={(e) => setEditFormName(e.target.value)}
                                                placeholder="Form Name" className="bg-gray-700 p-1.5 rounded text-sm w-full" />
                                            <input value={editFormImage} onChange={(e) => setEditFormImage(e.target.value)}
                                                placeholder="Form Image" className="bg-gray-700 p-1.5 rounded text-sm w-full" />
                                            <input value={editFormRender} onChange={(e) => setEditFormRender(e.target.value)}
                                                placeholder="Render Image" className="bg-gray-700 p-1.5 rounded text-sm w-full" />
                                            <div className="flex gap-2">
                                                <button onClick={() => updateForm(activeCharacter._id, form._id)}
                                                    className="flex-1 py-1 text-xs rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition">
                                                    ✓ Save
                                                </button>
                                                <button onClick={() => setEditingFormId(null)}
                                                    className="flex-1 py-1 text-xs rounded bg-gray-700 text-gray-400 hover:bg-gray-600 transition">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative group cursor-pointer">
                                            <img src={form.image} className="w-full h-32 object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition" />
                                            <p className="absolute bottom-0 w-full text-center text-sm font-medium py-2 bg-black/60 translate-y-full group-hover:translate-y-0 transition">
                                                {form.name}
                                            </p>
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => startEditForm(form)}
                                                    className="bg-blue-500 text-xs px-2 py-1 rounded">Edit</button>
                                                <button onClick={() => deleteForm(activeCharacter._id, form._id)}
                                                    className="bg-red-500 text-xs px-2 py-1 rounded">Del</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button onClick={() => { setActiveCharacter(null); setEditingFormId(null); }}
                            className="mt-6 bg-red-500 px-4 py-2 rounded hover:bg-red-400 transition">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ── HISTORY MODAL — text lore/story entries only ─── */}
            {historyCharacter && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 w-[750px] p-6 rounded-lg max-h-[85vh] overflow-y-auto">

                        <h2 className="text-2xl font-bold mb-1">📜 History — {historyCharacter.name}</h2>
                        <p className="text-xs text-gray-500 mb-5">
                            Text-based lore &amp; story entries. For video clips, use the <strong className="text-gray-300">Add Moments</strong> page.
                        </p>

                        {/* ADD HISTORY ENTRY */}
                        <div className="bg-gray-800 rounded-lg p-4 mb-6">
                            <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Add History Entry</p>
                            <div className="flex flex-col gap-2">
                                <input
                                    placeholder="Title *"
                                    value={historyTitle}
                                    onChange={(e) => setHistoryTitle(e.target.value)}
                                    className="bg-gray-700 p-2 rounded text-sm"
                                />
                                <textarea
                                    placeholder="Content * (story/lore text)"
                                    value={historyContent}
                                    onChange={(e) => setHistoryContent(e.target.value)}
                                    className="bg-gray-700 p-2 rounded text-sm resize-none h-24"
                                />
                                {/* Optional: tie to a specific form */}
                                {historyCharacter.forms?.length > 0 && (
                                    <select
                                        value={historyFormId}
                                        onChange={(e) => setHistoryFormId(e.target.value)}
                                        className="bg-gray-700 p-2 rounded text-sm text-gray-300"
                                    >
                                        <option value="">— General (no specific form) —</option>
                                        {historyCharacter.forms.map((f) => (
                                            <option key={f._id} value={f._id}>{f.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <button
                                onClick={() => addHistoryEntry(historyCharacter._id)}
                                className="mt-3 bg-purple-500 px-5 py-1.5 rounded text-sm hover:bg-purple-400 transition font-medium">
                                + Add Entry
                            </button>
                        </div>

                        {/* HISTORY LIST */}
                        {(!historyCharacter.history || historyCharacter.history.length === 0) ? (
                            <p className="text-gray-500 text-center py-8 text-sm">No history entries yet.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {historyCharacter.history.map((entry) => {
                                    const linkedForm = historyCharacter.forms?.find((f) => f._id === entry.formId);
                                    return (
                                        <div key={entry._id} className="bg-gray-800 rounded-lg p-4">
                                            {editingHistoryId === entry._id ? (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        value={editHistoryTitle}
                                                        onChange={(e) => setEditHistoryTitle(e.target.value)}
                                                        placeholder="Title"
                                                        className="bg-gray-700 p-2 rounded text-sm"
                                                    />
                                                    <textarea
                                                        value={editHistoryContent}
                                                        onChange={(e) => setEditHistoryContent(e.target.value)}
                                                        placeholder="Content"
                                                        className="bg-gray-700 p-2 rounded text-sm resize-none h-24"
                                                    />
                                                    {historyCharacter.forms?.length > 0 && (
                                                        <select
                                                            value={editHistoryFormId}
                                                            onChange={(e) => setEditHistoryFormId(e.target.value)}
                                                            className="bg-gray-700 p-2 rounded text-sm text-gray-300"
                                                        >
                                                            <option value="">— General (no specific form) —</option>
                                                            {historyCharacter.forms.map((f) => (
                                                                <option key={f._id} value={f._id}>{f.name}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    <div className="flex gap-2 mt-1">
                                                        <button
                                                            onClick={() => updateHistoryEntry(historyCharacter._id, entry._id)}
                                                            className="flex-1 py-1.5 text-xs rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition">
                                                            ✓ Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingHistoryId(null)}
                                                            className="flex-1 py-1.5 text-xs rounded bg-gray-700 text-gray-400 hover:bg-gray-600 transition">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm">{entry.title}</p>
                                                        <p className="text-gray-400 text-xs mt-1 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                                                        {linkedForm && (
                                                            <span className="inline-block mt-2 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                                                                ⚡ {linkedForm.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        <button onClick={() => startEditHistory(entry)}
                                                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white text-xs px-2.5 py-1 rounded transition">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => deleteHistoryEntry(historyCharacter._id, entry._id)}
                                                            className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs px-2.5 py-1 rounded transition">
                                                            Del
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <button onClick={() => { setHistoryCharacter(null); setEditingHistoryId(null); }}
                            className="mt-6 bg-red-500 px-4 py-2 rounded hover:bg-red-400 transition">
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Characters;