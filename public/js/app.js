[Element.prototype,CharacterData.prototype,DocumentType.prototype].forEach(function(t){t.hasOwnProperty("remove")||Object.defineProperty(t,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){null!==this.parentNode&&this.parentNode.removeChild(this)}})}),Array.prototype.forEach||(Array.prototype.forEach=function(t){var e,i;if(null==this)throw new TypeError("this is null or not defined");var s=Object(this),o=s.length>>>0;if("function"!=typeof t)throw new TypeError(t+" is not a function");for(arguments.length>1&&(e=arguments[1]),i=0;i<o;){var n;i in s&&(n=s[i],t.call(e,n,i,s)),i++}}),window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=function(t,e){e=e||window;for(var i=0;i<this.length;i++)t.call(e,this[i],i,this)});var jQuishy=function(t){this.t,this.el=t,"string"==typeof t?this.t=document.querySelectorAll(t):t instanceof HTMLCollection?this.t=[].slice.call(t):void 0!==t&&(this.t=[t]),this.items=this.t,this.item=this.t[0]};function paPos(t,e,i){t.forEach(function(t){t.insertAdjacentHTML(e,i)})}function _$(t){return new jQuishy(t)}jQuishy.prototype.first=function(){return this.t=[this.item],this},jQuishy.prototype.attr=function(t,e){var i=[];return this.t.forEach(function(s){if(void 0===e){var o=s.getAttribute(t);i.push(o)}else s.setAttribute(t,e)}),1===i.length?i[0]:i},jQuishy.prototype.css=function(t,e){return this.t.forEach(function(i){var s=[];if(s.push(t),e&&s.push(e),2===s.length)i.style.cssText=s[0]+" : "+s[1];else if(s[0]){var o="";for(var n in s[0]){o+=n.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()+":"+s[0][n]+";"}i.style.cssText=o}}),this},jQuishy.prototype.addClass=function(t){return this.t.forEach(function(e){e.classList?e.classList.add(t):e.className+=" "+t}),this},jQuishy.prototype.removeClass=function(t){return this.t.forEach(function(e){e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp("(^|\\b)"+t.split(" ").join("|")+"(\\b|$)","gi")," ")}),this},jQuishy.prototype.toggleClass=function(t){return this.t.forEach(function(e){if(e.classList)e.classList.toggle(t);else{var i=e.className.split(" "),s=i.indexOf(t);s>=0?i.splice(s,1):i.push(t),e.className=i.join(" ")}}),this},jQuishy.prototype.hasClass=function(t){this.t.forEach(function(e){return e.classList?e.classList.contains(t):new RegExp("(^| )"+t+"( |$)","gi").test(e.cls)})},jQuishy.prototype.prepend=function(t){return paPos(this.t,"afterbegin",t),this},jQuishy.prototype.append=function(t){return paPos(this.t,"beforeend",t),this},jQuishy.prototype.click=function(t){return this.t.forEach(function(e){e.addEventListener("click",function(e){t(e)})}),this},jQuishy.prototype.delegate=function(t,e,i){return this.t[0].addEventListener(e,function(e){e.target&&e.target.matches(t)&&i(e)}),this};

window.loaded = false;

$('form').each(function() {
  // console.log($(this).attr('id'));
  magicVial('form#' + $(this).attr('id'), "Sorry, please fix the errors below.");
});

$('[type="submit"]').click((e) => {
  e.preventDefault();
  var email = $('form#signup [type="email"]').val();
  var password = $('form#signup [type="password"]').val();
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (error.code) {
      alert("You have an error!");
    }
  });
});

$('.submit').click((e) => {
  e.preventDefault();
  console.log("atempting login");
  var email = $('form#login [type="email"]').val();
  var password = $('form#login [type="password"]').val();
  const promise = firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (error.code) {
      alert("You have an error!");
    }
  });
  promise.catch((e) => {
    console.log(e.message);
  });
});

$('body').delegate('#modalWindow .requirement-status', 'click', function(e) {
  var owner = $(e.target).attr('data-owner');
  var rank = $(e.target).attr('data-rank');
  var requirement = $(e.target).attr('data-requirement');
  console.log(_$(e.target).item.classList);
  if (_$(e.target).item.classList.contains('has-completed')) {
    $(e.target).text('Mark as completed');
    _$(e.target).removeClass('has-completed');
    toggleRequirement(window.dataObj, $(e.target).attr('data-owner'), $(e.target).attr('data-rank'), $(e.target).attr('data-requirement'));
    $('[data-owner="'+ owner +'"] .fragment[data-rank="'+ rank +'"][data-requirement="'+ requirement +'"]').removeClass('completed');
  }
  else {
    $(e.target).text('Completed');
    _$(e.target).addClass('has-completed');
    toggleRequirement(window.dataObj, owner, rank, requirement);
  }
  writeUserData(window.database, window.dataObj);
});

function compare(a,b) {
  let comparison = 0, x, y;

  if (a.match(/[a-z]/i) && b.match(/[a-z]/i)) {
    x = a;
    y = b;
  }
  else {
    x = parseInt(a.replace(/[a-z]/g, ''));
    y = parseInt(b.replace(/[a-z]/g, ''));
  }

  if (x > y) {
    comparison = 1;
  } else if (y > x) {
    comparison = -1;
  }

  return comparison;
}

function writeUserData(DB, data) {
  DB.ref('/').set({
      "members" : data
    });
}

function toggleRequirement(data, owner, rank, requirement) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === owner) {
      data[i].ranks.forEach(function(_rank_) {
        if (_rank_.name === rank) {
          if ('requirements' in _rank_) {
            if (requirement in _rank_.requirements) {
              delete _rank_.requirements[requirement]
            } else {
              var newAttrObj = {};
              newAttrObj.name = requirement
              _rank_.requirements[requirement] = newAttrObj;
            }
          } else {
            var newAttrObj = {};
            newAttrObj.name = requirement
            _rank_.requirements = {};
            _rank_.requirements[requirement] = newAttrObj;
          }
        }
      });
      continue;
    }
  }
}

$('#addNote').click(function() {
  if ($(this).text() == 'Close') {
    $(this).text('Add a note');
  }
  else {
    $(this).text('Close');
    $('#noteTextarea').val("");
  }
});

$('#editNote').click(function() {
  var $ref = $('#modalWindow .requirement-status');
  var owner = $($ref).attr('data-owner');
  var rank = $($ref).attr('data-rank');
  var requirement = $($ref).attr('data-requirement');
  var $fragment = $('[data-owner="'+ owner +'"] .fragment[data-rank="'+ rank +'"][data-requirement="'+ requirement +'"]');
  if ($($fragment).hasClass('editing')) {
    $($fragment).removeClass('editing');
    $('#notesWrapper').removeClass('edit-mode');
    $(this).text('Edit');
  } else {
    $($fragment).addClass('editing');
    $('#notesWrapper').addClass('edit-mode');
    $(this).text('Cancel');
  }
});

function handleNotes(note, data, owner, rank, requirement) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === owner) {
      data[i].ranks.forEach(function(_rank_) {
        if (_rank_.name === rank) {
          if (!('notes' in _rank_)) {
            _rank_.notes = {};
          }
          var keyString = rank.replace(" ", "") + "_" + requirement;
          _rank_.notes[keyString] = note;
        }
      });
      continue;
    }
  }
  writeUserData(window.database, window.dataObj);
}

$('#notesWrapper').delegate('.add-note', 'click', function() {
  var $ref = $('#modalWindow .requirement-status');
  var owner = $($ref).attr('data-owner');
  var rank = $($ref).attr('data-rank');
  var requirement = $($ref).attr('data-requirement');
  var note = $('#noteTextarea').val();
  handleNotes(note, window.dataObj, owner, rank, requirement);
  console.log(owner, ": ", rank +"-"+ requirement, "Note --", note);
  // $('.note-saved-message').addClass('show');

  var newNoteValue = $('#noteTextarea').val();
  var $fragment = $('[data-owner="'+ owner +'"] .fragment[data-rank="'+ rank +'"][data-requirement="'+ requirement +'"]');

  $('#currentNote').text(newNoteValue);
  $('#notesWrapper').removeClass('edit-mode');
  $($fragment).removeClass('editing');
  $('#editNote').text('Edit');
  // $('#addNote').css('display', 'none');
  $('#notesWrapper').addClass('has-note');
  // setTimeout(500, function() {
  //   $('.note-saved-message').removeClass('show');
  // });
});

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
      $(".logged-in-view").show();
      $(".logged-out-view").hide();

      // get elements
      window.database = firebase.database();

      // create references
      var membersDB = window.database.ref("members/");

      // Sync object changes
      membersDB.on('value', function(snapshot) {
        window.dataObj = snapshot.val();







        function initBarFragments() {
    			var progressBarBuild = [];
    			record.ranks.forEach(function(_rank_) {
    				var size = Object.keys(_rank_.requirements).length;
    				var fragmentWidth = 15;
    				var requirementsList = [];
    				for (var key in _rank_.requirements) {
    					requirementsList.push(key);
    				}
    				//- console.log("before: ", requirementsList);
    				requirementsList.sort(compare);
    				//- console.log(requirementsList);
    				//- console.log("after: ", requirementsList);
    				requirementsList.forEach(function(_requirement_) {
    					progressBarBuild.push(`<div style="width: ${fragmentWidth}px" class="fragment" data-rank="${_rank_.name}" data-requirement="${_requirement_}"><div class="label">${_requirement_}</div></div>`);
    				})
    			});
    			return progressBarBuild;
    		}

    		function initMemberBars(memberBarList) {
    			window.dataObj.forEach(function(_boy_) {
    				memberBarList.forEach(function(_fragment_) {
    					$('[data-owner="'+ _boy_.name +'"].progress-bar').append(_fragment_);
    				});
    			});
    		}

        function hasProp (obj, prop) {
          return Object.prototype.hasOwnProperty.call(obj, prop);
        }

    		function initMarkedBars() {
    			window.dataObj.forEach(function(_boy_) {
    				_boy_.ranks.forEach(function(_rank_) {
              if ('requirements' in _rank_) {
                // console.log(_rank_.requirements);
                for (key in _rank_.requirements) {
                  //- console.log("name: ", _boy_.name, " rank: ", _rank_.name, "completed: ", _requirement_);
                  $('[data-owner="'+ _boy_.name +'"] [data-rank="'+ _rank_.name +'"][data-requirement="'+ _rank_.requirements[key].name +'"]').addClass('completed');
                };
              }
    				});
    			});
    		}

    		function initRankSeparators() {
    			var total = 0;
    			record.ranks.forEach(function(_rank_) {
    					$('[data-lane="'+ _rank_.name +'"]').css('width', function() {
    						//- console.log(_rank_.requirements);
    						var size = Object.size(_rank_.requirements);
    						var calcWidth = 15 * size;
    						total += calcWidth;
    						return calcWidth + "px";
    						});
    				});
    			$('#rankWrapper').css('width', total + 8 + "px");
    			$('.shadow-progress-bar, .progress-bar').css('width', total + "px");
    		}

        if (!window.loaded) {
          var barFragments = initBarFragments();
          // console.log(barFragments);
          initMemberBars(barFragments);
          initMarkedBars();
          initRankSeparators();
          window.loaded = true;
        }
        initMarkedBars();









      });
  		// console.log("membersDb: ", window.membersDB.val());
  }
  else {
    $(".logged-in-view").hide();
    $(".logged-out-view").show();
  }
});

// function animateIn(obj) {
//   $(obj).show();
//   $(obj).animate({
//     opacity: 1
//   }, 600);
// }
//
// function animmateOut(obj) {
//   $(obj).animate({
//     opacity: 1
//   }, 600, () => {$(obj).hide()});
// }
//
// $('a[href="signup.html"]').click(function(e) {
//     e.preventDefault();
//     animateIn('.signup-form');
//     animmateOut('.login-form')
//     // $('.login-form').removeClass('reveal');
// });


$('a[href="login.html"]').click(function(e) {
    e.preventDefault();
    $('.signup-form').removeClass('reveal');
    $('.login-form').addClass('reveal');
});

$(".logout").click((e) => {
  e.preventDefault();
  firebase.auth().signOut();
});
