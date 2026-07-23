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
const deleteRecordBtn = document.getElementById('deleteRecordBtn');

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
    createForm.onsubmit = async (event) => {
      event.preventDefault();
      
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
      } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
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
        
        const recordIndex = allRecords.findIndex(record => record._id === currentRecord._id);
        if (recordIndex !== -1) {
          allRecords[recordIndex] = updatedRecord;
          renderRecords(allRecords);
          renderDetailDOM(updatedRecord);
        }
        
        history.back();
      } catch (error) {
        console.error('Ошибка при обновлении записи:', error);
      }
    };
  }

  if (deleteRecordBtn) {
    deleteRecordBtn.onclick = async () => {
      if (!currentRecord) return;

      if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

      try {
        await axios.delete(`/records/${currentRecord._id}`);

        allRecords = allRecords.filter(record => record._id !== currentRecord._id);
        renderRecords(allRecords);

        history.back();
      } catch (error) {
        console.error('Ошибка при удалении записи:', error);
      }
    };
  }
});

window.addEventListener('popstate', (event) => {
  if (event.state) {
    if (event.state.recordId) {
      const foundRecord = allRecords.find(record => record._id === event.state.recordId);
      if (foundRecord) {
        renderDetailDOM(foundRecord);
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
        const foundRecord = allRecords.find(record => record._id === history.state.recordId);
        if (foundRecord) renderDetailDOM(foundRecord);
        else renderListDOM();
      } else if (history.state?.view === 'add') {
        renderAddDOM();
      } else {
        renderRecords(allRecords);
        renderListDOM();
      }
    }
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
  }
}

function renderRecords(records) {
  recordsList.innerHTML = '';
  records.forEach(record => {
    const listItem = document.createElement('li');
    const author = record.name || record.author || record.user || 'Неизвестно';
    const title = record.title || 'Без названия';
    
    listItem.innerHTML = `<strong>${author}</strong> <small>${title}</small>`;
    listItem.onclick = () => openRecordDetail(record);
    recordsList.appendChild(listItem);
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