// == Bookmark Snoopy Executor (Global, Black Theme) ==
(() => {
  const fontFace = new FontFace('Varela Round',
    'url(data:font/woff2;base64,d09GMgABAAAAAFUwABEAAAAA37wAAFTNAAE...)'
  );
  fontFace.load().then(f => document.fonts.add(f));

  let blobFrame = null;
  let blobFrameContainer = null;
  let isOpening = false;
  let isClosing = false;
  const STORAGE_KEY = "uBlobeBM_Global";
  let bookmarklets = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  // Open popup with Ctrl+Shift+~
  document.addEventListener("keydown", e => {
    if(e.code=="Backquote" && e.ctrlKey && e.shiftKey && !isOpening && !isClosing){
      if(blobFrame){
        closeWithAnimation(blobFrameContainer);
        blobFrame = null;
        return;
      }
      openWithAnimation();
    }
  });

  function openWithAnimation(){
    isOpening = true;
    blobFrameContainer = document.createElement("div");
    blobFrameContainer.style.cssText = `
      position: fixed;
      width: 600px;
      height: 400px;
      z-index: 999999999;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      background: #000;
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

  function closeWithAnimation(container){
    isClosing = true;
    container.style.opacity = 0;
    container.style.transform = "translate(-50%, -50%) scale(0.95)";
    setTimeout(() => { container.remove(); blobFrame=null; isClosing=false; }, 300);
  }

  function createInterface(container){
container.innerHTML = `
  <div style="padding:10px;font-family:'Varela Round',sans-serif;background:#000;color:#fff;height:100%;">
    <h2 style="margin-top:0;">Bookmark Snoopy Executor (Global)</h2>
    <input id="bm_name" placeholder="Name" style="width:100%;margin-bottom:5px;padding:5px;border:none;border-radius:4px;background:#222;color:#fff;">
    <textarea id="bm_code" placeholder="Enter JavaScript here..." style="width:100%;height:80px;padding:5px;border:none;border-radius:4px;background:#222;color:#fff;"></textarea>
    <button id="bm_add" style="width:100%;margin-top:5px;padding:6px;border:none;border-radius:4px;background:#000;color:#fff;">Add</button>
    <div id="bm_list" style="margin-top:10px;max-height:250px;overflow-y:auto;"></div>
  </div>
`;


    renderBookmarklets();

    container.querySelector("#bm_add").onclick = () => {
      const name = container.querySelector("#bm_name").value.trim();
      const code = container.querySelector("#bm_code").value.trim();
      if(!name || !code) return alert("Enter both name and code!");
      bookmarklets.push({name, code});
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarklets));
      renderBookmarklets();
      container.querySelector("#bm_name").value = "";
      container.querySelector("#bm_code").value = "";
    };

    function renderBookmarklets(){
      const list = container.querySelector("#bm_list");
      list.innerHTML = "";
      bookmarklets.forEach((bm, i) => {
        const div = document.createElement("div");
        div.style = "margin-bottom:6px;padding:5px;background:#111;border-radius:5px;";
        div.innerHTML = `
          <strong style="color:#fff;">${bm.name}</strong><br>
          <button style="margin-right:5px;background:#000;color:#0f0;border:none;border-radius:3px;padding:3px 6px;"
            onclick="try{(${bm.code})()}catch(e){alert(e)}">▶ Run</button>
          <button style="background:#f00;color:#fff;border:none;border-radius:3px;padding:3px 6px;"
            onclick="(${removeBookmarklet})(${i})">🗑 Remove</button>
        `;
        list.appendChild(div);
      });
    }

    window.removeBookmarklet = (index) => {
      bookmarklets.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarklets));
      renderBookmarklets();
    };
  }
})();
