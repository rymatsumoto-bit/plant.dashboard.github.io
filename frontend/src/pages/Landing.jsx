import { useState } from 'react';
import LoginModal from '../components/modals/LoginModal';

export default function Landing() {
  // State to control login modal visibility
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Handler for opening login modal
  const handleSignInClick = () => { setShowLoginModal(true); };

  // Handler for closing login modal
  const handleCloseModal = () => { setShowLoginModal(false); };

  // Handler for successful login
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Reload the page to trigger App.jsx auth check
    // This will cause App to re-check auth and show Dashboard
    window.location.reload();
  };

  {/* ── Floating leaves ── */}
  const leafPositions = [
    { top: '10%', left: '10%', delay: '0s',  duration: '25s' },
    { top: '20%', left: '80%', delay: '5s',  duration: '30s' },
    { top: '50%', left: '20%', delay: '10s', duration: '22s' },
    { top: '80%', left: '70%', delay: '15s', duration: '28s' },
  ];

  return (
    <>
      {/*
        Inline keyframes for animations that Tailwind can't express as utilities.
        These replace the @keyframes blocks that lived in landing.css,  and leaf.css.
      */}
      <style>{`

        @keyframes leafFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25%       { transform: translate(20px, -20px) rotate(10deg); }
          50%       { transform: translate(-10px, -40px) rotate(-5deg); }
          75%       { transform: translate(15px, -20px) rotate(8deg); }
        }

        @keyframes slideDown {
          from  { transform: translateY(-100%); opacity: 0; }
          to    { transform: translateY(0);    opacity: 1; }
        }

        @keyframes slideLeft {
          from  { transform: translateX(-50px); opacity: 0; }
          to    { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideRight {
          from  { transform: translateX(50px); opacity: 0; }
          to    { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        @keyframes floatCard1 {
          0%, 100% { transform: translateX(-50%) rotate(-3deg) translateY(0); }
          50%       { transform: translateX(-50%) rotate(-3deg) translateY(-15px); }
        }

        @keyframes floatCard2 {
          0%, 100% { transform: rotate(5deg) translateY(0); }
          50%       { transform: rotate(5deg) translateY(-20px); }
        }

        @keyframes floatCard3 {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          50%       { transform: rotate(-5deg) translateY(-10px); }
        }

        @keyframes fillBar {
          from { width: 0; }
        }

      `}</style>

      {/* ── Root: organic radial background ── */}
      <div
        className="relative overflow-x-hidden leading-relaxed bg-background-primary"
      >

        {/* Organic background texture */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(122,155,118,0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(244,213,141,0.20) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(200,111,86,0.10) 0%, transparent 40%)
            `,
          }}
        />

        {/* ── Floating leaves ── */}
        {leafPositions.map((pos, i) => (
          <div
            key={i}
            className="fixed pointer-events-none z-1 opacity-20 animate-[leafFloat_5s_infinite_ease-in-out]"
            style={{
              top: pos.top,
              left: pos.left,
              animationName: 'leafFloat',
              animationDelay: pos.delay,
              animationDuration: pos.duration
            }}
          >
            <span className="text-[60px]">🌿</span>
          </div>
        ))}

        {/* ── Page wrapper (above bg layers) ── */}
        <div className="relative z-2">

          {/* Navigation */}
          <nav className="flex justify-between items-center p-[2rem_5%] animate-[slideDown_0.8s_ease-out]">
            <div className="text-title text-forest-deep font-bold flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              Plant Dash
            </div>

            <div className="flex gap-4">
              <button 
                className="btn px-6 py-3 text-base font-medium bg-transparent border-2 hover:bg-moss hover:text-cream"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="grid grid-cols-2 gap-16 px-[5%] pt-16 pb-24 items-center min-h-[80vh]">
            <div className="animate-[slideLeft_1s_ease-out]">
              <h1 className="text-forest-deep leading-[1.1] mb-12 font-semibold"
                style={{ fontSize: "4.5rem", fontFamily: "'Fraunces', serif"}}>
                Nurture every{' '}
                <em className="italic font-light text-sage">leaf</em>
                , one day at a time
              </h1>
              <p className="text-xl text-moss mb-16 leading-8">Transform your plant care routine with intelligent tracking, personalized reminders, and a thriving community of plant lovers.</p>
              <div className="flex gap-8 items-center">
                <a href="#signup" className="btn px-10 py-4 text-base text-cream border-2 bg-terracotta inline-block no-underline hover:bg-cream hover:text-terracotta">Start Growing Free</a>
                <a href="#features" className="btn px-10 py-4 text-base text-forest-deep border-2 inline-block no-underline hover:bg-moss hover:text-cream">Learn More</a>
              </div>
            </div>

            <div className="relative animate-[slideRight_1s_ease-out]">
              <div className="relative w-full h-125">

                {/* Card 1 */}
                <div className="absolute w-65 bg-white rounded-[20px] p-8 cursor-pointer transition-transform duration-300 animate-[floatCard1_6s_ease-in-out_infinite] hover:-translate-y-2.5 hover:rotate-2"
                  style={{
                    top: '0px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-3deg)',
                    boxShadow: '0 10px 40px rgba(26,58,46,0.1)',
                    zIndex: 3,
                  }}
                >

                  <span className="text-[4rem] mb-4 block">🌿</span>
                  <h3 className="text-[1.5rem] mb-2 text-forest-deep">Monstera</h3>
                  <div className="flex items-center gap-2 text-[0.9rem] mt-3 text-moss">
                    <span>Health</span>
                    <div className="h-2 rounded-full overflow-hidden flex-1 bg-sand">
                      <div className="h-full rounded-full animate-[fillBar_2s_ease-out]"
                        style={{ width: '80%', background: 'linear-gradient(90deg, var(--color-sage), var(--color-sunlight))' }}>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[0.9rem] mt-3 text-moss">
                    <span>Water in 2 days</span>
                  </div>
                </div>
                
                {/* Card 2 */}
                <div className="absolute w-65 bg-white rounded-[20px] p-8 cursor-pointer transition-transform duration-300 animate-[floatCard2_7s_ease-in-out_infinite] hover:-translate-y-2.5 hover:rotate-2"
                  style={{
                    top: '120px',
                    right: 0,
                    transform: 'rotate(5deg)',
                    boxShadow: '0 10px 40px rgba(26,58,46,0.1)',
                    zIndex: 2,
                  }}
                >

                  <span className="text-[4rem] mb-4 block">🪴</span>
                  <h3 className="text-[1.5rem] mb-2 text-forest-deep">Pothos</h3>
                  <div className="flex items-center gap-2 text-[0.9rem] mt-3 text-moss">
                    <span>Health</span>
                    <div className="h-2 rounded-full overflow-hidden flex-1 bg-sand">
                      <div className="h-full rounded-full animate-[fillBar_2s_ease-out]"
                        style={{ width: '95%', background: 'linear-gradient(90deg, var(--color-sage), var(--color-sunlight))' }}>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[0.9rem] mt-3 text-moss">
                    <span>Thriving!</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="absolute w-65 bg-white rounded-[20px] p-8 cursor-pointer transition-transform duration-300 animate-[floatCard3_8s_ease-in-out_infinite] hover:-translate-y-2.5 hover:rotate-2"
                  style={{
                    bottom: 0,
                    left: 0,
                    transform: 'rotate(5deg)',
                    boxShadow: '0 10px 40px rgba(26,58,46,0.1)',
                    zIndex: 1,
                  }}
                >
                  <span className="text-[4rem] mb-4 block">🌵</span>
                  <h3 className="text-[1.5rem] mb-2 text-forest-deep">Succulent</h3>
                  <div className="flex items-center gap-2 text-[0.9rem] mt-3 text-moss">
                    <span>Health</span>
                    <div className="h-2 rounded-full overflow-hidden flex-1 bg-sand">
                      <div className="h-full rounded-full animate-[fillBar_2s_ease-out]"
                        style={{ width: '50%', background: 'linear-gradient(90deg, var(--color-sage), var(--color-sunlight))' }}>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[0.9rem] mt-3 text-moss">
                    <span>Water today</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-[5%] py-16" id="features">
            <div className="text-center mb-16 animate-[slideUp_1s_ease-out_backwards]">
              <h2 className="text-[3rem] mb-4 text-forest-deep">Everything you need to thrive</h2>
              <p className="text-[1.25rem] text-moss">Powerful tools to keep your plants healthy and happy</p>
            </div>

            <div className="grid grid-cols-3 gap-12">
              {[
                { icon: '💧', title: 'Smart Watering',  body: "Never forget to water again. Get personalized reminders based on each plant's unique needs and your local climate." },
                { icon: '📊', title: 'Growth Tracking', body: 'Watch your garden flourish with photo journals, growth metrics, and health insights over time.' },
                { icon: '🌞', title: 'Care Guidance',   body: 'Get expert tips on light, water, and nutrients tailored to every plant in your collection.' },
              ].map(({ icon, title, body }) => (
                <div key={title} className="text-center p-8 animate-[slideUp_1s_ease-out_backwards]">
                  <div
                    className="text-[4rem] mb-6 inline-block transition-transform duration-300 hover:scale-110 hover:rotate-6"
                  >
                    {icon}
                  </div>
                  <h3 className="text-[1.75rem] mb-4 text-forest-deep">{title}</h3>
                  <p className="leading-[1.7] text-moss">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative px-[5%] py-24 text-center overflow-hidden" id="signup"
            style={{ background: 'linear-gradient(135deg, var(--color-forest-deep) 0%, var(--color-moss) 100%)', color: 'var(--color-cream)' }}
          >

            <div className="relative z-2">
              <h2 className="text-[3.5rem] mb-6 text-sand">Ready to grow together?</h2>
              <p className="text-[1.5rem] mb-10 opacity-90">Join thousands of plant parents creating their perfect green space</p>

              <a
                href="#create-account"
                className="inline-block px-10 py-4 rounded-full text-[1.125rem] text-cream font-medium bg-terracotta cursor-pointer transition-all duration-300 no-underline hover:translate-y-0.5 hover:scale-105 hover:bg-cream hover:text-terracotta"
              >
                Create Your Free Account
              </a>


            </div>
          </section>

          {/* Footer */}
          <footer className="px-[5%] py-12 text-center text-cream bg-forest-deep">
            <p className="opacity-70">&copy; 2024 PlantDash. Cultivating green spaces, one plant at a time.</p>
          </footer>
        </div>

        {/* Login Modal - conditionally rendered */}
        {showLoginModal && (
          <LoginModal 
            onClose={handleCloseModal}
            onSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </>
  );
}