$(document).ready(function () {

  AOS.init();

$(window).scroll(function () {
    if ($(window).scrollTop() >= 120) {
        $('header .navbar').addClass('fixed-top bg-dark');
    }
    else {
        $('header .navbar').removeClass('fixed-top bg-dark');
    }
});


/* Bind Scroll */
$('.page-scroll').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top - 15)
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
});


    /* Add active to menu */
$('.navbar-nav li a').click(function (e) {
    var $this = $(this);
    $this.parent().siblings().removeClass('active').end().addClass('active');
    $(".navbar-toggle").removeClass('active');
    e.preventDefault();
});

    $(".courses-carousel").owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        smartSpeed: 500,
        dots: true,
        autoplay: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2,
                width : '50%'
            },
            1000: {
                items: 4
            }
        }
    });
    $(".client-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        autoplay: true,
        responsive: {
            0: {
                items: 2,
            },
            480: {
                items: 3,
            },
            768: {
                items: 4,
            },
            1000: {
                items: 6,
            }
        }
    });
});
