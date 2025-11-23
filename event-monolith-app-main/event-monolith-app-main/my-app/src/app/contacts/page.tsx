import Link from "next/link"
import Image from "next/image"
import './contacts.css'

export default function Contacts() {
    return (
        <div className="contacts-container">
            {/* Brand Logo */}
            <Link href="/" className="contacts-logo">
                <span className="brand-text">EventHub</span>
            </Link>

            <div className="contacts-content">
                <h1 className="contacts-title">Contact Zambian Community Events</h1>
                <p className="contacts-subtitle">
                    Get in touch with our community support team — we’re here to help you connect, register, and participate.
                </p>
                
                <div className="contacts-grid">
                    {/* Phone Call */}
                    <div className="contact-card">
                        <div className="contact-icon">
                            <Image src="/icons/phone.svg" alt="Phone" width={40} height={40} />
                        </div>
                        <h3 className="contact-type">Phone Call</h3>
                        <p className="contact-detail">Speak directly with our community support team</p>
                        <Link href="tel:+260970000000" className="contact-button">Call Us Now</Link>
                    </div>

                    {/* WhatsApp */}
                    <div className="contact-card">
                        <div className="contact-icon">
                            <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={40} height={40} />
                        </div>
                        <h3 className="contact-type">WhatsApp</h3>
                        <p className="contact-detail">Chat with us instantly on WhatsApp for quick assistance</p>
                        <Link href="https://wa.me/260970000000" className="contact-button" target="_blank" rel="noopener noreferrer">
                            Message Us
                        </Link>
                    </div>

                    {/* Email */}
                    <div className="contact-card">
                        <div className="contact-icon">
                            <Image src="/icons/email.svg" alt="Email" width={40} height={40} />
                        </div>
                        <h3 className="contact-type">Email</h3>
                        <p className="contact-detail">Send us a detailed message or event inquiry</p>
                        <Link href="mailto:info@zambiacommunityevents.zm" className="contact-button">Email Us</Link>
                    </div>

                    {/* Facebook */}
                    <div className="contact-card">
                        <div className="contact-icon">
                            <Image src="/icons/facebook.svg" alt="Facebook" width={40} height={40} />
                        </div>
                        <h3 className="contact-type">Facebook</h3>
                        <p className="contact-detail">Follow and engage with us on Facebook</p>
                        <Link href="https://facebook.com/zambiacommunityevents" className="contact-button" target="_blank" rel="noopener noreferrer">
                            Follow Us
                        </Link>
                    </div>

                    {/* Instagram */}
                    <div className="contact-card">
                        <div className="contact-icon">
                            <Image src="/icons/instagram.svg" alt="Instagram" width={40} height={40} />
                        </div>
                        <h3 className="contact-type">Instagram</h3>
                        <p className="contact-detail">See highlights from recent community events</p>
                        <Link href="https://instagram.com/zambiacommunityevents" className="contact-button" target="_blank" rel="noopener noreferrer">
                            Follow Us
                        </Link>
                    </div>

                    {/* TikTok */}
                    <div className="contact-card">
                        <div className="contact-icon">
                            <Image src="/icons/tiktok.svg" alt="TikTok" width={40} height={40} />
                        </div>
                        <h3 className="contact-type">TikTok</h3>
                        <p className="contact-detail">Watch our event recaps and community stories</p>
                        <Link href="https://tiktok.com/@zambiacommunityevents" className="contact-button" target="_blank" rel="noopener noreferrer">
                            Follow Us
                        </Link>
                    </div>
                </div>

                <div className="contacts-cta">
                    <h2>We’re Here for the Community</h2>
                    <p>
                        Reach out through any of the platforms above to get event details, support, or partnership opportunities.
                    </p>
                </div>
            </div>
        </div>
    )
}
