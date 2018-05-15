$(function(){
  $(".btn-load-submit").click(function(){
    layerLoadIndex = layer.load({shade:[0.4,"#000"]});
    var formid=$(this).data("formid");
    $(formid).submit();
  });
});
