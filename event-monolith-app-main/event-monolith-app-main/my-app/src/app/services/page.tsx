import Link from 'next/link';
import './services.css';

export default function Service() {
    return (
        <div className="services-section">
            {/* Brand Logo Link for Home */}
            <Link href="/" className="home-logo">
                <span className="brand-text">EventHub</span>
            </Link>
            
            <div className="container">
                <h1 className="services-main-heading">Our Community Engagement Services</h1>
                <p className="services-intro">
                    Discover exciting opportunities to connect, collaborate, and participate in events 
                    that celebrate Zambia’s creativity, innovation, and diversity. Whether you’re an organizer 
                    or an attendee, our platform makes event engagement easy and impactful.
                </p>
                
                <div className="subjects-grid">
                    <div className="subject-card">
                        <div className="subject-header">
                            <h3 className="subject-title">💻 Technology & Innovation</h3>
                        </div>
                        <p className="subject-description">
                            Join Zambia’s growing digital community through hackathons, tech expos, and 
                            innovation summits like the Lusaka Tech Expo and UNZA Robotics Summit. Connect 
                            with innovators shaping the country’s digital future.
                        </p>
                    </div>
                    
                    <div className="subject-card">
                        <div className="subject-header">
                            <h3 className="subject-title">🎶 Culture & Music</h3>
                        </div>
                        <p className="subject-description">
                            Experience Zambia’s vibrant arts and entertainment scene through festivals like 
                            the Copperbelt Music Festival, traditional dance showcases, and cultural fairs that 
                            celebrate our shared heritage.
                        </p>
                    </div>
                    
                    <div className="subject-card">
                        <div className="subject-header">
                            <h3 className="subject-title">🏃 Sports & Fitness</h3>
                        </div>
                        <p className="subject-description">
                            Be part of Zambia’s active sports community — from the Zambezi Marathon to local 
                            football tournaments. Participate, cheer, and stay active with events promoting 
                            fitness and unity.
                        </p>
                    </div>
                    
                    <div className="subject-card">
                        <div className="subject-header">
                            <h3 className="subject-title">🎨 Art & Creativity</h3>
                        </div>
                        <p className="subject-description">
                            Explore exhibitions, craft fairs, and creative workshops like the Kitwe Arts & Culture Fair. 
                            Discover Zambian talent and support artists who bring color and inspiration to our communities.
                        </p>
                    </div>
                    
                    <div className="subject-card">
                        <div className="subject-header">
                            <h3 className="subject-title">🎓 Education & Empowerment</h3>
                        </div>
                        <p className="subject-description">
                            Attend conferences, seminars, and mentorship sessions organized by universities and 
                            institutions — including the Zambia University College of Technology Expo. Learn, network, 
                            and grow professionally.
                        </p>
                    </div>
                </div>
                
                <div className="enrollment-cta">
                    <h2>Join the Event Network Today</h2>
                    <p>
                        To explore and register for events, please login to your account or create one 
                        to stay updated with notifications and recommendations across Zambia.
                    </p>
                    <div className="auth-buttons">
                        <Link href="/auth/login" className="auth-btn login-btn">Login</Link>
                        <Link href="/auth/register" className="auth-btn register-btn">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
