const editBtn = document.querySelector('.edit-user-btn')

if (editBtn) {
const splitURL = document.URL.split('/');
const userId = splitURL[splitURL.length-1];
const profileInfoRoutes = document.querySelector(`.the-outer-outer-routes`);
const profileInfoCrags = document.querySelector(`.the-outer-outer-crags`);
const form = document.querySelector(`#edit-form-${userId}`)

editBtn.addEventListener('click', e =>{
    if(form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        profileInfoRoutes.classList.add('hidden');
        profileInfoCrags.classList.add('hidden');
        editBtn.innerText = "Cancel"
    } else {
        form.classList.add('hidden');
        profileInfoRoutes.classList.remove('hidden');
        profileInfoCrags.classList.remove('hidden');
        editBtn.innerText = "Edit"
    }

});

const submitBtn = document.querySelector(`#edit-submit-user${userId}`)
submitBtn.addEventListener('click', async(submitEvent) => {
    submitEvent.preventDefault();

    const username = document.querySelector(`#edit-username-user${userId}`).value
    const biography = document.querySelector(`#edit-bio-user${userId}`).value
    const email = document.querySelector(`#edit-email-user${userId}`).value
    const password = document.querySelector(`#edit-password-user${userId}`).value
    const confirmPassword = document.querySelector(`#confirm-password-user${userId}`).value

    const res = await fetch(`/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            biography,
            email,
            password,
            confirmPassword
        })
    });

    const data = await res.json()
    const errorContainer = document.querySelector('#user-error-container');
    if(data.message === 'Success!') {
        const usernameEle = document.querySelector(`#username-user${userId}`)
        const bioEle = document.querySelector(`#bio-user${userId}`)

        usernameEle.innerHTML = `${data.user.username}'s Profile`;
        bioEle.innerHTML = data.user.biography;
        // errorContainer.innerHTML = '';

        profileInfo.classList.remove('hidden');
        form.classList.add('hidden');
    }
    else {
       data.errors.forEach(error => {
        errorContainer.innerHTML += `<li>${error}</li>`
       });

    }

})

}
