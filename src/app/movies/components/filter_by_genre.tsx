"use client"
import AnimeGenres from "@/app/types/genres_list"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from 'next/navigation'

interface SectionStates {
  genres: boolean
  types: boolean
  status: boolean
}

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

interface FilterItemProps {
  href: string
  children: React.ReactNode
}

interface GenreItemProps {
  genreName: string
  genreId: number
}

interface ContentItemProps {
  content: string
}

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
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
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
        <div ref={contentRef} className="pt-4">
          <div className="flex flex-wrap gap-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FilterByGenre(): JSX.Element {
  const [sections, setSections] = useState<SectionStates>({
    genres: false,
    types: false,
    status: false
  })

  const toggleSection = (section: keyof SectionStates): void => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-24 shadow-xl">
      <FilterSection
        title="Filter by Genre"
        isOpen={sections.genres}
        onToggle={() => toggleSection('genres')}
      >
        {AnimeGenres.map((genre) => (
          <Suspense>
             <GenreItem 
            key={genre.mal_id} 
            genreName={genre.name} 
            genreId={genre.mal_id} 
          />
         </Suspense>
        ))}
      </FilterSection>

      <FilterSection
        title="Filter by Type"
        isOpen={sections.types}
        onToggle={() => toggleSection('types')}
      >
        {["TV", "Movie", "OVA", "ONA", "Special"].map((type) => (
          <Suspense>
            <TypeItem key={type} content={type} />
          </Suspense>
        ))}
      </FilterSection>

      <FilterSection
        title="Filter by Status"
        isOpen={sections.status}
        onToggle={() => toggleSection('status')}
      >
        {["Airing", "Complete", "Upcoming"].map((status) => (
          <Suspense>
            <StatusItem key={status} content={status} />
          </Suspense>
        ))}
      </FilterSection>
    </div>
  )
}

const FilterItem: React.FC<FilterItemProps> = ({ href, children }) => (
  <Link href={href}>
    <div className="rounded-full px-3 py-1.5 bg-gray-500 bg-opacity-40 hover:bg-opacity-70 
                    transition-all duration-200 hover:scale-105 cursor-pointer">
      <span className="text-white font-medium text-sm">
        {children}
      </span>
    </div>
  </Link>
)

export const GenreItem: React.FC<GenreItemProps> = ({ genreName, genreId }) => {
  const searchParams = useSearchParams()
  
  const updateUrl = (): string => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('genre')) {
      params.set('genre', genreName)
      params.set('genreId', genreId.toString())
    } else {
      params.append('genre', genreName)
      params.append('genreId', genreId.toString())
    }
    return `/movies/Filter?${params.toString()}`
  }

  return <FilterItem href={updateUrl()}>{genreName}</FilterItem>
}

export const TypeItem: React.FC<ContentItemProps> = ({ content }) => {
  const searchParams = useSearchParams()
  
  const updateUrl = (): string => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('type')) {
      params.set('type', content)
    } else {
      params.append('type', content)
    }
    return `/movies/Filter?${params.toString()}`
  }

  return <FilterItem href={updateUrl()}>{content}</FilterItem>
}

export const StatusItem: React.FC<ContentItemProps> = ({ content }) => {
  const searchParams = useSearchParams()
  
  const updateUrl = (): string => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('status')) {
      params.set('status', content)
    } else {
      params.append('status', content)
    }
    return `/movies/Filter?${params.toString()}`
  }

  return <FilterItem href={updateUrl()}>{content}</FilterItem>
}