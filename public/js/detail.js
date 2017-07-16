// 动态处理评论
$(function() {
    $('.comment').click(function(e) {
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');

        if ($('#toId').length > 0) { //只加载一次，且以最后点击头像的子对象为主
            $('#toId').val(toId);
        } else {
            $('<input>').attr({
                type: 'hidden',
                id: 'toId',
                name: 'comment[tid]',
                value: toId
            }).appendTo('#commentForm');
        }

        if ($('#commentId').length > 0) {
            $('#commentId').val(commentId);
        } else {
            $('<input>').attr({
                type: 'hidden',
                id: 'commentId',
                name: 'comment[cid]', //踩坑中：comment【cid】,bodypaser中间件，封装好comment对象，里面有各个属性
                value: commentId,
            }).appendTo('#commentForm');
        }
    });
});
