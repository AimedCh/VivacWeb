import React, { useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const WelcomeScreen = ({ user, onContinue, autoCloseMs = 2500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue && onContinue();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [autoCloseMs, onContinue]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-blue-600" />

      {/* Animated orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: '400ms' }} />

      {/* Confetti-like sparkles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(18)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-${i % 3} 6s ease-in-out ${i * 150}ms infinite`
            }}
            size={16 + (i % 3) * 4}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-xl text-center bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-10 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            ¡Bienvenido, {user?.name || 'Explorador'}!
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Tu cuenta está lista. Preparando tu experiencia personalizada...
          </p>
          <button
            onClick={onContinue}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-emerald-600 font-semibold shadow hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Continuar ahora
          </button>
          <p className="text-white/70 text-xs mt-3">Se continuará automáticamente en unos segundos</p>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes float-0 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-12px) } }
        @keyframes float-1 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-18px) } }
        @keyframes float-2 { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-8px) } }
        .animate-fade-in { animation: fadeIn 600ms ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;



