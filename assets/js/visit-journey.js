(() => {
  const explorer = document.querySelector('.family-explorer');
  if (!explorer) return;
  const choices = {
    ambiente: ['Um lugar para estar junto.', 'Uma boa conversa, a mesa reunida e tempo para aproveitar. Conheça a atmosfera acolhedora que acompanha os nossos encontros.'],
    brasa: ['O sabor do encontro.', 'Cortes preparados na brasa e acompanhamentos para dividir. Escolha seus sabores e aproveite a refeição em boa companhia.'],
    pizza: ['A noite pede uma pizza.', 'Dos sabores clássicos às combinações da casa, a pizzaria é um convite para reunir a família ao redor da mesa.'],
    sobremesas: ['Um doce para fechar o encontro.', 'Sobremesas para completar a refeição e dividir bons momentos à mesa. Escolha seu doce favorito e aproveite o encontro.']
  };
  const tabs = [...explorer.querySelectorAll('[role="tab"]')];
  const panel = explorer.querySelector('[role="tabpanel"]');
  function select(tab) {
    const [title, description] = choices[tab.dataset.familyChoice];
    tabs.forEach(item => {
      item.setAttribute('aria-selected', String(item === tab));
      item.tabIndex = item === tab ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    panel.querySelector('h3').textContent = title;
    panel.querySelector('.family-panel-description').textContent = description;
    panel.querySelector('.family-panel-index').textContent = `${String(tabs.indexOf(tab) + 1).padStart(2, '0')} / 04`;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const offsets = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 2, ArrowUp: -2 };
      let next;
      if (event.key in offsets) next = (index + offsets[event.key] + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[next]);
      tabs[next].focus();
    });
  });

  const date = document.querySelector('#bdayDate');
  if (date) {
    const today = new Date();
    date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }
})();
