const editBtn = document.querySelector('.edit-user-btn')

if (editBtn) {
const splitURL = document.URL.split('/');
const userId = splitURL[splitURL.length-1];
const profileInfo = document.querySelector(`#profile-user-${userId}`)
const form = document.querySelector(`#edit-form-${userId}`)

editBtn.addEventListener('click', e =>{
    if(form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        profileInfo.classList.add('hidden');
    } else {
        form.classList.add('hidden');
        profileInfo.classList.remove('hidden');
    }
});

const submitBtn = document.querySelector(`#edit-submit-user${userId}`)
submitBtn.addEventListener('click', async(submitEvent) => {
    submitEvent.preventDefault();

    const username = document.querySelector(`#edit-username-user${userId}`).value
    const biography = document.querySelector(`#edit-bio-user${userId}`).value
    const email = document.querySelector(`#edit-email-user${userId}`).value
    const password = document.querySelector(`#edit-password-user${userId}`).value
    const confirmPassword = document.querySelector(`#edit-confirmPassword-user${userId}`).value

    const res = await fetch(`/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            biography,
            email,
            password
        })
    });

    const data = await res.json()
    if(data.message === 'Success!') {
        const usernameEle = document.querySelector(`#user-${userId}-username`)
        const emailEle = document.querySelector(`#user-${userId}-email`)
        const bioEle = document.querySelector(`#user-${userId}-bio`)

        usernameEle.innerHTML = data.user.username;
        emailEle.innerHTML = data.user.email;
        bioEle.innerHTML = data.user.biography

        profileInfo.classList.remove('hidden');
        form.classList.add('hidden');
    } else {
        //TO DO: create error
    }

})

}
