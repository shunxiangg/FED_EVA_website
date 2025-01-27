document.getElementById('sellForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // added alert to let users know 
    alert('Item listed successfully!');
});

document.getElementById('photoUpload').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.upload-box').style.backgroundImage = `url(${e.target.result})`;
            document.querySelector('.upload-box span').style.display = 'none';
        }
        reader.readAsDataURL(e.target.files[0]);
    }
});