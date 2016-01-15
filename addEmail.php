<?php

/*
 * Copyright (C) 2015 Hadi Mehrpouya
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/*
 * TODO:
 * Add a unique identifier to the user insert requests so if this is not them then don't insert.
 */
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
echo "hi";
$ini = parse_ini_file("config.ini");
$username = $ini['username'];
$password = $ini['password'];
$database = $ini['database'];
$host = $ini['host'];
$db = new mysqli($host, $username, $password, $database);
if (isset($_POST['email'])) {
  echo $_POST['email'];
    $_POST = array_map("strip_tags", $_POST);
    $_POST = array_map("trim", $_POST);
    if ($db->connect_errno > 0) {
        die('Unable to connect to database [' . $db->connect_error . ']');
    } else {
        $sth = $db->prepare("INSERT INTO `emails`(`email`) VALUES ('" . $_POST['email'] . "')");
        $OK = $sth->execute();

// return if successful or display error
        $result=-1;
        if ($OK) {
            $result = $sth->insert_id;
            echo $result;
        }
        else{
            echo $OK;
        }

        $sth->close();
    }
}
?>
