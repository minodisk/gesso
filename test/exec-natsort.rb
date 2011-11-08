#!/usr/local/bin/ruby

require 'cgi';
qs = CGI.new;

print "Content-type: text/html\n\n";
print qs['src']