import {
    FiArrowLeft,
    FiShield,
    FiDatabase,
    FiAlertCircle,
    FiAlertTriangle,
    FiLock,
    FiUserX
} from "react-icons/fi";

interface TermsProps {
    onBack: () => void;
}

const TermsAndCondition = ({ onBack }: TermsProps) => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className=" bg-gradient-to-br from-red-700 to-red-900 px-8 py-12 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
                    <button
                        onClick={onBack}
                        className="flex items-center text-red-100 hover:text-white transition-colors mb-8 group font-medium"
                    >
                        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Service & Safety Protocol</h1>
                    <p className="text-red-200 text-sm font-medium">Strictly Enforced • Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Content */}
                <div className="px-8 py-10 space-y-12 text-gray-700">

                    {/* 1. Binding Agreement */}
                    <section>
                        <div className="flex items-center mb-4">
                            <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 text-sm">1</span>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Binding Legal Agreement
                            </h2>
                        </div>
                        <p className="leading-relaxed text-gray-600 pl-11">
                            By accessing or using ChatHub, you are entering into a legally binding agreement. You acknowledge that this platform facilitates anonymous communication with <strong>unverified strangers</strong>. Use of this service constitutes your unqualified acceptance of these strict terms. If you are under 18 years of age, you are <strong>strictly prohibited</strong> from using this application.
                        </p>
                    </section>

                    {/* 2. CRITICAL SAFETY WARNING */}
                    <section className="bg-red-50 p-8 rounded-xl border-l-4 border-red-600 shadow-sm">
                        <div className="flex items-start mb-5">
                            <FiAlertTriangle className="text-red-600 w-8 h-8 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold text-red-900">
                                    EXTREME CAUTION ADVISED: Stranger Danger
                                </h2>
                                <p className="text-red-800 font-medium mt-1">
                                    Assume everyone is a potential threat until proven otherwise.
                                </p>
                            </div>
                        </div>

                        <p className="text-red-800 mb-6 leading-relaxed">
                            Users on this platform are completely anonymous. We verify <strong>nothing</strong> about them. Predatory individuals may use this platform. You are solely responsible for your own safety.
                        </p>

                        <div className="bg-white p-5 rounded-lg border border-red-100 shadow-inner">
                            <h3 className="text-xs font-bold text-red-900 uppercase tracking-widest mb-4 border-b border-red-100 pb-2">Absolutely Prohibited Disclosures</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-red-800 font-medium">
                                <li className="flex items-center"><FiLock className="mr-2.5 text-red-500" /> Full Name or Family Names</li>
                                <li className="flex items-center"><FiLock className="mr-2.5 text-red-500" /> Financial Info (Bank/Cards)</li>
                                <li className="flex items-center"><FiLock className="mr-2.5 text-red-500" /> Physical Addresses (Home/Work)</li>
                                <li className="flex items-center"><FiLock className="mr-2.5 text-red-500" /> Phone Numbers or Emails</li>
                                <li className="flex items-center"><FiLock className="mr-2.5 text-red-500" /> Social Media Handles</li>
                                <li className="flex items-center"><FiLock className="mr-2.5 text-red-500" /> School or Workplace Names</li>
                            </ul>
                        </div>
                    </section>

                    {/* 3. Severe Conduct Policy */}
                    <section>
                        <div className="flex items-center mb-5">
                            <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 text-sm">3</span>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                Zero Tolerance Conduct Policy
                            </h2>
                        </div>

                        <div className="pl-11">
                            <p className="mb-6 text-gray-600">
                                We utilize automated filters and user reporting to monitor platform activity. <strong>Any violation will result in an immediate, permanent ban of your Device ID and IP Address.</strong> We cooperate fully with law enforcement for illegal activities.
                            </p>
                            <div className="grid gap-4">
                                <div className="flex p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <FiUserX className="text-red-600 w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Sexual Harassment & Nudity</h4>
                                        <p className="text-sm text-gray-600 mt-1">Strictly prohibited. Solicitation, sexting, sharing explicit images, or unwanted sexual advances will trigger an instant ban.</p>
                                    </div>
                                </div>
                                <div className="flex p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <FiShield className="text-red-600 w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Hate Speech & Abuse</h4>
                                        <p className="text-sm text-gray-600 mt-1">Zero tolerance for racism, sexism, homophobia, religious intolerance, or bullying. We are a hate-free zone.</p>
                                    </div>
                                </div>
                                <div className="flex p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <FiAlertCircle className="text-red-600 w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Illegal Activities & Fraud</h4>
                                        <p className="text-sm text-gray-600 mt-1">Promotion of drugs, weapons, violence, scams, phishing, or any criminal activity is strictly forbidden.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. Data Privacy */}
                    <section className="bg-blue-50 p-8 rounded-xl border-l-4 border-blue-600">
                        <div className="flex items-start">
                            <FiDatabase className="text-blue-600 w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold text-blue-900 mb-3">
                                    Ephemeral Data Architecture
                                </h2>
                                <p className="text-blue-800 leading-relaxed mb-4 text-sm">
                                    ChatHub is built on a <strong>"Transient Data"</strong> model designed for privacy, but this comes with limitations you must accept:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-blue-800 text-sm font-medium ml-1">
                                    <li><strong>Volatile Storage:</strong> Messages exist ONLY in temporary RAM. We have no hard drives storing chats.</li>
                                    <li><strong>Irreversible Erasure:</strong> Data is wiped instantly upon server restart or after 1 hour of inactivity.</li>
                                    <li><strong>No Recovery:</strong> We cannot recover lost messages, evidence, or logs for you. Once it's gone, it's gone.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 5. Disclaimer */}
                    <section className="border-t-2 border-gray-100 pt-10">
                        <div className="flex items-center mb-4">
                            <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 text-sm">5</span>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Limitation of Liability
                            </h2>
                        </div>
                        <div className="pl-11 text-gray-500 text-sm space-y-4 text-justify">
                            <p>
                                <strong>CHAT HUB IS PROVIDED "AS IS".</strong> WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED. WE DO NOT SCREEN USERS.
                            </p>
                            <p>
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHATHUB AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE, INCLUDING WITHOUT LIMITATION, ANY DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES.
                            </p>
                            <p>
                                YOU AGREE TO INDEMNIFY AND HOLD HARMLESS CHATHUB FROM ANY CLAIMS ARISING OUT OF YOUR USE OF THE SERVICE OR VIOLATION OF THESE TERMS.
                            </p>
                        </div>
                    </section>

                    <section className="bg-gray-900 text-gray-300 p-6 rounded-lg text-center text-sm">
                        <p>
                            By clicking "Join Chat", you explicitly confirm that you have read, understood, and agree to be bound by these Terms.
                        </p>
                        <p className="mt-2 text-white font-bold">
                            VIOLATION OF THESE TERMS WILL RESULT IN A PERMANENT IP BAN.
                        </p>
                    </section>
                    <button
                        onClick={onBack}
                        className="flex items-center text-black hover:cursor-pointer transition-colors mb-8 group font-medium"
                    >
                        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>

                </div>
            </div>
        </div>
    );
};

export default TermsAndCondition;