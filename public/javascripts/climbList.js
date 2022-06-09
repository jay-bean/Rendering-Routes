// const editBtns = document.querySelectorAll('.edit-list-btn')

// for (let i =0; i< editBtns.length; i++) {
//     const btn = editBtns[i];
//     btn.addEventListener('click', async (e)=>{
//         e.preventDefault()
//         const userId = e.target.dispatchEvent.split('-')[2]

//         const res = await fetch(`/${userId}/climb-list`, {
//             method: 'PATCH',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//                 haveClimbed
//             })
//         })

//         const data = await res.json()

//     })
// }
