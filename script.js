const textInput = document.getElementById('textInput');
const hashOutput = document.getElementById('hashOutput');
const saveHashBtn = document.getElementById('saveHashBtn');
const resetBtn = document.getElementById('resetBtn');
const hashList = document.getElementById('hashList');
const downloadHashesBtn = document.getElementById('downloadHashesBtn');

// Function to calculate SHA-256 hash
const calculateHash = (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  });
};

// Function to add a hash to the list
const addHashToList = (text, hash) => {
  const div = document.createElement('div');
  div.textContent = `${text} : ${hash}`;
  hashList.appendChild(div);
};

// Event listener for Save Hash button
saveHashBtn.addEventListener('click', async () => {
  const text = textInput.value.trim();
  if (text === '') {
    alert('Please enter some text.');
    return;
  }

  try {
    const hash = await calculateHash(text);
    hashOutput.value = hash;
    addHashToList(text, hash);
  } catch (error) {
    console.error('Error calculating hash:', error);
    alert('An error occurred while calculating the hash.');
  }
});

// Event listener for Reset button
resetBtn.addEventListener('click', () => {
  textInput.value = '';
  hashOutput.value = '';
  hashList.innerHTML = '';
});

// Event listener for Download Hashes button
downloadHashesBtn.addEventListener('click', () => {
  const hashesText = Array.from(hashList.children)
    .map(div => div.textContent)
    .join('\n');

  const blob = new Blob([hashesText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'saved_hashes.txt';
  document.body.appendChild(a);
  a.click();

  URL.revokeObjectURL(url);
  document.body.removeChild(a);
});
