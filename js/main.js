document.addEventListener('DOMContentLoaded', function () {

    var navigationLastChild = document.querySelector('.navigation li:last-child');
    var mobileNavSpan = document.querySelector('.mobile-nav span');

    // Toggling navigation menu
    if (navigationLastChild) {
        navigationLastChild.addEventListener('click', function () {
            var closedMenu = document.querySelector('.closed-menu');
            if (closedMenu) {
                closedMenu.classList.remove('closed-menu');
                closedMenu.classList.add('open-menu');
            }
        });
    }

    // Toggling mobile navigation span to open menu
    if (mobileNavSpan) {
        mobileNavSpan.addEventListener('click', function () {
            var openMenu = document.querySelector('.open-menu');
            if (openMenu) {
                openMenu.classList.remove('open-menu');
                openMenu.classList.add('closed-menu');
            }
        });
    }

    // Closing open menu when clicking any item in .mobile-nav ul
    var mobileNavLinks = document.querySelectorAll('.mobile-nav ul a');
    mobileNavLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var openMenu = document.querySelector('.open-menu');
            if (openMenu) {
                openMenu.classList.remove('open-menu');
                openMenu.classList.add('closed-menu');
            }
        });
    });

});

