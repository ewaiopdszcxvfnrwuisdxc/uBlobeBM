// == uBlobeBM Global Version ==
// Everything works the same — just saves globally on all websites.

setTimeout(() => {

  const fontFace = new FontFace('Varela Round',
    'url(data:font/woff2;base64,d09GMgABAAAAAFUwABEAAAAA37wAAFTNAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGlYbvCwckQYGYACF...)'
  );
  fontFace.load().then(f => document.fonts.add(f));

  let blobFrame = null;
  let blobFrameContainer = null;
  let isOpening = false;
  let isClosing = false;

  // --- GLOBAL STORAGE KEY ---
  const STORAGE_KEY = "uBlobeBM_Global";
  let bookmarklets = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  // --- OPEN UI WITH CTRL+SHIFT+~ ---
  document.addEventListener("keydown", function (e) {
    if (e.code == "Backquote" && e.ctrlKey && e.shiftKey && !isOpening && !isClosing) {
      if (blobFrame) {
        closeWithAnimation(blobFrameContainer);
        blobFrame = null;
        return;
      }
      openWithAnimation();
    }
  });

  // --- OPEN POPUP ---
  function openWithAnimation() {
    isOpening = true;
    blobFrameContainer = document.createElement("div");
    blobFrameContainer.style.cssText = `
      position: fixed;
      width: 600px;
      height: 400px;
      z-index: 999999999;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      background: #1e1e1e;
      color: #fff;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.95);
    `;
    document.body.appendChild(blobFrameContainer);
    requestAnimationFrame(() => {
      blobFrameContainer.style.opacity = 1;
      blobFrameContainer.style.transform = "translate(-50%, -50%) scale(1)";
    });
    createInterface(blobFrameContainer);
    blobFrame = true;
    isOpening = false;
  }

  // --- CLOSE POPUP ---
  function closeWithAnimation(container) {
    isClosing = true;
    container.style.opacity = 0;
    container.style.transform = "translate(-50%, -50%) scale(0.95)";
    setTimeout(() => {
      container.remove();
      blobFrame = null;
      isClosing = false;
    }, 300);
  }

  // --- CREATE INTERFACE ---
  function createInterface(container) {
    container.innerHTML = `
      <div style="padding:10px;font-family:'Varela Round',sans-serif;">
        <h2 style="margin-top:0;">uBlobeBM (Global)</h2>
        <input id="bm_name" placeholder="Name" style="width:100%;margin-bottom:5px;padding:5px;border:none;border-radius:4px;">
        <textarea id="bm_code" placeholder="Enter JavaScript here..." style="width:100%;height:80px;padding:5px;border:none;border-radius:4px;"></textarea>
        <button id="bm_add" style="width:100%;margin-top:5px;padding:6px;border:none;border-radius:4px;background:#000;color:#fff;">Add</button>
        <div id="bm_list" style="margin-top:10px;max-height:200px;overflow-y:auto;"></div>
      </div>
    `;

    renderBookmarklets();

    container.querySelector("#bm_add").onclick = () => {
      const name = container.querySelector("#bm_name").value.trim();
      const code = container.querySelector("#bm_code").value.trim();
      if (!name || !code) return alert("Enter both name and code!");

      bookmarklets.push({ name, code });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarklets));
      renderBookmarklets();
      container.querySelector("#bm_name").value = "";
      container.querySelector("#bm_code").value = "";
    };

    function renderBookmarklets() {
      const list = container.querySelector("#bm_list");
      list.innerHTML = "";
      bookmarklets.forEach((bm, i) => {
        const div = document.createElement("div");
        div.style = "margin-bottom:6px;padding:5px;background:#000000;border-radius:5px;";
        div.innerHTML = `
          <strong>${bm.name}</strong><br>
          <button style="margin-right:5px;background:#000;color:#fff;border:none;border-radius:3px;padding:3px 6px;"
            onclick="try{(${bm.code})()}catch(e){alert(e)}">▶ Run</button>
          <button style="background:#f44336;color:#fff;border:none;border-radius:3px;padding:3px 6px;"
            onclick="(${removeBookmarklet})( ${i} )">🗑 Remove</button>
        `;
        list.appendChild(div);
      });
    }

    // Make removal function accessible
    window.removeBookmarklet = (index) => {
      bookmarklets.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarklets));
      renderBookmarklets();
    };
  }

});
