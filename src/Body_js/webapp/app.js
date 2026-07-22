const recordsList = document.getElementById('recordsList');
const listView = document.getElementById('listView');
const addView = document.getElementById('addView');
const detailView = document.getElementById('detailView');

const openAddViewBtn = document.getElementById('openAddViewBtn');
const backFromAddBtn = document.getElementById('backFromAddBtn');
const backButton = document.getElementById('backButton');

const authorName = document.getElementById('authorName');
const recordTitle = document.getElementById('recordTitle');
const modalContent = document.getElementById('modalContent');
const modalEditButton = document.getElementById('modalEditButton');
const editForm = document.getElementById('editForm');
const editTitleInput = document.getElementById('editTitleInput');
const editContentInput = document.getElementById('editContentInput');
const saveEditButton = document.getElementById('saveEditButton');

const createForm = document.getElementById('createForm');
const newAuthorInput = document.getElementById('newAuthorInput');
const newTitleInput = document.getElementById('newTitleInput');
const newContentInput = document.getElementById('newContentInput');

let currentRecord = null;
let allRecords = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchRecords();

  if (openAddViewBtn) {
    openAddViewBtn.onclick = () => {
      history.pushState({ view: 'add' }, '', '?action=add');
      renderAddDOM();
    };
  }

  if (backFromAddBtn) {
    backFromAddBtn.onclick = () => {
      history.back();
    };
  }

  if (createForm) {
    createForm.onsubmit = async (e) => {
      e.preventDefault();
      
      const newRecord = {
        name: newAuthorInput.value.trim(),
        title: newTitleInput.value.trim(),
        content: newContentInput.value.trim()
      };

      try {
        await axios.post('/records', newRecord);
        createForm.reset();
        await fetchRecords();
        history.back();
      } catch (err) {
        console.error('Ошибка при создании пользователя:', err);
      }
    };
  }

  if (backButton) {
    backButton.onclick = () => {
      history.back();
    };
  }

  if (modalEditButton) {
    modalEditButton.onclick = () => {
      editTitleInput.value = currentRecord.title || '';
      editContentInput.value = currentRecord.content || '';
      editForm.style.display = 'block';
    };
  }

  if (saveEditButton) {
    saveEditButton.onclick = async () => {
      if (!currentRecord) return;

      const newTitle = editTitleInput.value.trim();
      const newContent = editContentInput.value.trim();

      try {
        const response = await axios.put(`/records/${currentRecord._id}`, {
          title: newTitle,
          content: newContent
        });
        
        const updatedRecord = response.data.data.record;
        
        const index = allRecords.findIndex(r => r._id === currentRecord._id);
        if (index !== -1) {
          allRecords[index] = updatedRecord;
          renderRecords(allRecords);
          renderDetailDOM(updatedRecord);
        }
        
        history.back();
      } catch (err) {
        console.error('Ошибка при обновлении записи:', err);
      }
    };
  }
});

window.addEventListener('popstate', (event) => {
  if (event.state) {
    if (event.state.recordId) {
      const record = allRecords.find(r => r._id === event.state.recordId);
      if (record) {
        renderDetailDOM(record);
        return;
      }
    } else if (event.state.view === 'add') {
      renderAddDOM();
      return;
    }
  }
  renderListDOM();
});

async function fetchRecords() {
  try {
    const response = await axios.get('/records');
    
    const recordsData = response.data?.data?.records || response.data?.records || response.data;
    
    if (Array.isArray(recordsData)) {
      allRecords = recordsData;
      
      if (history.state?.recordId) {
        const record = allRecords.find(r => r._id === history.state.recordId);
        if (record) renderDetailDOM(record);
        else renderListDOM();
      } else if (history.state?.view === 'add') {
        renderAddDOM();
      } else {
        renderRecords(allRecords);
        renderListDOM();
      }
    }
  } catch (err) {
    console.error('Ошибка при получении записей:', err);
  }
}

function renderRecords(records) {
  recordsList.innerHTML = '';
  records.forEach(record => {
    const li = document.createElement('li');
    const author = record.name || record.author || record.user || 'Неизвестно';
    const title = record.title || 'Без названия';
    
    li.innerHTML = `<strong>${author}</strong> <small>${title}</small>`;
    li.onclick = () => openRecordDetail(record);
    recordsList.appendChild(li);
  });
}

function openRecordDetail(record) {
  history.pushState({ recordId: record._id }, '', `?id=${record._id}`);
  renderDetailDOM(record);
}

function renderDetailDOM(record) {
  currentRecord = record;
  authorName.textContent = record.name || record.author || record.user || 'Неизвестно';
  recordTitle.textContent = record.title || 'Без названия';
  modalContent.textContent = record.content || '';
  
  editForm.style.display = 'none';
  listView.style.display = 'none';
  addView.style.display = 'none';
  detailView.style.display = 'block';
}

function renderAddDOM() {
  listView.style.display = 'none';
  detailView.style.display = 'none';
  addView.style.display = 'block';
}

function renderListDOM() {
  detailView.style.display = 'none';
  addView.style.display = 'none';
  listView.style.display = 'block';
}