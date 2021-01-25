import router from '../router'
import {dateOfMonday} from '../service/monitoring'
import {nameOfMonth} from '../service/analitica'

const state = {
    auth: {
        userid: '',
        key: localStorage.getItem('key') || ''
    },
    //Тестеры, которым показывать разделы Новости, Форумы
    loginTester: ['tester'],
    analiticaTest: localStorage.getItem('analiticaTest') || false,
    sendAuthInfo: false,
    choosedMarket: JSON.parse(localStorage.getItem('choosedMarket')) || false,
    choosedYearMonitoring: parseInt(localStorage.getItem('choosedYearMonitoring')) || false,
    choosedYearAnalitica: parseInt(localStorage.getItem('choosedYearAnalitica')) || false,
    choosedWeekMonitoring: parseInt(localStorage.getItem('choosedWeekNumberMonitoring')) || false,
    choosedMonthAnalitica: parseInt(localStorage.getItem('choosedMonthNumberAnalitica')) || false,
    maxWeekMonitoring: false,
    maxMonthAnalitica:  parseInt(localStorage.getItem('maxMonthAnalitica')) || false,
    listWeeks: false,
    listMonth: false,
    accessMarkets: JSON.parse(localStorage.getItem('accessMarkets')) || false,
    accessProducts: JSON.parse(localStorage.getItem('accessProducts')) || false,
    accessYears: JSON.parse(localStorage.getItem('accessYears')) || false,
    prod: JSON.parse(localStorage.getItem('dictionaryProducts')) || {},
    market:JSON.parse(localStorage.getItem('dictionaryMarket')) || false,
    snackbar: {
        status: false,
        text: ''
    },
    navMenu: false,
    choosedProd: false,
    lastDate: false,
    sendQuestion: false,
    snackbarSendQuestion: {
        show: false,
        text: '',
        color: ''
    },
    zoomPage: 1,
    normalZoom: 1,
    countItemsToScroll: 5,
    numberTotalElement: 29
}

const getters =  {
    getZoomPage: state => {
        return state.zoomPage;
    },
    getNormalZoom: state => {
        return state.normalZoom;
    },
    getNavMenu: state => {
        return state.navMenu;
    },
    getSnackbar: state => {
        return state.snackbar;
    },
    getAuthKey: state => {
        return state.auth.key;
    },
    getAnaliticaTest: state => {
        return state.analiticaTest;
    },
    getSendAuthInfo: state => {
        return state.sendAuthInfo;
    },

    getMarket: state => {
        return state.market;
    },
    getChoosedMarket: state => {
        return state.choosedMarket;
    },
    getChoosedMarketId: state => {
        if (!state.choosedMarket || !state.choosedMarket.id) return false;
        return state.choosedMarket.id;
    },

    getMaxYear: state => {
        if ((Object.keys(state.lastDate).length > 0) && (!!state.choosedMarket && !!state.choosedMarket.id)) {
            return state.lastDate[state.choosedMarket.id].y;
        }
        return false
    },
    getChoosedYearAnalitica: state => {
        return state.choosedYearAnalitica;
    },
    getChoosedYearMonitoring: state => {
        return state.choosedYearMonitoring;
    },

    getChoosedMonthAnalitica: state => {
        return state.choosedMonthAnalitica;
    },
    getChoosedWeekMonitoring: state => {
        return state.choosedWeekMonitoring;
    },

    getMaxYearAnalitica: state => {
        if ((Object.keys(state.lastDate).length > 0) && (!!state.choosedMarket && !!state.choosedMarket.id)) {
            return state.lastDate[state.choosedMarket.id].y;
        }
        return false;
    },

    getMaxMonthAnalitica: state => {
        return state.maxMonthAnalitica;
    },
    getMaxWeekMonitoring: state => {
        return state.maxWeekMonitoring;
    },
    
    getListMonth: state => {
        return state.listMonth;
    },
    getListWeeks: state => {
        return state.listWeeks;
    },

    getAccessMarkets: state => {
        return state.accessMarkets;
    },
    getAccessYears: state => {
        return state.accessYears;
    },
    getAccessProducts: state => {
        return state.accessProducts;
    },
    getAccessProductsByMarket: state => {
        if (!state.choosedMarket || !state.choosedMarket.id) return false
        if (!!state.accessProducts[state.choosedMarket.id]) return state.accessProducts[state.choosedMarket.id];
        return false
    },

    getProd: state => {
        return state.prod;
    },
    getProdName: state => id => {
        if (!!state.prod[id] && !!state.prod[id].name) return state.prod[id].name;
        return '&mdash;';
    },
    getProdCode: state => id => {
        if (!!state.prod[id] && !!state.prod[id].code) return state.prod[id].code;
        return '&mdash;';
    },
    getChoosedProd: state => {
        return state.choosedProd;
    },

    getSendQuestion: state => {
        return state.sendQuestion
    },
    getSnackbarSendQuestion: state => {
        return state.snackbarSendQuestion
    },
    getCountItemsToScroll: state => {
        return state.countItemsToScroll
    }
}

const mutations = {
    //Сброс данных при неверном доступе
    SET_DEFAULT(state) {
        state.auth= {
            userid: '',
            key: ''
        };
        state.accessMarkets = false;
        state.accessProducts = false;
        state.accessYears = false;
        state.choosedMarket = false;
        state.choosedYear = false;
        state.choosedWeek = false;
        state.analiticaTest = false;
    },

    SET_ZOOM_PAGE(state, data) {
        state.zoomPage = data;
    },

    SET_NAV_MENU(state,data) {
        state.navMenu = data;
    },
    SET_SNACKBAR(state, data) {
        state.snackbar = data;
    },
    SET_AUTH_INFO(state, data) {
        state.auth = data;
    },
    SET_ANALITICA_TEST(state, data) {
        localStorage.setItem('analiticaTest', data)
        state.analiticaTest = data;
    },
    SET_SEND_AUTH_INFO(state, data) {
        state.sendAuthInfo = data;
    },
    SET_AUTH_INFO_BY_KEY(state, data) {
        state.auth[data.key] = data.value;
    },
    SET_ACCESS_RIGHTS(state, data) {
        state.accessRights = data;
    },

    SET_CHOOSED_MARKET(state, data) {
        localStorage.setItem('choosedMarket', JSON.stringify(data));
        state.choosedMarket = data;

        //При смене рынка происходит пересчет дат для Аналитики. Потому что данные даты для разных рынков разные
        if (!!state.lastDate && !!state.lastDate[state.choosedMarket.id] && !!state.lastDate[state.choosedMarket.id].y){
            if (!state.choosedYearAnalitica || (state.choosedYearAnalitica > state.lastDate[state.choosedMarket.id].y)  || (!!state.accessYears && !state.accessYears.find(item => item == state.choosedYearAnalitica))) {
                let year = state.lastDate[state.choosedMarket.id].y;
                this.commit('SET_CHOOSED_YEAR_ANALITICA', year);
            } else if (!state.maxMonthAnalitica || (state.maxMonthAnalitica != state.lastDate[state.choosedMarket.id].m)) {
                let year = state.lastDate[state.choosedMarket.id].y;
                this.commit('auth/SET_MAX_MONTH_ANALITICA', year);
            }
            this.commit('auth/SET_LIST_MONTH');
        }
    },

    SET_CHOOSED_YEAR_ANALITICA(state, data) {
        localStorage.setItem('choosedYearAnalitica', data);
        state.choosedYearAnalitica = data;
        this.commit('auth/SET_MAX_MONTH_ANALITICA', data);
    },
    SET_CHOOSED_YEAR_MONITORING(state, data) {
        localStorage.setItem('choosedYearMonitoring', data);
        state.choosedYearMonitoring = data;
        this.commit('auth/SET_MAX_WEEK_MONITORING', data);
    },

    SET_CHOOSED_MONTH_ANALITICA(state, data) {
        localStorage.setItem('choosedMonthNumberAnalitica', data);
        state.choosedMonthAnalitica = data;
    },
    SET_CHOOSED_WEEK_MONITORING(state, data) {
        localStorage.setItem('choosedWeekNumberMonitoring', data);
        state.choosedWeekMonitoring = data;
    },

    SET_CHOOSED_WEEK(state, data) {
        localStorage.setItem('choosedWeekNumber', data);
        state.choosedWeek = data;
    },

    SET_MAX_MONTH_ANALITICA(state, year) {
        year = parseInt(year)
        //Установка даты для аналитики зависит от полученных значений по API и выбранного рынка.
        //Проверяем, есть ли эти данные
        if ((Object.keys(state.lastDate).length > 0) && (!!state.choosedMarket && !!state.choosedMarket.id) && (!!state.lastDate[state.choosedMarket.id] && !!state.lastDate[state.choosedMarket.id].y  && !!state.lastDate[state.choosedMarket.id].m)) {
            let maxYear = state.lastDate[state.choosedMarket.id].y;
            let maxMonth;
            if (year < maxYear) {
                maxMonth = 12;
            } else if (year == maxYear) {
                maxMonth = state.lastDate[state.choosedMarket.id].m;
            } else {
                maxMonth = 1;
            }
            this.commit('auth/SET_CHOOSED_MONTH_ANALITICA', maxMonth);
            localStorage.setItem('maxMonthAnalitica', maxMonth);
            state.maxMonthAnalitica = maxMonth;
        }
    },
    SET_MAX_WEEK_MONITORING(state, year) {
        year = parseInt(year)
        let date = new Date();
        let nowYear = date.getFullYear();
        let nowDay = date.getDate();
        let nowMonth = date.getMonth();
        let maxWeek;
        if (year < nowYear) {
            //Если год меньше текущего года, то максимальная неделя это последняя неделя года
            maxWeek = new Date( year,11,28 ).getWeekNumber();
        } else if (year == nowYear) {
            //Иначе высчитываем неделю по текущей дате
            maxWeek = new Date( nowYear, nowMonth, nowDay ).getWeekNumber();
        } else {
            maxWeek = 1;
        }
        this.commit('auth/SET_CHOOSED_WEEK_MONITORING', maxWeek);
        localStorage.setItem('maxWeekNumberMonitoring', maxWeek);
        state.maxWeekMonitoring = maxWeek;
    },

    SET_ACCESS_MARKETS(state, data) {
        localStorage.setItem('accessMarkets', JSON.stringify(data));
        state.accessMarkets = data;
    },
    SET_ACCESS_PRODUCTS(state, data) {
        // Удаление элемента Общее. Просьба заказчика
        Object.keys(data).forEach( item => {
            let deletIndex = data[item].indexOf(state.numberTotalElement);
            if (deletIndex >= 0) data[item].splice(deletIndex, 1);
        })
        localStorage.setItem('accessProducts', JSON.stringify(data));
        state.accessProducts = data;
    },
    SET_CHOOSED_PROD(state, data) {
        state.choosedProd = data;
    },
    SET_ACCESS_YEARS(state, data) {
        function compareNumeric(a, b) {
            if (a > b) return 1;
            if (a == b) return 0;
            if (a < b) return -1;
        }
        data = data.sort(compareNumeric);
        localStorage.setItem('accessYears', JSON.stringify(data));
        state.accessYears = data;
    },
    SET_LIST_MONTH(state) {
        //Установка даты для аналитики зависит от полученных значений по API и выбранного рынка.
        //Проверяем, есть ли эти данные
        if ((state.accessYears.length > 0) && (Object.keys(state.lastDate).length > 0) && (!!state.choosedMarket && !!state.choosedMarket.id) && (!!state.lastDate[state.choosedMarket.id] && !!state.lastDate[state.choosedMarket.id].y  && !!state.lastDate[state.choosedMarket.id].m)) {
            let listMonth = {};
            let maxYear = parseInt(state.lastDate[state.choosedMarket.id].y);
            let maxMonthInYear;
            //Для каждого доступного года из accessYears формируем список месяцев
            //В последнем году, исходя из lastDate, последним месяцем должен быть state.lastDate[state.choosedMarket.id].m
            state.accessYears.forEach(function(year) {
                if (year < maxYear) {
                    maxMonthInYear = 12;
                } else if (year == maxYear) {
                    maxMonthInYear = parseInt(state.lastDate[state.choosedMarket.id].m);
                } else {
                    maxMonthInYear = 1;
                }
                listMonth[year] = [];
                while(maxMonthInYear > 0) {
                    listMonth[year].push({
                        monthNumber: maxMonthInYear,
                        month: nameOfMonth(maxMonthInYear, year)
                    });
                    maxMonthInYear = maxMonthInYear - 1;
                }
            })
            state.listMonth = [];
            state.listMonth = listMonth;
        }
    },
    SET_LIST_WEEKS(state) {
        if (state.accessYears.length > 0) {
            let listWeeks = {};
            let date = new Date();
            let nowYear = date.getFullYear();
            let nowDay = date.getDate();
            let nowMonth = date.getMonth();
            let maxWeekInYear;
            //Для каждого доступного года из accessYears формируем список недель
            //Для текущего года последней неделей будет текущая
            state.accessYears.forEach(function(year, index) {
                if (year < nowYear) {
                    maxWeekInYear = new Date( year,11,28).getWeekNumber();
                } else if (year == nowYear) {
                    maxWeekInYear = new Date( nowYear, nowMonth, nowDay ).getWeekNumber();
                } else {
                    maxWeekInYear = 1;
                }
                listWeeks[year] = [];
                while(maxWeekInYear > 0) {
                    listWeeks[year].push({
                        week: maxWeekInYear,
                        day: dateOfMonday(maxWeekInYear, year)
                    });
                    maxWeekInYear = maxWeekInYear - 1;
                }
            })
            state.listWeeks = [];
            state.listWeeks = listWeeks;
        }
    },

    SET_MARKET(state, data) {
        state.market = {};
        data.forEach(country => {
            state.market[country.id] = country;
        });
        localStorage.setItem('dictionaryMarket', JSON.stringify(state.market));
    },
    SET_PROD(state, data) {
        data.forEach(element => {
            state.prod[element.id] = element;
        });
        localStorage.setItem('dictionaryProducts', JSON.stringify(state.prod));
    },
    SET_LAST_DATE(state, data) {
        state.lastDate = data
    },
    SET_SEND_QUESTION(state, data) {
        state.sendQuestion = data;
    },
    SET_SNACKBAR_SEND_QUESTION(state, data) {
        state.snackbarSendQuestion = data;
    },
}

const actions = {
    sendAuthInfo({ commit, dispatch }, info) {
        commit('SET_SEND_AUTH_INFO', true);
        axios.get('https://api?login=' + info.login + '&pass=' + info.pass)
        .then((response) => {
            if (!!response.data && (response.data.status == "1")){
                commit('SET_AUTH_INFO', response.data);
                if (state.loginTester.indexOf(info.login.toLowerCase()) >=0) commit('SET_ANALITICA_TEST', true);
                localStorage.setItem('key', response.data.key);
                localStorage.setItem('userid', response.data.userid);
                dispatch('getStartInfo');
                router.push('/');
            }
        })
        .finally(() => commit('SET_SEND_AUTH_INFO', false))
    },
    getStartInfo({dispatch}) {
        dispatch('getMarketDictionary');
        dispatch('getProductsDictionary');
        dispatch('getAccessRights');
    },

    //Получаем права доступа для данного пользователя (года, рынки, продукты)
    getAccessRights({ commit, state }) {
        axios.get('https://api?key=' + state.auth.key)
        .then((response) => {
            if (!!response.data && (response.data.status == "1")){
                commit('SET_ACCESS_RIGHTS', response.data.data);
                localStorage.setItem('accessForums', JSON.stringify(response.data.data.forums));
                commit('SET_ACCESS_YEARS', response.data.data.years);
                commit('SET_ACCESS_MARKETS', response.data.data.analytics_markets);
                commit('SET_ACCESS_PRODUCTS', response.data.data.analytics_products);
                
                //Дата для мониторинга. Всегда должны быть самой свежей
                let year = Math.max.apply(null, response.data.data.years); //Но должна учитывать права доступа на года
                commit('SET_CHOOSED_YEAR_MONITORING', year);
                commit('SET_LIST_WEEKS');

                //Дата для аналитики. Получаем с сервера дату, по которую есть данные Аналитики
                axios.get('https://api')
                .then((res) => {
                    if (!!res.data && (res.data.status != "0")){
                        commit('SET_LAST_DATE', res.data);
                        let year = parseInt(res.data[state.choosedMarket.id].y);
                        while (!response.data.data.years.find(item => item == year) && response.data.data.years.length && (year > 2000)) {
                            year -- //Дата должна учитывать права доступа на года
                        }
                        commit('SET_CHOOSED_YEAR_ANALITICA', year);
                        commit('SET_LIST_MONTH');
                    }
                })

                //Устанавливаем Дату для отсчета повторного запроса данных
                localStorage.setItem('lastUpdateTime', new Date().getTime());
                localStorage.setItem('lastUpdateDate', new Date().getDate());
            }
        })
    },

    //Получаем словарь рынков
    getMarketDictionary({ commit, state }) {
        axios.get('https://api?key=' + state.auth.key)
        .then((response) => {
            if (!!response.data && (response.data.status != "0")){
                commit('SET_MARKET', response.data);
            }
        })
    },

    //Получаем словарь продуктов
    getProductsDictionary({ commit, state }) {
        axios.get('https://api?key=' + state.auth.key)
        .then((response) => {
            if (!!response.data && (response.data.status == "1")){
                commit('SET_PROD', response.data.products);
            }
        })
    },

    //Отправка формы со страницы Котнтакты
    sendQuestion({ commit }, info) {
        commit('SET_SEND_QUESTION', true);
        axios.get('https://api?name=' + info.fio + '&mail=' + info.eml + '&text=' + info.text)
        .then((response) => {
            if (!!response.data && (response.data == '+')){
                commit('SET_SNACKBAR_SEND_QUESTION', {
                    show: true,
                    text: 'Запрос успешно отправлен',
                    color: 'success'
                })
            } else{
                commit('SET_SNACKBAR_SEND_QUESTION', {
                    show: true,
                    text: 'Не удалось отправить данные. Попробуйте позже.',
                    color: 'error'
                })
            }
        })
        .finally(() => {
            commit('SET_SEND_QUESTION', false)
            setTimeout(() => {
                commit('SET_SNACKBAR_SEND_QUESTION', {
                    show: false,
                    text: '',
                    color: ''
                })
            }, 5000);
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
