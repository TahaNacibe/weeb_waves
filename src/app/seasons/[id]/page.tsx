"use client";
import FilterByGenre from "../components/filter_by_genre";
import SearchListDisplay from "../components/season_anime";

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
          <SearchListDisplay />
        </div>
      </main>
    </div>
  );
}