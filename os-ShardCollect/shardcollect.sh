#!/bin/bash

until [ -z "$1" ]
do
  case "$1" in
    -h|--help)
      echo "      ShardCollect
      ============
      echo This program outputs all subfolders without any active files.
      echo USAGE: $0 [folder]"
      exit 0
      ;;
    -d|--directory)
      if [[ -d "$2" ]];
      then
        folder=$2
      else
        folder="."
      fi
      shift
      ;;
  esac
  shift
done

if [ -z $folder ];
then
  folder="."
fi

folders="::.:"
for file in $folder/*;
do
  if [[ -d $file ]];
  then
    folders=$folders:$file:
  fi
done
folders="$folders:"

usedFolders="::.::"

for line in $(lsof -Fn +D $folder 2>/dev/null | tail -n +2);
do
  if [[ "$line" = n* ]];
  then
    upperFolder=$(dirname "${line/n}")

    while [[ "${folders/::$upperFolder::}" = "$folders" ]];
    do
      upperFolder=$(dirname "$upperFolder")
    done
    usedFolders=$usedFolders::$upperFolder::
  fi
done

IFS=$'\n'
for dir in $folder/*;
do
  if [[ -d $dir ]];
  then
    if [[ "${usedFolders/::$dir::}" = "$usedFolders" ]];
    then
      echo "$dir"
    fi
  fi
done
