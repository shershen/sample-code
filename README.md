Vuex модуль из одного проекта.

Сайт показывает данные аналитики и мониторинга.
Данный модуль отвечает за авторизацию и получение доступов клиентов, различных словарей и формирования списка месяцев и недель
для навигации по аналитике и мониторингу соответственно.

После авторизации необходимо получить список годов, к которым есть доступ у клиента. Для аналитики так же есть дата, по которую есть аналитика.

На основе этих годов и текущей даты формируем список выбора недели для мониторинга и список выбора месяца для аналитики.

Со списком месяц все просто. Для прошлых годов это от января до декабря. Если это последний доступный год, то берем последний доступный месяц.

В списке недель у недели выводится номер недели и дата понедельника. Это определяется с помощью функции getWeekNumber.
Количество недель в году разное и чтобы определить максимальную неделю в году, необходимо взять 28 декабря и нужный год.
Потому что даты с 29 по 31 декабря могут входит в первую неделю следующего года.

При смене рынка происходит и смена дат для аналитики, так как для каждого рынка она разная.
