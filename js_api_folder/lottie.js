document.addEventListener("DOMContentLoaded", function () {
    // Check if user came from login or signup
    const prevPage = document.referrer;

    console.log('Need to wait');
    setTimeout(function () {
        console.log('setting window location');
        // Redirect based on previous page
        if (prevPage.includes('login.html')) {
            window.location.href = 'home.html';
        } else if (prevPage.includes('signup.html')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'index.html'; //go default page either signup or main index.html
        }
    }, 1200);

});

