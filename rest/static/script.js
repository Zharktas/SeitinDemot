var baseUrl = '/api/heroes/';
var makeRequest = function(method, url, data) {
  $.ajax({
    url: url,
    type: method,
    data: data,
    dataType: "text",
    contentType: "application/json",
    success: function(msg){
      $("textarea#get").val(msg);
    },
    error: function(xhr, status, err) {
      alert(status);
    }});
};

$(document).ready(function() {
  $("button#delete").click(function() {
    var id = $("textarea#delete").val()
    makeRequest("DELETE", baseUrl+id+'/',null);
  });

  $("button#get").click(function() {
    makeRequest("GET", baseUrl,null);
  });

  $("button#post").click(function() {
    var text = $("textarea#post").val();
    makeRequest("POST", baseUrl,text);
  });

  $("button#put").click(function() {
    var id = $("textarea#putid").val();
    var text = $("textarea#puttext").val();
    makeRequest("PUT", baseUrl+id+'/',text);
  });
});

