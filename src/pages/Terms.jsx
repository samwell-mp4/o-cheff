import React, { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Termos de Uso | O Chefão dos Cards";
  }, []);

  return (
    <div className="pt-40 pb-32 container max-w-4xl">
      <h1 className="text-5xl font-black mb-12 font-gamer tracking-tighter">TERMOS DE <span className="neon-cyan">USO</span></h1>
      <div className="glass-card p-12 rounded-[40px] space-y-8 text-[#E0E0E0] leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">1. Aceitação dos Termos</h2>
          <p>Ao acessar e utilizar a plataforma O Chefão dos Cards, você concorda em cumprir e estar vinculado aos seguintes termos e condições. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">2. Licença de Uso</h2>
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais no site apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">3. Isenção de Responsabilidade</h2>
          <p>Os materiais no site são fornecidos 'como estão'. O Chefão dos Cards não oferece garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">4. Precisão dos Materiais</h2>
          <p>Os materiais exibidos no site podem incluir erros técnicos, tipográficos ou fotográficos. O Chefão dos Cards não garante que qualquer material em seu site seja preciso, completo ou atual.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
