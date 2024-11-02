"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

// Define interfaces for prop types
interface SectionStates {
  yearSeason: boolean;
}

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// Unified FilterSection component
const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [contentRef, children]);

  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between group"
        type="button"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <div className="h-1 w-20 bg-blue-500 rounded transition-all duration-300 group-hover:w-24" />
        </div>
        <ChevronDown 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={20}
        />
      </button>
      <div
        style={{
          height: isOpen ? `${height}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div ref={contentRef} className="pt-4 flex flex-wrap gap-2">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main filter component
export default function FullFilter(): JSX.Element {
  const [sections, setSections] = useState<SectionStates>({
    yearSeason: true
  });

  const searchParams = useSearchParams();
  const seasonQuery = String(searchParams.get('season')) || "summer";
  const yearQuery = Number(searchParams.get('year')) || new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(yearQuery.toString());
  const [season, setSeason] = useState<string>(seasonQuery);
  const router = useRouter();
  
  const seasons = ["Winter", "Spring", "Summer", "Fall"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => (currentYear - i).toString());

  const toggleSection = (section: keyof SectionStates): void => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateUrl = () => {
    const params = new URLSearchParams();
    params.set("year", year);
    params.set("season", season.toLowerCase());
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    updateUrl();
  }, [year, season]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <FilterSection
        title="Select Year and Season"
        isOpen={sections.yearSeason}
        onToggle={() => toggleSection('yearSeason')}
      >
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-white font-semibold mb-2 block">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-md transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
            >
              {years.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white font-semibold mb-2 block">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-md transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
            >
              {seasons.map((seasonOption) => (
                <option key={seasonOption} value={seasonOption.toLowerCase()}>
                  {seasonOption}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>
    </div>
  );
}
