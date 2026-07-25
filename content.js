// Content script injected into Google Vids pages (V3.10 - 切り替えリトライ＆デバッグ機能強化版)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "inject_script") {
    const scriptText = request.text;
    injectTextToGoogleVids(scriptText).then(success => {
      sendResponse({ success: success });
    });
    return true;
  } else if (request.action === "auto_inject") {
    const scenes = request.scenes;
    runAutoInjection(scenes).then(success => {
      sendResponse({ success: success });
    }).catch(err => {
      console.error("全自動入力中にエラー発生:", err);
      sendResponse({ success: false, error: err.message });
    });
    return true; 
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
  const sidebar = document.querySelector('.appsFlixScriptsSidebarWorkspacePlaceholder')?.parentElement?.parentElement || 
                  document.querySelector('.appsFlixScriptsSidebarWorkspace')?.parentElement ||
                  document.querySelector('[role="complementary"]');
  
  if (sidebar) {
    const iframe = sidebar.querySelector('.docs-texteventtarget-iframe');
    if (iframe) return iframe;
  }

  const iframes = Array.from(document.querySelectorAll('.docs-texteventtarget-iframe'));
  if (iframes.length > 0) return iframes[iframes.length - 1];

  return null;
}

// 既存シーンの文字をクリアして台本を流し込む
async function injectTextToGoogleVids(text) {
  let placeholder = document.querySelector('.appsFlixScriptsSidebarWorkspacePlaceholder');
  if (placeholder) {
    placeholder.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    placeholder.click();
    placeholder.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await sleep(1000); 
  }

  const iframe = getNarrationIframe();
  
  if (iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeWindow = iframe.contentWindow;
      
      iframe.focus();
      iframeWindow.focus();
      iframeDoc.body.focus();
      await sleep(200);

      // 既存の文字を削除 (Ctrl+A & Backspace)
      iframeDoc.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true }));
      iframeDoc.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', ctrlKey: true, bubbles: true }));
      iframeDoc.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', keyCode: 8, bubbles: true }));
      iframeDoc.body.dispatchEvent(new KeyboardEvent('keyup', { key: 8, bubbles: true }));
      await sleep(200);

      // ペースト
      triggerPaste(iframeDoc.body, text);
      if (iframeDoc.activeElement && iframeDoc.activeElement !== iframeDoc.body) {
        triggerPaste(iframeDoc.activeElement, text);
      }
      triggerPaste(iframe, text);

      // フィードバック用に一時的に枠線を緑に光らせる
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

  // フォールバック
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
  
  for (let attempt = 0; attempt < 20; attempt++) {
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
      await sleep(2000); // 描画ラグ対策で少し長めに待機
    } else {
      console.error("新しいシーンボタンが見つかりません。");
      return false;
    }
  }
  return false;
}

// 指定したシーンをアクティブに切り替える (フォーカス + Spaceキー、リトライ＆ロギング強化)
async function changeScene(sceneNum) {
  // DOMの更新ラグに備えて、最大3回リトライする
  for (let attempt = 0; attempt < 3; attempt++) {
    const rects = Array.from(document.querySelectorAll('rect[aria-label]'));
    const targetRect = rects.find(rect => {
      const label = rect.getAttribute('aria-label') || '';
      // "シーン 2", "Scene 2", "2/6" などに幅広くマッチさせる
      const match = label.match(/(?:シーン|Scene)\s*(\d+)/i) || label.match(/^(\d+)\/\d+/);
      const parsedNum = match ? parseInt(match[1]) : null;
      return parsedNum === sceneNum;
    });

    if (targetRect) {
      console.log(`シーン ${sceneNum} に切り替えます (aria-label: "${targetRect.getAttribute('aria-label')}")`);
      targetRect.focus();
      targetRect.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
      targetRect.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, bubbles: true }));
      await sleep(1800); // 画面更新待機
      return true;
    }
    
    console.warn(`⚠️ シーン ${sceneNum} の要素がまだ見つかりません。再試行します... (${attempt + 1}/3)`);
    await sleep(1000); // 同期を待つ
  }

  // 完全に失敗した場合、デバッグ用に現在存在するすべての rect のラベルをコンソールに出力する
  console.error(`❌ シーン ${sceneNum} のタイムライン要素が見つかりませんでした。`);
  const allLabels = Array.from(document.querySelectorAll('rect[aria-label]')).map(r => r.getAttribute('aria-label'));
  console.log("現在タイムライン上に存在する rect のラベル一覧:", allLabels);

  return false;
}

// 全自動入力処理のメインループ
async function runAutoInjection(scenes) {
  console.log("🎬 全自動流し込みプロセス開始...");
  
  // 1. シーンを自動で増やす
  const successAdd = await addScenesUntil(scenes.length);
  if (!successAdd) {
    throw new Error("スライドの自動追加に失敗しました。");
  }

  // スライド生成完了後、タイムライン全体のDOMが落ち着くまで2秒待機
  console.log("スライド自動生成完了。DOMの安定化をお待ちください...");
  await sleep(2000);

  // 2. シーン1へ一度戻す
  console.log("シーン 1 へ切り替えます...");
  const successGoToOne = await changeScene(1);
  if (!successGoToOne) {
    throw new Error("シーン 1 への復帰に失敗しました。");
  }
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
