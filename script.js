/**
 * Minimal Mindfulness App
 * Logic: Breathing Loop State Machine
 */

// デフォルト設定
const DEFAULTS = {
    inhale: 3,
    hold: 6,
    exhale: 9
};

// 現在の設定
let settings = { ...DEFAULTS };

// DOM要素
const els = {
    display: document.getElementById('phase-text'),
    settingsPanel: document.getElementById('settings-panel'),
    settingsTrigger: document.getElementById('settings-trigger'),
    closeBtn: document.getElementById('close-settings'),
    inputs: {
        inhale: document.getElementById('inhale-time'),
        hold: document.getElementById('hold-time'),
        exhale: document.getElementById('exhale-time')
    }
};

// 初期化
function init() {
    loadSettings();
    setupEventListeners();
    startLoop(); // TODO: 実装後に有効化
}

// 設定の読み込み
function loadSettings() {
    const saved = localStorage.getItem('mindfulness-settings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            settings = { ...DEFAULTS, ...parsed }; // マージして欠損防ぐ
        } catch (e) {
            console.error('Failed to parse settings', e);
        }
    }
    updateInputs();
}

// 設定UIへの反映
function updateInputs() {
    els.inputs.inhale.value = settings.inhale;
    els.inputs.hold.value = settings.hold;
    els.inputs.exhale.value = settings.exhale;
}

// 設定の保存
function saveSettings() {
    settings.inhale = Number(els.inputs.inhale.value) || DEFAULTS.inhale;
    settings.hold = Number(els.inputs.hold.value) || DEFAULTS.hold;
    settings.exhale = Number(els.inputs.exhale.value) || DEFAULTS.exhale;

    localStorage.setItem('mindfulness-settings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
}

// イベントリスナー設定
function setupEventListeners() {
    // 隠しトリガー（画面下部クリック）で設定を表示
    els.settingsTrigger.addEventListener('click', () => {
        els.settingsPanel.classList.remove('hidden');
        els.settingsPanel.setAttribute('aria-hidden', 'false');
    });

    // 閉じるボタン
    els.closeBtn.addEventListener('click', () => {
        saveSettings(); // 閉じる時に保存
        els.settingsPanel.classList.add('hidden');
        els.settingsPanel.setAttribute('aria-hidden', 'true');
    });

    // 入力変更時にも保存（任意）
    Object.values(els.inputs).forEach(input => {
        input.addEventListener('change', saveSettings);
    });
}

// 呼吸ループ開始
function startLoop() {
    console.log('Loop started');
    runLoop('inhale');
}

// ループ実行関数（再帰的）
function runLoop(phase) {
    // 次のフェーズと時間を決定
    let durationSec = 0;
    let text = '';
    let nextPhase = '';

    switch (phase) {
        case 'inhale':
            durationSec = settings.inhale;
            text = '吸';
            nextPhase = 'hold';
            break;
        case 'hold':
            durationSec = settings.hold;
            text = '止';
            nextPhase = 'exhale';
            break;
        case 'exhale':
            durationSec = settings.exhale;
            text = '吐';
            nextPhase = 'inhale';
            break;
    }

    // UI更新
    updateDisplay(text, phase, durationSec);

    // 次のフェーズへ（秒数をミリ秒に変換）
    setTimeout(() => {
        runLoop(nextPhase);
    }, durationSec * 1000);
}

// 画面表示の更新
function updateDisplay(text, phase, duration) {
    const display = els.display;

    // 一旦非表示にしてフェードアウト効果（必要に応じて調整）
    // 今回はシンプルなテキスト切り替えとCSSトランジションに任せる

    // テキスト更新
    display.textContent = text;

    // クラスのリセットと適用
    display.className = ''; // 既存クラス全削除
    display.classList.add('active'); // 表示用
    display.classList.add(`phase-${phase}`); // フェーズ別スタイル用（色やサイズ用）

    // トランジション時間を動的に設定（フェーズの長さに合わせる場合など）
    // CSS変数をJSから操作して、アニメーション時間を同期させる
    document.documentElement.style.setProperty('--current-duration', `${duration}s`);
}

// 起動
document.addEventListener('DOMContentLoaded', init);
