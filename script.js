document.addEventListener('DOMContentLoaded', function() {
    const currentDateElement = document.getElementById('currentDate');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const journalText = document.getElementById('journalText');
    const saveBtn = document.getElementById('saveBtn');
    const toggleHistoryBtn = document.getElementById('toggleHistory');
    const historyList = document.getElementById('historyList');

    // 显示当前日期
    function displayCurrentDate() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        currentDateElement.textContent = now.toLocaleDateString('zh-CN', options);
    }

    // 心情选择功能
    let selectedMood = null;

    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 清除之前的选择
            moodButtons.forEach(btn => btn.classList.remove('selected'));

            // 选择当前心情
            this.classList.add('selected');
            selectedMood = this.getAttribute('data-mood');
        });
    });

    // 保存功能
    saveBtn.addEventListener('click', function() {
        const journalContent = journalText.value.trim();

        if (!selectedMood && !journalContent) {
            alert('请选择心情或写下一些内容！');
            return;
        }

        // 获取当前日期作为键值
        const today = new Date().toDateString();

        // 准备保存的数据
        const entryData = {
            date: today,
            mood: selectedMood,
            content: journalContent,
            timestamp: new Date().toISOString()
        };

        // 保存到localStorage
        let entries = JSON.parse(localStorage.getItem('moodJournalEntries')) || [];

        // 检查今天是否已有记录
        const existingEntryIndex = entries.findIndex(entry => entry.date === today);

        if (existingEntryIndex !== -1) {
            // 更新现有记录
            entries[existingEntryIndex] = entryData;
        } else {
            // 添加新记录
            entries.push(entryData);
        }

        localStorage.setItem('moodJournalEntries', JSON.stringify(entries));

        // 显示保存成功信息
        saveBtn.textContent = '已保存！';
        saveBtn.style.background = '#48bb78';

        setTimeout(() => {
            saveBtn.textContent = '保存';
            saveBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 2000);
    });

    // 加载今天的记录
    function loadTodayEntry() {
        const today = new Date().toDateString();
        const entries = JSON.parse(localStorage.getItem('moodJournalEntries')) || [];
        const todayEntry = entries.find(entry => entry.date === today);

        if (todayEntry) {
            // 恢复心情选择
            if (todayEntry.mood) {
                const moodButton = document.querySelector(`[data-mood="${todayEntry.mood}"]`);
                if (moodButton) {
                    moodButton.classList.add('selected');
                    selectedMood = todayEntry.mood;
                }
            }

            // 恢复文本内容
            if (todayEntry.content) {
                journalText.value = todayEntry.content;
            }
        }
    }

    // 历史记录功能
    function getMoodEmoji(mood) {
        const moodEmojis = {
            'happy': '😊',
            'sad': '😢',
            'angry': '😠',
            'calm': '😌',
            'excited': '🤩'
        };
        return moodEmojis[mood] || '';
    }

    function displayHistory() {
        const entries = JSON.parse(localStorage.getItem('moodJournalEntries')) || [];

        if (entries.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #999;">还没有历史记录</p>';
            return;
        }

        // 按日期倒序排列
        entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const historyHTML = entries.map(entry => {
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return `
                <div class="history-item">
                    <div class="history-date">${formattedDate}</div>
                    <div class="history-mood">${getMoodEmoji(entry.mood)}</div>
                    <div class="history-content">${entry.content || '无内容'}</div>
                </div>
            `;
        }).join('');

        historyList.innerHTML = historyHTML;
    }

    toggleHistoryBtn.addEventListener('click', function() {
        if (historyList.classList.contains('hidden')) {
            displayHistory();
            historyList.classList.remove('hidden');
            toggleHistoryBtn.textContent = '隐藏历史';
        } else {
            historyList.classList.add('hidden');
            toggleHistoryBtn.textContent = '查看历史';
        }
    });

    // 初始化
    displayCurrentDate();
    loadTodayEntry();
});