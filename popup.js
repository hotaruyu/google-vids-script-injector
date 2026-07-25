// Google Vids Script Injector Popup Logic (V3.7 - GitHub連携・全自動流し込み対応版)

const sceneData = {
  ep4: [
    {
      id: "scene_all",
      name: "🌐 [全シーン一括] フル台本 (校正済み)",
      text: `皆さん、こんにちは。昭和AIです。[pause 1.5s]
昭和の終わりから平成の始まりにかけて、会社に初めて「パソコン」や「ワープロ」が導入された日のことを覚えていますか？[pause 1.5s]
緑色の画面をにらみながら、キーボードを指一本で「い・ろ・は」と探していた同僚。[pause 1.0s] フロッピーディスクを何枚も入れ替えてデータを保存していたあの日々。[pause 2.0s]
当時、「キーボード入力が早い人」や「パソコンの操作方法を詳しく知っている人」が重宝されましたよね。[pause 1.5s]
実は今、まったく同じ現象がAIの世界で起きています。[pause 2.0s]
「AIへの上手な命令文、プロンプトの書き方」「AIツールの操作テクニック」……。[pause 1.0s] 世間では「プロンプトが書ける人はすごい！」と持て囃されています。[pause 2.0s]
しかし、歴史を知る私たち昭和世代は知っています。[pause 1.5s]
『操作ができるだけの人の価値は、やがて暴落する！』ということを。[pause 2.5s]
...`
    },
    {
      id: "scene_1",
      name: "🎬 シーン1: 冒頭 (問題提起)",
      text: `皆さん、こんにちは。昭和AIです。[pause 1.5s]
昭和の終わりから平成の始まりにかけて、会社に初めて「パソコン」や「ワープロ」が導入された日のことを覚えていますか？[pause 1.5s]
緑色の画面をにらみながら、キーボードを指一本で「い・ろ・は」と探していた同僚。[pause 1.0s] フロッピーディスクを何枚も入れ替えてデータを保存していたあの日々。[pause 2.0s]
当時、「キーボード入力が早い人」や「パソコンの操作方法を詳しく知っている人」が重宝されましたよね。[pause 1.5s]
実は今、まったく同じ現象がAIの世界で起きています。[pause 2.0s]
「AIへの上手な命令文、プロンプトの書き方」「AIツールの操作テクニック」……。[pause 1.0s] 世間では「プロンプトが書ける人はすごい！」と持て囃されています。[pause 2.0s]
...`
    }
  ],
  ep3: [
    {
      id: "scene_all",
      name: "🌐 [全シーン一括] フル台本 (校正済み)",
      text: `皆さん、こんにちは。昭和AIです。[pause 1.5s]
最近、ニュースを開けば「ChatGPT」や「生成AI」の話題ばかりですよね。[pause 1.5s]
「これからはAIの時代だ」「AIを使わない会社は生き残れない」……。[pause 1.0s] そんな言葉を聞いて、少し焦ったり、あるいは「本当にそんなに変わるのか？」と冷ややかに見ている方も多いのではないでしょうか。[pause 2.0s]
...`
    }
  ]
};

// 【台本パースロジック】
// markdownやtxtの中の「【シーン1】タイトル\n本文」という形式をパースして配列に変換する
// ※ 【シーン1】だけでなく、マークダウン見出し「# 【シーン1】」や「### シーン1」などにも柔軟に対応できるように正規表現を拡張
function parseCustomScript(text) {
  const scenes = [];
  
  // 区切り文字（【シーンX】または シーンX）を特定する
  // 例: 【シーン1】, 【シーン 1】, # 【シーン1】, ## シーン1
  const regex = /(?:[#\s]*【シーン\s*(\d+)】|[#\s]*シーン\s*(\d+))([^\n]*)/g;
  
  // 区切り文字で本文を分割
  const parts = text.split(/(?:[#\s]*【シーン\s*\d+】|[#\s]*シーン\s*\d+)[^\n]*/);
  
  let match;
  let index = 1;
  while ((match = regex.exec(text)) !== null) {
    const num = parseInt(match[1] || match[2]);
    const title = match[3] ? match[3].trim() : `シーン ${num}`;
    const bodyText = parts[index] ? parts[index].trim() : "";
    
    // ナレーション本文が空でない場合のみ追加
    if (bodyText) {
      scenes.push({
        num: num,
        title: title,
        text: bodyText
      });
    }
    index++;
  }
  return scenes;
}

// GitHubのRawコンテンツをフェッチする
async function fetchScriptFromGitHub(filename, ext) {
  // hotaruyu/hermes-agent の docs/ フォルダから取得する
  const url = `https://raw.githubusercontent.com/hotaruyu/hermes-agent/main/docs/${encodeURIComponent(filename)}${ext}`;
  console.log("GitHubから台本をダウンロード中:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ファイルのダウンロードに失敗しました (Status: ${response.status})。\nリポジトリにファイルが存在するか、公開されているかご確認ください。`);
  }
  return await response.text();
}

document.addEventListener('DOMContentLoaded', () => {
  const presetSelect = document.getElementById('script-preset');
  
  // 各モード別コンテナ
  const githubArea = document.getElementById('github-controls-area');
  const customArea = document.getElementById('custom-controls-area');
  const presetArea = document.getElementById('preset-controls-area');
  
  const sceneSelect = document.getElementById('scene-select');
  const scriptText = document.getElementById('script-text');
  const injectBtn = document.getElementById('inject-btn');
  const prevBtn = document.getElementById('prev-scene-btn');
  const nextBtn = document.getElementById('next-scene-btn');
  const statusMsg = document.getElementById('status-msg');

  // コピペ用
  const customScriptText = document.getElementById('custom-script-text');
  const autoInjectBtn = document.getElementById('auto-inject-btn');

  // GitHub用
  const githubFilename = document.getElementById('github-filename');
  const githubFileExt = document.getElementById('github-file-ext');
  const githubInjectBtn = document.getElementById('github-inject-btn');

  // 1. シーンプリセットのロード
  function loadScenes(epKey) {
    const scenes = sceneData[epKey] || [];
    sceneSelect.innerHTML = scenes.map((s, idx) => `
      <option value="${idx}">${s.name}</option>
    `).join('');
    updateText(epKey, 0);
  }

  function updateText(epKey, sceneIndex) {
    const scenes = sceneData[epKey] || [];
    const item = scenes[sceneIndex];
    if (item) {
      scriptText.value = item.text;
    }
  }

  // 初期ロード
  loadScenes('ep4');

  // 2. モード切り替え制御
  presetSelect.addEventListener('change', () => {
    const val = presetSelect.value;
    statusMsg.textContent = '';
    
    if (val === 'github') {
      githubArea.style.display = 'block';
      customArea.style.display = 'none';
      presetArea.style.display = 'none';
    } else if (val === 'custom') {
      githubArea.style.display = 'none';
      customArea.style.display = 'block';
      presetArea.style.display = 'none';
    } else {
      githubArea.style.display = 'none';
      customArea.style.display = 'none';
      presetArea.style.display = 'block';
      loadScenes(val);
    }
  });

  sceneSelect.addEventListener('change', () => {
    updateText(presetSelect.value, parseInt(sceneSelect.value));
  });

  prevBtn.addEventListener('click', () => {
    let curr = parseInt(sceneSelect.value);
    if (curr > 0) {
      curr--;
      sceneSelect.value = curr;
      updateText(presetSelect.value, curr);
    }
  });

  nextBtn.addEventListener('click', () => {
    const scenes = sceneData[presetSelect.value] || [];
    let curr = parseInt(sceneSelect.value);
    if (curr < scenes.length - 1) {
      curr++;
      sceneSelect.value = curr;
      updateText(presetSelect.value, curr);
    }
  });

  // 3. 手動（単一シーン）流し込み
  injectBtn.addEventListener('click', async () => {
    const text = scriptText.value.trim();
    const sceneName = sceneSelect.options[sceneSelect.selectedIndex].text;

    if (!text) {
      statusMsg.textContent = '❌ 台本テキストがありません。';
      statusMsg.style.color = '#ff4757';
      return;
    }

    statusMsg.textContent = '⏳ Google Vidsへ流し込み中...';
    statusMsg.style.color = '#ffa502';

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      statusMsg.textContent = '❌ 有効なタブが見つかりません。';
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "inject_script", text: text }, (response) => {
      if (chrome.runtime.lastError || !response || !response.success) {
        navigator.clipboard.writeText(text);
        statusMsg.textContent = `📋 コピー完了！ナレーション欄で Ctrl + V を押してください。`;
        statusMsg.style.color = '#2ed573';
      } else {
        statusMsg.textContent = `✅ 『${sceneName}』の注入完了！`;
        statusMsg.style.color = '#2ed573';
      }
    });
  });

  // 4. コピペ台本の全自動流し込み
  autoInjectBtn.addEventListener('click', async () => {
    const rawText = customScriptText.value.trim();
    if (!rawText) {
      statusMsg.textContent = '❌ 台本をコピペしてください。';
      statusMsg.style.color = '#ff4757';
      return;
    }

    const scenes = parseCustomScript(rawText);
    if (scenes.length === 0) {
      statusMsg.textContent = '❌ 有効な【シーン番号】の区切りが見つかりませんでした。';
      statusMsg.style.color = '#ff4757';
      return;
    }

    statusMsg.textContent = `⏳ 全自動処理を開始します... (合計 ${scenes.length} シーン)`;
    statusMsg.style.color = '#ffa502';

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      statusMsg.textContent = '❌ 有効なタブが見つかりません。';
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "auto_inject", scenes: scenes }, (response) => {
      if (chrome.runtime.lastError) {
        statusMsg.textContent = `❌ エラー: ${chrome.runtime.lastError.message}`;
        statusMsg.style.color = '#ff4757';
      } else if (response && response.success) {
        statusMsg.textContent = `🎉 全自動流し込みが正常に完了しました！`;
        statusMsg.style.color = '#2ed573';
      } else {
        statusMsg.textContent = `❌ エラーで停止しました。Vids画面を確認してください。`;
        statusMsg.style.color = '#ff4757';
      }
    });
  });

  // 5. GitHub連携での全自動流し込み
  githubInjectBtn.addEventListener('click', async () => {
    const filename = githubFilename.value.trim();
    const ext = githubFileExt.value;

    if (!filename) {
      statusMsg.textContent = '❌ ファイル名を入力してください。';
      statusMsg.style.color = '#ff4757';
      return;
    }

    statusMsg.textContent = '⏳ GitHubから台本をダウンロード中...';
    statusMsg.style.color = '#ffa502';

    try {
      // 5-1. ダウンロード実行
      const rawText = await fetchScriptFromGitHub(filename, ext);
      
      // 5-2. パース
      const scenes = parseCustomScript(rawText);
      if (scenes.length === 0) {
        statusMsg.textContent = '❌ 取得した台本に有効な【シーン番号】の区切りが見つかりません。';
        statusMsg.style.color = '#ff4757';
        return;
      }

      statusMsg.textContent = `⏳ ダウンロード成功！全自動流し込みを開始します... (${scenes.length} シーン)`;
      statusMsg.style.color = '#ffa502';

      // 5-3. 流し込み指示を送信
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        statusMsg.textContent = '❌ 有効なタブが見つかりません。';
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: "auto_inject", scenes: scenes }, (response) => {
        if (chrome.runtime.lastError) {
          statusMsg.textContent = `❌ エラー: ${chrome.runtime.lastError.message}`;
          statusMsg.style.color = '#ff4757';
        } else if (response && response.success) {
          statusMsg.textContent = `🎉 GitHubから全自動流し込みが正常に完了しました！`;
          statusMsg.style.color = '#2ed573';
        } else {
          statusMsg.textContent = `❌ エラーで停止しました。Vids画面を確認してください。`;
          statusMsg.style.color = '#ff4757';
        }
      });

    } catch (err) {
      statusMsg.textContent = `❌ ${err.message}`;
      statusMsg.style.color = '#ff4757';
    }
  });
});
