export default function getParams(){
    const params = new URLSearchParams(window.location.search);
    const path = params.get('path');
    console.log('Path:', path);
    return path;
}
