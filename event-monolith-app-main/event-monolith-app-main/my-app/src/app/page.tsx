import Link from "next/link";
import Image from "next/image";
import "./css/main.css";

export default function Home() {
  return (
    <>
      <div className="main-container">
        <header>
          <nav className="main-flex">
            <Link href="/" className="brand-logo">
              <span className="brand-text">EventHub</span>
            </Link>

            <ul className="nav-flex">
              <li><Link href="/dashboard/users/main" className="nav-links">Home</Link></li>
              <li><Link href="/about" className="nav-links">About</Link></li>
              <li><Link href="/services" className="nav-links">Events</Link></li>
              <li><Link href="/contacts" className="nav-links">Contact</Link></li>
              <li><Link href="/auth/login" className="btn-2">Login</Link></li>
              <li><Link href="/auth/register" className="btn-1">Register</Link></li>
            </ul>
          </nav>

          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title">Discover and Join Zambia’s Most Exciting Events</h1>
              <p className="hero-subtitle">
                Explore community gatherings, expos, sports, and educational events happening across Zambia.
              </p>

              <div className="subjects-grid">
                <div className="subject-card"><h3 className="subject-title">Technology</h3></div>
                <div className="subject-card"><h3 className="subject-title">Culture & Arts</h3></div>
                <div className="subject-card"><h3 className="subject-title">Sports</h3></div>
                <div className="subject-card"><h3 className="subject-title">Education</h3></div>
                <div className="subject-card"><h3 className="subject-title">Business</h3></div>
              </div>

              <div className="hero-actions">
                <ul className="hero-actions">
                  <li><Link href="/auth/register" className="cta-button primary">Join the Community</Link></li>
                  <li><Link href="/services" className="cta-button secondary">Explore Events</Link></li>
                </ul>
              </div>
            </div>
          </section>
        </header>

        <main>
          {/* Community Engagement Section */}
          <div className="learning-solutions-section">
            <div className="container">
              <h2 className="section-heading">Engage with Your Community</h2>

              <div className="learning-methods">
                <div className="learning-method">
                  <div className="image-container">
                    <Image
                      src="/mobile.jpg"
                      alt="People discovering events on mobile"
                      width={400}
                      height={300}
                      className="learning-image"
                    />
                  </div>
                  <div className="content">
                    <h3 className="method-title">Find Events Anywhere, Anytime</h3>
                    <p className="method-description">
                      Use your mobile to find upcoming festivals, tech expos, or workshops near you.
                      Stay connected to Zambia’s vibrant community from wherever you are.
                    </p>
                  </div>
                </div>

                <div className="learning-method">
                  <div className="image-container">
                    <Image
                      src="/pc.jpg"
                      alt="User browsing events on a computer"
                      width={400}
                      height={300}
                      className="learning-image"
                    />
                  </div>
                  <div className="content">
                    <h3 className="method-title">Plan and Register Seamlessly</h3>
                    <p className="method-description">
                      Explore detailed event pages, register instantly, and get reminders for upcoming
                      Zambian events that matter most to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Mainno Events */}
          <div className="features-section">
            <div className="container">
              <h2 className="features-heading">Why Choose EventHub?</h2>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path d="M5 7H19C20.1046 7 21 7.89543 21 9V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V9C3 7.89543 3.89543 7 5 7Z" stroke="#00D4AA" strokeWidth="2"/>
                      <path d="M10 12L13 10V14L10 12Z" fill="#00D4AA"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">Verified Local Events</h3>
                  <p className="feature-description">
                    Every event is verified and community-driven — from Lusaka Tech Expo to Ndola Music Festivals.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path d="M10 15V9M14 15V12M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#00D4AA" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">Event Tracking</h3>
                  <p className="feature-description">
                    Track event schedules, see updates, and get instant notifications before events begin.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="#00D4AA" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">Community Support</h3>
                  <p className="feature-description">
                    Connect directly with organizers or community leads for any event-related help.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#00D4AA" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">Flexible Scheduling</h3>
                  <p className="feature-description">
                    Receive updates when events are rescheduled or new ones are added near your city.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="#00D4AA" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">Event Resources</h3>
                  <p className="feature-description">
                    Download flyers, event guides, and get directions right from your dashboard.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path d="M17 9V7C17 5.89543 16.1046 5 15 5H5C3.89543 5 3 5.89543 3 7V13C3 14.1046 3.89543 15 5 15H7M9 19H19C20.1046 19 21 18.1046 21 17V11C21 9.89543 20.1046 9 19 9H9C7.89543 9 7 9.89543 7 11V17C7 18.1046 7.89543 19 9 19Z" stroke="#00D4AA" strokeWidth="2"/>
                      <path d="M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z" fill="#00D4AA"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">Mobile-Friendly Access</h3>
                  <p className="feature-description">
                    Join or manage your event registrations easily through mobile or desktop.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="faq-section">
            <h2 className="faq-heading">Frequently Asked Questions</h2>
            <div className="faq-content">
              <div className="faq-item">
                <h3 className="faq-question">How do I register for an event?</h3>
                <div className="faq-answer">
                  <p>
                    Create an account and explore our list of community events. You can register directly from
                    the event page and receive confirmation via email or SMS.
                  </p>
                </div>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">Is there a cost to join?</h3>
                <div className="faq-answer">
                  <p>
                    Most community events are free, while others may have small registration fees. Payment is
                    securely processed through MTN or Airtel Money.
                  </p>
                </div>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">Can I host my own event?</h3>
                <div className="faq-answer">
                  <p>
                    Yes! Registered users can apply to become organizers and list their own events on the
                    EventHub platform.
                  </p>
                </div>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">Where are events located?</h3>
                <div className="faq-answer">
                  <p>
                    Events take place across Zambia — from Lusaka, Ndola, Kitwe, and Livingstone to
                    universities and cultural centers.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-section">
                <h3 className="footer-title">EventHub</h3>
                <p className="footer-description">
                  Connecting Zambia through meaningful community events and cultural experiences.
                </p>
              </div>

              <div className="footer-section">
                <h4 className="footer-subtitle">Quick Links</h4>
                <ul className="footer-links">
                  <li><Link href="/services">Events</Link></li>
                  <li><Link href="/contacts">Contact</Link></li>
                </ul>
              </div>

              <div className="footer-section">
                <h4 className="footer-subtitle">Contact</h4>
                <ul className="footer-contact">
                  <li>
                    <Link href="tel:+260970000000" className="contact-item">
                      <Image src="/icons/phone.svg" alt="Phone" width={16} height={16} />
                      <span>+260 97 6 59045</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="mailto:hello@mainnoevents.org" className="contact-item">
                      <Image src="/icons/email.svg" alt="Email" width={16} height={16} />
                      <span>frankmwelwa02@gmail.com</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://maps.google.com/?q=Ndola,Zambia" target="_blank" className="contact-item">
                      <Image src="/icons/location.svg" alt="Location" width={16} height={16} />
                      <span>Ndola, Zambia</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="copyright">© 2025 EventHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
