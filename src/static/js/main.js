$(function () {
    $('.box-carousel').each(function () {
        var $this = $(this);
        var itemsCount = $this.data("items");
        var itemsCountPad = $this.data("itemsPad");
        var loop = !$this.data("dontLoop");
        var autoplay = !$this.data("autoPlay");

        $this.owlCarousel({

            items: (itemsCount ? itemsCount : 1),
            margin: 0,
            nav: true,
            loop: loop,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {

                    items: itemsCountPad ? itemsCountPad : (itemsCount ? itemsCount : 1)
                },
                1000: {

                    items: itemsCount ? itemsCount : 1
                }
            }
        });
    });
});