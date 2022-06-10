const addAReviewButton = document.querySelector('#review-post-button')
if (addAReviewButton) {
    addAReviewButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const title = document.querySelector('#title-of-review').value;
        const description = document.querySelector('#description-of-review').value;
        const rating = document.querySelector('#rating-of-review').value;
        const userId = document.querySelector('#reviews-hidden-user').value;
        const routeId = document.querySelector('#reviews-hidden-route').value;

        const res = await fetch('/routes/reviews', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                rating,
                userId,
                routeId
            })
        })

        const data = await res.json();
        const errorContainer = document.querySelector('#review-error-container');
        if (data.message === 'Success!') {
            const newReview = document.createElement('div');
            newReview.innerHTML = `
            <p>${data.review.title}</p>
            <p>${data.review.rating}</p>
            <p>${data.review.description}</p>
            `

            const reviewContainer = document.querySelector('#review-container');
            reviewContainer.prepend(newReview);


            const titleEle = document.querySelector(`#title-of-review`);
            const descriptionEle = document.querySelector(`#description-of-review`);
            errorContainer.innerHTML = ``;
            titleEle.value = '';
            descriptionEle.value = '';
        } else {
            data.errors.forEach((error) => {
                errorContainer.innerHTML += `<li>${error}</li>`
            })
        }
    })

}

// const editReviewButtons = document.querySelectorAll('.edit-review-btn');

// if (editReviewButtons) {
//     const splitURL = document.URL.split('/');
//     const userId = splitURL[4];
//     const reviewsInfo = document.querySelectorAll('.individual-review-container')
//     const form = document.querySelector(`#edit-review-form-${userId}`)

//     for (let i = 0; i < editReviewButtons.length; i++) {
//         const btn = editReviewButtons[i];

//         btn.addEventListener('click', (e)=> {
//         if(form.classList.contains('hidden')) {
//             form.classList.remove('hidden');
//             btn.innerText = "Cancel"
//         } else {
//             form.classList.add('hidden')
//             btn.innerText = "Edit Review"
//         }


//         })
//     }

// const submitEditReview = document.querySelector(`.edit-review-submit`)
//     submitEditReview.addEventListener('click', async (e) => {
//         e.preventDefault();
//         const reviewIdDiv = document.querySelector('div.hidden').id
//         const reviewId = reviewIdDiv.split('-')[2]
//         const splitURL = document.URL.split('/');
//         const userId = splitURL[4];
//         const form = document.querySelector(`#edit-review-form-${userId}`)
//         const title = document.querySelector(`#edit-review-title-${reviewId}`).value
//         const description = document.querySelector(`#edit-review-description-${reviewId}`).value
//         const rating = document.querySelector(`#edit-review-rating-${reviewId}`).value

//         const res = await fetch(`/users/${userId}/reviews`, {
//             method: 'PATCH',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//                 title,
//                 description,
//                 rating,
//                 reviewId
//             })
//         });

//         const data = await res.json()
//         const errorContainer = document.querySelector('review-error-container')
//         if(data.message === 'Success!') {
//             const titleEle = document.querySelector(`#title-${reviewId}`)
//             const descriptionEle = document.querySelector(`#description-${reviewId}`)
//             const ratingEle = document.querySelector(`#rating-${reviewId}`)

//             titleEle.innerHTML = data.review.title;
//             descriptionEle.value = data.review.desription;
//             ratingEle.innerHTML = data.review.rating;
//             // errorContainer.innerHTML = ""

//             form.classList.add('hidden')
//         } else {
//             data.errors.forEach(error => {
//                 errorContainer.innerHTML += `<li>${error}</li>`
//                });
//         }

//     })
// }

const deleteReviewBtns = document.querySelectorAll('.review-delete-btn')
for (let i = 0; i < deleteReviewBtns.length; i++) {
    const btn = deleteReviewBtns[i];

    btn.addEventListener('click', async (e) => {
        e.preventDefault()
        const splitURL = document.URL.split('/');
        const userId = splitURL[4];
        const reviewIdDiv = document.querySelector('div.hidden').id
        const reviewId = reviewIdDiv.split('-')[2]

        const res = await fetch(`/users/${userId}/reviews`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewId })
        })

        const data = await res.json();
        if(data.message = "Success!") {
            const container = document.getElementById(`single-review-container-${reviewId}`)
            container.remove()
        } 
    })

}
