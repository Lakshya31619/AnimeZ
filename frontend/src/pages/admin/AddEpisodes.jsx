import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Title from "../../components/admin/Title";
import { Trash2Icon, PencilIcon, PlusCircleIcon, XIcon } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

const SERIES_LIST = [
  "Dragon Ball",
  "Dragon Ball Z",
  "Dragon Ball GT",
  "Dragon Ball Super",
  "Dragon Ball Daima"
];

const EMPTY_FORM = {
  series: "Dragon Ball Z",
  title: "",
  episode_number: "",
  saga: "",
  overview: "",
  thumbnail: "",
  episode_link: "",
  duration: "",
  air_date: ""
};

function AddEpisodes() {
  const { getToken } = useAuth();

  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterSeries, setFilterSeries] = useState("All");

  // Fetch all episodes
  const fetchEpisodes = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`${baseURL}/api/episodes/all`);
      if (res.data.success) setEpisodes(res.data.episodes);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchEpisodes(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const payload = { ...formData, episode_number: Number(formData.episode_number) };

      let res;
      if (editId) {
        res = await axios.put(`${baseURL}/api/episodes/update/${editId}`, payload, { headers });
      } else {
        res = await axios.post(`${baseURL}/api/episodes/add`, payload, { headers });
      }

      if (res.data.success) {
        alert(editId ? "Episode updated ✅" : "Episode added ✅");
        setFormData(EMPTY_FORM);
        setEditId(null);
        setShowForm(false);
        fetchEpisodes();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ep) => {
    setFormData({
      series: ep.series,
      title: ep.title,
      episode_number: ep.episode_number,
      saga: ep.saga || "",
      overview: ep.overview || "",
      thumbnail: ep.thumbnail || "",
      episode_link: ep.episode_link,
      duration: ep.duration || "",
      air_date: ep.air_date || ""
    });
    setEditId(ep._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this episode?")) return;
    try {
      const token = await getToken();
      const res = await axios.delete(`${baseURL}/api/episodes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchEpisodes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEpisodes =
    filterSeries === "All"
      ? episodes
      : episodes.filter((e) => e.series === filterSeries);

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between mb-8">
        <Title text1="Manage" text2="Episodes" />
        <button
          onClick={() => {
            setFormData(EMPTY_FORM);
            setEditId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull text-white text-sm rounded-lg transition"
        >
          <PlusCircleIcon className="w-4 h-4" />
          Add Episode
        </button>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="bg-white/5 border border-gray-700 rounded-2xl p-6 mb-10 relative">
          <button
            onClick={() => { setShowForm(false); setEditId(null); setFormData(EMPTY_FORM); }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-semibold mb-6 text-primary">
            {editId ? "Edit Episode" : "Add New Episode"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Series */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Series *</label>
              <select
                name="series"
                value={formData.series}
                onChange={handleChange}
                required
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              >
                {SERIES_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Episode Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Episode Number *</label>
              <input
                type="number"
                name="episode_number"
                value={formData.episode_number}
                onChange={handleChange}
                required
                placeholder="e.g. 1"
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-gray-400">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. The Arrival of Raditz"
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Saga */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Saga / Arc</label>
              <input
                type="text"
                name="saga"
                value={formData.saga}
                onChange={handleChange}
                placeholder="e.g. Saiyan Saga"
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 24 min"
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Air Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Air Date</label>
              <input
                type="text"
                name="air_date"
                value={formData.air_date}
                onChange={handleChange}
                placeholder="e.g. 1989-04-26"
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://..."
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Episode Link */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-gray-400">
                Episode Link (Abyss embed URL) *
              </label>
              <input
                type="text"
                name="episode_link"
                value={formData.episode_link}
                onChange={handleChange}
                required
                placeholder="https://abysscdn.com/..."
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Overview */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-gray-400">Overview / Synopsis</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the episode..."
                className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white text-sm rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Saving..." : editId ? "Update Episode" : "Add Episode"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", ...SERIES_LIST].map((s) => (
          <button
            key={s}
            onClick={() => setFilterSeries(s)}
            className={`px-3 py-1 rounded-full text-xs border transition ${
              filterSeries === s
                ? "bg-primary border-primary text-white"
                : "border-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Episodes Table */}
      {fetchLoading ? (
        <p className="text-gray-500 text-sm">Loading episodes...</p>
      ) : filteredEpisodes.length === 0 ? (
        <p className="text-gray-500 text-sm">No episodes found. Add your first episode above!</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-white/3">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">EP</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium max-md:hidden">Series</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium max-md:hidden">Saga</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium max-md:hidden">Duration</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEpisodes.map((ep, i) => (
                <tr
                  key={ep._id}
                  className={`border-b border-gray-800/50 hover:bg-white/5 transition ${
                    i % 2 === 0 ? "" : "bg-white/2"
                  }`}
                >
                  <td className="px-4 py-3 text-primary font-bold">{ep.episode_number}</td>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{ep.title}</td>
                  <td className="px-4 py-3 text-gray-400 max-md:hidden">{ep.series}</td>
                  <td className="px-4 py-3 text-gray-500 max-md:hidden">{ep.saga || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 max-md:hidden">{ep.duration || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(ep)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ep._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AddEpisodes;
