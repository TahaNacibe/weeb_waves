"use client"
import React, { useState, useEffect, FC } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Play, Share2, Loader2, Check,Minus, Plus } from 'lucide-react';
import { Anime } from '@/app/types/anime_type';
import InfoItem from '@/app/components/information_label';
import Link from 'next/link';
import RegisterForm from '@/app/forms/sign_up';
import AuthModal from '@/app/forms/sign_up';
import FirebaseServices from '@/app/firebase/firebase_services';
import { SignInData, SignUpData } from '@/app/types/sign_in_up';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';



type AnimeDetailsPageType = {
  anime: Anime
  formatDuration: string
  formatDateRange : string
}

const AnimeDetailsPage : FC<AnimeDetailsPageType> = ({anime, formatDateRange, formatDuration}) => {
  const [showForm, setFormState] = useState(false)
  const [showLists, setListsState] = useState(false)
  const [isInLists, setInLists] = useState<any>({})
  const [user, setUser] = useState <User | null>(null)

  const fireBase_services = new FirebaseServices()
  const auth = getAuth();
  
  useEffect(() => {
    // Set up an observer on the Auth object
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    })
  }, [])


  const getItemState = async () => {
    console.log("let's fucking goo")
    console.log(user)
    if (user) {
      const response = await fireBase_services.checkIfAnimeIsInList(String(anime.mal_id), user.uid)
      setInLists(response)
    }
  }
  useEffect(() => {
    getItemState()
  },[user])
  
  const isAnyCaseTrue = () => {
    return isInLists.isItTrue;
  }

  const isAnimeInThatList = (listId: number): boolean => {
    console.log(isInLists)
    if (isInLists && isInLists.resultMaps && isInLists.resultMaps[listId]) {
      return isInLists.resultMaps[listId].exists
    } else {
      return false
    }
  };
  
  
  const onClickOnList = () => {
    if (!user) {
      //* open forms for sign in and up
      setFormState(true)
    } else {
      //* open lists choice
      setListsState(true)
    }
  }
  
  const onSubmit = (data: SignInData | SignUpData) => {
    if ("username" in data) {
      {/* sign up case */ }
      fireBase_services.signUp(data.email, data.password,data.username)
    } else {
      {/* sign in case */ }
      fireBase_services.signIn(data.email, data.password)
    }
  }

  const updateListContent = (index: number, isInTheList: boolean) => {
    if (user) {
      const lists: Array<string> = ["Plan_to_watch", "completed", "dropped", "on-Hold", "watching"]
      fireBase_services.updateListContent(lists[index], anime, user.uid, isInTheList)
        getItemState()
    }

  }

  const DropMenuButton: FC = () => {
    const lists: Array<string> = ["Plan to Watch", "Completed", "Dropped", "On-Hold", "Watching"];

    return (
        <Menu as="div" className="relative text-left">
            <Menu.Button className="inline-flex w-full items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer px-3">
                <Plus aria-hidden="true" className="h-5 w-5 text-gray-400" />
                {`${isAnyCaseTrue() ? "Anime In List" : "Add To List"} `}
            </Menu.Button>

            <Menu.Items
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 transition-all transform focus:outline-none"
            >
                <div className="py-1 flex flex-col">
                    {lists.map((listName, index) => (
                        <Menu.Item key={index}>
                            {( {active}:{active:any} ) => (
                                <button
                                    onClick={() => updateListContent(index,isAnimeInThatList(index) )}
                                    className={`block w-full text-sm text-left ${active ? "bg-gray-900 text-gray-900" : "text-white"}`}
                                >
                                    <h2 className='text-base font-semibold p-2 ring-1 ring-white ring-opacity-5'>
                                        {isAnimeInThatList(index)? "Remove From " : "Add To "}
                                        {listName}
                                    </h2>
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </div>
            </Menu.Items>
        </Menu>
    );
};
  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden relative pt-14">
      <div className={`z-50 absolute md:w-[90%] h-screen flex justify-items-center justify-center ${showForm? "block" : "hidden"}`}>
        <AuthModal isOpen={showForm} onClose={() => {
          setFormState(false)
        }} onSubmit={(data) => {
          onSubmit(data)
        setFormState(false)
      }} />

      </div>
      {/* Blurred Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${anime.images.jpg.large_image_url})`,
            filter: 'blur(20px) brightness(0.2)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Navigation */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="hover:text-white cursor-pointer">Home</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">{anime.type}</span>
              <span>•</span>
              <span className="text-gray-300">{anime.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex md:flex-row flex-col gap-8">
            {/* Left Column - Cover Image */}
            <div className="md:w-[225px] scale-90 md:scale-100 flex-shrink-0 space-y-4">
              <img
                src={anime.images.jpg.large_image_url || '/api/placeholder/225/318'}
                alt={`${anime.title} Cover`}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="space-y-2">
                <button className="w-full bg-indigo-500 hover:bg-indigo-700 text-black py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-5 h-5" />
                  Watch now
                </button>
                <DropMenuButton />
              </div>
            </div>
            {/* Middle Column - Main Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{anime.title}</h1>

              {/* Info Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">
                  {anime.rating?.replace('PG-13', 'PG-13') || 'PG-13'}
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">HD</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {anime.episodes || '?'} Episodes
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">{formatDuration}</span>
                <Link href={`/anime/Filter?type=${anime.type}`}>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">{anime.type}</span>
                </Link>
              </div>

              {/* Synopsis */}
              <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                {anime.synopsis}
              </p>

              {/* Genres */}
              <div className="mb-6">
                <h3 className="text-gray-400 mb-2 text-xs">Genres</h3>
                <div className="flex gap-2 flex-wrap">
                  {anime.genres.map(genre => (
                    <Link href={`/anime/Filter?genre=${genre.name}&genreId=${genre.mal_id}`} key={genre.mal_id} >
                     <span 
                      
                      className="px-3 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20 cursor-pointer transition-colors"
                    >
                      {genre.name}
                    </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="md:w-[300px] bg-white/5 rounded-lg p-6 space-y-6 h-fit">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-2xl font-bold text-indigo-400">{anime.score?.toFixed(2) || '?'}</div>
                <div className="text-xs text-gray-400">
                  <div>Score</div>
                  <div>on MyAnimeList</div>
                </div>
              </div>

              <InfoItem 
                label="Japanese Title" 
                value={anime.title_japanese} 
              />

              <InfoItem 
                label="Aired" 
                value={formatDateRange} 
              />

              <Link href={`/seasons/Season?year=${anime.year}&season=${anime.season}`}>
              <InfoItem 
                label="Season" 
                value={anime.season ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}` : '—'} 
              />
              </Link>

              <InfoItem 
                label="Studios" 
                value={
                  <div className="flex gap-2 flex-wrap">
                    {anime.studios.map(studio => (
                      <Link href={studio.url} key={studio.mal_id} >
                      <span 
                        className="text-blue-400 hover:underline cursor-pointer text-xs"
                      >
                        {studio.name}
                      </span>
                      </Link>
                    ))}
                  </div>
                } 
              />

              <InfoItem 
                label="Producers" 
                value={
                  <div className="flex gap-2 flex-wrap">
                    {anime.producers.map(producer => (
                      <Link href={producer.url} key={producer.mal_id} >
                      <span 
                        className="text-blue-400 hover:underline cursor-pointer text-xs"
                      >
                        {producer.name}
                      </span>

                      </Link>
                    ))}
                  </div>
                } 
              />

              <InfoItem 
                label="Status" 
                value={anime.status} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailsPage;

