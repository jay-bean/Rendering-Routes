const addAReviewButton = document.querySelector('#review-post-button')

if (addAReviewButton) {
    addAReviewButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const title = document.querySelector('#title-of-review').value;
        const description = document.querySelector('#description-of-review').value;
        const rating = document.querySelector('#rating-of-review').value;

        const res = await fetch('/routes/reviews', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                rating
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
            reviewContainer.innerHTML += newReview;
        } else {
            data.errors.forEach((error) => {
                errorContainer.innerHTML += `<li>${error}</li>`
            })
        }
    })

}

// const editButton = document.querySelector('#route-edit-button');

// if (editButton) {
//     const splitURL = document.URL.split('/');
//     const cragId = splitURL[splitURL.length - 1];
//     const postInfo = document.querySelector(`#route-post-${route.id}`)
//     const formInfo = document.querySelector(`#route-edit-`)
// }
