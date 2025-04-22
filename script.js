document.addEventListener('DOMContentLoaded', function() {
    const currentDateElement = document.getElementById('currentDate');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const journalText = document.getElementById('journalText');
    const saveBtn = document.getElementById('saveBtn');

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

    // 初始化
    displayCurrentDate();
    loadTodayEntry();
});