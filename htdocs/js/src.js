//---------VARIABLES---------//
var showDebug = true;

var codes = {
  'success' : 1,
  'dbError' : 2,
  'inputError' : 3,
  'unknown' : 4
}

var server = {
  'protocol' : 'http://',
  'ip' : '127.0.0.1',
  'port' : '1337'
}

var departments, employees;

//---------FUNCTIONS---------//

//---------DEBUG LOGGING---------//
function logDebug(type, text){if(showDebug){console.log(type + ' : ' + text);}}

//---------SUBMITTING FORMS---------//
function submitForm(data, page){
  var loc = createUrl(page);
  $.post( loc, data).done(function( data ) {
    switch (data) {
      case codes.success:
        alert('record added');
        $('#' + page + 'Form')[0].reset();
        $('#' + page).modal('hide');
        break;
      case codes.inputError:
        alert('there was an input error');
        break;
      case codes.dbError:
        alert('there was an database error');
        break;
      case codes.unknown:
        alert('there was an unkown error');
        break;
      default:
    }
  }).fail(function(error) {
    alert('there was a url error');
    console.log("error");
  });
}

//---------GET DATA---------//
function getData(page, type, data, trigger){
  var loc = createUrl(page);
  $.get( loc, data).done(function( data ) {
    switch (data) {
      case codes.inputError:
        alert('there was an input error');
        break;
      case codes.dbError:
        alert('there was an database error');
        break;
      case codes.unknown:
        alert('there was an unkown error');
        break;
      default:
      $(document).trigger('' + trigger + '', [data]);
      return data;
    }
  }).fail(function(error) {
    alert('there was a url error');
    console.log("error");
  });
}

//---------EXTRACT DATA---------//
function extractSingleDataVue(data){
  arr = [];
  data.forEach(function(i) {
    arr.push(i._fields[0].properties);
  });
  return arr;
}

//---------CHECK DATA---------//
function errorCheck(error){
  switch (error) {
    case error.success: return true; break;
    case error.dbError: return false; break;
    case error.inputError: return false; break;
    default: return true;
  }
}

//---------CREATE URL---------//
function createUrl(page){
  return (server.protocol + server.ip + ":" + server.port + "/" + page);
}

//---------CONVERT FORM OBJECT TO ARRAY---------//
function formToArray(form){
    var arr = {};
    for(var pair of form.entries()) {arr[pair[0]] = pair[1];}
    return arr;
}

// //---------ADD EMPLOYEE---------//
// $("#addEmployeeForm").submit(function(e){
//   e.preventDefault();
//   var form = document.getElementById("addEmployeeForm");
//   var data = new FormData(form);
//   submitForm(formToArray(data), 'addEmployee');
// });
//
// //---------ADD DEPARTMENT---------//
// $("#addDepartmentForm").submit(function(e){
//   e.preventDefault();
//   var form = document.getElementById("addDepartmentForm");
//   var data = new FormData(form);
//   submitForm(formToArray(data), 'addDepartment');
// });


Vue.component('dep-option', {
  template: '<option>{{ dep.name }}</option>',
  props: ['dep']
})

var app = new Vue({
  el : '#e_controller',
  data : {
    test : "this is a test",
    departments: [],
    employees: [],
  },
  created : function(){
    this.getDepartments();
    this.getEmployees();
  },
  methods : {
    getDepartments: function(){
      this.$http.get(createUrl('departments')).then(response => {
        if(errorCheck(response)){
          this.departments = extractSingleDataVue(response.body);
        }else{console.log('data error : ' + response);}
      }, response => {
      }).bind(this);
    },
    addDepartment: function(form){
      var data = {"name" : form.target.elements.name.value, "description" : form.target.elements.description.value};
      this.$http.post(createUrl('addDepartment'), data).then(response => {
        if(errorCheck(response)){
          this.departments.push(data);
          form.target.reset();
        }else{console.log('data error : ' + response);}
      }, response => {}).bind(this);
    },
    getEmployees: function(){
      this.$http.get(createUrl('Employees')).then(response => {
        if(errorCheck(response)){
          this.employees = extractSingleDataVue(response.body);
        }else{console.log('data error : ' + response);}
      }, response => {
      }).bind(this);
    },
  }
});
