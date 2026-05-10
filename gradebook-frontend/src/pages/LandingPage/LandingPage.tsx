import { Link } from 'react-router-dom'
import { PrincepsLogo } from '@/components/PrincepsLogo/PrincepsLogo'
import styles from './LandingPage.module.scss'

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconGradebook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </svg>
)

const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const IconCheckmark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
)

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '120+',  label: 'обучени ученика' },
  { value: '98%',   label: 'доволни родители' },
  { value: '4.9★',  label: 'средна оценка на програмата' },
  { value: '6 г.',  label: 'опит в преподаването' },
]

const PAIN_POINTS = [
  'Не знаете каква оценка е получило детето ви — разбирате чак вкъщи, вечерта.',
  'Отсъствията се натрупват и никой не ви е уведомил навреме.',
  'Нямате ясна представа как напредва детето ви по теми и задачи.',
]

const HOW_STEPS = [
  {
    num: '01',
    title: 'Запишете се',
    desc: 'Свържете се с нас за безплатна консултация. Обсъждаме целите и нивото на детето ви и намираме подходящ план.',
  },
  {
    num: '02',
    title: 'Започват часовете',
    desc: 'Наставникът провежда персонализирани уроци и въвежда оценките и отсъствията в дигиталния дневник в реално време.',
  },
  {
    num: '03',
    title: 'Следите напредъка',
    desc: 'Получавате известие при всяка нова оценка или отсъствие. Дневникът е достъпен по всяко време от телефона ви.',
  },
]

const FEATURES = [
  {
    icon: <IconGradebook />,
    title: 'Дигитален дневник',
    benefit: 'Всяка оценка е видима в момента, в който е поставена — не чакате детето да ви каже.',
  },
  {
    icon: <IconCalendar />,
    title: 'Следене на отсъствия',
    benefit: 'Всяко отсъствие се регистрира автоматично. Никога повече "не знаех, че е отсъствал".',
  },
  {
    icon: <IconBell />,
    title: 'Известия в реално време',
    benefit: 'Push-известие на телефона ви при нова оценка или отсъствие — без да питате всеки ден.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Преди Princeps нямах представа как върви дъщеря ми между часовете. Сега получавам известие веднага и мога да я подкрепям навреме. Разликата е огромна.',
    name: 'Мария Стоянова',
    role: 'Майка на ученичка в 10. клас, София',
  },
  {
    quote: 'Дневникът ми помага да виждам точно кои теми трябва да повторя. Оценките се качиха и аз знам защо — защото знам точно какво да уча.',
    name: 'Александър Петров',
    role: 'Ученик, 11. клас',
  },
  {
    quote: 'Димитър е изключителен педагог, а платформата прави работата му прозрачна за нас като родители. Препоръчвам програмата без резерви.',
    name: 'Красимир Иванов',
    role: 'Баща на ученик в 9. клас, Пловдив',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export const LandingPage = () => {
  return (
    <div className={styles.page}>

      {/* ── Sticky navbar ───────────────────────────────────────────────────── */}
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          <a href="#hero" className={styles.navbarLogo} aria-label="Princeps — начало">
            <PrincepsLogo size="sm" variant="dark" />
          </a>

          <nav className={styles.navLinks} aria-label="Основна навигация">
            <a href="#how"      className={styles.navLink}>Как работи</a>
            <a href="#features" className={styles.navLink}>Функции</a>
            <a href="#about"    className={styles.navLink}>За наставника</a>
            <a href="#contact"  className={styles.navLink}>Контакт</a>
          </nav>

          <Link to="/login" className={styles.navCta}>
            Вход <IconArrow />
          </Link>
        </div>
      </header>

      <main>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className={styles.hero} id="hero">
          <div className={styles.heroDecorLeft}  aria-hidden="true" />
          <div className={styles.heroDecorRight} aria-hidden="true" />

          <div className={styles.heroInner}>
            <p className={styles.heroEyebrow}>Програма Princeps · Български език и литература</p>

            <h1 className={styles.heroTitle}>
              Вашето дете напредва.<br />
              <em>Вие ще го знаете<br className={styles.heroBr} /> в реално време.</em>
            </h1>

            <p className={styles.heroSub}>
              Частна менторска програма с дигитален дневник — оценки, отсъствия и известия
              директно на вашия телефон, в момента, в който се случват.
            </p>

            <div className={styles.heroActions}>
              <a href="#contact" className={styles.heroCtaPrimary}>
                Запиши се за безплатна консултация
              </a>
              <a href="#how" className={styles.heroCtaSecondary}>
                Как работи →
              </a>
            </div>

            <p className={styles.heroMicro}>Без ангажимент. Без такса за записване.</p>
          </div>
        </section>

        {/* ── Trust bar ───────────────────────────────────────────────────── */}
        <div className={styles.trust}>
          <div className={styles.trustInner}>
            {STATS.map(({ value, label }) => (
              <div key={label} className={styles.trustItem}>
                <span className={styles.trustValue}>{value}</span>
                <span className={styles.trustLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pain ────────────────────────────────────────────────────────── */}
        <section className={styles.pain}>
          <div className={styles.sectionInner}>
            <div className={styles.painContent}>
              <p className={styles.sectionEyebrow}>Познато ли ви е?</p>
              <h2 className={styles.sectionTitle}>
                Не знаете дали детето ви напредва.
              </h2>
              <p className={styles.sectionSub}>
                Стандартните частни уроци оставят родителите в неведение. Плащате,
                надявате се, но нямате реална представа какво се случва.
              </p>

              <ul className={styles.painList}>
                {PAIN_POINTS.map((point) => (
                  <li key={point} className={styles.painItem}>
                    <span className={styles.painIcon}><IconX /></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <p className={styles.painAnswer}>
                Princeps решава точно това — пълна прозрачност за родителя,
                без да се намесва в учебния процес.
              </p>
            </div>

            <div className={styles.painVisual} aria-hidden="true">
              <div className={styles.mockPhone}>
                <div className={styles.mockPhoneScreen}>
                  <div className={styles.mockNotif}>
                    <span className={styles.mockNotifDot} />
                    <div>
                      <p className={styles.mockNotifTitle}>Нова оценка</p>
                      <p className={styles.mockNotifMsg}>Александър получи оценка <strong>6</strong> по Литература</p>
                      <p className={styles.mockNotifTime}>преди 2 минути</p>
                    </div>
                  </div>
                  <div className={styles.mockNotif}>
                    <span className={styles.mockNotifDot} />
                    <div>
                      <p className={styles.mockNotifTitle}>Нова оценка</p>
                      <p className={styles.mockNotifMsg}>Александър получи оценка <strong>5.5</strong> по Български</p>
                      <p className={styles.mockNotifTime}>вчера</p>
                    </div>
                  </div>
                  <div className={`${styles.mockNotif} ${styles.mockNotifRead}`}>
                    <div>
                      <p className={styles.mockNotifTitle}>Нова оценка</p>
                      <p className={styles.mockNotifMsg}>Александър получи оценка <strong>5</strong> по Литература</p>
                      <p className={styles.mockNotifTime}>преди 3 дни</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mentor ──────────────────────────────────────────────────────── */}
        <section className={styles.mentor} id="about">
          <div className={styles.sectionInner}>
            <div className={styles.mentorCard}>
              <div className={styles.mentorPhoto} aria-label="Снимка на наставника" />
              <div className={styles.mentorBody}>
                <p className={styles.sectionEyebrow}>Вашият наставник</p>
                <h2 className={styles.mentorName}>Димитър Кацаров</h2>
                <p className={styles.mentorTitle}>Учител по Български език и литература</p>

                <div className={styles.mentorCredentials}>
                  <div className={styles.mentorCred}>
                    <span className={styles.mentorCredIcon}><IconCheckmark /></span>
                    Магистър по Българска филология, СУ „Климент Охридски"
                  </div>
                  <div className={styles.mentorCred}>
                    <span className={styles.mentorCredIcon}><IconCheckmark /></span>
                    6+ години опит с ученици от 8. до 12. клас
                  </div>
                  <div className={styles.mentorCred}>
                    <span className={styles.mentorCredIcon}><IconCheckmark /></span>
                    Специализация в подготовка за матура и кандидатстване
                  </div>
                  <div className={styles.mentorCred}>
                    <span className={styles.mentorCredIcon}><IconCheckmark /></span>
                    Персонализирана учебна програма за всеки ученик
                  </div>
                </div>

                <p className={styles.mentorBio}>
                  Вярвам, че всеки ученик може да овладее Български език и литература, когато
                  подходът е правилен. В Princeps работим по индивидуален план — без стандартни
                  шаблони, без изгубено време. Родителите са пълноправни участници в процеса,
                  а не просто платци.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section className={styles.how} id="how">
          <div className={styles.sectionInner}>
            <p className={styles.sectionEyebrow}>Процесът</p>
            <h2 className={styles.sectionTitle}>Как работи Princeps?</h2>
            <p className={styles.sectionSub}>
              Три стъпки от записването до пълна прозрачност за родителя.
            </p>

            <div className={styles.howSteps}>
              {HOW_STEPS.map(({ num, title, desc }) => (
                <div key={num} className={styles.howStep}>
                  <span className={styles.howNum}>{num}</span>
                  <h3 className={styles.howTitle}>{title}</h3>
                  <p className={styles.howDesc}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section className={styles.features} id="features">
          <div className={styles.sectionInner}>
            <p className={styles.sectionEyebrow}>Платформата</p>
            <h2 className={styles.sectionTitle}>Всичко, което ви трябва — на едно място</h2>
            <p className={styles.sectionSub}>
              Дигиталният дневник на Princeps е проектиран за родители и ученици,
              не за технически специалисти.
            </p>

            <div className={styles.featureGrid}>
              {FEATURES.map(({ icon, title, benefit }) => (
                <div key={title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{icon}</div>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureBenefit}>{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ────────────────────────────────────────────────── */}
        <section className={styles.testimonials}>
          <div className={styles.sectionInner}>
            <p className={styles.sectionEyebrow}>Казват за нас</p>
            <h2 className={styles.sectionTitle}>Родители и ученици от Princeps</h2>

            <div className={styles.testimonialGrid}>
              {TESTIMONIALS.map(({ quote, name, role }) => (
                <blockquote key={name} className={styles.testimonialCard}>
                  <p className={styles.testimonialQuote}>„{quote}"</p>
                  <footer className={styles.testimonialFooter}>
                    <div className={styles.testimonialAvatar} aria-hidden="true">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <p className={styles.testimonialName}>{name}</p>
                      <p className={styles.testimonialRole}>{role}</p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────── */}
        <section className={styles.ctaSection} id="contact">
          <div className={styles.ctaDecor} aria-hidden="true" />
          <div className={styles.ctaInner}>
            <p className={styles.sectionEyebrow} style={{ color: '#C9A24E' }}>Готови ли сте?</p>
            <h2 className={styles.ctaTitle}>
              Спрете да гадаете.<br />
              <em>Запишете се за безплатна консултация.</em>
            </h2>
            <p className={styles.ctaSub}>
              Ако след първия месец не сте доволни — връщаме парите без въпроси.
            </p>

            <div className={styles.ctaButtons}>
              <a
                href="https://wa.me/359888000000"
                target="_blank"
                rel="noreferrer"
                className={styles.ctaBtnPrimary}
              >
                Свържете се с нас в WhatsApp
              </a>
              <a
                href="viber://chat?number=359888000000"
                className={styles.ctaBtnSecondary}
              >
                Viber
              </a>
            </div>

            <p className={styles.ctaMicro}>
              Или се свържете директно:{' '}
              <a href="mailto:info@princeps.bg" className={styles.ctaEmail}>
                info@princeps.bg
              </a>
            </p>

            <div className={styles.ctaDivider} aria-hidden="true" />

            <p className={styles.ctaExisting}>Вече имате акаунт?</p>
            <div className={styles.ctaRoleButtons}>
              <Link to="/login" className={styles.ctaRoleBtn}>
                Вход за родители →
              </Link>
              <Link to="/login" className={styles.ctaRoleBtn}>
                Вход за ученици →
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <PrincepsLogo size="sm" variant="dark" subtitle />
            <p className={styles.footerTagline}>
              Частна менторска програма<br />по Български език и литература
            </p>
          </div>

          <div className={styles.footerLinks}>
            <p className={styles.footerGroupTitle}>Навигация</p>
            <a href="#how"      className={styles.footerLink}>Как работи</a>
            <a href="#features" className={styles.footerLink}>Функции</a>
            <a href="#about"    className={styles.footerLink}>За наставника</a>
            <a href="#contact"  className={styles.footerLink}>Контакт</a>
          </div>

          <div className={styles.footerLinks}>
            <p className={styles.footerGroupTitle}>Акаунт</p>
            <Link to="/login"          className={styles.footerLink}>Вход</Link>
            <Link to="/forgot-password" className={styles.footerLink}>Забравена парола</Link>
          </div>

          <div className={styles.footerContact}>
            <p className={styles.footerGroupTitle}>Контакт</p>
            <a href="mailto:info@princeps.bg" className={styles.footerLink}>info@princeps.bg</a>
            <a href="https://wa.me/359888000000" target="_blank" rel="noreferrer" className={styles.footerLink}>WhatsApp</a>
            <a href="viber://chat?number=359888000000" className={styles.footerLink}>Viber</a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Princeps · Всички права запазени</p>
          <p>Данните ви са защитени · GDPR съвместим</p>
        </div>
      </footer>

    </div>
  )
}
