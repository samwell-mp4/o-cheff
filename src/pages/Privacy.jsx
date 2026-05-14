import React, { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Política de Privacidade | O Chefão dos Cards";
  }, []);

  return (
    <div className="pt-40 pb-32 container max-w-4xl">
      <h1 className="text-5xl font-black mb-12 font-gamer tracking-tighter">POLÍTICA DE <span className="neon-purple">PRIVACIDADE</span></h1>
      <div className="glass-card p-12 rounded-[40px] space-y-8 text-[#E0E0E0] leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">Sua Privacidade é Importante</h2>
          <p>É política do O Chefão dos Cards respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site O Chefão dos Cards e outros sites que possuímos e operamos.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">Coleta de Informações</h2>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">Retenção de Dados</h2>
          <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">Cookies</h2>
          <p>Utilizamos cookies para ajudar a personalizar sua experiência online. Você tem a capacidade de aceitar ou recusar cookies através das configurações do seu navegador.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
