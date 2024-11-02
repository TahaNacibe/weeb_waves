"use client";
import AnimeListDisplay from "../components/anime_list";
import FilterByGenre from "../components/filter_by_genre";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 pt-20 flex flex-col md:flex-row gap-6">
        {/* Sidebar Filter */}
        <aside className="md:w-64 flex-shrink-0">
          <FilterByGenre />
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          <AnimeListDisplay />
        </div>
      </main>
    </div>
  );
}