let count_class = 0;
var photo_url;
let count_items = 10;
let count_offset=0;
let i=0;
function getUrl(count_offset){
    // console.log(count_offset);
    return 'https://api.vk.com/method/wall.get?domain=extrawebdev&access_token=3195e9e93195e9e93115aff35931c30219331953195e9e9697cc67864e1f0c35fe7c074&count='+count_items+'&offset='+count_offset+'&v=5.85';
}
function beforeSend(){
    $('body>div:last-child').addClass('load-active');
}
function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}

function showItems(url){
$.ajax({
    url: url,
    type: 'GET',
    dataType: 'jsonp',
    beforeSend: beforeSend
})
.done(function(data) {
    var obj = data.response.items;
    // console.log(data);
    sleep(1000);
    for(count_class=0;count_class<count_items;count_class++){
    $('body').append($('#main').clone(true).attr('class', 'i-' + i).fadeIn());

    // console.log(i);
    // console.log(count_class);

    if(obj[count_class].hasOwnProperty('copy_history')){

    $('.i-' + i + ' .title a').attr('href', 'https://vk.com/public' + Math.abs(obj[count_class].copy_history[0].owner_id) + '?w=wall' + obj[count_class].copy_history[0].owner_id + '_' + obj[count_class].copy_history[0].id);
    if(obj[count_class].copy_history[0].hasOwnProperty('attachments')){
    if(obj[count_class].copy_history[0].attachments[0].type == 'doc'){
        photo_url = obj[count_class].copy_history[0].attachments[0].doc.url;
    }
    else if(obj[count_class].copy_history[0].attachments[0].type == 'photo') photo_url = obj[count_class].copy_history[0].attachments[0].photo.sizes[4].url;
    else if(obj[count_class].copy_history[0].attachments[0].type == 'link'){
        // $('.i-' + i + ' .title a').attr('href', obj[count_class].attachments[0].link.url);
        photo_url = "";
    }
    $('.i-' + i + ' .photo img').attr('src',photo_url);
}
    $('.i-' + i + ' .date').html(moment(obj[count_class].date*1000).format('LLL'));
    $('.i-' + i + ' .text').html(obj[count_class].text+ '<hr>' +obj[count_class].copy_history[0].text);

}
else{
    $('.i-' + i + ' .title a').attr('href','https://vk.com/public'+obj[count_class].owner_id*(0-1)+'?w=wall'+obj[count_class].owner_id+'_'+obj[count_class].id);
    if(obj[count_class].hasOwnProperty('attachments')){
    if(obj[count_class].attachments[0].type == 'doc'){
        photo_url = obj[count_class].attachments[0].doc.url;
    }
    else if(obj[count_class].attachments[0].type == 'photo') photo_url = obj[count_class].attachments[0].photo.sizes[4].url;
    else if(obj[count_class].attachments[0].type == 'link') {
        $('.i-' + i + ' .title a').attr('href', obj[count_class].attachments[0].link.url);
        photo_url = "";
    }
    $('.i-' + i + ' .photo img').attr('src',photo_url);
}
    $('.i-' + i + ' .date').html(moment(obj[count_class].date*1000).format('LLL'));
    $('.i-' + i + ' .text').html(obj[count_class].text);

}
i++;
    // console.log(count_class);
    }
})
.fail(function(data){
    $('body').html('Ошибка загрузки').addClass('errorbody');
})
;
}
let j=0;
let count_scroll=0;
showItems(getUrl(0));
$(document).ready(function(){
    $(window).scroll(function(){
        if($(window).scrollTop()+$(window).height()==$(document).height()){
            count_offset+=count_items;

            showItems(getUrl(count_offset));
            count_scroll++;
            if(count_scroll>=2){
                count_scroll=0;
                while(j<count_offset-count_items){
                    $('.i-' + j).remove();
                    j++;
                }
                sleep(300);
            }

        }
    });
});