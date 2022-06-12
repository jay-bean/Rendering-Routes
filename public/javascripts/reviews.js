const addAReviewButton = document.querySelector('#review-post-button');
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
            newReview.id = 'single-review';

            newReview.innerHTML = `
            <h4 id='single-review-title'>${data.review.title}</h4>
            <p id='single-review-rating'>Rating: ${data.review.rating}/5</p>
            <p id='description-review'>${data.review.description}</p>
            `

            const reviewContainer = document.querySelector('#review-container');
            reviewContainer.prepend(newReview);


            const titleEle = document.querySelector(`#title-of-review`);
            const descriptionEle = document.querySelector(`#description-of-review`);
            const noCurrentReviewsEle = document.querySelector(`#no-reviews`);
            errorContainer.innerHTML = ``;
            titleEle.value = '';
            descriptionEle.value = '';
            if (noCurrentReviewsEle) noCurrentReviewsEle.innerHTML = '';
        } else {
            data.errors.forEach((error) => {
                errorContainer.innerHTML += `<li>${error}</li>`
            })
        }
    })

}

const editReviewButtons = document.querySelectorAll('.edit-review-btn');

if (editReviewButtons) {
    const splitURL = document.URL.split('/');
    const userId = splitURL[4];

    for (let i = 0; i < editReviewButtons.length; i++) {
        const btn = editReviewButtons[i];

        btn.addEventListener('click', (e) => {
            const postId = e.target.id.split('-')[2];
            const form = document.querySelector(`#edit-review-form-${postId}`);
            const reviewContainer = document.querySelector(`#individual-review-${postId}`);

            if (form.classList.contains('hidden')) {
                form.classList.remove('hidden');
                reviewContainer.classList.add('hidden');
                btn.innerText = "Cancel"
            } else {
                form.classList.add('hidden')
                reviewContainer.classList.remove('hidden');
                btn.innerText = "Edit"
            }
        });
    }

    const submitEditReview = document.querySelectorAll(`.edit-review-submit`)

    if (submitEditReview) {
        for (let i = 0; i < submitEditReview.length; i++) {
            const btn = submitEditReview[i];
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const reviewId = e.target.id.split('-')[3];
                const title = document.querySelector(`#edit-review-title-${reviewId}`).value
                const description = document.querySelector(`#edit-review-description-${reviewId}`).value
                const rating = document.querySelector(`#edit-review-rating-${reviewId}`).value

                const res = await fetch(`/users/${userId}/reviews`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        title,
                        description,
                        rating,
                        reviewId
                    })
                });

                const reviewContainer = document.querySelector(`#individual-review-${reviewId}`);
                const form = document.querySelector(`#edit-review-form-${reviewId}`);

                const data = await res.json()
                const errorContainer = document.querySelector(`#review-error-container-${reviewId}`);

                if (data.message === 'Success!') {
                    const titleEle = document.querySelector(`#title-${reviewId}`);
                    const descriptionEle = document.querySelector(`#description-${reviewId}`);
                    const rating = document.querySelector(`#rating-${reviewId}`);
                    const editBtn = document.querySelector(`#edit-review-${reviewId}`);

                    titleEle.innerHTML = data.review.title;
                    descriptionEle.innerHTML = data.review.description;
                    rating.innerHTML = data.review.rating;
                    errorContainer.innerHTML = '';
                    editBtn.innerText = "Edit"

                    reviewContainer.classList.remove('hidden');
                    form.classList.add('hidden');
                } else {
                    data.errors.forEach(error => {
                        errorContainer.innerHTML += `<li>${error}</li>`;
                    });
                }
            });
        }
    }
}


const deleteReviewBtns = document.querySelectorAll('.review-delete-btn')
for (let i = 0; i < deleteReviewBtns.length; i++) {
    const btn = deleteReviewBtns[i];

    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const splitURL = document.URL.split('/');
        const userId = splitURL[4];
        const reviewId = e.target.id.split('-')[2];

        const res = await fetch(`/users/${userId}/reviews`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewId })
        })

        const data = await res.json();
        if(data.message = "Success!") {
            const container = document.getElementById(`individual-review-container-id-${reviewId}`)
            container.remove()
        }
    })

}
