var curURL = document.URL
console.log(curURL)
var formCount = 2
$("#parent").on("click",".checklistItem", function () {
    $(this).toggleClass("completed");
    var dataid = $(this).attr('data-id')
    console.log(curURL+"/"+dataid)
    $.ajax({
        type: "PUT",
        url: curURL+"/"+dataid,
        data: {
            id: $(this).attr('data-id')
        },
        dataType: "json",
        success: function (response) {
            //console.log(data)
            console.log(response)
        }
    });
});

$("#newItemForm").on("keypress", function (event) {
    if(event.which == 13){
        console.log("Hit Enter")
        //event.preventDefault();
        if($(this).val() != ""){
            var text = $(this).val()
            $(this).val("")
            console.log(text)
            $.ajax({
                type: "post",
                url: curURL+"/create",
                data: {
                    value: text
                },
                dataType: "json",
                success: function (response) {
                    console.log("creating element")
                    var x = $("#parent")
                    console.log(response)
                    //console.log("<p class='checklistItem' data-id='"+response._id+"'>Hello</p>")
                    x.append("<div class='ui grid segment'>\
                                    <div class='fourteen wide column middle aligned content'>\
                                            <div class='description fluid'>\
                                                    <p class='checklistItem' data-id='"+response._id+"'>"+response.action+"</p>\
                                            </div>\
                                    </div>\
                                    <div class='two wide column right aligned content extra' >\
                                        <i class='x icon delete' data-id='"+response._id+"'></i>\
                                    </div>\
                                </div>")
                }
            });
        }
    }
});


$(".delete").on("click",function(event){
    console.log($(this).attr('data-id'));
    var dataid = $(this).attr('data-id')
    var ele = $(this)
    console.log(ele)
    $.ajax({
        type: "DELETE",
        url: curURL+"/"+dataid,
        data: {
            id: $(this).attr('data-id')
        },
        success: function(){
            console.log("successful ajax")
            console.log(ele.closest(".ui, .segment"))
            ele.closest(".ui, .segment").remove()
        }
    });
})

$("#regForm").on("change",".formField:last",function(event){
    console.log($(this).val())
    if($(this).val() != ""){
        var x = $("#submit")
        x.before("<div class='field'><input type='text'name='item[action]' placeholder='action' class='formField'></div>")
        $(this).off("change",function(event){
            console.log("Removed event")
        })
    }
})

$("#new").on("click",function(event){
    $(".ui.modal").modal("show")
})