// Função para processar Markdown com suporte a callouts
function processMarkdown(markdown) {
  const calloutRegex = /> \[!(\w+)\]\s*\n>(.*)/g;
  let processedMarkdown = markdown.replace(calloutRegex, (match, type, content) => {
      const className = type.toLowerCase();
      return `<blockquote class="${className}"><strong>${type}</strong><br>${content}</blockquote>`;
  });
  return marked.parse(processedMarkdown);
}

// Atualizar a prévia em tempo real
const markdownInput = document.getElementById('markdownInput');
const preview = document.getElementById('preview');

markdownInput.addEventListener('input', () => {
  const markdownText = markdownInput.value;
  preview.innerHTML = processMarkdown(markdownText);
});

// Carregar arquivo .md
document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          markdownInput.value = e.target.result;
          preview.innerHTML = processMarkdown(e.target.result);
      };
      reader.readAsText(file);
  }
});

// Modal de exportação
const exportModal = document.getElementById('exportModal');
const scaleSlider = document.getElementById('scale');
const scaleValue = document.getElementById('scaleValue');

scaleSlider.addEventListener('input', () => {
  scaleValue.textContent = `${scaleSlider.value}%`;
});

function openExportModal() {
  exportModal.style.display = 'flex';
}

function closeExportModal() {
  exportModal.style.display = 'none';
}

// Exportar para PDF com configurações
function exportToPDF() {
  const element = document.getElementById('preview');
  const pageSize = document.getElementById('pageSize').value;
  const orientation = document.getElementById('orientation').value;
  const margin = parseFloat(document.getElementById('margin').value);
  const scale = parseFloat(scaleSlider.value) / 100;

  // Clonar o elemento para ajustar o estilo no PDF
  const clone = element.cloneNode(true);
  clone.style.background = 'white';
  clone.style.border = 'none';
  clone.style.padding = '20px';
  clone.style.height = 'auto';

  // Forçar a cor do texto para preto, exceto em elementos específicos
  const allElements = clone.querySelectorAll('h1, h2, h3, p, li, ul, ol');
  allElements.forEach(el => {
      el.style.color = '#000';
  });

  // Garantir que o código e os títulos dos alertas mantenham suas cores
  const codeElements = clone.querySelectorAll('code');
  codeElements.forEach(el => {
      el.style.color = '#d63384';
      el.style.background = '#f0f0f0';
  });

  const preElements = clone.querySelectorAll('pre');
  preElements.forEach(el => {
      el.style.background = '#f0f0f0';
  });

  const noteStrong = clone.querySelectorAll('.note strong');
  noteStrong.forEach(el => {
      el.style.color = '#6ab0de';
  });

  const tipStrong = clone.querySelectorAll('.tip strong');
  tipStrong.forEach(el => {
      el.style.color = '#3c763d';
  });

  const importantStrong = clone.querySelectorAll('.important strong');
  importantStrong.forEach(el => {
      el.style.color = '#a626a4';
  });

  const warningStrong = clone.querySelectorAll('.warning strong');
  warningStrong.forEach(el => {
      el.style.color = '#f0ad4e';
  });

  const cautionStrong = clone.querySelectorAll('.caution strong');
  cautionStrong.forEach(el => {
      el.style.color = '#d9534f';
  });

  const opt = {
      margin: margin,
      filename: 'markdown_export.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 * scale, backgroundColor: '#fff' },
      jsPDF: { unit: 'in', format: pageSize, orientation: orientation }
  };

  html2pdf().set(opt).from(clone).save();
  closeExportModal();
}

// Exemplo inicial com o conteúdo fornecido
markdownInput.value = `## Código em linha

Para salvar as alterações da versão usamos:
- \`git add\`: Adiciona os arquivos para o commit
- \`git commit -m ""\`: Para escrever a mensagem do commit
- \`git push\`: Para enviar o commit para o servidor.

> [!NOTE]
> Uma observação ou comentários especiais sobre o documento.
> [!TIP]
> Uma dica de como usar a ferramenta.
> [!IMPORTANT]
> Uma mensagem importante que precisamos chamar atenção do usuário.
> [!WARNING]
> Um aviso, normalmente associado a algo que pode representar um risco ou causar algum erro.
> [!CAUTION]
> Um aviso de perigo, quando uma determinada ação pode representar um risco para o usuário ou dispositivo.`;
preview.innerHTML = processMarkdown(markdownInput.value);