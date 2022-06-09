const splitURL = document.URL.split('/');
const userId = splitURL[3];
const editListBtns = document.querySelectorAll(`#update-route-${userId}`)
const deleteBtns = document.querySelectorAll('.delete-btn')

if(deleteBtns) {

    for (let i = 0; i < deleteBtns.length; i++) {
        const btn = deleteBtns[i];

        btn.addEventListener('click', async(e) => {
            e.preventDefault()
            btn.innerHTML = "Remove"
            // const routeId = e.target.id.split('-')[2]

            // const res = await fetch(`/${userId}/climb-list`, {
            //     method: 'DELETE'
            // })

            // const data = await res.json()
            // if (data.message = "Success!") {
            //     const container = document.getElementById(`route-container-${routeId}`)
            //     container.remove()
            // } else {

            // }
        })
    }
}
// for (let i =0; i< editListBtns.length; i++) {
//     const btn = editBtns[i];
//     btn.addEventListener('click', (e)=>{
//         // const userId = e.target.id.split('-')[2]

//         btn.innerHTML = "testchange"
//         // const res = await fetch(`/${userId}/climb-list`, {
//         //     method: 'PATCH',
//         //     headers: {'Content-Type': 'application/json'},
//         //     body: JSON.stringify({
//         //         haveClimbed
//         //     })
//         // })

//         // const data = await res.json()

//     })
// }
