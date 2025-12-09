import { useState } from "react"
import type { LoginProps } from "../interfaces";




const Login = ({ onLogin, onShowTerms }: LoginProps) => {
    const [username, setUserName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl  shadow-black/5 overflow-hidden">

                {/* Left side gradient section */}

                <div className="h-2  bg-gradient-to-r from-blue-500 to-violet-500">

                </div>

                <div className="px-8 py-12">
                    {/* Header */}

                    <div className="text-center  mb-8">
                        <h1 className="text-2xl font-bold  text-slate-800">Welcome to ChatHub</h1>
                        <p className="mt-2 text-slate-600">Join the conversation</p>
                    </div>

                    {/* Login */}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700">Choose a username</label>
                            <div className="relative">
                                <input type="text" id="username" placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full px-4 py-3  bg-slate-50 border border-slate-200 
                                        rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                                        focus:border-blue:500 transition-all duration-200 
                                        placeholder:text-slate-400" required
                                />
                                {
                                    username && <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    </div>
                                }
                            </div>

                        </div>
                        <button type="submit" disabled={!username.trim()} className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl 
                                hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer 
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none">Join Chat</button>
                    </form>

                    {/* Footer */}

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-center text-sm text-slate-500">
                            By joining, You agree to our{" "}
                            <button
                                type="button"
                                onClick={onShowTerms} // Call the function here
                                className="text-blue-500 hover:text-blue-600 font-medium hover:underline focus:outline-none"
                            >
                                terms & conditions
                            </button>
                        </p>
                    </div>
                </div>

            </div>


        </div>
    )
}

export default Login
