<?php

$file = "/afs/cs.unc.edu/home/bartel/public_html/cgi-bin/emailUI/EmailUI/config.properties";

$output = exec('java -jar ConfigFileDriver.jar write '.$file);
print $output;
?>
