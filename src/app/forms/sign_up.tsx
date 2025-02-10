import { FC, useState, useEffect } from 'react'
import { Mail, Lock, User, Eye, EyeOff, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SignInData, SignUpData } from '../types/sign_in_up'

type AuthModalProps = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: SignInData | SignUpData) => void
    isLoading?: boolean
    isOutSide?: boolean
}

// Separate controlled input component
const ControlledInput: FC<{
    icon: FC<any>
    name: string
    type?: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    error?: string
    showPasswordToggle?: boolean
    autoComplete?: string
}> = ({
    icon: Icon,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    showPasswordToggle,
    autoComplete
}) => {
    const [showPassword, setShowPassword] = useState(false)
    
    return (
        <div className="space-y-1">
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon className="w-5 h-5" />
                </div>
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full bg-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-gray-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                              hover:bg-white/[0.15] transition-all duration-200
                              ${error ? 'ring-2 ring-red-500/50' : ''}`}
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                                 hover:text-gray-300 transition-colors p-1"
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-red-400 text-xs pl-1">{error}</p>
            )}
        </div>
    )
}

const AuthModal: FC<AuthModalProps> = ({ 
    isOpen,
    onClose, 
    onSubmit, 
    isOutSide: isOutSide = false,
    isLoading = false 
}) => {
    const [isSignIn, setIsSignIn] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState<SignUpData>({
        email: '',
        password: '',
        username: '',
        confirmPassword: ''
    })

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!isSignIn) {
            if (!formData.username) {
                newErrors.username = 'Username is required'
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            const submitData = isSignIn 
                ? { email: formData.email, password: formData.password }
                : formData
            onSubmit(submitData)
        }
    }

    const handleInputChange = (name: keyof SignUpData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className={`fixed ${isOutSide? "pt-80" : ""} inset-0 z-50 flex items-center justify-center px-4`}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md overflow-hidden"
                >
                    <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white 
                                     transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-white">
                                    {isSignIn ? 'Welcome Back' : 'Create Account'}
                                </h1>
                                <p className="text-gray-400 mt-2">
                                    {isSignIn 
                                        ? 'Sign in to continue to your account' 
                                        : 'Sign up to get started with our service'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isSignIn && (
                                    <ControlledInput 
                                        icon={User}
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={(value) => handleInputChange('username', value)}
                                        error={errors.username}
                                        autoComplete="username"
                                    />
                                )}
                                
                                <ControlledInput 
                                    icon={Mail}
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(value) => handleInputChange('email', value)}
                                    error={errors.email}
                                    autoComplete="email"
                                />
                                
                                <ControlledInput 
                                    icon={Lock}
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(value) => handleInputChange('password', value)}
                                    error={errors.password}
                                    showPasswordToggle
                                    autoComplete={isSignIn ? "current-password" : "new-password"}
                                />
                                
                                {!isSignIn && (
                                    <ControlledInput 
                                        icon={Lock}
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={(value) => handleInputChange('confirmPassword', value)}
                                        error={errors.confirmPassword}
                                        showPasswordToggle
                                        autoComplete="new-password"
                                    />
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium
                                             hover:bg-blue-600 focus:outline-none focus:ring-2 
                                             focus:ring-blue-500/50 transition-all duration-200
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             mt-6"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>{isSignIn ? 'Signing in...' : 'Signing up...'}</span>
                                        </div>
                                    ) : (
                                        isSignIn ? 'Sign In' : 'Sign Up'
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm text-gray-400">
                                {isSignIn ? (
                                    <>
                                        Don&apos;t have an account?{' '}
                                        <button
                                            onClick={() => {
                                                setIsSignIn(false)
                                                setErrors({})
                                            }}
                                            className="text-blue-400 hover:text-blue-300 
                                                     font-medium transition-colors"
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            onClick={() => {
                                                setIsSignIn(true)
                                                setErrors({})
                                            }}
                                            className="text-blue-400 hover:text-blue-300 
                                                     font-medium transition-colors"
                                        >
                                            Sign In
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default AuthModal