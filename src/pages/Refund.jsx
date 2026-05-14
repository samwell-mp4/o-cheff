import React, { useEffect } from 'react';

const Refund = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Política de Reembolso | O Chefão dos Cards";
  }, []);

  return (
    <div className="pt-40 pb-32 container max-w-4xl">
      <h1 className="text-5xl font-black mb-12 font-gamer tracking-tighter">POLÍTICA DE <span className="neon-green">REEMBOLSO</span></h1>
      <div className="glass-card p-12 rounded-[40px] space-y-8 text-[#E0E0E0] leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">Garantia de Satisfação</h2>
          <p>Nossa Política de Reembolso e Devoluções foi criada para garantir a transparência e a segurança de nossos clientes em todas as transações realizadas na plataforma.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">Condições para Reembolso</h2>
          <p>O reembolso total será concedido nos seguintes casos:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-[#888888]">
            <li>O item não foi entregue em até 24 horas após a confirmação do pagamento.</li>
            <li>O item entregue está em desacordo com a descrição do anúncio.</li>
            <li>Problemas técnicos na plataforma que impossibilitem a conclusão do pedido.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">Como Solicitar</h2>
          <p>Para solicitar um reembolso, entre em contato com nosso suporte via WhatsApp ou Chat Oficial, informando o número do pedido e o motivo da solicitação.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest font-bebas">Prazos</h2>
          <p>Uma vez aprovado o reembolso, o processamento será realizado em até 48 horas úteis, utilizando o mesmo método de pagamento escolhido na compra (PIX).</p>
        </section>
      </div>
    </div>
  );
};

export default Refund;
