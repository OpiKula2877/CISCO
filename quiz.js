const STORAGE_KEY = 'ccnaQuizState';
const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const storage = isStandaloneMode ? window.localStorage : window.sessionStorage;

const categories = [
    { id: 1, label: 'Síťové modely a základy komunikace (OSI a TCP/IP)' },
    { id: 2, label: 'Aplikační vrstva a síťové služby (Protokoly)' },
    { id: 3, label: 'Transportní vrstva (TCP a UDP)' },
    { id: 4, label: 'Fyzická vrstva a síťová média (Hardware)' },
    { id: 5, label: 'Ethernet a linková vrstva (Layer 2)' },
    { id: 6, label: 'Protokol ARP (Řešení úkolů v LAN)' },
    { id: 7, label: 'IPv4 Adresování a Subnetting (Matematické úkoly)' },
    { id: 8, label: 'IPv6 Adresování a konfigurace' },
    { id: 9, label: 'Konfigurace a správa Cisco zařízení (IOS)' },
    { id: 10, label: 'Bezpečnost sítě, diagnostika a provoz' },
    { id: 11, label: 'Všechny' }
];

const sampleQuestions = [
    {
        id: 1,
        otazka: 'Kolik vrstev má OSI model?',
        moznosti: ['4', '5', '7', '8'],
        spravna_odpoved: 2,
        kategorie: 1,
        vysvetleni: 'OSI model má 7 vrstev. To je základní pomůcka pro rozdělení síťových funkcí.'
    },
    {
        id: 2,
        otazka: 'Který protokol se typicky používá pro překlad doménového jména na IP adresu?',
        moznosti: ['DNS', 'DHCP', 'ARP', 'NTP'],
        spravna_odpoved: 0,
        kategorie: 2,
        vysvetleni: 'DNS překládá názvy jako www.cisco.com na IP adresy. DHCP adresy jen přiděluje.'
    },
    {
        id: 3,
        otazka: 'Který protokol je spojově orientovaný a zajišťuje spolehlivé doručení?',
        moznosti: ['UDP', 'TCP', 'ICMP', 'ARP'],
        spravna_odpoved: 1,
        kategorie: 3,
        vysvetleni: 'TCP používá potvrzení, opakovaný přenos a řazení segmentů, takže je spolehlivý.'
    },
    {
        id: 4,
        otazka: 'Co je hlavní úlohou fyzické vrstvy?',
        moznosti: ['Směrování paketů', 'Přenos bitů po médiu', 'Překlad MAC adres', 'Řízení relací'],
        spravna_odpoved: 1,
        kategorie: 4,
        vysvetleni: 'Fyzická vrstva řeší samotný přenos bitů jako elektrický, optický nebo rádiový signál.'
    },
    {
        id: 5,
        otazka: 'Která adresa se používá jako broadcast v rámci ARP requestu?',
        moznosti: ['00:00:00:00:00:00', 'FF:FF:FF:FF:FF:FF', '255.255.255.255', '127.0.0.1'],
        spravna_odpoved: 1,
        kategorie: null,
        vysvetleni: 'ARP request jde jako broadcast do celé lokální sítě, proto používá MAC broadcast FF:FF:FF:FF:FF:FF.'
    }
];

function createPlaceholderQuestions(startId, totalCount) {
    const placeholders = [];

    for (let id = startId; id <= totalCount; id += 1) {
        placeholders.push({
            id,
            otazka: `DOPLNIT OTÁZKU ${id}`,
            moznosti: ['Možnost A', 'Možnost B', 'Možnost C', 'Možnost D'],
            spravna_odpoved: 0,
            kategorie: null,
            vysvetleni: 'Sem doplň vlastní vysvětlení správné odpovědi.',
            jeSablona: true
        });
    }

    return placeholders;
}

const allQuestions = [...sampleQuestions, ...createPlaceholderQuestions(6, 168)];

const dom = {
    goWebButton: document.getElementById('goWebButton'),
    webWarning: document.getElementById('webWarning'),
    startScreen: document.getElementById('startScreen'),
    quizScreen: document.getElementById('quizScreen'),
    resultScreen: document.getElementById('resultScreen'),
    categorySelect: document.getElementById('categorySelect'),
    questionCount: document.getElementById('questionCount'),
    availableCountInfo: document.getElementById('availableCountInfo'),
    shuffleToggle: document.getElementById('shuffleToggle'),
    startQuizButton: document.getElementById('startQuizButton'),
    resetSavedButton: document.getElementById('resetSavedButton'),
    quizCategoryLabel: document.getElementById('quizCategoryLabel'),
    quizTitle: document.getElementById('quizTitle'),
    progressChip: document.getElementById('progressChip'),
    progressFill: document.getElementById('progressFill'),
    questionCounter: document.getElementById('questionCounter'),
    questionNavPrev: document.getElementById('questionNavPrev'),
    questionNavNext: document.getElementById('questionNavNext'),
    questionNavViewport: document.getElementById('questionNavViewport'),
    questionNavTrack: document.getElementById('questionNavTrack'),
    questionText: document.getElementById('questionText'),
    explanationBox: document.getElementById('explanationBox'),
    explanationText: document.getElementById('explanationText'),
    answersGrid: document.getElementById('answersGrid'),
    prevQuestionButton: document.getElementById('prevQuestionButton'),
    nextQuestionButton: document.getElementById('nextQuestionButton'),
    finishQuizButton: document.getElementById('finishQuizButton'),
    backToSettingsButton: document.getElementById('backToSettingsButton'),
    reviewWrongOnlyButton: document.getElementById('reviewWrongOnlyButton'),
    reviewAllButton: document.getElementById('reviewAllButton'),
    reviewList: document.getElementById('reviewList'),
    resultSummary: document.getElementById('resultSummary'),
    correctCount: document.getElementById('correctCount'),
    wrongCount: document.getElementById('wrongCount'),
    resultPercent: document.getElementById('resultPercent'),
    restartQuizButton: document.getElementById('restartQuizButton'),
    backToStartButton: document.getElementById('backToStartButton')
};

const state = {
    category: '11',
    count: 5,
    shuffle: false,
    questionIds: [],
    currentIndex: 0,
    answers: {},
    completed: false,
    reviewFilter: 'wrong',
    screen: 'start'
};

function isQuestionReady(question) {
    return Boolean(question.otazka && question.otazka.trim())
        && Array.isArray(question.moznosti)
        && question.moznosti.length === 4
        && question.moznosti.every((option) => Boolean(option && option.trim()));
}

function getActiveQuestions() {
    return allQuestions.filter((q) => isQuestionReady(q) && !q.jeSablona);
}

function getCategoryLabel(categoryId) {
    return categories.find((item) => String(item.id) === String(categoryId))?.label ?? 'Neznámá kategorie';
}

function getQuestionsForCategory(categoryId) {
    const activeQuestions = getActiveQuestions();

    if (String(categoryId) === '11') {
        return activeQuestions;
    }

    return activeQuestions.filter((question) => String(question.kategorie) === String(categoryId));
}

function getCategoryAvailability(categoryId) {
    const activeQuestions = getActiveQuestions();

    if (String(categoryId) === '11') {
        return {
            categoryCount: activeQuestions.length,
            totalCount: activeQuestions.length
        };
    }

    const categoryCount = activeQuestions.filter((question) => String(question.kategorie) === String(categoryId)).length;

    return {
        categoryCount,
        totalCount: categoryCount
    };
}

function getSelectedQuestions() {
    return state.questionIds
        .map((questionId) => getActiveQuestions().find((question) => question.id === questionId))
        .filter(Boolean);
}

function getCorrectIndex(question) {
    if (typeof question.spravna_odpoved === 'number') {
        return question.spravna_odpoved;
    }

    return question.moznosti.findIndex((option) => option === question.spravna_odpoved);
}

function isCorrectAnswer(question, answerIndex) {
    return getCorrectIndex(question) === answerIndex;
}

function getAnswerLabel(question, answerIndex) {
    if (answerIndex === null || answerIndex === undefined || answerIndex < 0) {
        return 'Bez odpovědi';
    }

    return question.moznosti[answerIndex] ?? 'Bez odpovědi';
}

function shuffleArray(items) {
    const clone = [...items];

    for (let index = clone.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
    }

    return clone;
}

function updateQuickNavButtons() {
    const buttons = Array.from(dom.questionNavTrack.querySelectorAll('.question-nav-btn'));

    buttons.forEach((button) => {
        const index = Number(button.dataset.index);
        const question = getSelectedQuestions()[index];

        if (!question) {
            return;
        }

        const answerIndex = state.answers[question.id];
        const answered = Object.prototype.hasOwnProperty.call(state.answers, question.id);
        const correct = answered && isCorrectAnswer(question, answerIndex);

        button.classList.toggle('is-current', index === state.currentIndex);
        button.classList.toggle('is-answered', answered);
        button.classList.toggle('is-skipped', !answered);
        button.classList.toggle('is-correct', state.completed && correct);
        button.classList.toggle('is-wrong', state.completed && answered && !correct);
    });

    const viewport = dom.questionNavViewport;
    const canScroll = viewport.scrollWidth > viewport.clientWidth + 4;
    dom.questionNavPrev.hidden = !canScroll;
    dom.questionNavNext.hidden = !canScroll;
    dom.questionNavPrev.disabled = viewport.scrollLeft <= 2;
    dom.questionNavNext.disabled = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
}

function renderQuestionNavigation() {
    dom.questionNavTrack.innerHTML = getSelectedQuestions().map((question, index) => {
        const answered = Object.prototype.hasOwnProperty.call(state.answers, question.id);
        const answerIndex = state.answers[question.id];
        const correct = answered && isCorrectAnswer(question, answerIndex);
        const classes = ['question-nav-btn'];

        if (answered) {
            classes.push('is-answered');
        }

        if (!answered) {
            classes.push('is-skipped');
        }

        if (index === state.currentIndex) {
            classes.push('is-current');
        }

        if (state.completed && answered && correct) {
            classes.push('is-correct');
        }

        if (state.completed && answered && !correct) {
            classes.push('is-wrong');
        }

        return `<button type="button" class="${classes.join(' ')}" data-index="${index}" title="Otázka ${index + 1}">${index + 1}</button>`;
    }).join('');

    window.requestAnimationFrame(updateQuickNavButtons);
}

function clearSavedState() {
    storage.removeItem(STORAGE_KEY);
}

function getReviewQuestions() {
    const questions = getSelectedQuestions();

    if (state.reviewFilter === 'wrong') {
        return questions.filter((question) => !isCorrectAnswer(question, state.answers[question.id]));
    }

    return questions;
}

function setReviewFilter(filter) {
    state.reviewFilter = filter;
    dom.reviewWrongOnlyButton.classList.toggle('is-active-filter', filter === 'wrong');
    dom.reviewAllButton.classList.toggle('is-active-filter', filter === 'all');
    renderReviewList();
    saveState();
}

function renderReviewList() {
    const questions = getReviewQuestions();

    if (!questions.length) {
        dom.reviewList.innerHTML = '<div class="review-card is-correct"><strong>Bez chyb.</strong><p>V tomto filtru nejsou žádné otázky.</p></div>';
        return;
    }

    dom.reviewList.innerHTML = questions.map((question) => {
        const selectedAnswer = state.answers[question.id];
        const correctIndex = getCorrectIndex(question);
        const correct = isCorrectAnswer(question, selectedAnswer);
        const questionNumber = getSelectedQuestions().findIndex((item) => item.id === question.id) + 1;

        const optionsHtml = question.moznosti.map((optionText, optionIndex) => {
            const optionClasses = ['answer-pill'];
            const selectedIsWrong = typeof selectedAnswer === 'number' && selectedAnswer !== correctIndex;

            if (optionIndex === selectedAnswer && selectedIsWrong) {
                optionClasses.push('is-wrong');
            }

            if (optionIndex === correctIndex) {
                optionClasses.push('is-correct');
            }

            return `
                <div class="${optionClasses.join(' ')}">
                    ${String.fromCharCode(65 + optionIndex)}. ${optionText}
                </div>
            `;
        }).join('');

        return `
            <article class="review-card ${correct ? 'is-correct' : 'is-wrong'}">
                <div class="review-card-head">
                    <div>
                        <p class="eyebrow">Otázka ${questionNumber}</p>
                        <div class="review-question">${question.otazka}</div>
                    </div>
                    <span class="answer-pill ${correct ? 'is-correct' : 'is-wrong'}">${correct ? 'Správně' : 'Špatně'}</span>
                </div>

                <div class="review-meta">
                    <div class="answer-line"><strong>Tvoje odpověď:</strong> <span class="answer-pill ${correct ? 'is-correct' : 'is-wrong'}">${getAnswerLabel(question, selectedAnswer)}</span></div>
                    <div class="answer-line"><strong>Správná odpověď:</strong> <span class="answer-pill is-correct">${getAnswerLabel(question, correctIndex)}</span></div>
                </div>

                <div class="review-explanation">
                    <strong>Vysvětlení:</strong> <p>${question.vysvetleni || 'K této otázce zatím nebylo doplněno vysvětlení.'}</p>
                </div>

            </article>
        `;
    }).join('');
}

function saveState() {
    const answeredCount = Object.keys(state.answers).length;
    const progressPercent = state.questionIds.length
        ? Math.round(((state.currentIndex + 1) / state.questionIds.length) * 100)
        : 0;

    const payload = {
        ...state,
        answeredCount,
        progressPercent,
        standalone: isStandaloneMode
    };

    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
    const rawState = storage.getItem(STORAGE_KEY);

    if (!rawState) {
        return false;
    }

    try {
        const parsed = JSON.parse(rawState);
        Object.assign(state, {
            category: parsed.category ?? '11',
            count: parsed.count ?? 5,
            shuffle: Boolean(parsed.shuffle),
            questionIds: Array.isArray(parsed.questionIds) ? parsed.questionIds : [],
            currentIndex: Number.isInteger(parsed.currentIndex) ? parsed.currentIndex : 0,
            answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
            completed: Boolean(parsed.completed),
            reviewFilter: parsed.reviewFilter ?? 'wrong',
            screen: parsed.screen ?? 'start'
        });
        return true;
    } catch {
        clearSavedState();
        return false;
    }
}

function setScreen(screenName) {
    state.screen = screenName;
    dom.startScreen.hidden = screenName !== 'start';
    dom.quizScreen.hidden = screenName !== 'quiz';
    dom.resultScreen.hidden = screenName !== 'result';

    dom.startScreen.classList.toggle('is-active', screenName === 'start');
    dom.quizScreen.classList.toggle('is-active', screenName === 'quiz');
    dom.resultScreen.classList.toggle('is-active', screenName === 'result');
}

function updateAvailableCount() {
    const availability = getCategoryAvailability(dom.categorySelect.value);
    const maxQuestions = availability.totalCount;

    // Allow min 0 only when there are no questions; otherwise keep min 1
    dom.questionCount.min = maxQuestions === 0 ? '0' : '1';
    dom.questionCount.max = String(Math.max(maxQuestions, 0));
    dom.availableCountInfo.textContent = `K dispozici: ${maxQuestions} otázek`;

    const currentValue = Number(dom.questionCount.value) || 0;
    if (currentValue > maxQuestions) {
        dom.questionCount.value = String(maxQuestions);
    }

    // Disable start when nothing is available
    dom.startQuizButton.disabled = maxQuestions === 0;
}

function buildCategoryOptions() {
    dom.categorySelect.innerHTML = categories.map((category) => {
        return `<option value="${category.id}">${category.id}. ${category.label}</option>`;
    }).join('');
}

function renderQuestion() {
    const selectedQuestions = getSelectedQuestions();
    const currentQuestion = selectedQuestions[state.currentIndex];

    if (!currentQuestion) {
        finishQuiz();
        return;
    }

    const categoryLabel = currentQuestion.kategorie === null
        ? 'Kategorie: vždy dostupná otázka'
        : `Kategorie: ${currentQuestion.kategorie}. ${getCategoryLabel(currentQuestion.kategorie)}`;

    dom.quizCategoryLabel.textContent = categoryLabel;
    dom.quizTitle.textContent = 'Otázka';
    dom.questionCounter.textContent = `Otázka ${state.currentIndex + 1} z ${selectedQuestions.length}`;
    dom.questionText.textContent = currentQuestion.otazka;

    dom.explanationBox.hidden = !state.completed;
    dom.explanationText.textContent = currentQuestion.vysvetleni || 'K této otázce zatím nebylo doplněno vysvětlení.';

    const progressPercent = selectedQuestions.length
        ? Math.round(((state.currentIndex + 1) / selectedQuestions.length) * 100)
        : 0;
    dom.progressChip.textContent = `${progressPercent}%`;
    dom.progressFill.style.width = `${progressPercent}%`;

    renderQuestionNavigation();

    dom.answersGrid.innerHTML = currentQuestion.moznosti.map((optionText, optionIndex) => {
        const isSelected = state.answers[currentQuestion.id] === optionIndex;
        const correctIndex = getCorrectIndex(currentQuestion);
        const classes = ['answer-button'];

        if (isSelected) {
            classes.push('is-selected');
        }

        if (state.completed && optionIndex === correctIndex) {
            classes.push('is-correct');
        }

        if (state.completed && isSelected && optionIndex !== correctIndex) {
            classes.push('is-wrong');
        }

        return `
            <button class="${classes.join(' ')}" type="button" data-question-id="${currentQuestion.id}" data-option-index="${optionIndex}" ${state.completed ? 'disabled' : ''}>
                <strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${optionText}
            </button>
        `;
    }).join('');

    dom.prevQuestionButton.disabled = state.currentIndex === 0;
    const isLastQuestion = state.currentIndex >= selectedQuestions.length - 1;
    dom.nextQuestionButton.hidden = isLastQuestion;
    dom.finishQuizButton.hidden = !isLastQuestion;
    dom.nextQuestionButton.disabled = typeof state.answers[currentQuestion.id] !== 'number';
    dom.finishQuizButton.disabled = selectedQuestions.length === 0;
    saveState();
}

function startQuizFromSettings() {
    const category = dom.categorySelect.value;
    const requestedCount = Math.max(1, Number(dom.questionCount.value) || 1);
    const shuffle = dom.shuffleToggle.checked;
    const availableQuestions = getQuestionsForCategory(category);
    const count = Math.min(requestedCount, availableQuestions.length);

    const selectedQuestions = shuffle ? shuffleArray(availableQuestions) : [...availableQuestions].sort((a, b) => a.id - b.id);

    Object.assign(state, {
        category,
        count,
        shuffle,
        questionIds: selectedQuestions.slice(0, count).map((question) => question.id),
        currentIndex: 0,
        answers: {},
        completed: false,
        reviewFilter: 'wrong',
        screen: 'quiz'
    });

    setScreen('quiz');
    renderQuestion();
}

function goToQuestion(index) {
    const selectedQuestions = getSelectedQuestions();

    if (!selectedQuestions.length) {
        return;
    }

    state.currentIndex = Math.max(0, Math.min(index, selectedQuestions.length - 1));
    setScreen('quiz');
    renderQuestion();
}

function goToNextQuestion() {
    if (state.currentIndex < state.questionIds.length - 1) {
        state.currentIndex += 1;
        renderQuestion();
        return;
    }

    finishQuiz();
}

function goToPreviousQuestion() {
    if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        renderQuestion();
    }
}

function finishQuiz() {
    const questions = getSelectedQuestions();

    const correctAnswers = questions.filter((question) => isCorrectAnswer(question, state.answers[question.id])).length;
    const wrongAnswers = questions.length - correctAnswers;
    const percent = questions.length ? Math.round((correctAnswers / questions.length) * 100) : 0;

    state.completed = true;
    state.screen = 'result';

    dom.correctCount.textContent = String(correctAnswers);
    dom.wrongCount.textContent = String(wrongAnswers);
    dom.resultPercent.textContent = `${percent} %`;
    dom.resultSummary.textContent = `Vybral(a) jsi kategorii „${getCategoryLabel(state.category)}“ a odpověděl(a) na ${questions.length} otázek.`;
    dom.reviewWrongOnlyButton.classList.add('is-active-filter');
    dom.reviewAllButton.classList.remove('is-active-filter');

    saveState();
    renderQuestionNavigation();
    renderReviewList();

    setScreen('result');
}

function restoreQuizIfNeeded() {
    if (!loadState()) {
        setScreen('start');
        return;
    }

    dom.categorySelect.value = state.category;
    dom.questionCount.value = String(state.count);
    dom.shuffleToggle.checked = state.shuffle;
    dom.reviewWrongOnlyButton.classList.toggle('is-active-filter', state.reviewFilter !== 'all');
    dom.reviewAllButton.classList.toggle('is-active-filter', state.reviewFilter === 'all');
    updateAvailableCount();

    if (!state.questionIds.length) {
        setScreen('start');
        return;
    }

    if (state.screen === 'quiz') {
        setScreen('quiz');
        renderQuestion();
        return;
    }

    if (state.screen === 'result') {
        setScreen('result');
        renderQuestionNavigation();
        renderReviewList();
        const questions = getSelectedQuestions();
        const correctAnswers = questions.filter((question) => isCorrectAnswer(question, state.answers[question.id])).length;
        const wrongAnswers = questions.length - correctAnswers;
        const percent = questions.length ? Math.round((correctAnswers / questions.length) * 100) : 0;
        dom.correctCount.textContent = String(correctAnswers);
        dom.wrongCount.textContent = String(wrongAnswers);
        dom.resultPercent.textContent = `${percent} %`;
        dom.resultSummary.textContent = `Vybral(a) jsi kategorii „${getCategoryLabel(state.category)}“ a odpověděl(a) na ${questions.length} otázek.`;
        dom.reviewWrongOnlyButton.classList.toggle('is-active-filter', state.reviewFilter !== 'all');
        dom.reviewAllButton.classList.toggle('is-active-filter', state.reviewFilter === 'all');
        dom.reviewList.innerHTML = '';
        renderReviewList();
        return;
    }

    setScreen('start');
}

function wireEvents() {
    dom.goWebButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    dom.categorySelect.addEventListener('change', () => {
        updateAvailableCount();
        saveState();
    });

    dom.questionCount.addEventListener('input', saveState);
    dom.shuffleToggle.addEventListener('change', saveState);

    dom.startQuizButton.addEventListener('click', startQuizFromSettings);
    dom.resetSavedButton.addEventListener('click', () => {
        clearSavedState();
        setScreen('start');
    });

    if (dom.backToSettingsButton) {
        dom.backToSettingsButton.addEventListener('click', () => {
            setScreen('start');
        });
    }

    dom.prevQuestionButton.addEventListener('click', goToPreviousQuestion);
    dom.nextQuestionButton.addEventListener('click', goToNextQuestion);
    dom.finishQuizButton.addEventListener('click', finishQuiz);
    dom.restartQuizButton.addEventListener('click', startQuizFromSettings);
    dom.backToStartButton.addEventListener('click', () => {
        clearSavedState();
        setScreen('start');
    });

    dom.reviewWrongOnlyButton.addEventListener('click', () => setReviewFilter('wrong'));
    dom.reviewAllButton.addEventListener('click', () => setReviewFilter('all'));

    dom.questionNavPrev.addEventListener('click', () => {
        const amount = Math.max(280, Math.floor(dom.questionNavViewport.clientWidth * 0.75));
        dom.questionNavViewport.scrollBy({ left: -amount, behavior: 'smooth' });
        window.setTimeout(updateQuickNavButtons, 150);
    });

    dom.questionNavNext.addEventListener('click', () => {
        const amount = Math.max(280, Math.floor(dom.questionNavViewport.clientWidth * 0.75));
        dom.questionNavViewport.scrollBy({ left: amount, behavior: 'smooth' });
        window.setTimeout(updateQuickNavButtons, 150);
    });

    dom.questionNavViewport.addEventListener('scroll', updateQuickNavButtons, { passive: true });

    window.addEventListener('resize', () => {
        updateQuickNavButtons();
    });

    dom.answersGrid.addEventListener('click', (event) => {
        const answerButton = event.target.closest('.answer-button');
        if (!answerButton) {
            return;
        }

        const questionId = Number(answerButton.dataset.questionId);
        const optionIndex = Number(answerButton.dataset.optionIndex);
        state.answers[questionId] = optionIndex;
        renderQuestion();
    });

    dom.questionNavTrack.addEventListener('click', (event) => {
        const button = event.target.closest('.question-nav-btn');
        if (!button) {
            return;
        }

        goToQuestion(Number(button.dataset.index));
    });

    window.addEventListener('beforeunload', () => {
        if (!isStandaloneMode) {
            saveState();
        }
    });
}

function configureModeBanner() {
    dom.webWarning.hidden = isStandaloneMode;

    if (!isStandaloneMode) {
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry && navEntry.type === 'reload') {
            clearSavedState();
        }
    }
}

function initialize() {
    buildCategoryOptions();
    configureModeBanner();
    wireEvents();

    dom.categorySelect.value = state.category;
    dom.questionCount.value = String(state.count);
    dom.shuffleToggle.checked = state.shuffle;
    updateAvailableCount();
    restoreQuizIfNeeded();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Registrace je best-effort, aby se kvíz nezasekl na chybě sítě.
        });
    }
}

initialize();