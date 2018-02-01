//$('#present_slider').gslider({slideSize: 920, autoPlay: true});
// $('#present_slider').gslider({slideSize: 880, autoPlay: true});
// $('#repair_request_form_phone').mask("+7(999)-999-99-99");

$('form').each(function(){
    this.reset();
    $(this).find('[type="text"]').removeAttr('disabled');
    $(this).find('select').removeAttr('disabled');
});

$('#messenger_form [type="button"]').on('click', function(){
    if ( !validateForm('#messenger_form') ) {
        showAlertMessage();
        return false;
    }
    $.post(
        'send.php',
        $('#messenger_form').serialize(),
        function(data){
            if ( data.code == 200 ) {
                alert('Письмо успешно отправлено. Мы свяжемся с вами в ближайшее время');
                location.reload();
            }
        },
        'json'
    );
});

$('.popup_repair_device, #repair_request_form_submit, .start-over-info-link').on('click', function() {
    var formId = $(this).data('form'),
        formFields = $(formId).serialize(),
        formFields = formFields.split('&'),
        formFieldsData = [],
        formData = new FormData(),
        $fileInput = $(formId).find('[type="file"]')[0],
        files = '',
        action = '',
        dataType = '';
    
    if ( formId == '#repair_form' ) {
        action   = 'form.php';
        dataType = 'html';
    } else {
        action = 'send.php';
        dataType = 'json';
    }
    
    if ( typeof $fileInput != 'undefined' ) {
        files = $fileInput.files;
    }
    
    if ( !validateForm(formId) ) {
        showAlertMessage();
        return false;
    }
    
    for (var i = 0, temp; i < formFields.length; i++) {
        temp = formFields[i].split('=');
        formData.append(temp[0], temp[1]);
    }

    $.each(files, function(key, value) {
        formData.append(key, value);
    });
    
    
    $.ajax({
        url: action,
        type: 'POST',
        data: formData,
        cache: false,
        dataType: dataType,
        processData: false,
        contentType: false,
        success: function(data, textStatus, jqXHR)
        {
            if ( dataType == 'html' ) {
                var myModal = new jBox('Modal', {
                    content: data,
                    closeButton: 'box',
                    onCloseComplete: function(){
                        this.destroy();
                    }
                });   
                myModal.open();
            } else if( dataType == 'json' && data.code == '200') {
                alert('Письмо успешно отправлено. Мы свяжемся с вами в ближайшее время');
                location.reload();
            }
        },
    });
});

function validateForm(formId) {
    var valid = true;
    switch(formId) {
        case '#repair_request_form':
            $(formId).find('select').each(function(index){
                if ( !$(this).is(':disabled') ) {
                    if ( $(this).val() == 'default' ) {
                        valid = false;
                    }
                }
            });
            $(formId).find('[type="text"]').not('[name="repair_reason"]').each(function(){
                if ( $(this).val() == '' || $(this).val() == 'default' ) {
                    valid = false;
                }
            });
            break;
        case '#messenger_form':
            $(formId).find('[type="text"]').each(function(){
                if ( $(this).val() == '' ) {
                    valid = false;
                }
            });
            break;
    }
    
    return valid;
}

function showAlertMessage() {
    alert('Вы заполнили не все поля');
}

$('#selected_device').on('change', function() {
    if ($(this).val() == 'default') {
        return;
    }
    var deviceType = $(this).val(),
        $modelSelect = $('#selected_model'),
        modelHtml = '<option value="default">' + $modelSelect.find('[value="default"]').text() + '</option>';
    
    $('#selected_model').removeAttr('disabled');
    $.getJSON('devices.php', {device: deviceType}, function(data) {
        if ( data.none ) {
            $('#selected_model').attr('disabled', 'disabled');
            return false;
        }
        for (var i = 0; i < data.length; i++) {
            modelHtml += '<option value="' + data[i] + '">' + data[i] + '</option>';
            $modelSelect.html(modelHtml);
        }
    });
});

var $fixedMenu = $('#fixed_menu'),
        $topSection = $('#home'),
        topBlockHeight = $topSection.height() + 20,
        fixedHeaderHeight = 78;

$(window).on('scroll load', function(event) {
    var e = event || window.event;
    scrollVal = parseInt($(this).scrollTop());

    if (scrollVal >= (topBlockHeight - fixedHeaderHeight)) {
        $fixedMenu.addClass('rolldown');
    } else {
        $fixedMenu.removeClass('rolldown');
    }
});

var $categoryLink = $('#repair_category a'),
    $subcategoryBlock = $('.repair_subcategory_block'),
    $subcategoryBlockLink = $subcategoryBlock.find('a');
    $repairTypesBlock = $('.repair_types'),
    $repairTypesBlockLink = $repairTypesBlock.find('a'),
    $repairPriceBlock = $('.repair_price_block');
    
$categoryLink.on('click', function(event) {
    if ($(this).hasClass('active')) {
        return;
    }
    var e = event || window.event,
            thisCategory = this;
            categoryShow = $(thisCategory).attr('class').split('_'),
            categoryShow = categoryShow[0];
    $('#device_repair_form').val(categoryShow);
    $('#model_repair_form').val('');
    $('#repair_type_repair_form').val('');

    $subcategoryShow = $('#' + categoryShow + '_repair_subcategory');
    $repairTypeShow = $('#' + categoryShow + '_repair_types');
    e.preventDefault();

    $categoryLink.removeClass('active');
    $subcategoryBlockLink.removeClass('active');

//    $subcategoryBlock.hide();
//    $repairTypesBlock.hide();
//    $repairPriceBlock.hide();
    $(thisCategory).addClass('active');
    
    $repairPriceBlock.slideUp(500);
    
    if ( parseInt($(this).data('showTypes')) ) { // Нет подкатегорий, как, например, у Мака
        if ( minOneBlockShown( $repairTypesBlock ) ) {
            if ( minOneBlockShown($subcategoryBlock) ) {
                $subcategoryBlock.slideUp(500);
            }
            
            hideAndShow($repairTypesBlock, function(){
                //$repairTypeShow.slideDown(500);
                showNextStep($repairTypeShow, '#repair_category');
            });
        } else if ( minOneBlockShown( $subcategoryBlock ) ) {
            hideAndShow($subcategoryBlock, function(){
                showNextStep($repairTypeShow, '#repair_category');
            });
        } else {
            $repairTypeShow.slideDown(500);
        }
        return false;
    }
    
    if ( areBlocksHidden($subcategoryBlock) ) {
        if ( areBlocksHidden($repairTypesBlock) ) {
//            subcategoryShow();
            showNextStep($subcategoryShow, '#repair_category');
        } else {
            hideAndShow($repairTypesBlock, function(){
                showNextStep($subcategoryShow, '#repair_category')
            });
        }
    } else {
        $repairTypesBlock.slideUp(500);
        hideAndShow($subcategoryBlock, function(){
            if ( parseInt($(thisCategory).data('showTypes')) ) {
                $repairTypeShow.slideDown(500);
            } else {
//                subcategoryShow();
                showNextStep($subcategoryShow, '#repair_category');
            }
        });
    }
});

function subcategoryShow(){
    $subcategoryShow.slideDown(500, function() {
        $('html,body').animate({
            scrollTop: Math.ceil($('#repair_category').offset().top) - fixedHeaderHeight
        }, 500);
    });
}

function showNextStep($collection, scrollTo, extraPos) {
    var extraPos = extraPos ? extraPos : 0;
    $collection.slideDown(500, function() {
        $('html,body').animate({
            scrollTop: Math.ceil($(scrollTo).offset().top) - fixedHeaderHeight - extraPos
        }, 500);
    });
}

function minOneBlockShown($collection) {
    return $collection.filter(':visible').length;
}

function areBlocksHidden($collection) {
    return $collection.length == $collection.filter(':hidden').length;
}

function hideAndShow($visible, complete) {
    $visible.filter(':visible').slideUp(500, function(){
        complete();
    });
}

$subcategoryBlockLink.on('click', function(event) {
    if ($(this).hasClass('active')) {
        return;
    }
    var e = event || window.event
    subcategoryId = this.id,
            $repairTypeShow = $('#' + subcategoryId + '_repair_types'),
            paddingTop = 25;
    e.preventDefault();
    $('#model_repair_form').val(subcategoryId);
    $('#repair_type_repair_form').val('');
    console.log(subcategoryId);
    $subcategoryBlockLink.removeClass('active');
    $(this).addClass('active');
    
//    $repairTypesBlock.hide();
//    $repairPriceBlock.hide();
    
    if ( areBlocksHidden($repairTypesBlock) ) {
        showNextStep($repairTypeShow, '#' + subcategoryId, paddingTop);
    } else {
        $repairPriceBlock.slideUp(500);
        hideAndShow($repairTypesBlock, function(){
            showNextStep($repairTypeShow, '#' + subcategoryId, paddingTop);
        });
    }

//    $repairTypeShow.slideDown(500, function() {
//        $('html,body').animate({
//            scrollTop: Math.ceil($('#' + subcategoryId).offset().top) - fixedHeaderHeight - paddingTop
//        }, 500);
//    });
});

$repairTypesBlockLink.on('click', function(event) {
    var e = event || window.event,
            // repairTypeId = $(this).find('span').attr('class').split(' '),
            repairTypeId = $(this).find('label').attr('class').split(' '),
            repairTypeId = repairTypeId[0].split('_'),
            repairTypeId = repairTypeId[0],
            subcategoryId = $(this).parent().attr('id').split('_'),
            subcategoryId = subcategoryId[0],
            $repairTypePriceShow = $('#' + subcategoryId + '_' + repairTypeId + '_repair_price');
            var repairTypeId = $(this).find(".it-price-checkbox__default").prop("checked", true);

    e.preventDefault();
    $('#repair_type_repair_form').val(repairTypeId);
    console.log(repairTypeId);
    $repairPriceBlock.hide();
    $repairTypePriceShow.show();
//    $repairTypePriceShow.slideDown(500, function() {
//        $('html,body').animate({
//            scrollTop: Math.ceil($repairTypePriceShow.offset().top) - fixedHeaderHeight
//        }, 500);
//    });
});

// $(".repair_types")on('click', function(event) {
//
// };

var bgImages = $('#flowers_slides .image'),
    navBullets;
for (var i = 0; i < bgImages.length; i++) {
    var indexOfTheEnd = bgImages.length - i;
    bgImages[i].style.zIndex = indexOfTheEnd * 10;
    $('<a href="javascript:void(0)" data-index="'+ i +'"></a>').appendTo($('#flowers_bullets'));
}
navBullets = $('#flowers_bullets a');
navBullets.first().addClass('active');

var intervaId;

startAnimation(bgImages, navBullets);

navBullets.on('click', function() {
    $('#flowers_bullets > a').removeClass('active');
    $(this).addClass('active');

    var lastIndex = bgImages.length - 1,
        imageIndex = lastIndex - $(this).data('index');
        
    bgImages.removeClass('hidden');
    for (var i = lastIndex; i > imageIndex; i--) {
        bgImages.eq(i).addClass('hidden');
    }

    startAnimation(bgImages, navBullets, true);
});

function startAnimation(images, bullets, reload) {
    if (reload == true) {
        clearInterval(window.intervaId);
    }

    window.intervaId = setInterval(function process() {
        var hiddenImageIndex;
        bullets.removeClass('active');
        if (images.not('.hidden').length == 1) {
            images.removeClass('hidden');
            bullets.eq(0).addClass('active');
        } else {
            images.not('.hidden').last().addClass('hidden');
            hiddenImageIndex = images.filter('.hidden').first().data('index');
            hiddenImageIndex++;
            bullets.eq(hiddenImageIndex).addClass('active');
        }
    }, 7000);
}

/*$('#get_repair_price, .request_messenger, .get_messenger').on('click', function() {
    var scrollToElement = $(this).data('scrollTo');
    $('html,body').animate({
        scrollTop: Math.ceil($(scrollToElement).position().top) - fixedHeaderHeight
    }, 500);
});*/

$('.menu_block a').on('click', function() {
    var scrollToElement = $(this).data('scrollTo'),
        exludeHeaderHeight = $(this).data('minusHeaderHeight');

    $('html,body').animate({
        scrollTop: Math.ceil($(scrollToElement).position().top) + (exludeHeaderHeight ? -fixedHeaderHeight : 0)
    }, 500);
});

$('.time-remaining, .price-val').on('click', function(){
    var $tr = $(this).parent().parent(),
        $time = $tr.find('.time-remaining'),
        $price = $tr.find('.price-val');
    
    if ( $time.is(':hidden') ) {
        $time.show();
        $price.hide();
    } else {
        $time.hide();
        $price.show();
    }
});

/*$('.flowers_links a').on('click', function(event){
    var e = event || window.event,
        showTabId = this.id.split('_');
    e.preventDefault();
    
    showTabId.pop();
    showTabId = showTabId.join('_');
    $('.flowers_links a').removeClass('active');
    $(this).addClass('active');
    $('.flowers_tab').hide();
    $('#'+showTabId).show();
    
    if ( showTabId == 'flowers_statistics' ) {
        setTimeout(function(){
            countUp('#achievement_clients', 3870, 60);
            countUp('#achievement_repair', 615, 11);
            countUp('#achievement_hours', 139, 4);
            countUp('#achievement_coffe', 964, 15);
        }, 500);
    }
});

$(window).on('load', function(){
    setTimeout(function(){
        $('#flowers_statistics_tab').trigger('click');
    }, 700)
});*/


/*
var statisticsTop_Y = $('#flowers_statistics').offset().top - 350,
    fixedMenuHeight = fixedHeaderHeight,
    windowScrollTop_Y = $(window).scrollTop() + fixedMenuHeight,
    fired = false;

$(function(){
    if ( windowScrollTop_Y >= statisticsTop_Y ) {
        setTimeout(function(){
            animateNumbers();
        }, 1000);
        fired = true;
        $(window).off('scroll');
    }
}); 

$(window).on('scroll', function(){
    var windowScroll_Y = $(this).scrollTop() + fixedMenuHeight;
    if ( windowScroll_Y >= statisticsTop_Y && !fired ) {
        animateNumbers();
        fired = true;
    }
});

function animateNumbers() {
    countUp('#achievement_clients', 5322, 60);
    countUp('#achievement_repair', 845, 11);
    countUp('#achievement_hours', 152, 4);
    countUp('#achievement_coffe', 312, 15);
}*/

function countUp(id, count, step) {
    var countValue = 0,
    intervalID = setInterval(function(){
        countValue += step;
        $(id).text(countValue);
        if ( countValue >= count ) {
            $(id).text(count);
            clearInterval(intervalID);
        }
    }, 10);
}