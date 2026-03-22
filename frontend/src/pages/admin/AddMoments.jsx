import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AddMoments() {

  const baseURL = import.meta.env.VITE_BASE_URL;

  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState("");
  const [episode, setEpisode] = useState("");
  const [video, setVideo] = useState("");

  // EDIT STATE
  const [editingMoment, setEditingMoment] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    show: "",
    episode: "",
    video: "",
  });

  // FETCH CHARACTERS
  const fetchCharacters = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/character/all`);

      if (res.data.success) {
        const list = res.data.characters;
        setCharacters(list);

        if (selectedCharacter) {
          const updated = list.find(
            (c) => c._id === selectedCharacter._id
          );
          if (updated) setSelectedCharacter(updated);
        }
      }
    } catch {
      toast.error("Failed to load characters");
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  // ADD MOMENT
  const handleAddMoment = async (e) => {
    e.preventDefault();

    if (!selectedCharacter) {
      toast.error("Select a character");
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/api/character/${selectedCharacter._id}/moment`,
        { title, description, show, episode, video }
      );

      if (res.data.success) {
        toast.success("Moment added");

        setTitle("");
        setDescription("");
        setShow("");
        setEpisode("");
        setVideo("");

        fetchCharacters();
      }
    } catch {
      toast.error("Failed to add moment");
    }
  };

  // DELETE MOMENT
  const deleteMoment = async (momentId) => {
    try {
      const res = await axios.delete(
        `${baseURL}/api/character/${selectedCharacter._id}/moment/${momentId}`
      );

      if (res.data.success) {
        toast.success("Moment deleted");
        fetchCharacters();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (moment) => {
    setEditingMoment(moment);
    setEditData({
      title: moment.title,
      description: moment.description,
      show: moment.show,
      episode: moment.episode,
      video: moment.video,
    });
  };

  // UPDATE MOMENT
  const handleUpdateMoment = async () => {
    try {
      const res = await axios.put(
        `${baseURL}/api/character/${selectedCharacter._id}/moment/${editingMoment._id}`,
        editData
      );

      if (res.data.success) {
        toast.success("Moment updated");
        setEditingMoment(null);
        fetchCharacters();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredCharacters = characters.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 text-white max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Manage Character Moments
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search characters..."
        className="w-full max-w-md p-3 mb-8 rounded bg-gray-900 border border-gray-700"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CHARACTER GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12 max-h-[420px] overflow-y-auto">
        {filteredCharacters.map((char) => (
          <div
            key={char._id}
            onClick={() => setSelectedCharacter(char)}
            className={`cursor-pointer bg-gray-900 rounded-xl overflow-hidden border transition
            hover:scale-105
            ${selectedCharacter?._id === char._id ? "border-primary" : "border-gray-800"}`}
          >
            <img
              src={char.profileLink}
              alt={char.name}
              className="h-32 w-full object-cover"
            />
            <div className="p-3 text-center text-sm font-medium">
              {char.name}
            </div>
          </div>
        ))}
      </div>

      {/* ADD MOMENT FORM */}
      {selectedCharacter && (
        <form
          onSubmit={handleAddMoment}
          className="bg-gray-900 p-6 rounded-xl mb-12 max-w-2xl space-y-4"
        >
          <h2 className="text-xl font-semibold mb-2">
            Add Moment
          </h2>

          <input
            placeholder="Moment Title"
            className="w-full p-3 rounded bg-gray-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full p-3 rounded bg-gray-800"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Show"
              className="w-full p-3 rounded bg-gray-800"
              value={show}
              onChange={(e) => setShow(e.target.value)}
            />

            <input
              placeholder="Episode"
              className="w-full p-3 rounded bg-gray-800"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
            />
          </div>

          {/* ✅ UPDATED PLACEHOLDER */}
          <input
            placeholder="Moment Link"
            className="w-full p-3 rounded bg-gray-800"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-primary px-6 py-2 rounded font-semibold hover:opacity-90"
          >
            Add Moment
          </button>
        </form>
      )}

      {/* MOMENTS LIST */}
      {selectedCharacter && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {selectedCharacter.name} Moments
          </h2>

          {selectedCharacter.moments?.length === 0 && (
            <p className="text-gray-500">
              No moments added yet.
            </p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCharacter.moments?.map((moment) => (
              <div
                key={moment._id}
                className="bg-gray-900 p-6 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {moment.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    {moment.description}
                  </p>

                  <p className="text-gray-500 text-sm mt-3">
                    {moment.show} • Episode {moment.episode}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6">

                  {/* ✅ EDIT BUTTON */}
                  <button
                    onClick={() => openEditModal(moment)}
                    className="bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteMoment(moment._id)}
                    className="bg-red-600 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ EDIT MODAL */}
      {editingMoment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">

            <h2 className="text-xl font-semibold">Edit Moment</h2>

            <input
              className="w-full p-3 bg-gray-800 rounded"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />

            <textarea
              className="w-full p-3 bg-gray-800 rounded"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />

            <input
              className="w-full p-3 bg-gray-800 rounded"
              value={editData.show}
              onChange={(e) =>
                setEditData({ ...editData, show: e.target.value })
              }
            />

            <input
              className="w-full p-3 bg-gray-800 rounded"
              value={editData.episode}
              onChange={(e) =>
                setEditData({ ...editData, episode: e.target.value })
              }
            />

            <input
              className="w-full p-3 bg-gray-800 rounded"
              value={editData.video}
              onChange={(e) =>
                setEditData({ ...editData, video: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingMoment(null)}
                className="px-4 py-2 bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateMoment}
                className="px-4 py-2 bg-primary rounded"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AddMoments;