const API_URL = "http://127.0.0.1:5000";

/**
 * 🎙️ Record real WAV audio without FFmpeg
 */
async function recordWav(seconds = 5) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const ctx = new AudioContext();
  const src = ctx.createMediaStreamSource(stream);
  const proc = ctx.createScriptProcessor(4096, 1, 1);
  const chunks = [];

  proc.onaudioprocess = e => {
    const input = e.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(input));
  };

  src.connect(proc);
  proc.connect(ctx.destination);

  console.log("🎤 Recording started...");
  await new Promise(r => setTimeout(r, seconds * 1000));
  console.log("🛑 Recording stopped.");

  proc.disconnect();
  src.disconnect();
  stream.getTracks().forEach(t => t.stop());

  // Merge Float32Array chunks into one
  const totalLength = chunks.reduce((a, c) => a + c.length, 0);
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.length;
  }

  const wavBuffer = floatToWav(result, ctx.sampleRate);
  return new Blob([wavBuffer], { type: "audio/wav" });
}

/**
 * 🔊 Convert Float32 PCM → WAV format
 */
function floatToWav(float32Array, sampleRate) {
  const buffer = new ArrayBuffer(44 + float32Array.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const length = 44 + float32Array.length * 2 - 8;
  writeString(0, "RIFF");
  view.setUint32(4, length, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, float32Array.length * 2, true);

  let offset = 44;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return buffer;
}

/**
 * 📡 Send recorded audio to backend
 */
async function sendAudio(endpoint, studentId, audioBlob) {
  const form = new FormData();
  form.append("student_id", studentId);
  form.append("audio", audioBlob, "voice.wav");

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    body: form,
  });
  return response.json();
}

/**
 * 💬 Update status box
 */
function setStatus(message, success = true) {
  const box = document.getElementById("statusContainer");
  const indicator = document.getElementById("statusIndicator");
  const text = document.getElementById("statusMessage");

  box.classList.remove("hidden");
  indicator.style.background = success ? "#00ffb3" : "#ff4d4d";
  text.textContent = message;
}

/**
 * 🧍 Register voice
 */
document.getElementById("registerBtn").addEventListener("click", async () => {
  const studentId = document.getElementById("studentIdRegister").value.trim();
  if (!studentId) return alert("Please enter a Student ID!");

  setStatus("🎙️ Recording voice for registration...");
  try {
    const blob = await recordWav(7); // record 7 seconds
    setStatus("📡 Uploading voice...");
    const result = await sendAudio("register", studentId, blob);
    console.log("Server response:", result);
    setStatus(result.message, result.success);
  } catch (err) {
    console.error(err);
    setStatus("❌ Recording or upload failed: " + err.message, false);
  }
});

/**
 * ✅ Verify voice
 */
document.getElementById("verifyBtn").addEventListener("click", async () => {
  const studentId = document.getElementById("studentIdVerify").value.trim();
  if (!studentId) return alert("Please enter a Student ID!");

  setStatus("🎧 Recording voice for verification...");
  try {
    const blob = await recordWav(7); // record 7 seconds
    setStatus("📡 Uploading voice...");
    const result = await sendAudio("verify", studentId, blob);
    console.log("Server response:", result);
    setStatus(result.message, result.success);
  } catch (err) {
    console.error(err);
    setStatus("❌ Recording or upload failed: " + err.message, false);
  }
});
/**
 * ✅ Verify voice and redirect to exam page
 */
document.getElementById("verifyBtn").addEventListener("click", async () => {
  const studentId = document.getElementById("studentIdVerify").value.trim();
  if (!studentId) return alert("Please enter a Student ID!");

  setStatus("🎧 Recording voice for verification...");
  try {
    const blob = await recordWav(7); // record 7 seconds
    setStatus("📡 Uploading voice...");
    const result = await sendAudio("verify", studentId, blob);
    console.log("Server response:", result);
    setStatus(result.message, result.success);

    // ✅ Redirect to exam page if verification successful
    if (result.success) {
      setTimeout(() => {
        localStorage.setItem("student_id", studentId);
        window.location.href = "exam.html";
      }, 2000);
    }
  } catch (err) {
    console.error(err);
    setStatus("❌ Recording or upload failed: " + err.message, false);
  }
});
