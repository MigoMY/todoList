/**
 * Created by Administrator on 2017/4/21.
 */
$(function () {
    /*一.设置吸顶效果*/
    /*1.1监听滚动
    * window不需要引号*/
    var off_top = $('.nav').offset().top;
    $(window).on('scroll',function () {
        var scr_top = $(window).scrollTop();
        /*1.2判断如果滚动的距离大于等于对应的offset的top值,就让他显示吸顶*/
        if(scr_top>=off_top){
            /*1.21设置属性*/
            $('.nav').css(
                {'position':'fixed',
                    'top':0


                }
            );
            $('.nav img').css(
                {
                    'opacity':1
                }
            )
        }else {
            $('.nav').css({
                'position':'absolute',
                'top':off_top
            });
            $('.nav img').css(
                {
                    'opacity':0
                }
            )
        }

    })

    /*二.设置对应的返回顶部的业务逻辑*/
    /*2.1当滚动到一定的范围的时候,让返回图片显示*/
    $(window).on('scroll',function () {
        var scr_top = $(window).scrollTop();
        /*2.11比较*/
        if(scr_top >=off_top){
            //让返回图片动画显示
            $('.back_top').fadeIn(200);
        }else {
            $('.back_top').fadeOut(200);
        }
    })
    /*2.2点击返回按钮的时候让对应的body返回顶部*/
    $('.back_top').on('click',function () {
        /*2.21让对应的body返回顶部
        * 使用动画设置对应的scrollTop值*/
        $('html body').animate(
            {
                scrollTop:0
            }
        )
    })

    /*三.点击提交的时候,创建对应的li*/
    var itemArray ;
    /*3.1如果要存储数据,当程序运行起来的时候,我们需要先从存储的地方获取数据
    * 根据数据渲染界面
    * 凡是数据发生变化的地方都需要记录数据
    * get:方法表示获取数据
    * 传入一个参数,这个参数表示获取数据参考的索引值*/
    itemArray = store.get('itemArray')||[];
    render_view();

    $('input[type=submit]').on('click',function (event) {

        /*3.0阻止默认行为*/
        event.preventDefault();


        /*3.1获取内容*/
        var input_content = $('input[type=text]').val();
        /*3.2判断*/
        if($.trim(input_content) == ''){
            alert('请输入内容')
            return;
        }else {
            /*一般实际开发的时候,我们需要数据和界面分离
            * 我们需要根据对应的数据来设置界面
            * 所以我们一般先设置数据
            * 然后根据数据来更新界面
            * 我们需要创建一个用来表示li的数据
            * 这个数据一般是个json
            * 我们创建一个单个数据就是字典
            * 然后把对应的字典放在一个数组中,然后遍历数组更新界面*/
            /*3.21创建一个数据*/
            var item = {
                /*标题*/
                title:'',
                content:'',
                isCheck:false,
                remindTime:'',
                isNotice:false,


            }

            /*3.22给数据设置值*/
            item.title = input_content;
            /*3.23添加数据到数组中*/
            itemArray.push(item);
            /*3.231保存数据
            * 第一个参数表示参考的索引,第二个表示存放的东西*/
            store.set('itemArray',itemArray);
            /*3.24根据数据更新界面*/
            render_view();

        }
    })
    /*3.3设置渲染的功能*/
    function render_view() {
        /*一般先清空旧的数据,然后添加新的数据*/
        $('.task').empty();
        $('.finish_task').empty()
        /*3.2根据数组设置li,创建li,然后添加li
        *
        * data-index:表示给对应的li设置索引*/
        /*遍历数组*/
        for(var i = 0;i < itemArray.length;i++){
            /*3.21获取每一数据*/
            var obj = itemArray[i];


            var tag = '<li data-index='+ i +' >'+
                '<input type="checkbox"'+(obj.isCheck?'checked':'')+'>'+
            '<span >'+obj.title+'</span>'+
            '<span class="del">删除</span>'+
            '<span class="detail">详情</span>'+
            '</li>';

            /*3.3添加*/
            if(obj.isCheck){
                $('.finish_task').prepend(tag);
            }else {
                $('.task').prepend(tag);

            }


        }




    }

    /*四.切换tab*/
    $('.header li').click(function () {
        /*4.1切换上面的li
        * 就是给当前的li添加对应的类,其余的兄弟节点移出对应的类*/
        $(this).addClass('curr').siblings().removeClass('curr');
        /*4.2切换下面的div*/
        /*4.21获取对应的索引*/
        var index = $(this).index();
        $('.body').eq(index).addClass('active').siblings().removeClass('active');

    })
    /*五.删除对应的li
    * span是动态添加的所以在事件域外面它的事件没有效果
    * 我们需要使用代理*/
    $('body').on('click','.del',function () {

       /*在实际开发中,我们如果修改界面,
       * 既要修改数据,也要修改界面
       * 对于现在我们需要删除数据
       * 以及删除界面中的内容*/

       /*5.1获取点击的索引值*/
       /*5.11获取span对应的li*/
       var　tag = $(this).parent();
       var index = tag.data('index');
       /*5.2.删除数据*/
       delete itemArray[index];
       /*5.3删除节点
       * 使用动画让对应的节点消失
       * 动画完成后删除节点*/
      tag.slideUp(200,function () {
          tag.remove();
      });

      /*6.保存数据*/
      store.set('itemArray',itemArray);


    })
    /*六.点击checkBox处理业务*/
    $('body').on('click','input[type = checkbox]',function () {
        /*6.1获取点击的索引值*/
        var tag = $(this).parent();
        var index = tag.data('index');

        /*6.2修改数据*/
        var item = itemArray[index];
        item.isCheck = $(this).is(':checked');
        /*6.3修改数组对应位置位置的数据(替换)*/
        itemArray[index] = item;

        /*6.31保存数据*/
        store.set('itemArray',itemArray);

        /*6.4根据数据重新更新界面*/
        render_view();






    })

    /*七.设置详情的span的点击*/
    /*7.0设置一个值用来记录点击了哪个详情span*/
    var curr_index = 0;

    $('body').on('click','.detail',function (){
       /*7.1让mask使用动画显示*/

       $('.mask').fadeIn();
       /*7.2设置mask中数据*/
       /*7.21获取对应的索引然后获取数据*/
       var tag = $(this).parent();
       var index = tag.data('index');
       curr_index = index;
       var item = itemArray[index];
       /*7.22设置具体的数据*/
       $('.content_header .title').text(item.title);
       $('textarea').val(item.content);
       $('.content_body input[type =text]').val(item.remindTime);

    })
    /*八.处理点击相关的逻辑*/
    $('.mask').click(function () {
        $(this).fadeOut();
    })
    $('.close').click(function () {
        $('.mask').fadeOut();
    })
    $('.mask_content').click(function (event) {

        /*阻止冒泡*/
        event.stopPropagation();

    })

    /*8.1处理时间的设置,使用插件*/
    /*8.11设置本地化*/
    $.datetimepicker.setLocale('ch');
    /*8.2给对应的标签设置对应的插件*/
    $('#remind_time').datetimepicker();

    /*九.设置更新内容*/
    $('.content_body button').click(function () {
        /*9.1获取数据,根据数据更新界面*/
        /*9.11获取原始数据,修改数据*/
        var item = itemArray[curr_index];
        // item.title = $('.content_body textarea').val();
        item.title = $('.content_header .title').text();
        item.content = $('.content_body textarea').val();
        item.remindTime = $('#remind_time').val();
        item.isNotice = false;

        /*替换数据*/
        itemArray[curr_index] = item;
        /*保存数据*/
        store.set('itemArray',itemArray);

        /*更新界面*/
        render_view();
        /*让mask消失*/
        $('.mask').fadeOut();






    })

    /*十.设置提醒
    * 注意我们需要和当前的时间比较
    * 时时刻刻都要比较,我们需要使用定时器*/
    var timer = setInterval(function () {
        /*遍历数组,取出提醒时间和当前的时间比较
        * 时间是一种格式,我们可以转化成毫秒比较*/

        for(var i= 0;i< itemArray.length;i++){
            var item  = itemArray[i];
            /*为了严格规范代码,我们需要对item进行判断*/
            if(item == undefined ||!item ||item.remindTime.length< 1 || item.isNotice ){
                continue;

            }
            /*自定义时间需要把对应的时间放在new Date()的括号中*/
            var remind_timeM = ( new Date(item.remindTime)).getTime();
            var now_timeM = (new Date()).getTime();

            /*比较时间*/
            if(now_timeM - remind_timeM >1){

                /*设置响起音乐
                * 使用播放的方法是js对象,我们需要把jquery对象转化成js对象*/
                $('video').get(0).play();
                $('video').get(0).currentTime = 0;

                /*设置数据,设置已经提醒*/
                item.isNotice = true;
                itemArray[i] = item;
                /*保存数据*/
                store.set('itemArray',itemArray);
            }


        }
    },2000)









})
