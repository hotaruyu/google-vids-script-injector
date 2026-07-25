// Content script injected into Google Vids pages (V3.6 - 全自動流し込み対応版)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "inject_script") {
    // 既存の単一シーン流し込み
    const scriptText = request.text;
    const success = injectTextToGoogleVids(scriptText);
    sendResponse({ success: success });
  } else if (request.action === "auto_inject") {
    // 新規：全自動シーン追加＆流し込み
    const scenes = request.scenes;
    runAutoInjection(scenes).then(success => {
      sendResponse({ success: success });
    }).catch(err => {
      console.error("全自動入力中にエラー発生:", err);
      sendResponse({ success: false, error: err.message });
    });
    return true; // 非同期レスポンスを返すために必要
  }
  return true;
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ペーストイベントの送信
function triggerPaste(targetElement, text) {
  if (!targetElement) return;
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', text);

  const pasteEvent = new ClipboardEvent('paste', {
    clipboardData: dataTransfer,
    bubbles: true,
    cancelable: true
  });
  targetElement.dispatchEvent(pasteEvent);
}

// 正しいナレーション用 iframe を特定する
function getNarrationIframe() {
  // 1. サイドバー領域 (.appsFlixScriptsSidebarWorkspace) の中から探す
  const sidebar = document.querySelector('.appsFlixScriptsSidebarWorkspacePlaceholder')?.parentElement?.parentElement || 
                  document.querySelector('.appsFlixScriptsSidebarWorkspace')?.parentElement ||
                  document.querySelector('[role="complementary"]');
  
  if (sidebar) {
    const iframe = sidebar.querySelector('.docs-texteventtarget-iframe');
    if (iframe) return iframe;
  }

  // 2. 全 iframe のうち最後のものを取得する (キャンバス用を避けるため)
  const iframes = Array.from(document.querySelectorAll('.docs-texteventtarget-iframe'));
  if (iframes.length > 0) return iframes[iframes.length - 1];

  return null;
}

// 既存シーンの文字をクリアして台本を流し込む
async function injectTextToGoogleVids(text) {
  // 1. プレースホルダーをクリックしてエディタを活性化
  let placeholder = document.querySelector('.appsFlixScriptsSidebarWorkspacePlaceholder');
  if (placeholder) {
    placeholder.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    placeholder.click();
    placeholder.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await sleep(1000); 
  }

  // 2. ナレーション用 iframe を取得
  const iframe = getNarrationIframe();
  
  if (iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeWindow = iframe.contentWindow;
      
      iframe.focus();
      iframeWindow.focus();
      iframeDoc.body.focus();
      await sleep(200);

      // 既存の文字を削除 (Ctrl+A & Backspace のエミュレーション)
      iframeDoc.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true }));
      iframeDoc.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', ctrlKey: true, bubbles: true }));
      iframeDoc.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', keyCode: 8, bubbles: true }));
      iframeDoc.body.dispatchEvent(new KeyboardEvent('keyup', { key: 8, bubbles: true }));
      await sleep(200);

      // 各候補へペースト送信
      triggerPaste(iframeDoc.body, text);
      if (iframeDoc.activeElement && iframeDoc.activeElement !== iframeDoc.body) {
        triggerPaste(iframeDoc.activeElement, text);
      }
      triggerPaste(iframe, text);

      // フィードバック用に一時的に枠線を光らせる
      const visualContainer = document.querySelector('.appsFlixScriptsSidebarWorkspace') || placeholder;
      if (visualContainer) {
        const origBorder = visualContainer.style.outline;
        visualContainer.style.outline = '3px solid #2ed573';
        setTimeout(() => visualContainer.style.outline = origBorder, 1500);
      }

      return true;
    } catch (err) {
      console.error("iframe ペースト中にエラー:", err);
    }
  }

  // フォールバック（通常要素）
  console.log("フォールバックでの入力...");
  let targetElement = document.activeElement;
  if (!targetElement || targetElement === document.body || targetElement.tagName === 'BODY') {
    targetElement = document.querySelector('textarea, [contenteditable="true"], [role="textbox"]');
  }

  if (targetElement) {
    triggerPaste(targetElement, text);
    return true;
  }

  return false;
}

// 新しいシーンを自動追加する (目標の数に達するまで)
async function addScenesUntil(targetCount) {
  console.log(`[全自動化] 目標スライド数: ${targetCount} に向け自動生成を開始...`);
  
  for (let attempt = 0; attempt < 15; attempt++) {
    const currentCount = document.querySelectorAll('rect[aria-label*="シーン"]').length;
    console.log(`現在: ${currentCount} / 目標: ${targetCount}`);
    
    if (currentCount >= targetCount) {
      return true;
    }
    
    const addBtn = document.querySelector('[aria-label*="新しいシーン"]') || 
                    document.querySelector('[aria-label*="Ctrl+M"]');
    
    if (addBtn) {
      addBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      addBtn.click();
      addBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      await sleep(1800); // 描画ラグを考慮
    } else {
      console.error("新しいシーンボタンが見つかりません。");
      return false;
    }
  }
  return false;
}

// 指定したシーンをアクティブに切り替える (フォーカス + Spaceキー)
async function changeScene(sceneNum) {
  const rects = Array.from(document.querySelectorAll('rect[aria-label*="シーン"]'));
  const targetRect = rects.find(rect => {
    const label = rect.getAttribute('aria-label') || '';
    const match = label.match(/シーン\s*(\d+)/);
    return match && parseInt(match[1]) === sceneNum;
  });

  if (targetRect) {
    targetRect.focus();
    targetRect.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
    targetRect.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
    await sleep(1500); // 画面更新待機
    return true;
  }
  return false;
}

// 全自動入力処理のメインループ
async function runAutoInjection(scenes) {
  console.log("🎬 全自動流し込みプロセス開始...");
  
  // 1. シーンを自動で増やす
  const successAdd = await addScenesUntil(scenes.length);
  if (!successAdd) {
    throw new Error("スライドの自動追加に失敗しました。タイムラインのボタンが隠れていないか確認してください。");
  }

  // 2. シーン1へ一度戻す
  console.log("シーン 1 へ切り替えます...");
  await changeScene(1);
  await sleep(1000);

  // 3. ループで順次流し込む
  for (let i = 0; i < scenes.length; i++) {
    const script = scenes[i];
    console.log(`ステップ ${script.num}: 『${script.title}』を処理中...`);

    // シーン切り替え（シーン1より後ろの場合）
    if (script.num > 1) {
      const successChange = await changeScene(script.num);
      if (!successChange) {
        throw new Error(`シーン ${script.num} への切り替えに失敗しました。`);
      }
    }

    // ナレーション欄に入力
    const successInject = await injectTextToGoogleVids(script.text);
    if (!successInject) {
      throw new Error(`シーン ${script.num} のナレーション欄の活性化に失敗しました。`);
    }

    await sleep(1000); // 安定化ウェイト
  }

  console.log("🎉 全自動流し込みが正常に完了しました！");
  return true;
}
