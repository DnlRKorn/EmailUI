$(document).ready(function() {

	

	/* This function will take care of recording the log of events. It could do so by writing to a file,
	outputting to the console, or any other way that seems reasonable */

	//$('#instructions').modal('toggle');
	var log_message = function(message) {
 		//console.log(message);
		session_log += (message + '\n');
	}

	/* Returns a timestamp of the exact second since the sessions started
	   For example, if session started at 3:00, this function will return
	   60 at 3:01 */
	var get_timestamp = function() {
		return ((new Date().getTime()) - session_start.getTime())/1000;
	}
	
	var save_session_url = 'https://wwwx.cs.unc.edu/~bartel/cgi-bin/emailUI/EmailUI/php/save_session_log.php'
	var end_session_url = 'https://wwwx.cs.unc.edu/~bartel/cgi-bin/emailUI/EmailUI/php/end_session.php'
    Email.generate();
	var session_log = "\n";

	var session_start = new Date();
	log_message('Resumed session on: ' + session_start);

	var already_suggested = false;
	var first_click = true;
	var flat_interface = false;
	var include_modal = false;
	var email_editor_open = false;
	var maxSubjectAndPreviewLength = 150; //I calculated this number after testing the layout


	// Append_Emails
	for (var i = 0; i < Email.all.length; i++) {
		var email = Email.all[i];
		var subject = email.subject.substring(0,maxSubjectAndPreviewLength);
		var previewSize = (subject.length + 1 >= maxSubjectAndPreviewLength) ? 0: maxSubjectAndPreviewLength - subject.length - 2;
		var preview = email.content.substring(0, previewSize);

		$('ul.list-group').append('<li class="list-group-item email tracked click" id="email'+i+'"></li>');
		$('#email'+i).append('<span class="sender">' + email.sender.name + '</span>  ' + '<span class="subject">' + subject + '</span>\
							  <span class="preview"> &nbsp;&ndash;&nbsp;' + preview + '</span>' + '<span class="date">' + email.formattedDate() + '</span>');
	}

	var getPredictions = function() {
		/* right now do it randomly */
		//Select 3 random contacts and make a PredictionGroup with them 
		var p1 = new PredictionGroup();
        var p2 = new PredictionGroup();

        for (var i = 0; i < 3; i++) {
			var index = Math.floor(Math.random()*Contact.all.length);
			var c = Contact.all[index];
            p1.addContact(c);
			log_message('Contact ' + JSON.stringify(c) + ' was predicted');			
		}

        p2.addContact(Contact.all[0]);
        p2.addSubgroup(p1);
        return p2;
	}

	/* Attach prediction to 'To' field when selected */
    var attachPrediction = function(contact) {
		var comma = (first_click) ? ' ': ', ';
		wrap_contact(contact) //append email to contents of to_field
		log_message('Changed content of to_field to ' + contact + ';timestamp: ' + get_timestamp());
		first_click = false;
    }
    
    var attachPredictionGroup = function(prediction_group) {
        var groups = prediction_group.subgroups;
        var contacts = prediction_group.contacts;

        for (var i = 0; i < groups.length; i++) {
            attachPredictionGroup(groups[i]);
        }

        for (var j = 0; j < contacts.length; j++) {
        	if (!contacts[j].deleted)
            	attachPrediction(contacts[j].name);
        }
    }
	//Expand email
	$(document).on('click', '.email', function() {


		if (email_editor_open)
			$('#email_expanded_col').attr('class','col-md-4')
		else
			$('#email_expanded_col').attr('class','col-md-10')

		var id = $(this).attr('id');
		var index = parseInt(id.substring(5)); //i.e, 'email5' will yield 5
		var email = Email.all[index];

		$('.panel-title').text(email.subject);
		$('#email_expanded > .panel-body').append('<strong class="tracked" id="expanded_sender">' + email.sender.name +'</strong>' + '&lt;' + email.sender.email +'&gt<hr>');
		$('#email_expanded > .panel-body').append('<p class="tracked" id="expanded_content">' + email.content +'</p>');
		$('#email_expanded_col').show();
		$('#email_list').hide();
	});

	//Open New Message editor
	$('#nav_new_message').click(function() {

		$("#testalert").alert();
		email_editor_open = true;

		$('.preview').hide();
		$('#email_expanded_col').attr('class', 'col-md-4');
		$('#email_list').attr('class','col-md-4');
		$('#new_message_editor').show();
	});

	//Return to the main inbox
	$('#nav_inbox').click(function() {
		$('#email_expanded > .panel-heading > .panel-title').empty();
		$('#email_expanded > .panel-body').empty();
		$('#email_expanded_col').hide();

		if (email_editor_open)
			$('#email_list').attr('class','col-md-4')
		else
			$('#email_list').attr('class','col-md-10')

		$('#email_list').show();
	});

	/* Tracking functions */
	$(document).on('mouseenter', '.tracked', function() {
		log_message('Entered element ' + $(this).prop('id')+'; timestamp: ' + get_timestamp());
	});

	$(document).on('mouseleave', '.tracked', function() {
		log_message('Left element ' + $(this).prop('id')+'; timestamp: ' + get_timestamp());
	});

	$(document).on('click', '.click', function() {
		log_message('Clicked element ' + $(this).prop('id')+'; timestamp: ' + get_timestamp());
	});

	$(document).on('change keyup paste','.text', function() {
		log_message('Changed content of ' + $(this).prop('id') + ' to ' +
					$(this).val() + ';timestamp: ' + get_timestamp());
	}); 

	/* Autocomplete contacts */
	$(function() {
		var test = [
			"Lebron James",
			"Luis Scola",
			"Roy Hibbert",
			"Kevin Durant",
			"Russell Westbrook"
		]
		$('#to_field').autocomplete({
			source:test
		});
	});
	/* Wrap autocompleted contacts in the panel */
	$(document).on('click','.ui-corner-all', function() {
		var content = $('#to_field').val();
		if (content !== '') {
			wrap_contact(content);
    		console.log("wrapping: " + content);
    	}

    	$('#to_field').val('');

	});
	/* Trigger hover effect on input */
	$('#to_field').on('focus', function() {
		$('#to_field_outer').trigger('focus');
	})

    var wrap_contact = function(content) {
    		var sb = new StringBuilder();
    		sb.append('<span class="contact_wrapper wrapper">');
            sb.append('<span class="label label-info">');
            sb.append('<span class="tracked click">'+ content +'</span>');
            sb.append('<span class="glyphicon glyphicon-remove remove tracked click"></span>');
            sb.append('</span>');
            sb.append('</span>');
    		$('#to_field_outer div').append(sb.toString());
    		$('#to_field').val('');
    }

    $(document).on('click', '.contact_wrapper span.remove', function() {
    	$(this).parents('.contact_wrapper').remove();
    })

	//Make random suggestions
	$('#to_field').on('change keyup paste',function() {
		var content = $(this).val();
		console.log(content);
		if (content.indexOf(",") != -1) {
			wrap_contact(content.substring(0,content.length - 1));

			if (!already_suggested) {
				already_suggested = true;

				predictions = getPredictions();

	            $('#predictions').append('<span> Consider including: </span>');
	            if (flat_interface)
	            	$('#predictions').append(predictions.buildFlatInterface());
	            else
	            	$('#predictions').append(predictions.buildHierarchicalInterface());

				$('#predictions').show();
			}

		}
	});


    $(document).on('mouseenter','.prediction_group', function() {
        console.log('test');
        var id = $(this).data('group_id');
        $('.group'+id).css('color','#FF9966');
    });

    $(document).on('mouseleave','.prediction_group', function() {
        var id = $(this).data('group_id');
        $('.group'+id).css('color','#428bca');
    });

    
	$(document).on('click','.prediction', function() {
        var name = $(this).text();
	    attachPrediction(name);
    });

    $(document).on('click','.prediction_group', function() {
        var index = parseInt($(this).data('group_id'));
        attachPredictionGroup(PredictionGroup.all[index]);
    });
    
    $(document).on('click','prediction_wrapper span.remove', function() {
        //first, delete the contact from the group
        var group_index = parseInt($(this).data('group_id'));
        var contact_index = parseInt($(this).data('contact_id'));

        var group = PredictionGroup.all[group_index];
        group.deleteContact(contact_index);
    
        //remove contact node from html
        $(this).parent().remove();
    });
	
    //Save Session
	$('#save_session').on('click', function() {
        log_message('Session ended on: ' + new Date());
		$.ajax({
			type: 'POST',
            async:false,
			url:save_session_url,
			data: {'data':session_log, 'end_session':true},
			success: function(data, status, jqXHR) {
			    //console.log(data);
                window.location.replace(data); //load a thank you page
			}
		});
	});

    $('#end_session').on('click', function () {
        var c = confirm("Are you sure?");
        if (c==true) {
            $.ajax({
                type: 'POST',
                url:end_session_url,
                success:function(data) {
                    window.location.replace(data);
                }
            });
        }
    });

	//Save session if window is closed
	$(window).unload(function() {
        log_message('Session paused on: ' + new Date());
		$.ajax({
			type: 'POST',
            async:false,
			url:save_session_url,
			data: {'data':session_log, 'end_session':false},
            success: function(data) {
                console.log(data);
            }
		});
	});
});
