<html>
<head>
  <style type="text/css">
    ul {
      list-style-type : none;
      padding         : 0;
    }
    input[type="text"] {
      width : 100%;
    }
  </style>
  <script type="text/javascript">
    (function (document) {
      window.addEventListener('DOMContentLoaded', function (e) {
        var dst = document.querySelector('#dst');
        dst.selectionStart = 0;
        dst.selectionEnd = dst.value.length;
      });
    })(window.document);
  </script>
</head>
<body>
<p>phpversion = <?php echo phpversion(); ?></p>
<?php
$src = $_POST["src"];
if (get_magic_quotes_gpc()) {
  $src = stripslashes($src);
}
$arr = explode(",", $src);
for ($i = 0, $len = sizeof($arr); $i < $len; ++$i) {
  $arr[$i] = preg_replace("/^\s*\'(.*?)\'\s*$/", "$1", $arr[$i]);
}
shuffle($arr);
natsort($arr);
for ($i = 0, $len = sizeof($arr); $i < $len; ++$i) {
  $arr[$i] = "'" . $arr[$i] . "'";
}
$dst = implode(", ", $arr);
?>
<ul>
  <li>
    <form action="make_natsort_test.php" method="post">
      <label>src:</label><input type="text" name="src" value="<?php echo $src; ?>"/>
      <input type="submit" value="shuffle -> natsort"/>
    </form>
  </li>
  <li>
    <span>dst:</span><span>
    <input type="text" id="dst" value="<?php echo $dst; ?>"/>
  </li>
</ul>
</body>
</html>