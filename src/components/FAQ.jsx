import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, ShieldCheck } from 'lucide-react';

const faqs = [
  {
    question: "Como posso confiar no O Chefão?",
    answer: "No O Chefão, a confiança é fundamental. Com milhares de vendas realizadas e uma sólida reputação, acumulamos vasta experiência no mercado. Temos milhares de avaliações positivas que demonstram a satisfação de nossos clientes. Para sua segurança, você pode consultar as avaliações de compradores recentes. Se tiver dúvidas, use nosso chat ao vivo ou envie um e-mail para suporte@chefaodoscards.shop."
  },
  {
    question: "O que é O Chefão?",
    answer: "O Chefão é uma plataforma dedicada à venda de itens raros, moedas e contas de jogos como Murder Mystery 2 (MM2). Oferecemos as melhores ofertas do mercado com um serviço de atendimento de alta qualidade, garantindo uma experiência de compra segura, rápida e satisfatória."
  },
  {
    question: "Recebo o produto automaticamente após o pagamento?",
    answer: "A entrega varia por tipo de item. Itens MM2, gemas e moedas são entregues manualmente via trade oficial no Roblox, geralmente em apenas 5 a 10 minutos. Para contas específicas, a entrega pode ser automática via chat do pedido após a confirmação do pagamento."
  },
  {
    question: "Como obter cupons de desconto ou participar de sorteios?",
    answer: "Para se manter atualizado sobre promoções, cupons e sorteios, recomendamos que você siga nosso canal oficial no Discord. É a melhor maneira de aproveitar as oportunidades exclusivas do O Chefão."
  },
  {
    question: "Vocês oferecem reembolsos?",
    answer: "Não oferecemos reembolsos para itens virtuais já entregues, pois uma vez realizada a transferência no jogo, o item fica fora do nosso controle. Pedimos que tenha certeza de sua compra antes de finalizá-la."
  },
  {
    question: "Posso renomear a conta que comprar?",
    answer: "Sim! Você terá total liberdade para personalizar e renomear a conta adquirida conforme sua preferência, garantindo que a experiência seja única e sua."
  },
  {
    question: "As contas possuem restrições de região?",
    answer: "Não, todas as contas vendidas pelo O Chefão são globais e sem limitações regionais. Você poderá jogar com amigos de qualquer lugar do mundo normalmente."
  },
  {
    question: "Posso cancelar a compra se mudar de ideia?",
    answer: "O cancelamento é possível apenas ANTES do produto ser entregue. Uma vez que o item foi transferido para sua conta no jogo, não é mais possível efetuar o cancelamento ou devolução."
  },
  {
    question: "O serviço mantém dados sobre mim?",
    answer: "O Chefão preza pela sua privacidade. Coletamos e mantemos apenas as informações estritamente necessárias para processar suas transações com segurança, seguindo protocolos rigorosos de proteção de dados."
  }
];

const FAQItem = ({ faq, isOpen, toggle }) => (
  <div className="mb-4">
    <button
      onClick={toggle}
      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
        isOpen 
          ? 'bg-[#00FFFF]/10 border-[#00FFFF]/40 shadow-[0_0_20px_rgba(0,255,255,0.1)]' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${isOpen ? 'bg-[#00FFFF]/20' : 'bg-white/5'}`}>
          <HelpCircle className={`w-5 h-5 ${isOpen ? 'text-[#00FFFF]' : 'text-gray-400'}`} />
        </div>
        <span className="font-bebas text-lg sm:text-xl tracking-wider text-white">
          {faq.question}
        </span>
      </div>
      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00FFFF]' : ''}`} />
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-6 text-gray-400 leading-relaxed font-light border-x border-b border-white/5 rounded-b-2xl bg-black/20">
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 relative overflow-hidden" id="faq">
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter"
          >
            PERGUNTAS <span className="neon-cyan">FREQUENTES</span>
          </motion.h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
            Tire suas dúvidas sobre o funcionamento da nossa loja, entregas e segurança.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              toggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Support CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 glass-card p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-[#00FFFF]" />
              <div className="text-left">
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Ainda com dúvidas?</div>
                <div className="text-white font-bebas text-lg">CHAT AO VIVO 24/7</div>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#BF00FF]" />
              <div className="text-left">
                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Segurança Total</div>
                <div className="text-white font-bebas text-lg">COMPRA GARANTIDA</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
