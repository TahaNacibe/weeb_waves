"use client"
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from "../firebase/firebase";
import { User as UserIcon } from "lucide-react";
import AuthModal from "../forms/sign_up";
import { createPortal } from "react-dom";
import Link from "next/link";
import FirebaseServices from "../firebase/firebase_services";

export default function ProfileAndSignInButton() {
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
    const Firebase_Services = new FirebaseServices()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user || null);
        });
        return () => unsubscribe(); // Clean up on component unmount
    }, []);

    const imagePlaceHolder = () => (
        <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">
                {(user?.displayName ?? "Guest")[0].toUpperCase()}
            </span>
        </div>
    );

    const signInButton = () => (
        <button 
            type="button" 
            onClick={() => setIsModalOpen(true)} // Set modal to open
            className="text-gray-900 hover:text-white border border-gray-800 hover:bg-white/15 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/15 flex flex-row gap-2 dark:focus:ring-gray-800"
        >
            <UserIcon size={20} /> Sign In
        </button>
    );

    // Render the modal as a portal to document.body
    const renderModal = () => {
        return createPortal(
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <AuthModal 
                    isOpen={true}
                    onClose={() => {
                        setIsModalOpen(false)
                    }} // Close modal on close
                    onSubmit={(data) => {
                        if ("username" in data) {
                            {/* sign up case */ }
                            Firebase_Services.signUp(data.email, data.password,data.username)
                          } else {
                            {/* sign in case */ }
                            Firebase_Services.signIn(data.email, data.password)
                          }
                        setIsModalOpen(false)
                    }} // Close modal on submit
                />
            </div>,
            document.body
        );
    };

    return (
        <div className="flex items-center">
            {user ? (
                <>
                    <Link
                        href={`/profile?userName=${user.displayName}$profile=${user.photoURL}`}
                        className="flex items-center">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="User profile" className="rounded-full w-8 h-8" />
                    ) : (
                        imagePlaceHolder()
                    )}
                    <h1 className="text-center flex justify-center items-center pl-2">
                        {user.displayName}
                    </h1>
                    </Link>
                </>
            ) : (
                <>
                    {signInButton()}
                    {isModalOpen && renderModal()}
                </>
            )}
        </div>
    );
}
