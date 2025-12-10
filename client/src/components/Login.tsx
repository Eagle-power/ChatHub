import { useState, useEffect } from "react";
import { RiMessage2Fill } from "react-icons/ri";
import { FiArrowRight, FiLoader } from "react-icons/fi"; 
import type { LoginProps } from "../interfaces";

const Login = ({ onLogin, onShowTerms }: LoginProps) => {
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            setIsLoading(true);
            onLogin(username);
        }
    };

    // Safety: If the server is dead and doesn't respond in 5 seconds, 
    // stop the loader so the user isn't stuck forever.
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isLoading) {
            timeout = setTimeout(() => {
                setIsLoading(false);
            }, 5000);
        }
        return () => clearTimeout(timeout);
    }, [isLoading]);

    return (
        <div className="flex-1 flex items-center justify-center p-4 animate-fade-in relative">

            {/* 1. LOADING OVERLAY */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                    <div className="bg-white p-4 rounded-full shadow-xl">
                        <FiLoader className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-indigo-900 animate-pulse">
                        Connecting to secure server...
                    </p>
                </div>
            )}

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <RiMessage2Fill className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">ChatHubSpace</h1>
                    <p className="text-indigo-100">Enter your alias to join the chat space</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-gray-50 focus:bg-white"
                                placeholder="Ex. Agent Smith"
                                required
                                disabled={isLoading}  
                                autoComplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !username.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            <span>{isLoading ? "Joining..." : "Join Secure Chat"}</span>
                            {!isLoading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {/* Footer Section */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-center text-sm text-slate-500">
                            By joining, You agree to our{" "}
                            <button
                                type="button"
                                onClick={onShowTerms}
                                disabled={isLoading}
                                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline focus:outline-none transition-colors"
                            >
                                Terms & Safety Protocol
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;