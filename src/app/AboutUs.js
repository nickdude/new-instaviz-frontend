import React from 'react'
import { Link } from 'react-router-dom'
import BlueButton from '../components/buttons/BlueButton'

const AboutUs = () => {
    return (
        <div className="w-full min-h-screen bg-darkGrey flex items-start justify-center py-12 px-4">
            <div className="max-w-6xl w-full bg-white rounded-2xl shadow-md p-6 md:p-12">
                <div className="space-y-8">
                    <header className="text-center">
                        <h1 className="text-3xl md:text-4xl font-semibold text-black">About Instaviz</h1>
                        <p className="mt-3 text-sm text-lightGrey max-w-2xl mx-auto">We help professionals, teams, and businesses replace outdated paper cards with fast, secure, and beautifully designed digital profiles that are easy to share and update.</p>
                    </header>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div>
                            <h2 className="text-2xl font-semibold text-black mb-3">Our mission</h2>
                            <p className="text-gray-700 mb-4">Make digital networking effortless. We believe that every professional should be able to share who they are and what they do in under a second — without losing control over their information.</p>

                            <h3 className="font-medium text-black mt-4">Vision</h3>
                            <p className="text-gray-700">To be the simplest, most trusted platform for professional identity. We imagine a world where contacts are meaningful, up-to-date, and privacy-respecting.</p>

                            <div className="mt-6">
                                <h3 className="font-medium text-black">Core values</h3>
                                <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
                                    <li><strong>Performance:</strong> Instant load times on any device.</li>
                                    <li><strong>Privacy:</strong> You decide what to share and when.</li>
                                    <li><strong>Design:</strong> Templates that look great and convert.</li>
                                    <li><strong>Simplicity:</strong> Powerful features without the complexity.</li>
                                </ul>
                            </div>

                            <div className="mt-6">
                                <Link to="/contact"><BlueButton label="Contact our team" width="w-auto" /></Link>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-black mb-3">Our story</h3>
                            <p className="text-gray-700 mb-4">Instaviz was founded by designers and engineers who saw that business cards—while familiar—often failed to keep up with the speed of modern networking. We started with a simple vCard generator and iterated into a full platform for smart cards, templates, and professional profiles used by freelancers, agencies, and enterprises.</p>

                            <h4 className="font-medium text-black">Team highlights</h4>
                            <div className="mt-3 space-y-3">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-white rounded-full mr-3 flex items-center justify-center text-sm font-semibold">A</div>
                                    <div>
                                        <div className="font-medium">Anur</div>
                                        <div className="text-gray-600 text-sm">Founder & CEO</div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-white rounded-full mr-3 flex items-center justify-center text-sm font-semibold">R</div>
                                    <div>
                                        <div className="font-medium">Raghul</div>
                                        <div className="text-gray-600 text-sm">Head of Product</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-black mb-4">What we build</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium">Smart Cards</h4>
                                <p className="text-sm text-gray-600 mt-2">Shareable cards with contact actions, socials, and analytics.</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium">Profile Pages</h4>
                                <p className="text-sm text-gray-600 mt-2">Customizable profiles for freelancers and teams.</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium">Templates & Integrations</h4>
                                <p className="text-sm text-gray-600 mt-2">Beautiful templates and tools that work with your stack.</p>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-black">How we work</h3>
                            <ol className="list-decimal pl-5 mt-3 text-sm text-gray-600 space-y-2">
                                <li>Design with simplicity — pick a template and personalize in minutes.</li>
                                <li>Ship fast — all pages are optimized for performance and SEO.</li>
                                <li>Respect privacy — data stays under your control; export or delete anytime.</li>
                            </ol>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-black">Trusted by teams</h3>
                            <p className="text-sm text-gray-600">Companies use Instaviz to consolidate employee profiles, track shares, and keep contact info current across their org.</p>
                            <div className="mt-4 space-y-3">
                                <blockquote className="text-sm text-gray-700 italic">"Instaviz made our networking effortless — team profiles are consistent and updating info is instant." — A happy customer</blockquote>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-black mb-3">Frequently asked</h2>
                        <div className="space-y-3 text-sm text-gray-700">
                            <div>
                                <p className="font-medium">Is my data private?</p>
                                <p className="text-gray-600">Yes — you control what fields are public. We do not sell your information.</p>
                            </div>
                            <div>
                                <p className="font-medium">Can I export contacts?</p>
                                <p className="text-gray-600">Yes — contact exports and integrations are available on paid plans.</p>
                            </div>
                        </div>
                    </section>

                    <footer className="text-center py-6">
                        <p className="text-sm text-gray-600 mb-4">Ready to modernize how you share your professional identity?</p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/register"><BlueButton label="Get Started" width="" /></Link>
                            <Link to="/contact" className="text-sm text-lightBlue underline">Contact Sales</Link>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default AboutUs
