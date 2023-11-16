<?php

function get_definition_tables(){
    global $database;
    $def_tables = $database-> select("definition_tables","*");
    return $def_tables;
}

function get_table_header($table_name){
    global $database;
    $table_data = $database -> select($table_name,'*',['LIMIT'=>1]);
    if(count($table_data)==0){
        return array();
    }
    return(array_keys($table_data[0]));

}
