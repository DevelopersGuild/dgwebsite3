'use strict';

/*
 require('./jqModal.min');
 $(window).load(function() {
 $('#modal').jqm({
 trigger: 'a#joinbutton'
 });
 if(window.location.hash && window.location.hash === '#join'){
 $('#modal').jqmShow()
 }
 $('#modal a').click(function() {
 $('#modal').jqmHide();
 });
 });
 */

$(document).ready(function() {
    var $owl = $(".gallery-owl-carousel");

    $owl.owlCarousel({
        loop: true
    });

    $(".next").click(function() {
        $owl.trigger('next.owl.carousel');
    });

    $(".prev").click(function() {
        $owl.trigger('prev.owl.carousel');
    });

    // tv carousel
    var $tvOwl = $(".tv-owl-carousel");
    
    $tvOwl.owlCarousel({
        loop: true,
        items: 1,
    });

    $(".tv-next").click(function() {
        $tvOwl.trigger('next.owl.carousel');
    });

    $(".tv-prev").click(function() {
        $tvOwl.trigger('prev.owl.carousel');
    });
});


window.iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
if (window.iOS) {
    // iOS doesn't support "background-attachment: fixed", and, in fact, does something weird, instead.
    //$('.fixed-background').removeClass('fixed-background');
    var backgroundElements = document.getElementsByClassName('fixed-background');
    while (backgroundElements.length)
        backgroundElements[0].classList.remove('fixed-background');
}