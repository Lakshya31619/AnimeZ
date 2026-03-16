import React from "react";

function MovieFilter({ search, setSearch, sort, setSort }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search movie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-black/40 border border-primary/30 px-4 py-2 rounded-md w-full md:w-64"
      />

      {/* SORT */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="bg-black/40 border border-primary/30 px-4 py-2 rounded-md w-full md:w-52"
      >
        <option value="year-desc">Release Year (Newest)</option>
        <option value="year-asc">Release Year (Oldest)</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>

    </div>
  );
}

export default MovieFilter;