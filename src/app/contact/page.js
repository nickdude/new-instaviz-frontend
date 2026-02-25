'use client'
import { useState } from 'react'
import BlueButton from '../../components/buttons/BlueButton'
import { useToast } from '../../contexts/ToastContext'
import HomeNavBar from '../../components/HomeNavBar'
import Footer from '../../components/Footer'

export default function ContactUs() {
    const { addToast } = useToast()
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const validate = () => {
        const err = {}
        if (!form.name.trim()) err.name = 'Name is required'
        if (!form.email.trim()) err.email = 'Email is required'
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) err.email = 'Invalid email'
        if (!form.message.trim()) err.message = 'Please enter a message'
        setErrors(err)
        return Object.keys(err).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            // POST to Formspree (public form endpoint)
            const FORM_URL = process.env.NEXT_PUBLIC_API_GOOGLE_FORM
            const res = await fetch(FORM_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name: form.name, email: form.email, message: form.message })
            })

            if (!res.ok) {
                const text = await res.text().catch(() => '')
                throw new Error(`Formspree error: ${res.status} ${res.statusText} ${text}`)
            }

            addToast('Message sent — we will get back to you shortly', { type: 'success' })
            setForm({ name: '', email: '', message: '' })
            setErrors({})
        } catch (err) {
            // Show error to user and keep form state so they can retry
            console.warn('Contact submit failed', err?.message || err)
            addToast('Failed to send message — please try again later', { type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <HomeNavBar />
            <div className="w-full min-h-screen bg-darkGrey flex items-start justify-center py-12 px-4">
                <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-semibold text-black mb-3">Get in touch</h2>
                        <p className="text-sm text-lightGrey mb-6">Have a question, feedback or want to collaborate? Send us a message and we'll respond as soon as possible.</p>

                        <div className="space-y-4 text-sm text-black">
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-gray-600">info@instaviz.me</p>
                            </div>
                            <div>
                                <p className="font-medium">Support</p>
                                <p className="text-gray-600">support@instaviz.me</p>
                            </div>
                            <div>
                                <p className="font-medium">Address</p>
                                <p className="text-gray-600">7th Floor, Temple Tower, 672 Anna Salai, Nandanam, Chennai, TN 600035</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded-lg p-3 outline-none" />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded-lg p-3 outline-none" />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea name="message" value={form.message} onChange={handleChange} rows={6} className="mt-1 block w-full border rounded-lg p-3 outline-none" />
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                            </div>

                            <div>
                                <BlueButton label={loading ? 'Sending…' : 'Send message'} type="submit" disabled={loading} width="w-full" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            <Footer />
        </div>
    )
}
