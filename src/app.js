/**
 * app.js - Core Logic for CITS5505 Project
 * Author: Ryan (Lintao) Gong
 * 
 * This file handles global navigation, AJAX requests, 
 * quiz logic, and the interactive tutorial sandbox, fully utilizing jQuery.
 */

$(document).ready(function() {
    console.log('CITS5505 Project Initialized with jQuery');
    
    // --- 1. Global Navigation Handler ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $('.nav-link').each(function() {
        if ($(this).attr('href') === currentPath) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });

    // --- 2. Interactive Sandbox Logic (Tutorial Page) ---
    if ($('#html-input').length && $('#css-input').length && $('#run-sandbox').length) {
        const updatePreview = () => {
            const $previewArea = $('#preview-area');
            $previewArea.empty(); // jQuery empty
            
            const $iframe = $('<iframe>').css({
                width: '100%',
                height: '100%',
                border: 'none'
            });
            $previewArea.append($iframe); // jQuery append

            const doc = $iframe[0].contentDocument || $iframe[0].contentWindow.document;
            const content = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: sans-serif; color: #333; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; }
                        ${$('#css-input').val()}
                    </style>
                </head>
                <body>${$('#html-input').val()}</body>
                </html>
            `;
            doc.open();
            doc.write(content);
            doc.close();
        };
        
        $('#run-sandbox').on('click', updatePreview); // jQuery event listener
        updatePreview();
    }

    // --- 3. Quiz Module Initialization ---
    if (currentPath === 'quiz.html') {
        initQuizModule();
    }

    // --- 4. CV Page Animations ---
    if (currentPath === 'cv.html') {
        initCVAnimations();
    }
});

/**
 * Initializes IntersectionObserver for CV skill bars (if any)
 */
function initCVAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const $target = $(entry.target);
                $target.css('width', $target.data('width'));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    $('.skill-bar').each(function() {
        observer.observe(this);
    });
}

/**
 * ==========================================
 * QUIZ MODULE (Powered by jQuery)
 * ==========================================
 */
function initQuizModule() {
    // State Variables
    let questionsData = [];
    let userAnswers = {}; 
    let isDirty = false;  
    const PASS_THRESHOLD = 0.7; 

    // jQuery DOM Elements
    const $quizContainer = $('#quiz-container');
    const $submitBtn = $('#submit-quiz');
    const $validationWarning = $('#validation-warning');
    const $resultContainer = $('#result-container');
    const $rewardContainer = $('#reward-container');
    const $retryBtn = $('#retry-quiz');
    const $clearHistoryBtn = $('#clear-history');

    // 1. Initialize
    loadHistory(); 
    fetchQuestions(); 

    // 2. Fetch Questions via jQuery AJAX
    function fetchQuestions() {
        $.ajax({
            url: 'questions.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                questionsData = data.questions;
                shuffleArray(questionsData);
                renderQuestions();
            },
            error: function(xhr, status, error) {
                console.error('Failed to load questions:', error);
                $quizContainer.html('<div class="alert alert-danger">Failed to load quiz data. Please ensure you are running this on a local server.</div>');
            }
        });
    }

    // 3. Render Questions Dynamically with jQuery
    function renderQuestions() {
        $quizContainer.empty(); 
        
        $.each(questionsData, function(index, q) {
            // Create Card Container
            const $card = $('<div>', { 
                class: 'card mb-4 question-card', 
                id: `question-card-${q.id}` 
            });
            
            // Create Header
            const $header = $('<div>', { class: 'card-header d-flex justify-content-between align-items-center' })
                .html(`<span class="fw-bold text-cyan">Question ${index + 1}</span> <span class="badge bg-secondary">${q.topic}</span>`);
            
            // Create Body
            const $body = $('<div>', { class: 'card-body' });
            const $questionText = $('<h5>', { class: 'card-title mb-4', text: q.question });
            $body.append($questionText);
            
            // Create Options
            const $optionsContainer = $('<div>', { class: 'options-container' });
            
            $.each(q.options, function(optIndex, optText) {
                const $optDiv = $('<div>', { class: 'quiz-option d-flex align-items-center' });
                const $optionCircle = $('<div>', {
                    class: 'option-circle me-3',
                    style: 'width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--text-muted); transition: all 0.2s;'
                });
                const $optionText = $('<span>', { text: optText });

                $optDiv.append($optionCircle, $optionText);
                
                // jQuery Event Listener
                $optDiv.on('click', function() {
                    handleOptionSelect(q.id, optIndex, $(this), $optionsContainer);
                });
                
                $optionsContainer.append($optDiv);
            });
            
            $body.append($optionsContainer);
            $card.append($header).append($body);
            $quizContainer.append($card);
        });

        // jQuery animation to show submit button
        $submitBtn.removeClass('d-none').hide().fadeIn(500); 
    }

    // 4. Handle Option Selection
    function handleOptionSelect(questionId, optionIndex, $selectedElement, $container) {
        userAnswers[questionId] = optionIndex;
        
        // Visual Update using jQuery
        $container.children().removeClass('selected').each(function() {
            $(this).find('.option-circle').css({
                'border-color': 'var(--text-muted)',
                'background': 'transparent',
                'box-shadow': 'none'
            });
        });
        
        $selectedElement.addClass('selected');
        $selectedElement.find('.option-circle').css({
            'border-color': 'var(--bg-dark)',
            'background': 'var(--bg-dark)',
            'box-shadow': 'inset 0 0 0 4px var(--accent-cyan)'
        });
        
        $(`#question-card-${questionId}`).css('border-color', '');
        
        if (!isDirty) {
            isDirty = true;
            $(window).on('beforeunload', beforeUnloadHandler);
        }
    }

    const beforeUnloadHandler = function(e) {
        e.preventDefault();
        e.returnValue = ''; 
    };

    // 5. Submit Validation & Scoring
    $submitBtn.on('click', function() {
        $validationWarning.slideUp(); // jQuery animation
        let isValid = true;
        let $firstUnanswered = null;

        $('.question-card').css('border-color', '');

        $.each(questionsData, function(index, q) {
            if (userAnswers[q.id] === undefined) {
                isValid = false;
                const $card = $(`#question-card-${q.id}`);
                $card.css('border-color', '#ef4444'); 
                if (!$firstUnanswered) $firstUnanswered = $card;
            }
        });

        if (!isValid) {
            $validationWarning.slideDown(); // jQuery animation
            $('html, body').animate({
                scrollTop: $firstUnanswered.offset().top - 100
            }, 500); // jQuery smooth scrolling
            return; 
        }

        let score = 0;
        $.each(questionsData, function(index, q) {
            if (userAnswers[q.id] === q.answer) {
                score++;
            }
        });

        const total = questionsData.length;
        const percentage = (score / total);
        const passed = percentage >= PASS_THRESHOLD;

        isDirty = false;
        $(window).off('beforeunload', beforeUnloadHandler);

        displayResults(score, total, percentage, passed);
        saveAttemptToHistory(score, total, percentage, passed);

        if (passed) {
            fetchRewardAPI();
        }
    });

    // 6. Display Results (jQuery Animations)
    function displayResults(score, total, percentage, passed) {
        $quizContainer.slideUp(400);
        $submitBtn.slideUp(400);
        $resultContainer.removeClass('d-none').hide().fadeIn(800);

        const $titleEl = $('#result-title');
        const $scoreEl = $('#result-score');
        const $percentEl = $('#result-percentage');

        if (passed) {
            $titleEl.text('Congratulations!').removeClass('text-warning').addClass('text-success');
            $resultContainer.css('border-color', '#22c55e');
        } else {
            $titleEl.text('Keep Practicing!').removeClass('text-success').addClass('text-warning');
            $resultContainer.css('border-color', '#f59e0b');
        }

        $scoreEl.text(`${score} / ${total}`);
        $percentEl.text(`You scored ${Math.round(percentage * 100)}%. (Pass mark: 70%)`);
    }

    // 7. Reward via Public API (jQuery AJAX)
    function fetchRewardAPI() {
        const randomPokemonId = Math.floor(Math.random() * 1025) + 1;

        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}/`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const imageUrl = data?.sprites?.other?.['official-artwork']?.front_default || data?.sprites?.front_default;
                const pokemonName = data?.name
                    ? data.name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
                    : 'Pokemon reward';

                if (imageUrl) {
                    $('#reward-image')
                        .attr('src', imageUrl)
                        .attr('alt', `${pokemonName} artwork`);
                    $('#reward-name').text(`Pokemon: ${pokemonName}`);
                    $rewardContainer.removeClass('d-none').hide().slideDown(600);
                }
            },
            error: function(xhr, status, error) {
                console.error('Failed to fetch reward:', error);
            }
        });
    }

    // 8. Local Storage Management
    function saveAttemptToHistory(score, total, percentage, passed) {
        const attempt = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            score: score,
            total: total,
            percentage: Math.round(percentage * 100),
            passed: passed
        };

        try {
            let history = getHistoryData();
            history.unshift(attempt); 
            localStorage.setItem('cits5505_quiz_history', JSON.stringify(history));
            renderHistoryList(history);
        } catch (error) {
            console.error('LocalStorage write failed:', error);
        }
    }

    function loadHistory() {
        const history = getHistoryData();
        renderHistoryList(history);
    }

    function getHistoryData() {
        try {
            const data = localStorage.getItem('cits5505_quiz_history');
            if (data) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (error) {
            console.error('LocalStorage read failed:', error);
        }
        return []; 
    }

    function renderHistoryList(history) {
        const $listEl = $('#history-list');
        $('#history-count').text(history.length);
        $listEl.empty();

        if (history.length === 0) {
            $listEl.html('<li class="list-group-item bg-transparent text-muted text-center py-4">No attempts yet.</li>');
            return;
        }

        $.each(history, function(index, item) {
            const statusBadge = item.passed 
                ? '<span class="badge bg-success bg-opacity-25 text-success border border-success rounded-pill">Pass</span>' 
                : '<span class="badge bg-warning bg-opacity-25 text-warning border border-warning rounded-pill">Fail</span>';

            const $li = $('<li>', { class: 'list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center' });
            $li.html(`
                <div>
                    <div class="fw-bold text-light">${item.score}/${item.total} (${item.percentage}%)</div>
                    <small class="text-muted" style="font-size: 0.75rem;">${item.date}</small>
                </div>
                ${statusBadge}
            `);
            $listEl.append($li);
        });
    }

    $clearHistoryBtn.on('click', function() {
        try {
            localStorage.removeItem('cits5505_quiz_history');
            renderHistoryList([]);
        } catch (error) {
            console.error('Failed to clear LocalStorage:', error);
        }
    });

    $retryBtn.on('click', function() {
        userAnswers = {};
        isDirty = false;
        $resultContainer.addClass('d-none');
        $rewardContainer.addClass('d-none');
        $('#reward-image').attr('src', '').attr('alt', 'Random Pokemon reward');
        $('#reward-name').text('');
        $quizContainer.removeClass('d-none').hide().fadeIn(500);
        
        shuffleArray(questionsData);
        renderQuestions();
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // Utility: Fisher-Yates Shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
