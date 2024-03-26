document.addEventListener("DOMContentLoaded", function() {
  const inputText = document.getElementById("inputText");
  const outputHash = document.getElementById("outputHash");
  const generateHashBtn = document.getElementById("generateHashBtn");
  const saveHashBtn = document.getElementById("saveHashBtn");
  const downloadHashesBtn = document.getElementById("downloadHashesBtn");
  const resetBtn = document.getElementById("resetBtn");
  const savedHashesContainer = document.getElementById("savedHashes");

  let savedHashes = []; // Array to store saved hashes and texts

  generateHashBtn.addEventListener("click", function() {
    generateHash();
  });

  inputText.addEventListener("input", function() {
    generateHash();
  });

  inputText.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); 
      generateHash();
    }
  });

  saveHashBtn.addEventListener("click", function() {
    const hash = outputHash.value;
    if (hash) {
      const text = inputText.value.trim();
      saveHash(text, hash);
    } else {
      alert("No hash to save. Generate a hash first.");
    }
  });

  downloadHashesBtn.addEventListener("click", function() {
    downloadHashes();
  });

  resetBtn.addEventListener("click", function() {
    inputText.value = "";
    outputHash.value = "";
  });

  function generateHash() {
    const text = inputText.value;
    sha256(text)
      .then(hash => {
        outputHash.value = hash;
      })
      .catch(error => {
        console.error("Error generating hash:", error);
      });
  }

  function sha256(input) {
    const buffer = new TextEncoder("utf-8").encode(input);
    return crypto.subtle.digest("SHA-256", buffer).then(function(hash) {
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    });
  }

  function saveHash(text, hash) {
    savedHashes.push({ text, hash });
    const hashElement = document.createElement("div");
    hashElement.textContent = `${text} - ${hash}`;
    savedHashesContainer.appendChild(hashElement);
  }

  function downloadHashes() {
    if (savedHashes.length === 0) {
      alert("No hashes to download.");
      return;
    }

    const content = savedHashes.map(item => `${item.text} - ${item.hash}`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });

    // Create a link element to trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "saved_hashes.txt";
    downloadLink.click();
  }
});
