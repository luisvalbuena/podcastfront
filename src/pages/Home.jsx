import React from 'react';
import Layout from '../components/UI/Layout';
import  Button  from '../components/UI/Button';
import Card from '../components/UI/Card';

const Home = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">
          Crea podcasts de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
            calidad de estudio.
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl text-lg mb-10">
          Albatros te permite grabar en tiempo real con invitados y editar el resultado directamente en tu navegador.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <Card className="hover:border-blue-500/50 transition-colors cursor-pointer">
            <div className="text-3xl mb-4">🎙️</div>
            <h3 className="text-xl font-bold text-white mb-2">Nuevo Episodio</h3>
            <p className="text-slate-500 text-sm mb-6">Inicia una sala de streaming y graba con un invitado en alta fidelidad.</p>
            <Button className="w-full" onClick={() => window.location.href = '/room'}>
              Ir al Estudio
            </Button>
          </Card>

          <Card className="hover:border-emerald-500/50 transition-colors cursor-pointer">
            <div className="text-3xl mb-4">✂️</div>
            <h3 className="text-xl font-bold text-white mb-2">Editor de Audio</h3>
            <p className="text-slate-500 text-sm mb-6">Accede a tus grabaciones previas para recortar, mezclar y exportar.</p>
            <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/edit'}>
              Abrir Editor
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;