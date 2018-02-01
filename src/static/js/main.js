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
            dots: true,
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


    /* ****************************** accordion ****************************** */


        var $accordWrap = $("[data-it-accord-wrap]");
        var $accordItem = $("[data-it-accord-item]");
        var $accordToggle = $("[data-it-accord-toggle]");

        $accordItem.hide();
        $accordToggle.on("click", function () {
            var x = this;
            if ($(this).next($accordItem).css("display") === "none") {
                $(this).closest("[data-it-accord-wrap]").find("[data-it-accord-item]").fadeOut(500);

                $(this).closest("[data-it-accord-wrap]").find("[data-it-sign]").removeClass("active");

            }

            $(this).next($accordItem).slideToggle(200, function () {
                //window.scrollTo(0,this.offsetTop - 200);
            });
            $(this).parent().find("[data-it-sign]").toggleClass("active");

            /* $(this).parent().find("[]").toggle();
             $(this).parent().find("[]").toggle();*/
        });


});




