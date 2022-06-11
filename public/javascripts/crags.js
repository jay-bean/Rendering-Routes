const editButton = document.querySelector('#crag-edit-button');

if (editButton) {
    const splitURL = document.URL.split('/');
    const cragId = splitURL[splitURL.length-1];
    const postInfo = document.querySelector(`#crag-post-${cragId}`)
    const formInfo = document.querySelector(`#crag-edit-form-${cragId}`)
    const formContainer = document.querySelector(`#crag-edit-form-container`);

    // hide current details and show edit form (and viceversa)
    editButton.addEventListener('click', (e) => {
        if (editButton.innerText === 'Edit') {
            editButton.innerText = 'Cancel';
        } else {
            editButton.innerText = 'Edit';
        }

        if (postInfo.classList.contains('hidden')) {
            postInfo.classList.remove('hidden');
            formInfo.classList.add('hidden');
            formContainer.classList.add('hidden');
        } else {
            postInfo.classList.add('hidden');
            formInfo.classList.remove('hidden');
            formContainer.classList.remove('hidden');
        }
    });

    // edit the data
    const submitButton = document.querySelector(`#crag-edit-submit-${cragId}`);
    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.querySelector(`#crag-${cragId}-edit-name`).value;
        const location = document.querySelector(`#crag-${cragId}-edit-location`).value;
        const description = document.querySelector(`#crag-${cragId}-edit-description`).value;

        const res = await fetch(`/crags/${cragId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                location,
                description
            })
        });

        const data = await res.json();
        const errorContainer = document.querySelector('#crag-error-container');
        if (data.message === 'Success!') {
            const nameEle = document.querySelector(`#crag-${cragId}-name`);
            const locationEle = document.querySelector(`#crag-${cragId}-location`);
            const descriptionEle = document.querySelector(`#crag-${cragId}-description`);

            nameEle.innerHTML = data.crag.name;
            locationEle.innerHTML = data.crag.location;
            descriptionEle.innerHTML = data.crag.description;
            errorContainer.innerHTML = ``;
            editButton.innerText = 'Edit';

            postInfo.classList.remove('hidden');
            formInfo.classList.add('hidden');
            formContainer.classList.add('hidden');
        } else {
            data.errors.forEach(error => {
                errorContainer.innerHTML += `<li>${error}</li>`;
            });
        }
    });

}
