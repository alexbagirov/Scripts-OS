#!/bin/bash

if [[ "$1" = "-h" || "$1" = "--help" ]];
then
  echo "PATH checker
  Cuts all paths from PATH variable which doesn't have any executables.
  Outputs clear PATH.
  ======================
  Execution example: ./$0 [folder]
  Will run for [folder] is specified."
  exit 0
fi

answer=""

if [[ ! "$1" = "" ]];
then
  folder=$1
else
  folder=$PATH
fi

for dir in $( echo "$folder" | cut -d : -f 1- --output-delimiter=" " );
do
  if [ ! -d "$dir" ];
  then
    continue
  fi

  found_executable=0
  for file in $dir/*;
  do
    if [ -x "$file" ];
    then
      found_executable=1
      break
    fi
  done

  if [ "$found_executable" = "1" ];
  then
    if [[ "$answer" = "$dir" || "$answer" = "$dir":* || "$answer" = *:"$dir" || "$answer" = *:"$dir":* ]];
    then
      continue
    fi

    if [[ "$answer" = "" ]];
    then
      answer=$dir
    else
      answer=$answer:$dir
    fi
  fi
done

echo "$answer"