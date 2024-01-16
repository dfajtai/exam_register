<?php

function myUrlEncode($string) {
  $entities = array('%21', '%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%25', '%23', '%5B', '%5D');
  $replacements = array('!', '*', "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ",", "/", "?", "%", "#", "[", "]");
  return str_replace($entities, $replacements, urlencode($string));
}


function var_error_log( $object=null ){
  ob_start();                    // start buffer capture
  var_dump( $object );           // dump the values
  $contents = ob_get_contents(); // put the buffer into a variable
  ob_end_clean();                // end capture
  error_log( $contents );        // log contents of the result of var_dump( $object )
}

function array_decode_numbers(&$array){
  foreach($array as $key => $value) 
  {
    if($value==''){
      $array[$key] = null;
    }
    elseif(is_numeric($value))
      $array[$key] = $value + 0;
    else 
      $array[$key] = $value;        
  }

}