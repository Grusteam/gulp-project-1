/* модуль слежения за анимацией */
(function WATCH_ANIMATION () {
    let currentActiveGroup = null;

    /* утилиты и методы */
    const
        /* event listener */
        manageListening = (el=body, handler=()=>null, action='add', eType='animationend') => {
            el[`${action}EventListener`](eType, handler);
        },
        getElementIndex = (arr, name) => arr.indexOf(arr.find(el => el === name)),
        removeIndexFromArrayMUTATE = (arr, index) => arr.splice(index, 1),
        /* finish */
        finishAnimation = () => {
            currentActiveGroup = null;

            console.log('finish');
        },
        /* окончание анимации на 1 элементе */
        elementAnimationEndHandler = (e, elArr) => {
            const
                { target } = e,
                { id, dataset: { group }, } = target,
                index = getElementIndex(currentActiveGroup.activeElements, id);

            /* удалить из активных */
            removeIndexFromArrayMUTATE(currentActiveGroup.activeElements, index);

            /* есть ли в группе активные */
            if (!currentActiveGroup.activeElements.length) finishAnimation();
        },
        /* следить за набором */
        seizeAnimationGroup = (elArr = [], ) => {
            currentActiveGroup = {
                elementsCollection: {},
            };

            const elements = elArr.map((el, i) => {
                const { id, dataset: { group }, } = el;

                currentActiveGroup.group = group;
                currentActiveGroup.elementsCollection[id] = true;

                return id;
            });

            Object.assign(currentActiveGroup, { elements, activeElements: elements });
            
            elArr.forEach(el => {
                manageListening(el, (e) => elementAnimationEndHandler(e, elArr));
            });
        };

    /* тестовая группа нод */
    const testGroup = Array.from(document.querySelectorAll('.test'));

    /* запуск следения за группой */
    seizeAnimationGroup(testGroup);

    /* RAF */
    const
        FPS = 60,
        step = ms => {
            const
                id = requestAnimationFrame(step),
                sec = id / FPS;
        };

    /* запуск RAF */
    // step();
})();