export const saveAddToClimbList = () => {
const input = document.querySelector('.climb-status')
    if (localStorage.getItem('climbStatus')) {
    input.value = localStorage.getItem('climbStatus')
    } else {
        localStorage.setItem('climbStatus', input.value)
    }
}
