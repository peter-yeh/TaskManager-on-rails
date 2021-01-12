# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#

Task.create(name:"First task", description:"body of first task", tag:"tag of first task", due:"2020-12-29 11:12:23", priority:2, done: false)
Task.create(name:"Second task", description:"body of second task", tag:"tag of second task", due:"2021-12-29 11:12:23", priority:3, done: true)
