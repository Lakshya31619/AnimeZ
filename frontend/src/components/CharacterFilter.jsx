import React from "react";

function CharacterFilter({ search, setSearch, sort, setSort }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search characters..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {/* 🔽 Sort Dropdown */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full sm:w-1/4 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>

    </div>
  );
}

export default CharacterFilter;