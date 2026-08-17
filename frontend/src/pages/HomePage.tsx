import React from 'react';
import { Link } from 'react-router-dom';
import { FeatureCard, Footer, HomeNavbar } from '../components';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HomeNavbar />

      <header
        className="h-[80vh] flex items-center justify-center text-center text-white px-5 relative"
        style={{
          background: `linear-gradient(rgba(0, 50, 90, 0.7), rgba(0, 20, 40, 0.7)), url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop') no-repeat center center`,
          backgroundSize: 'cover'
        }}
      >
        <div className="hero-content max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-3 leading-tight">
            O Match perfeito para sua próxima moradia.
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Conectamos você a lugares e pessoas com os mesmos interesses. Encontrar um lar nunca foi tão fácil e seguro.
          </p>
          <Link
            to="/register"
            className="inline-block bg-accent-500 text-white font-semibold text-xl px-10 py-4 rounded-lg no-underline transition-all hover:bg-accent-600 hover:-translate-y-0.5"
          >
            Criar Conta Grátis
          </Link>
        </div>
      </header>

      <main>
        <section className="py-20 px-[5%] text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon="fas fa-user-edit"
              title="1. Crie seu Perfil"
              description="Preencha suas preferências de moradia e estilo de vida. Nosso algoritmo usa esses dados para encontrar a combinação ideal."
            />
            <FeatureCard
              icon="fas fa-search-location"
              title="2. Encontre Vagas e Pessoas"
              description="Explore vagas compatíveis ou forme grupos com outras pessoas para procurar um imóvel juntos. As possibilidades são muitas."
            />
            <FeatureCard
              icon="fas fa-heart"
              title="3. Dê um Match e Converse"
              description="Curtiu uma vaga ou um perfil? Se o interesse for mútuo, abrimos um chat para vocês combinarem os detalhes."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
