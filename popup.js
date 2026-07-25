// Google Vids Script Injector Popup Logic (V3.6 - 全自動流し込み対応版)

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
1980年代後半、パソコンやワープロが普及し始めた当初、「タイピングが早いこと」や「PCのコマンドを暗記していること」は、それだけで特別な技能でした。[pause 2.0s]
しかし、若者がキーボードをスラスラ打てるようになり、Windowsが登場して誰でも操作できるようになると、どうなったでしょうか？[pause 2.0s]
『単にパソコンが触れるだけの人の価値は、一瞬でゼロになった！』のです。[pause 2.5s]
その後に評価されるようになったのはどんな人でしたか？[pause 1.5s]
そう、パソコンを使って「営業の仕組み」を作れる人や、Excelを使って「経営や予算の管理」ができる人でした。[pause 2.0s]
つまり、技術が普及すると「機械の操作方法を知っていること」の価値は暴落し、『その技術を使って仕事の価値を生み出せること』に価値が移動するのです。[pause 2.5s]
最新のAIは、人間が多少あいまいに話しかけても、文脈を汲み取って返事をしてくれるようになっています。[pause 1.5s] マニアックな命令文を覚えなくても、友達に話しかけるように「これ、いい感じにまとめておいて」と言えば、AIが勝手に意図を理解してくれる時代がすぐそこまで来ています。[pause 2.0s]
つまり、『プロンプトの書き方テクニック』の価値は、これから急速に暴落するのです。[pause 2.5s]
では、プロンプトが上手いだけの人が淘汰された後、次に求められるのはどんな能力でしょうか？[pause 2.0s]
それこそが、『仕事の現場を知り、AIに何を任せるか決められる能力』なのです。[pause 2.5s]
AIに指示を出す時、一番大切なのは何だと思いますか？[pause 1.5s]
綺麗な文章を入力することではありません。[pause 1.5s]
『この仕事のゴールは何か』『現場で何が問題になるか』を理解していることです。[pause 2.5s]
昭和世代のあなたならこう言えるはずです。「このお客様は信頼重視だから過去実績を強調しよう」「ここは現場の職人さんが嫌がる手順だから別の方法をAIに考えさせよう」。[pause 2.0s]
『AIは優秀な下請け・作業員であり、監督はあなた！』のです。[pause 2.5s]
今日からできる3つの実践ステップをご紹介します。[pause 2.0s]
1. 『AIへの命令文に拘らず、普段の言葉で話しかけてみる』[pause 1.5s]
2. 『この仕事の最後の責任は人間が取る！と割り切る』[pause 1.5s]
3. 『昔パソコンが来た時の、あのワクワク感を思い出す』[pause 2.5s]
パソコンが登場した時と同じように、AIも「操作技術」から「仕事への応用」へと段階が進んでいます。[pause 1.5s]
操作の速さではなく、あなたがこれまで培ってきた『人生の経験と現場の判断力』こそが、AI時代に一番求められる能力です。[pause 2.5s]
恐怖心を、好奇心に変えていこう。[pause 1.5s]
『経験に勝る力無し』―― あなたの知恵が、次の時代を作ります！[pause 2.5s]
ご視聴ありがとうございました。[pause 2.0s]`
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
しかし、歴史を知る私たち昭和世代は知っています。[pause 1.5s]
『操作ができるだけの人の価値は、やがて暴落する！』ということを。[pause 2.5s]
今日は、昔のパソコン導入の歴史を振り返りながら、なぜプロンプトが上手いだけの人が淘汰されるのか？[pause 1.5s] そして次に圧倒的に評価される昭和世代の能力とは何か？を、分かりやすく解説していきます。[pause 2.5s]`
    },
    {
      id: "scene_2",
      name: "🎬 シーン2: 歴史比較 (タイピングの価値暴落)",
      text: `まずは、昭和から平成にかけて起きた「OA化」の歴史を振り返ってみましょう。[pause 2.0s]
1980年代後半、パソコンやワープロが普及し始めた当初、「タイピングが早いこと」や「PCのコマンドを暗記していること」は、それだけで特別な技能でした。[pause 2.0s]
しかし、若者がキーボードをスラスラ打てるようになり、Windowsが登場して誰でも操作できるようになると、どうなったでしょうか？[pause 2.0s]
『単にパソコンが触れるだけの人の価値は、一瞬でゼロになった！』のです。[pause 2.5s]
その後に評価されるようになったのはどんな人でしたか？[pause 1.5s]
そう、パソコンを使って「営業の仕組み」を作れる人や, Excelを使って「経営や予算の管理」ができる人でした。[pause 2.0s]
つまり、技術が普及すると「機械の操作方法を知っていること」の価値は暴落し、『その技術を使って仕事の価値を生み出せること』に価値が移動するのです。[pause 2.5s]
道具を操作する技術は、時間が経てば必ず誰でもできるようになります。これは歴史が証明している絶対のパターンです。[pause 2.5s]`
    },
    {
      id: "scene_3",
      name: "🎬 シーン3: 現代AI (プロンプトブームの終焉)",
      text: `さあ、この歴史の法則を、今のAIブームに当てはめてみましょう。[pause 2.0s]
今、ネットや本屋に行くと「魔法のプロンプト100選」や「AIに思い通りの文章を書かせるテクニック」といった情報があふれていますよね。[pause 1.5s]
しかし、AIの進化スピードはパソコンの何十倍も早いのです。[pause 2.0s]
最新のAIは、人間が多少あいまいに話しかけても、文脈を汲み取って返事をしてくれるようになっています。[pause 1.5s] マニアックな命令文を覚えなくても、友達に話しかけるように「これ、いい感じにまとめておいて」と言えば、AIが勝手に意図を理解してくれる時代がすぐそこまで来ています。[pause 2.0s]
つまり、『プロンプトの書き方テクニック』の価値は、これから急速に暴落するのです。[pause 2.5s]
では、プロンプトが上手いだけの人が淘汰された後、次に求められるのはどんな能力でしょうか？[pause 2.0s]
それこそが、『仕事の現場を知り、AIに何を任せるか決められる能力』なのです。[pause 2.5s]`
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
// 「【シーン1】タイトル\n本文」という形式をパースして配列に変換する
function parseCustomScript(text) {
  const scenes = [];
  const regex = /【シーン\s*(\d+)】([^\n]*)/g;
  
  // セパレーターで本文を分割する
  const parts = text.split(/【シーン\s*\d+】[^\n]*/);
  // parts[0] は最初のシーン前のゴミテキストが入るためスキップする
  
  let match;
  let index = 1;
  while ((match = regex.exec(text)) !== null) {
    const num = parseInt(match[1]);
    const title = match[2].trim();
    const bodyText = parts[index] ? parts[index].trim() : "";
    
    scenes.push({
      num: num,
      title: title || `シーン ${num}`,
      text: bodyText
    });
    index++;
  }
  return scenes;
}

document.addEventListener('DOMContentLoaded', () => {
  const presetSelect = document.getElementById('script-preset');
  const presetArea = document.getElementById('preset-controls-area');
  const customArea = document.getElementById('custom-controls-area');
  
  const sceneSelect = document.getElementById('scene-select');
  const scriptText = document.getElementById('script-text');
  const injectBtn = document.getElementById('inject-btn');
  const prevBtn = document.getElementById('prev-scene-btn');
  const nextBtn = document.getElementById('next-scene-btn');
  const statusMsg = document.getElementById('status-msg');

  // カスタム用
  const customScriptText = document.getElementById('custom-script-text');
  const autoInjectBtn = document.getElementById('auto-inject-btn');

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
    if (val === 'custom') {
      presetArea.style.display = 'none';
      customArea.style.display = 'block';
      statusMsg.textContent = '';
    } else {
      presetArea.style.display = 'block';
      customArea.style.display = 'none';
      loadScenes(val);
      statusMsg.textContent = '';
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

  // 4. 全自動（シーン生成＋流し込み）処理
  autoInjectBtn.addEventListener('click', async () => {
    const rawText = customScriptText.value.trim();
    if (!rawText) {
      statusMsg.textContent = '❌ 台本をコピペしてください。';
      statusMsg.style.color = '#ff4757';
      return;
    }

    // パース実行
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

    // content.jsへ全自動実行の合図を送る
    chrome.tabs.sendMessage(tab.id, { action: "auto_inject", scenes: scenes }, (response) => {
      if (chrome.runtime.lastError) {
        statusMsg.textContent = `❌ エラー: ${chrome.runtime.lastError.message}`;
        statusMsg.style.color = '#ff4757';
      } else if (response && response.success) {
        statusMsg.textContent = `🎉 全自動流し込みが正常に完了しました！`;
        statusMsg.style.color = '#2ed573';
      } else {
        statusMsg.textContent = `❌ エラーで停止しました。詳細はVids画面を確認してください。`;
        statusMsg.style.color = '#ff4757';
      }
    });
  });
});
