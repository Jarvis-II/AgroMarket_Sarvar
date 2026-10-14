# AgroMarket — Multi-page нұсқа

Студент: Калжанов Сарвар Ержанович
Топ: КИ-25-21
Пән: Full-Stack әзірлеу
Университет: КазАТУ
GitHub: https://github.com/Jarvis-II
Тапсырыс e-mail: kalzanovsarvar@gmail.com

## Беттер
- index.html — басты бет
- catalog.html — каталог
- favorites.html — таңдаулылар
- cart.html — себет
- checkout.html — тапсырысты рәсімдеу
- about.html — жоба туралы
- contact.html — байланыс

## Функциялар
Іздеу, санат бойынша фильтр, сұрыптау, таңдаулылар, себет, quantity, автоматты жалпы сома, тегін жеткізу 15 000 ₸-ден бастап, модаль терезе, dark/light режим, LocalStorage, адаптивті дизайн, GitHub сілтемесі.

## Gmail-ге тапсырыс жіберу
Checkout бетінде FormSubmit AJAX қолданылады:
https://formsubmit.co/ajax/kalzanovsarvar@gmail.com

Алғашқы қолданғанда FormSubmit осы адреске растау хатын жіберуі мүмкін. Сол хаттағы растауды бір рет орындау қажет. Егер сыртқы сервис қолжетімсіз болса, сайт Gmail арқылы хат дайындауға fallback жасайды.

Маңызды: статикалық HTML сайт Gmail паролін немесе API кілтін кодқа салмайды. Бұл қауіпсізірек. Автоматты SMTP жіберу үшін бөлек backend қажет.
