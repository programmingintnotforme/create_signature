const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const scale = canvas.offsetWidth / canvas.width;
ctx.scale(scale, 1);
let isDrawing = false;

function getOffset(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.touches ? event.touches[0].clientX : event.clientX) - rect.left,
    y: (event.touches ? event.touches[0].clientY : event.clientY) - rect.top,
  };
}

function startDrawing(event) {
  isDrawing = true;
  ctx.beginPath();
  const { x, y } = getOffset(event);
  ctx.moveTo(x, y);
}

function draw(event) {
  if (!isDrawing) return;
  const { x, y } = getOffset(event);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

canvas.addEventListener("touchstart", (event) => {
  event.preventDefault();
  startDrawing(event);
});
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  draw(event);
});
canvas.addEventListener("touchend", (event) => {
  event.preventDefault();
  stopDrawing();
});
canvas.addEventListener("touchcancel", (event) => {
  event.preventDefault();
  stopDrawing();
});

document.getElementById("saveButton").addEventListener("click", (event) => {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  const dataURL = canvas.toDataURL("image/png");

  // Cria um link temporário para download
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "assinatura.png"; // Nome do arquivo a ser baixado

  // Simula um clique no link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Remove o link do DOM

  document.getElementById(
    "signature"
  ).value = `<img src="${dataURL}" alt="Assinatura do Cliente">`;
  // Comente a próxima linha se não precisar enviar o formulário
  // document.getElementById("signatureForm").submit();
});

document.getElementById("clearButton").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("signature").value = "";
});
