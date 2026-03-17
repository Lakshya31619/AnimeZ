import { useEffect, useState } from "react";
import axios from "axios";

const Characters = () => {

    const baseURL = import.meta.env.VITE_BASE_URL;
    const API = `${baseURL}/api/character`;

    const [characters, setCharacters] = useState([]);
    const [search, setSearch] = useState("");

    const [name, setName] = useState("");
    const [profileLink, setProfileLink] = useState("");
    const [renderLink, setRenderLink] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editProfile, setEditProfile] = useState("");
    const [editRender, setEditRender] = useState("");

    const [activeCharacter, setActiveCharacter] = useState(null);

    const [formName, setFormName] = useState("");
    const [formImage, setFormImage] = useState("");
    const [formRender, setFormRender] = useState("");

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {

        try {
            const res = await axios.get(`${API}/all`);
            setCharacters(res.data.characters || []);
        }
        catch (err) {
            console.log(err);
        }

    };

    const addCharacter = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(`${API}/add`, {
                name,
                profileLink,
                renderLink
            });

            setCharacters([res.data.character, ...characters]);

            setName("");
            setProfileLink("");
            setRenderLink("");

        }
        catch (err) {
            console.log(err);
        }

    };

    const deleteCharacter = async (id) => {

        try {

            await axios.delete(`${API}/${id}`);

            setCharacters(characters.filter((c) => c._id !== id));

            if (activeCharacter?._id === id) {
                setActiveCharacter(null);
            }

        }
        catch (err) {
            console.log(err);
        }

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
                name: editName,
                profileLink: editProfile,
                renderLink: editRender
            });

            const updated = characters.map((c) => {
                if (c._id === id) {
                    return res.data.character;
                }
                return c;
            });

            setCharacters(updated);
            setEditingId(null);

        }
        catch (err) {
            console.log(err);
        }

    };

    const addForm = async (charId) => {

        try {

            await axios.post(`${API}/${charId}/form`, {
                name: formName,
                image: formImage,
                renderLink: formRender
            });

            const newForm = {
                _id: Date.now().toString(),
                name: formName,
                image: formImage,
                renderLink: formRender
            };

            const updatedCharacters = characters.map((char) => {

                if (char._id === charId) {

                    return {
                        ...char,
                        forms: [...(char.forms || []), newForm]
                    };

                }

                return char;

            });

            setCharacters(updatedCharacters);

            if (activeCharacter && activeCharacter._id === charId) {

                setActiveCharacter({
                    ...activeCharacter,
                    forms: [...(activeCharacter.forms || []), newForm]
                });

            }

            setFormName("");
            setFormImage("");
            setFormRender("");

        }
        catch (err) {
            console.log(err);
        }

    };

    const deleteForm = async (charId, formId) => {

        try {

            await axios.delete(`${API}/${charId}/form/${formId}`);

            const updatedCharacters = characters.map((char) => {

                if (char._id === charId) {

                    return {
                        ...char,
                        forms: char.forms.filter((f) => f._id !== formId)
                    };

                }

                return char;

            });

            setCharacters(updatedCharacters);

            if (activeCharacter && activeCharacter._id === charId) {

                setActiveCharacter({
                    ...activeCharacter,
                    forms: activeCharacter.forms.filter((f) => f._id !== formId)
                });

            }

        }
        catch (err) {
            console.log(err);
        }

    };

    const filteredCharacters = characters.filter((c) => {
        return c.name.toLowerCase().includes(search.toLowerCase());
    });

    return (

        <div className="p-8 text-white">

            <h1 className="text-3xl font-bold mb-6">
                Characters Admin
            </h1>

            {/* ADD CHARACTER */}

            <form
                onSubmit={addCharacter}
                className="flex gap-3 mb-8 flex-wrap"
            >

                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800 p-2 rounded"
                    required
                />

                <input
                    placeholder="Profile Image"
                    value={profileLink}
                    onChange={(e) => setProfileLink(e.target.value)}
                    className="bg-gray-800 p-2 rounded"
                    required
                />

                <input
                    placeholder="Render Image"
                    value={renderLink}
                    onChange={(e) => setRenderLink(e.target.value)}
                    className="bg-gray-800 p-2 rounded"
                    required
                />

                <button className="bg-green-500 px-4 rounded">
                    Add
                </button>

            </form>

            {/* SEARCH */}

            <input
                placeholder="Search characters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-800 p-2 rounded w-full mb-6"
            />

            {/* CHARACTER GRID */}

            <div className="grid grid-cols-4 gap-6">

                {filteredCharacters.map((char) => {

                    const isEditing = editingId === char._id;

                    return (

                        <div
                            key={char._id}
                            className="bg-gray-900 p-4 rounded-lg shadow"
                        >

                            <img
                                src={isEditing ? editProfile : char.profileLink}
                                className="w-full h-40 object-cover rounded mb-2"
                            />

                            {isEditing ? (

                                <>
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="bg-gray-800 p-1 rounded w-full mb-2"
                                    />

                                    <input
                                        value={editProfile}
                                        onChange={(e) => setEditProfile(e.target.value)}
                                        className="bg-gray-800 p-1 rounded w-full mb-2"
                                    />

                                    <input
                                        value={editRender}
                                        onChange={(e) => setEditRender(e.target.value)}
                                        className="bg-gray-800 p-1 rounded w-full mb-2"
                                    />

                                    <button
                                        onClick={() => updateCharacter(char._id)}
                                        className="text-green-400 text-sm"
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="text-gray-400 text-sm ml-3"
                                    >
                                        Cancel
                                    </button>

                                </>

                            ) : (

                                <>
                                    <p className="text-center font-semibold">
                                        {char.name}
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 mt-3">

                                      <button
                                          onClick={() => startEdit(char)}
                                          className="w-full py-1.5 text-xs font-medium rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                                      >
                                          ✏️ Edit
                                      </button>

                                      <button
                                          onClick={() => deleteCharacter(char._id)}
                                          className="w-full py-1.5 text-xs font-medium rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
                                      >
                                          🗑 Delete
                                      </button>

                                      <button
                                          onClick={() => setActiveCharacter(char)}
                                          className="col-span-2 w-full py-1.5 text-sm font-semibold rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black transition"
                                      >
                                          ⚡ Manage Forms
                                      </button>

                                  </div>

                                </>

                            )}

                        </div>

                    );

                })}

            </div>

            {/* FORMS MODAL */}

            {activeCharacter && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-gray-900 w-[700px] p-6 rounded-lg max-h-[80vh] overflow-y-auto">

                        <h2 className="text-2xl font-bold mb-4">
                            Manage Forms — {activeCharacter.name}
                        </h2>

                        {/* ADD FORM */}

                        <div className="grid grid-cols-4 gap-2 mb-6">

                            <input
                                placeholder="Form Name"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="bg-gray-800 p-2 rounded"
                            />

                            <input
                                placeholder="Form Image"
                                value={formImage}
                                onChange={(e) => setFormImage(e.target.value)}
                                className="bg-gray-800 p-2 rounded"
                            />

                            <input
                                placeholder="Render Image"
                                value={formRender}
                                onChange={(e) => setFormRender(e.target.value)}
                                className="bg-gray-800 p-2 rounded"
                            />

                            <button
                                onClick={() => addForm(activeCharacter._id)}
                                className="bg-green-500 px-4 rounded"
                            >
                                Add
                            </button>

                        </div>

                        {/* FORM GRID */}

                        <div className="grid grid-cols-3 gap-4">

                            {activeCharacter.forms?.map((form) => (

                                <div
                                    key={form._id}
                                    className="relative bg-gray-800 rounded-lg overflow-hidden group cursor-pointer"
                                >

                                    <img
                                        src={form.image}
                                        className="w-full h-32 object-cover transition duration-300 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition"></div>

                                    <p className="absolute bottom-0 w-full text-center text-sm font-medium py-2 bg-black/60 translate-y-full group-hover:translate-y-0 transition">
                                        {form.name}
                                    </p>

                                    <button
                                        onClick={() => deleteForm(activeCharacter._id, form._id)}
                                        className="absolute top-2 right-2 bg-red-500 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                                    >
                                        Delete
                                    </button>

                                </div>

                            ))}

                        </div>

                        <button
                            onClick={() => setActiveCharacter(null)}
                            className="mt-6 bg-red-500 px-4 py-2 rounded"
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};

export default Characters;