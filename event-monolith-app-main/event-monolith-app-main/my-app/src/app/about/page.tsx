import Link from 'next/link';
import './about.css';

export default function About() {
    return (
        <div className="about-section">
            {/* Brand Logo Link for Home */}
            <Link href="/" className="home-logo">
                <span className="brand-text">EventHub</span>
            </Link>
            
            <div className="container">
                <h1 className="about-main-heading">About Zambia Community Event App</h1>
                <p className="about-subtitle">Connecting People Through Local Events</p>
                
                <div className="about-content">
                    <div className="about-intro">
                        <h2>Empowering Zambians Through Community Engagement</h2>
                        <p>
                            The Zambia Community Event App is a dynamic platform designed to bring people together 
                            through cultural, educational, and social events. Our mission is to strengthen community ties, 
                            promote innovation, and celebrate Zambia’s vibrant culture by making event discovery 
                            and participation simple and accessible to everyone.
                        </p>
                    </div>

                    <div className="mission-vision">
                        <div className="mission">
                            <h3>🎯 Our Mission</h3>
                            <p>
                                To connect individuals, organizations, and communities across Zambia through real-time event 
                                discovery, registration, and participation — fostering growth, collaboration, and creativity.
                            </p>
                        </div>
                        
                        <div className="vision">
                            <h3>🔮 Our Vision</h3>
                            <p>
                                To become Zambia’s leading community engagement platform that promotes local talent, 
                                encourages innovation, and supports national unity through shared experiences and events.
                            </p>
                        </div>
                    </div>

                    <div className="what-we-offer">
                        <h3>🌟 What We Offer</h3>
                        <div className="offerings-grid">
                            <div className="offering-item">
                                <h4>🎉 Event Discovery</h4>
                                <p>Find the latest events happening across Zambia — from tech expos to cultural festivals.</p>
                            </div>
                            <div className="offering-item">
                                <h4>⚡ Real-Time Notifications</h4>
                                <p>Stay informed about event updates, registrations, and announcements instantly.</p>
                            </div>
                            <div className="offering-item">
                                <h4>🤝 Community Engagement</h4>
                                <p>Connect with other participants, local organizations, and creators through shared interests.</p>
                            </div>
                            <div className="offering-item">
                                <h4>📅 Event Planning Tools</h4>
                                <p>Organizers can list, promote, and manage events easily from a single dashboard.</p>
                            </div>
                            <div className="offering-item">
                                <h4>🌍 Local Focus</h4>
                                <p>Showcasing events across Zambia — from Lusaka to Ndola, Kitwe, Livingstone, and beyond.</p>
                            </div>
                            <div className="offering-item">
                                <h4>🎯 Personalized Suggestions</h4>
                                <p>Get AI-powered recommendations for events based on your interests and past activity.</p>
                            </div>
                        </div>
                    </div>

                    <div className="our-values">
                        <h3>❤️ Our Values</h3>
                        <div className="values-list">
                            <div className="value-item">
                                <h4>✅ Inclusivity</h4>
                                <p>We aim to bring people together from all walks of life across Zambia’s diverse regions.</p>
                            </div>
                            <div className="value-item">
                                <h4>🤝 Collaboration</h4>
                                <p>Encouraging partnerships between communities, organizations, and individuals.</p>
                            </div>
                            <div className="value-item">
                                <h4>🚀 Innovation</h4>
                                <p>Leveraging modern technology to enhance engagement and promote creativity.</p>
                            </div>
                            <div className="value-item">
                                <h4>🎊 Celebration</h4>
                                <p>Highlighting Zambia’s cultural heritage and creative spirit through local events.</p>
                            </div>
                        </div>
                    </div>

                    <div className="join-community">
                        <h2>Join the Zambian Event Movement</h2>
                        <p>
                            Thousands of Zambians are already using our platform to discover and share events that 
                            inspire connection and growth. Be part of the movement — explore, engage, and celebrate 
                            what makes our nation truly unique.
                        </p>
                        <div className="cta-buttons">
                            <Link href="/auth/register" className="cta-btn primary">Create an Account</Link>
                            <Link href="/contact" className="cta-btn secondary">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
