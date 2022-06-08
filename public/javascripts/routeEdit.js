const editButton = document.querySelector('#route-edit-button');

if (editButton) {
  const splitURL = document.URL.split('/');
  const routeId = splitURL[splitURL.length - 1];
  const postInfo = document.querySelector(`#route-post-${routeId}`);
  const formInfo = document.querySelector(`#route-edit-form-${routeId}`);

  editButton.addEventListener('click', (e) => {
    if (postInfo.classList.contains('hidden')) {
      postInfo.classList.remove('hidden');
      formInfo.classList.add('hidden');
      editButton.innerText = 'Edit';
    }
    else {
      postInfo.classList.add('hidden');
      formInfo.classList.remove('hidden');
      editButton.innerHTML = 'Cancel';
    }
  });

  const submitButton = document.querySelector(`#route-edit-submit-${routeId}`);
  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = document.querySelector(`#route-${routeId}-edit-name`).value;
    const difficulty = document.querySelector(`#route-${routeId}-edit-difficulty`).value;
    const height = document.querySelector(`#route-${routeId}-edit-height`).value;
    const type = document.querySelector(`#route-${routeId}-edit-type`).value;
    const protection = document.querySelector(`#route-${routeId}-edit-protection`).value;
    const description = document.querySelector(`#route-${routeId}-edit-description`).value;
    const cragDropDown = document.getElementById(`route-${routeId}-edit-crag`);
    const crag = cragDropDown.options[cragDropDown.selectedIndex].value;
    const cragArr = crag.split('-');
    console.log(cragArr);

    const cragId = cragArr[0];
    const cragName = cragArr[1];
    console.log('cragId', cragId);
    console.log('cragN', cragName);


    const res = await fetch(`/routes/${routeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          name,
          difficulty,
          height,
          type,
          protection,
          description,
          cragName,
          cragId
      })
    });


    const data = await res.json();
    const errorContainer = document.querySelector('#route-error-container');
    if (data.message === 'Success!') {
      const nameChange = document.querySelector(`#route-${routeId}-name`);
      const difficultyChange = document.querySelector(`#route-${routeId}-difficulty`);
      const heightChange = document.querySelector(`#route-${routeId}-height`);
      const typeChange = document.querySelector(`#route-${routeId}-type`);
      const protectionChange = document.querySelector(`#route-${routeId}-protection`);
      const descriptionChange = document.querySelector(`#route-${routeId}-description`);
      const cragChange = document.querySelector(`#route-${routeId}-crag`);
      console.log('cragChange', cragChange)
      console.log('cragName2', cragName)
      nameChange.innerHTML = data.route.name;
      difficultyChange.innerHTML = data.route.difficulty;
      heightChange.innerHTML = data.route.height;
      typeChange.innerHTML = data.route.type;
      protectionChange.innerHTML = data.route.protection;
      descriptionChange.innerHTML = data.route.description;
      cragChange.innerHTML = data.cragName;


      postInfo.classList.remove('hidden');
      formInfo.classList.add('hidden');
    }
    else {
      data.errors.forEach(error => {
        errorContainer.innerHTML += `<li>${error}</li>`;
      })
    }
  });
}
