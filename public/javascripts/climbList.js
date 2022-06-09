const splitURL = document.URL.split('/');
const userId = splitURL[4];
const editListBtns = document.querySelectorAll('.edit-list-btn')
const deleteBtns = document.querySelectorAll('.list-delete-btn')
const addButton = document.querySelector('#climb-list-add-button');

if (addButton) {
    const id = document.querySelector('#list-hidden-user').value;
    const curRoute = document.querySelector('#list-hidden-route').value;
    addButton.addEventListener("click", async (e) => {
        const status = document.querySelector('#climb-status-dropdown').value;
        e.preventDefault();

        const res = await fetch(`/routes/${curRoute}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status,
                userId: id,
                routeId: curRoute
            })
        })

        const data = await res.json();
    })
}

if (deleteBtns) {

    for (let i = 0; i < deleteBtns.length; i++) {
        const btn = deleteBtns[i];

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const routeId = e.target.id.split('-')[2]
            const res = await fetch(`/users/${userId}/climb-list`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ routeId })
            })

            const data = await res.json()
            if (data.message = "Success!") {
                const container = document.getElementById(`route-container-${routeId}`)
                container.remove()
            } else {

            }
        })
    }
}

if (editListBtns) {
    for (let i = 0; i < editListBtns.length; i++) {
        const editBtn = editListBtns[i];
        editBtn.addEventListener('click', async (e) => {
            const userId = e.target.id.split('-')[2]
            const routeId = e.target.id.split('-')[3]
            const haveClimbed = document.querySelector('.single-route-container').id.split("-")[0]
            const res = await fetch(`/users/${userId}/climb-list`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    haveClimbed,
                    routeId
                })
            })

            const data = await res.json()
            if (data.message = "Success!") {
                const container = document.getElementById(`route-container-${routeId}`)
                const edit = document.getElementById(`update-route-${userId}-${routeId}`)
                const div = document.querySelector(".add-here-container")
                container.remove()
                edit.remove()
                div.append(container)
            } else {

            }
        })
    }
}
