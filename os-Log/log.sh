#!/bin/bash

if [[ "$1" = "-h" || "$1" = "--help" ]];
then
  echo "Log Analyzer"
  echo "This program outputs the median of all processing time for specified resourse"
  echo "or for all log records if the resource is not specified."
  echo "USAGE: $0 <filename> [resource]"
  exit 0
fi

if [[ ! -f "$1" ]];
then
  echo "File doesn't exist or not provided."
  exit 0
else
  file=$1
fi

source=$2

while read -r i
    do
      if [[ "$i" = *"$source"* ]];
      then
        array[${#array[@]}]=$( echo "$i" | tr -d ' ' | cut -d "|" -f  5 )
      fi
done < "$file"

sortedArray=( $( printf "%s\n" "${array[@]}" | sort -n ) )

if [[ $((${#sortedArray[@]}%2)) -eq 0 ]];
then
  first=$((${sortedArray[${#sortedArray[@]}%2]}))
  second=$((${sortedArray[${#sortedArray[@]}%2+1]}))
  echo "scale=2; ($first + $second) / 2" | bc -l
else
  echo "${sortedArray[$((${#sortedArray[@]}/2))]}"
fi
