import React from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Globe2, Layers3, MapPin, ShieldCheck, SlidersHorizontal, TrendingUp } from 'lucide-react';
import '../landing.css';

const copy = {
  ru: {
    nav: ['Как работает', 'Методика', 'Вопросы'], start: 'Попробовать Crowdly', resume: 'Мой расчёт', demo: 'Открыть пример', language: 'Выбрать язык',
    eyebrow: 'ЭКОНОМИКА НОВОЙ ТОЧКИ', title: 'Проверьте экономику точки.', titleSecond: 'До того, как подпишете аренду.',
    intro: 'Сколько гостей нужно каждый день? Какую аренду выдержит бизнес? Сравните сценарии открытия на своих цифрах и увидьте, от чего зависит результат.',
    primary: 'Рассчитать мой бизнес', free: 'Бесплатно. Без регистрации. С понятными допущениями.',
    formats: ['Семейный центр', 'Wellness', 'Кафе', 'Свой формат'],
    previewLabel: 'ПРИМЕР РАСЧЁТА', previewName: 'Семейный центр', previewLocation: 'Москва · RUB', previewState: 'Учебный сценарий',
    previewBreakEven: 'Для выхода в ноль', previewUnit: 'оплаченных визитов / день', previewBreakEvenNote: 'при среднем чеке 1 400 ₽',
    previewRevenue: 'Выручка / месяц', previewRevenueValue: '2,94 млн ₽', previewProfit: 'Операционный результат', previewProfitValue: '+693 тыс. ₽',
    previewChart: 'Что меняется с загрузкой', previewChartSubtitle: 'Операционный результат в месяц', previewLow: 'Убыток', previewHigh: 'Профицит', previewZero: 'Точка безубыточности', previewAxis: 'Оплаченные визиты в день', previewBase: 'Ваш сценарий',
    previewFoot: '70 визитов / день · 30 дней · до налогов', previewNote: 'Иллюстрация модели, не прогноз спроса.',
    stripLabel: 'ОДНО РЕШЕНИЕ. ВСЕ ВАЖНЫЕ ЦИФРЫ.', strip: ['Нужная загрузка', 'Допустимая аренда', 'Сценарии окупаемости', 'Сравнение вариантов'],
    outcomeKicker: 'ДО ДОГОВОРА И РЕМОНТА', outcomeTitle: 'Хорошая идея должна сходиться в цифрах.', outcomeText: 'Начните с вопроса, на который действительно нужен ответ. Crowdly связывает условия вашей точки с её экономикой.',
    outcomes: [
      { title: 'Хватит ли загрузки?', body: 'Узнайте, сколько оплаченных визитов нужно, чтобы покрыть расходы, и какую долю вместимости это займёт.', tag: 'Визиты в день' },
      { title: 'Подходит ли аренда?', body: 'Посмотрите, сколько остаётся после переменных и постоянных расходов. Проверьте запас при более слабом спросе.', tag: 'Запас прочности' },
      { title: 'Какой вариант выбрать?', body: 'Сравните цену, затраты и инвестиции в нескольких сценариях. Сохраните расчёт, чтобы обсудить его с партнёром.', tag: 'Сравнение сценариев' },
    ],
    howKicker: 'ОТ ИДЕИ К РАСЧЁТУ', howTitle: 'Ваш бизнес. Ваши вводные.', howIntro: 'Не нужно знать посещаемость соседей или готовить бизнес-план заранее.',
    steps: [
      { number: '01', title: 'Выберите формат', body: 'Укажите тип бизнеса и параметры своей точки. Начните с примера или создайте собственную точку.' },
      { number: '02', title: 'Настройте экономику', body: 'Введите знакомые цифры: чек, аренду, затраты и вместимость. Неизвестные значения начнутся с редактируемых допущений.' },
      { number: '03', title: 'Проверьте решение', body: 'Измените загрузку и посмотрите, как меняется результат. Сравните варианты и экспортируйте расчёт вместе с допущениями.' },
    ],
    midKicker: 'ПРОВЕРЬТЕ НА СВОЁМ БИЗНЕСЕ', midTitle: 'Начните с одной точки.', midText: 'Первые вводные уже подготовлены. Замените их своими и найдите условия, при которых проект работает.', midNote: 'Можно начать с готового примера',
    modelKicker: 'ВИДНО, ОТКУДА РЕЗУЛЬТАТ', modelTitle: 'За каждой цифрой — понятная логика.', modelIntro: 'Модель отделяет ваши данные от допущений. Поэтому результат можно проверить, оспорить и пересчитать.',
    formulaLabel: 'ТОЧКА БЕЗУБЫТОЧНОСТИ', formulaNumerator: 'Постоянные расходы', formulaDenominator: 'Доход с визита − переменные затраты', formulaResult: '= нужные визиты',
    evidence: [
      { title: 'Ваши данные', body: 'Цены, расходы и параметры точки, которые вы вводите или уточняете.', tag: 'Можно изменить', kind: 'lime' },
      { title: 'Допущения модели', body: 'Загрузка, темп выхода на план и другие неизвестные параметры. Они остаются видимыми.', tag: 'Сценарий', kind: 'lilac' },
      { title: 'Расчётные показатели', body: 'Безубыточность, денежные потоки и NPV рассчитываются из ваших вводных. Формулы позволяют воспроизвести результат.', tag: 'Проверяемая логика', kind: 'plain' },
    ],
    honestyTitle: 'Сценарий показывает условия успеха.', honestyBody: 'Он не гарантирует будущий спрос. Для проверки прогнозов нужны фактические результаты работающих точек. Crowdly помогает понять, какие предположения сильнее всего влияют на решение.',
    regionsKicker: 'РАСЧЁТЫ В РУБЛЯХ', regionsTitle: 'Сравнивайте варианты на одной основе.', regionsText: 'Введите цены, расходы и вложения в рублях. Сохраните несколько вариантов и сравните их экономику.',
    regionRussia: 'Российский рубль', regionUae: 'На удобном языке', regionRussiaText: 'Все денежные показатели в RUB', regionUaeText: 'Русский и английский интерфейс', regionNote: 'Язык интерфейса не меняет валюту расчёта.',
    pricingKicker: 'НАЧАТЬ ПРОСТО', pricingTitle: 'Сначала попробуйте.', pricingFreeLabel: 'Доступно сейчас', pricingFreeTitle: 'Рабочий сценарий', pricingFreePrice: 'Бесплатно', pricingFreeText: 'Для первой проверки экономики и обсуждения идеи.', pricingFreeFeatures: ['Свой бизнес и готовые примеры', 'Сценарии и чувствительность', 'Сохранение и экспорт расчёта'],
    pricingPilotLabel: 'Следующий этап', pricingPilotTitle: 'Пилот с вашей сетью', pricingPilotPrice: 'По согласованию', pricingPilotText: 'Планируемая работа с историей ваших точек, проверкой модели и дополнительными источниками данных.', pricingPilotFeatures: ['Объём и стоимость определяются отдельно', 'Качество проверяется на фактических данных', 'Запуск после согласования задачи'], pricingPilotNote: 'Это направление развития, а не доступная в MVP платная подписка.',
    faqKicker: 'ЧТО ВАЖНО ЗНАТЬ', faqTitle: 'Хорошие вопросы.', faq: [
      ['Для какого бизнеса подходит Crowdly?', 'Начальный фокус — платный досуг и новые офлайн-точки: семейные центры, wellness и другие форматы с понятной ценой визита и вместимостью. Есть примеры для кафе и возможность задать свой формат. Сложные объекты требуют дополнительных допущений и проверки модели.'],
      ['Можно попробовать на моём бизнесе?', 'Да. Откройте расчёт, выберите формат и замените исходные значения своими. Регистрация, оплата и данные о посещаемости конкурентов для первого результата не нужны.'],
      ['Что делать, если я не знаю точную загрузку?', 'Начните с нескольких сценариев и посмотрите, сколько визитов нужно для безубыточности. Неизвестные параметры будут допущениями, которые можно менять. Это позволяет проверить требования к спросу, не выдавая его за уже измеренный.'],
      ['Насколько точен результат?', 'Финансовые показатели рассчитываются по вашим вводным. Точность прогноза спроса на конкретную точку без проверки на фактических данных не заявляется. Нижний, базовый и верхний варианты — сценарии, а не статистические доверительные интервалы.'],
      ['Нужна ли история продаж или доступ к API?', 'Для первого расчёта нет. История работающего бизнеса полезна для уточнения предположений. Базовая финансовая модель работает независимо от доступности внешних данных.'],
      ['Где хранятся мои расчёты?', 'В этой версии проекты сохраняются в браузере на вашем устройстве. Экспортируйте важные расчёты: очистка данных браузера может удалить локальные проекты. Содержимое проектов не отправляется на сервер. Для переноса на другое устройство сохраните JSON.'],
    ],
    finalTitle: 'Проверьте цифры, пока решение ещё можно изменить.', finalText: 'Начните с собственной точки или посмотрите, как устроен готовый пример.', footerTag: 'Экономика решений об открытии.', footerWorkspace: 'Расширенный режим', footerPrivacy: 'Хранение данных', footerModel: 'О модели', privacyTitle: 'Данные в этой версии', privacy: 'Расчёты сохраняются на этом устройстве. Содержимое проектов не отправляется на сервер. Для переноса на другое устройство сохраните JSON.', copyright: 'Crowdly · 2026', footerRegions: 'Расчёты в рублях · RUB',
  },
  en: {
    nav: ['How it works', 'Our method', 'Questions'], start: 'Try Crowdly', resume: 'My calculation', demo: 'Explore an example', language: 'Select language',
    eyebrow: 'THE ECONOMICS OF YOUR NEXT LOCATION', title: 'Check the numbers.', titleSecond: 'Before you sign the lease.',
    intro: 'How many guests do you need each day? What rent can the business afford? Compare opening scenarios using your own numbers and see what drives the outcome.',
    primary: 'Model my business', free: 'Free. No account needed. Assumptions you can inspect.',
    formats: ['Family centre', 'Wellness', 'Café', 'Your own format'],
    previewLabel: 'EXAMPLE ANALYSIS', previewName: 'Family activity centre', previewLocation: 'Moscow · RUB', previewState: 'Illustrative scenario',
    previewBreakEven: 'To break even', previewUnit: 'paid visits / day', previewBreakEvenNote: 'with a RUB 1,400 average ticket',
    previewRevenue: 'Monthly revenue', previewRevenueValue: 'RUB 2.94m', previewProfit: 'Operating surplus', previewProfitValue: '+RUB 693k',
    previewChart: 'What changes with utilisation', previewChartSubtitle: 'Monthly operating result', previewLow: 'Loss', previewHigh: 'Surplus', previewZero: 'Break-even', previewAxis: 'Paid visits per day', previewBase: 'Your scenario',
    previewFoot: '70 visits / day · 30 days · before tax', previewNote: 'Model illustration, not a demand forecast.',
    stripLabel: 'ONE DECISION. THE NUMBERS THAT MATTER.', strip: ['Required utilisation', 'Affordable rent', 'Payback scenarios', 'Compare alternatives'],
    outcomeKicker: 'BEFORE THE LEASE AND FIT-OUT', outcomeTitle: 'A good idea needs numbers that work.', outcomeText: 'Start with the question you need to answer. Crowdly connects the conditions of your location to its economics.',
    outcomes: [
      { title: 'Will utilisation be enough?', body: 'See how many paid visits cover your operating costs and how much of your capacity that requires.', tag: 'Visits per day' },
      { title: 'Does the rent make sense?', body: 'See what remains after variable and fixed costs. Check how much headroom you have if demand is lower.', tag: 'Room for uncertainty' },
      { title: 'Which option works better?', body: 'Compare pricing, costs and investment across scenarios. Save the calculation to discuss with your partners.', tag: 'Scenario comparison' },
    ],
    howKicker: 'FROM AN IDEA TO THE NUMBERS', howTitle: 'Your business. Your inputs.', howIntro: 'No competitor footfall data or finished business plan required.',
    steps: [
      { number: '01', title: 'Choose your format', body: 'Select a business type and set up your location. Start with an example or create your own location.' },
      { number: '02', title: 'Set your economics', body: 'Enter familiar numbers: ticket, rent, costs and capacity. Unknown values start as clearly editable planning assumptions.' },
      { number: '03', title: 'Test your decision', body: 'Change utilisation and see the result respond. Compare alternatives and export the calculation with its assumptions.' },
    ],
    midKicker: 'TRY IT WITH YOUR OWN BUSINESS', midTitle: 'Start with one location.', midText: 'The initial assumptions are ready. Replace them with your own and find the conditions under which your project works.', midNote: 'Or start with a worked example',
    modelKicker: 'SEE WHAT IS BEHIND THE RESULT', modelTitle: 'Every number has a reason.', modelIntro: 'Your inputs stay separate from model assumptions, so you can check, challenge and recalculate the outcome.',
    formulaLabel: 'BREAK-EVEN', formulaNumerator: 'Fixed operating costs', formulaDenominator: 'Revenue per visit − variable cost', formulaResult: '= required visits',
    evidence: [
      { title: 'Your inputs', body: 'Prices, expenses and location parameters that you enter or refine.', tag: 'Editable', kind: 'lime' },
      { title: 'Model assumptions', body: 'Utilisation, the ramp to steady operation and other unknowns. They remain visible.', tag: 'Scenario', kind: 'lilac' },
      { title: 'Calculated results', body: 'Break-even, cash flows and NPV are calculated from your inputs. The formulas let you reproduce the result.', tag: 'Reproducible logic', kind: 'plain' },
    ],
    honestyTitle: 'A scenario shows what needs to be true.', honestyBody: 'It does not guarantee future demand. Validating forecasts requires actual operating results. Crowdly helps you see which assumptions matter most to your decision.',
    regionsKicker: 'RUBLE CALCULATIONS', regionsTitle: 'Compare alternatives on the same basis.', regionsText: 'Enter prices, expenses and investment in Russian rubles. Save multiple cases and compare their economics.',
    regionRussia: 'Russian ruble', regionUae: 'In your language', regionRussiaText: 'Every monetary result is in RUB', regionUaeText: 'Russian and English interface', regionNote: 'Interface language does not change the calculation currency.',
    pricingKicker: 'EASY TO START', pricingTitle: 'Try it first.', pricingFreeLabel: 'Available now', pricingFreeTitle: 'Working scenario', pricingFreePrice: 'Free', pricingFreeText: 'For checking the economics and discussing your idea.', pricingFreeFeatures: ['Your own business and worked examples', 'Scenarios and sensitivity', 'Save and export calculations'],
    pricingPilotLabel: 'Next stage', pricingPilotTitle: 'A pilot with your network', pricingPilotPrice: 'Scoped together', pricingPilotText: 'Planned work with your location history, model validation and additional data sources.', pricingPilotFeatures: ['Scope and price agreed separately', 'Quality checked against actual results', 'Starts after the project is agreed'], pricingPilotNote: 'A development direction, not a paid subscription available in this MVP.',
    faqKicker: 'WHAT TO KNOW', faqTitle: 'Good questions.', faq: [
      ['Which businesses is Crowdly for?', 'The initial focus is paid leisure and new physical locations: family activity centres, wellness and other formats with an understandable ticket and capacity. Café examples and a custom format are also available. Complex properties require additional assumptions and model validation.'],
      ['Can I try it with my own business?', 'Yes. Open the calculator, choose a format and replace the starting assumptions with your own inputs. No registration, payment or competitor footfall data is required for a first result.'],
      ['What if I do not know my future utilisation?', 'Start with several scenarios and see the visits required to break even. Unknown parameters remain editable assumptions. This checks the demand your business needs without presenting that demand as already measured.'],
      ['How accurate is the result?', 'Financial outputs are calculated from your inputs. We do not claim validated demand accuracy for a location without actual operating data. Low, base and high cases are scenarios, not statistical confidence intervals.'],
      ['Do I need sales history or an API key?', 'Not for a first calculation. Operating history can help refine assumptions. The core financial model works independently of external data availability.'],
      ['Where are my calculations stored?', 'In this version, projects are stored in the browser on your device. Export important calculations: clearing browser data may remove local projects. Project contents are not sent to a server. Save a JSON file to transfer a project to another device.'],
    ],
    finalTitle: 'Check the numbers while you can still change the decision.', finalText: 'Start with your own location or explore a worked example.', footerTag: 'The economics of opening decisions.', footerWorkspace: 'Advanced workspace', footerPrivacy: 'Data storage', footerModel: 'About the model', privacyTitle: 'Your data in this version', privacy: 'Calculations are saved on this device. Project contents are not sent to a server. Save a JSON file to transfer a project to another device.', copyright: 'Crowdly · 2026', footerRegions: 'Calculations in Russian rubles · RUB',
  },
};

function Brand() {
  return <span className="cl-brand"><svg width="29" height="30" viewBox="0 0 29 30" fill="none" aria-hidden="true"><rect x="1" y="10" width="8" height="19" rx="4" fill="currentColor"/><rect x="11" y="1" width="8" height="28" rx="4" fill="currentColor"/><rect x="21" y="6" width="8" height="23" rx="4" fill="currentColor"/></svg><span>Crowdly<span className="cl-brand-dot">.</span></span></span>;
}

function ProductPreview({ t }) {
  return <div className="cl-preview-wrap">
    <div className="cl-preview-grid" aria-hidden="true" />
    <div className="cl-product-preview">
      <div className="cl-preview-top"><span><i /><i /><i /></span><span>crowdly / studio</span><SlidersHorizontal size={14}/></div>
      <div className="cl-preview-content">
        <div className="cl-preview-heading"><div><span className="cl-overline">{t.previewLabel}</span><h3>{t.previewName}</h3><p><MapPin size={12}/>{t.previewLocation}</p></div><span className="cl-preview-status">{t.previewState}</span></div>
        <div className="cl-preview-kpis">
          <div className="cl-preview-main-kpi"><span>{t.previewBreakEven}</span><div><strong>48</strong><ArrowUpRight size={26}/></div><p>{t.previewUnit}</p><small>{t.previewBreakEvenNote}</small></div>
          <div className="cl-preview-small-kpis"><div><span>{t.previewRevenue}</span><strong>{t.previewRevenueValue}</strong></div><div><span>{t.previewProfit}</span><strong>{t.previewProfitValue}</strong></div></div>
        </div>
        <div className="cl-preview-chart-head"><div><h4>{t.previewChart}</h4><span>{t.previewChartSubtitle}</span></div><span className="cl-chart-dot" aria-hidden="true" /></div>
        <svg className="cl-preview-chart" viewBox="0 0 480 242" role="img" aria-label={`${t.previewZero}: 48. ${t.previewBase}: 70. ${t.previewAxis}.`}>
          <defs><linearGradient id="cl-preview-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#aeb6f7" stopOpacity=".32"/><stop offset="1" stopColor="#aeb6f7" stopOpacity=".04"/></linearGradient></defs>
          <path d="M38 204 L158 148 L253 104 L339 64 L425 24 L425 208 L38 208Z" fill="url(#cl-preview-area)"/>
          <path d="M38 64H438M38 104H438M38 208H438" stroke="#edf0f4" strokeWidth="1"/>
          <path d="M38 148H438" stroke="#a9afbc" strokeDasharray="4 5"/>
          <path d="M158 148V211M253 104V211" stroke="#d5d9e4" strokeDasharray="3 5"/>
          <path d="M38 204 L158 148 L253 104 L339 64 L425 24" fill="none" stroke="#222b43" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="158" cy="148" r="5" fill="white" stroke="#222b43" strokeWidth="2"/>
          <circle cx="253" cy="104" r="10" fill="#c0f568"/><circle cx="253" cy="104" r="3.5" fill="#222b43"/>
          <rect x="183" y="57" width="140" height="27" rx="6" fill="#141c2d"/><text x="253" y="75" textAnchor="middle" fill="white" fontSize="10.5">{t.previewBase} · 70</text>
          <text x="39" y="136" fill="#737c8c" fontSize="10">{t.previewZero}</text><text x="433" y="137" textAnchor="end" fill="#737c8c" fontSize="10">0</text>
          {[['20',38],['48',158],['70',253],['90',339],['110',425]].map(([label,x])=><text key={label} x={x} y="230" textAnchor="middle" fill="#8b93a2" fontSize="11">{label}</text>)}
        </svg>
        <div className="cl-preview-chart-foot"><span>{t.previewAxis}</span><span>{t.previewFoot}</span></div>
      </div>
    </div>
    <div className="cl-preview-note"><ShieldCheck size={15}/><span>{t.previewNote}</span></div>
  </div>;
}

export default function Landing({ language = 'ru', onLanguageChange, onStart, onDemo, onWorkspace, onResume }) {
  const lang = language === 'en' ? 'en' : 'ru';
  const t = copy[lang];
  return <div className="cl-landing" lang={lang}>
    <a className="cl-skip-link" href="#cl-main">{lang === 'ru' ? 'К содержанию' : 'Skip to content'}</a>
    <header className="cl-header cl-container">
      <a className="cl-logo-link" href="#cl-main" aria-label="Crowdly"><Brand/></a>
      <nav className="cl-nav" aria-label={lang === 'ru' ? 'Основная навигация' : 'Main navigation'}><a href="#cl-how">{t.nav[0]}</a><a href="#cl-model">{t.nav[1]}</a><a href="#cl-faq">{t.nav[2]}</a></nav>
      <div className="cl-header-actions">{onResume&&<button type="button" className="cl-header-resume" onClick={onResume}>{t.resume}</button>}<div className="cl-language" role="group" aria-label={t.language}><button type="button" aria-pressed={lang === 'ru'} onClick={()=>onLanguageChange?.('ru')}>RU</button><button type="button" aria-pressed={lang === 'en'} onClick={()=>onLanguageChange?.('en')}>EN</button></div><button type="button" className="cl-button cl-button-dark cl-header-start" onClick={onStart}>{t.start}<ArrowUpRight size={16}/></button></div>
    </header>

    <main id="cl-main">
      <section className="cl-hero cl-container">
        <div className="cl-hero-copy"><div className="cl-kicker"><span className="cl-live-dot"/>{t.eyebrow}</div><h1>{t.title}<span>{t.titleSecond}</span></h1><p className="cl-hero-intro">{t.intro}</p><div className="cl-hero-buttons"><button type="button" className="cl-button cl-button-lime" onClick={onStart}>{t.primary}<ArrowUpRight size={19}/></button><button type="button" className="cl-button cl-button-quiet" onClick={onDemo}>{t.demo}<ArrowRight size={17}/></button></div><p className="cl-free-note">{t.free}</p><div className="cl-format-list">{t.formats.map(format=><span key={format}>{format}</span>)}</div></div>
        <ProductPreview t={t}/>
      </section>

      <div className="cl-value-strip cl-container"><span>{t.stripLabel}</span><div>{t.strip.map(value=><span key={value}><Check size={14}/>{value}</span>)}</div></div>

      <section className="cl-section cl-container" id="cl-outcomes">
        <div className="cl-section-heading"><div><p className="cl-kicker">{t.outcomeKicker}</p><h2>{t.outcomeTitle}</h2></div><p>{t.outcomeText}</p></div>
        <div className="cl-outcome-grid">{t.outcomes.map((item,index)=>{const Icon=[TrendingUp,SlidersHorizontal,Layers3][index];return <article className="cl-outcome-card" key={item.title}><div className={`cl-icon-tile cl-icon-${index}`}><Icon size={25} strokeWidth={1.6}/></div><span className="cl-card-index">0{index+1}</span><h3>{item.title}</h3><p>{item.body}</p><span className="cl-card-tag">{item.tag}<ArrowUpRight size={14}/></span></article>;})}</div>
      </section>

      <section className="cl-how-section cl-container" id="cl-how">
        <div className="cl-how-heading"><p className="cl-kicker">{t.howKicker}</p><h2>{t.howTitle}</h2><p>{t.howIntro}</p></div><div className="cl-steps">{t.steps.map(step=><article className="cl-step" key={step.number}><span className="cl-step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></article>)}</div>
      </section>

      <section className="cl-mid-cta cl-container" aria-labelledby="cl-try-heading"><div className="cl-cta-orbit cl-cta-orbit-one" aria-hidden="true"/><div className="cl-cta-orbit cl-cta-orbit-two" aria-hidden="true"/><div className="cl-mid-cta-copy"><p className="cl-kicker">{t.midKicker}</p><h2 id="cl-try-heading">{t.midTitle}</h2><p>{t.midText}</p></div><div className="cl-mid-cta-actions"><button type="button" className="cl-button cl-button-lime cl-button-large" onClick={onStart}>{t.primary}<ArrowUpRight size={25}/></button><button type="button" className="cl-cta-demo" onClick={onDemo}>{t.midNote}<ArrowRight size={15}/></button></div></section>

      <section className="cl-section cl-container" id="cl-model">
        <div className="cl-section-heading"><div><p className="cl-kicker">{t.modelKicker}</p><h2>{t.modelTitle}</h2></div><p>{t.modelIntro}</p></div>
        <div className="cl-method-layout"><div className="cl-formula-card"><div className="cl-formula-top"><span className="cl-kicker">{t.formulaLabel}</span><CircleHelp size={18}/></div><div className="cl-formula"><span>{t.formulaNumerator}</span><span>{t.formulaDenominator}</span></div><p className="cl-formula-result">{t.formulaResult}<ArrowUpRight size={20}/></p><div className="cl-honesty"><ShieldCheck size={21}/><div><h3>{t.honestyTitle}</h3><p>{t.honestyBody}</p></div></div></div><div className="cl-evidence-list">{t.evidence.map((item,i)=><div className="cl-evidence" key={item.title}><div className={`cl-evidence-marker cl-evidence-${item.kind}`}>{i+1}</div><div><h3>{item.title}</h3><p>{item.body}</p><span>{item.tag}</span></div></div>)}</div></div>
      </section>

      <section className="cl-regions-section cl-container"><div className="cl-regions-copy"><p className="cl-kicker">{t.regionsKicker}</p><h2>{t.regionsTitle}</h2><p>{t.regionsText}</p><small>{t.regionNote}</small></div><div className="cl-region-cards"><div className="cl-region-card"><span className="cl-currency-symbol">₽</span><span className="cl-region-code">RUB</span><h3>{t.regionRussia}</h3><p>{t.regionRussiaText}</p></div><div className="cl-region-card cl-region-language"><span className="cl-currency-symbol cl-language-symbol">RU / EN</span><Globe2 size={21}/><h3>{t.regionUae}</h3><p>{t.regionUaeText}</p></div></div></section>

      <section className="cl-section cl-container" id="cl-pricing"><div className="cl-pricing-heading"><p className="cl-kicker">{t.pricingKicker}</p><h2>{t.pricingTitle}</h2></div><div className="cl-pricing-grid"><article className="cl-price-card cl-price-free"><span className="cl-price-badge"><span className="cl-live-dot"/>{t.pricingFreeLabel}</span><h3>{t.pricingFreeTitle}</h3><strong className="cl-price-value">{t.pricingFreePrice}</strong><p>{t.pricingFreeText}</p><ul>{t.pricingFreeFeatures.map(feature=><li key={feature}><Check size={16}/>{feature}</li>)}</ul><button type="button" className="cl-button cl-button-dark" onClick={onStart}>{t.primary}<ArrowUpRight size={18}/></button></article><article className="cl-price-card cl-price-planned"><span className="cl-price-badge">{t.pricingPilotLabel}</span><h3>{t.pricingPilotTitle}</h3><strong className="cl-price-value cl-price-value-small">{t.pricingPilotPrice}</strong><p>{t.pricingPilotText}</p><ul>{t.pricingPilotFeatures.map(feature=><li key={feature}><Check size={16}/>{feature}</li>)}</ul><p className="cl-planned-note">{t.pricingPilotNote}</p></article></div></section>

      <section className="cl-faq-section cl-container" id="cl-faq"><div><p className="cl-kicker">{t.faqKicker}</p><h2>{t.faqTitle}</h2></div><div className="cl-faq-list">{t.faq.map(([question,answer],index)=><details className="cl-faq-item" key={question}><summary><span>{question}</span><ChevronDown size={19}/></summary><p>{answer}</p></details>)}</div></section>

      <section className="cl-final-cta cl-container"><p className="cl-kicker">CROWDLY</p><h2>{t.finalTitle}</h2><p>{t.finalText}</p><div><button type="button" className="cl-button cl-button-lime" onClick={onStart}>{t.primary}<ArrowUpRight size={19}/></button><button type="button" className="cl-button cl-button-quiet" onClick={onDemo}>{t.demo}<ArrowRight size={17}/></button></div></section>
    </main>

    <footer className="cl-footer cl-container"><div className="cl-footer-top"><div><Brand/><p>{t.footerTag}</p></div><div className="cl-footer-links"><button type="button" onClick={onDemo}>{t.demo}</button><a href="#cl-model">{t.footerModel}</a><a href="#cl-privacy">{t.footerPrivacy}</a>{onWorkspace&&<button type="button" onClick={onWorkspace}>{t.footerWorkspace}<ArrowUpRight size={13}/></button>}</div></div><div className="cl-privacy" id="cl-privacy"><ShieldCheck size={16}/><p><strong>{t.privacyTitle}.</strong> {t.privacy}</p></div><div className="cl-footer-bottom"><span>{t.copyright}</span><span>{t.footerRegions}</span></div></footer>
  </div>;
}
