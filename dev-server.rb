require 'sinatra'

# Serve only static files
set :public_folder, File.dirname(__FILE__)
