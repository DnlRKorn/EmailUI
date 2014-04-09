<?php 
session_start();
if (!isset($_SESSION['id'])) {
    header("Location: https://wwwx.cs.unc.edu/~bartel/cgi-bin/emailUI/EmailUI/consent/consent.html");
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title> Sample Email </title>

	<!-- Bootstrap -->
    <link href="libs/Bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!--Custom CSS-->
	<link rel="stylesheet" type="text/css" href="css/style.css">
</head>

<body>
<div id="container">

	<div class = "row" id="header">
		<div class="col-md-12">
			<h2> Email Prediction Test </h2>
		</div>
            <div class="modal fade" id="instructions" role="dialog" tab-index="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title">Module 1</h3>
                        </div>
                        <div class="modal-body">
                            <p>O"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-dismiss="modal">Begin Test</button>
                        </div>
                    </div>
                </div>
            </div><!-- /.modal -->
	</div>
    <div class = "row" >
        <div class="col-md-12" id="prediction_menu_options"> 
            <span> Email Prediction Interface: </span>
            <a class="selected" id="flat"> Flat </a> / <a id="hierarchical"> Hierarchical</a>
        </div>
    </div>
    <div class = "row" id="content">
        
    	<div class="col-md-1" id="navigation">
			<div class="btn-group-vertical" id="navigation">
				<button type="button" class="btn btn-default tracked click" id="nav_new_message">New Message</button>
				<button type="button" class="btn btn-default tracked click" id="nav_inbox">Inbox</button>
  				<button type="button" class="btn btn-default tracked click" id="nav_important">Important</button>
 				<button type="button" class="btn btn-default tracked click" id="nave_sent">Sent</button>
 				<button type="button" class="btn btn-default tracked click" id="nav_drafts">Drafts</button>
  				<button type="button" class="btn btn-default tracked click" id="nav_spam">Spam</button>
 				<button type="button" class="btn btn-default tracked click" id="nav_trash">Trash</button>
                <button type="button" class="btn btn-warning tracked click" id="save_session">Quit and Save</button>
                <button type="button" class="btn btn-danger tracked click" id="end_session">Quit</button>
			</div>
            
		</div>
        <div class ="col-md-10" id="email_list">
        	<div class="panel panel-default">
        		<ul class="list-group"></ul>
        	</div>
        </div>
        
        <div class ="col-md-10" id="email_expanded_col">
        	<div class="panel panel-default" id="email_expanded">
  				<div class="panel-heading"><h3 class="panel-title tracked" id="expanded_subject"></h3></div>
  				<div class="panel-body">
  				</div>
			</div>
        </div>

        <div class="col-md-6">
        <div class ="panel panel-default"  id="new_message_editor">
        	<div class="panel-heading">New Message</div>
        	<div class="panel-body">
                <input type="text" class="form-control" id="to_field" placeholder="To" autofocus><br>
            	<div id="predictions">
            	</div>
            	<input type="text" class="form-control" id="cc_field" placeholder="Cc"><br>
            	<input type="text" class="form-control tracked text" id="subect_field" placeholder="Subject">
            	<br>
            	<textarea rows="12" class ="form-control tracked text" id="message_field" placeholder="Write your message here"></textarea>
            	<div id="new_message_options">
                	<button type="button" class="btn btn-success tracked click" id="send"> Send </button>
                	<button type="button" class="btn btn-warning tracked click" id="save"> Save Draft</button>
                	<button type="button" class="btn btn-danger tracked click" id="discard"> Discard </button>
           	 	</div>
           	</div>
		</div>
		</div>
	</div>
    <!-- JS Files -->
    <script src="libs/jquery.min.js"></script>
    <script src="libs/Bootstrap/js/bootstrap.min.js"></script>

	<script src="js/email.js"></script>
	<script src="js/main.js"></script>

</body>
</html>
