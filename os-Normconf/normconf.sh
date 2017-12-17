#!/bin/bash

if [[ "$1" = "-h" || "$1" = "--help" ]];
then
  echo "Normconf
  ===============
  This program adjusts usual units to system-specific (seconds for time, kilograms for weight, meters for distance).
  Example of acceptable expressions: min=5m, days=5t 10kg, something=5min - 10d + 6h.
  Note: all incorrect arguments will be warned.
  ===============
  USAGE: $0 [filename]"
  exit 0
fi

if [[ "$1" = "" ]];
then
  echo "Please provide file name."
  exit 0
fi

if [[ ! -f $1 ]];
then
  echo "File not found."
  exit 0
fi

fileName=$1
time=":s:min:h:d:"
ditance=":mm:sm:dm:m:km:"
weight=":mg:g:kg:t:"
nbOfLine=0

IFS=$'\n'
for line in $( cat $fileName ); do
  nbOfLine=$(( nbOfLine + 1 ))
  key=$( echo $line | cut -d "=" -f 1 )
  sum=0
  IFS=' '
  operation="+"
  dataType=""

  for i in $( echo $line | cut -d "=" -f 2 | cut -d " " -f 1- );
  do
    value=0

    if [[ "$dataType" = "" ]];
    then
      case $i in
        *"s"|*"min"|*"h"|*"d")
          dataType="time"
          ;;
        *"mm"|*"sm"|*"dm"|*"m"|*"km")
          dataType="distance"
          ;;
        *"mg"|*"g"|*"kg"|*"t")
          dataType="weight"
      esac
    elif [[ ! "$i" = "-" && ! "$i" = "+" ]];
    then
      case $dataType in
        "time")
          if [[ ! "$i" = *"s" && ! "$i" = *"min" && ! "$i" = *"h" && ! "$i" = *"d" ]];
          then
            echo Ошибочный параметр в строке $nbOfLine: $i
            continue
          fi
          ;;
        "distance")
          if [[ ! "$i" = *"mm" && ! "$i" = *"sm" && ! "$i" = *"dm" && ! "$i" = *"m" && ! "$i" = *"km" ]];
          then
            echo Ошибочный параметр в строке $nbOfLine: $i
            continue
          fi
          ;;
        "time")
          if [[ ! "$i" = *"mg" && ! "$i" = *"g" && ! "$i" = *"kg" && ! "$i" = *"t" ]];
          then
            echo Ошибочный параметр в строке $nbOfLine: $i
            continue
          fi
          ;;
        esac
    fi

    case $i in
      *"min")
        i=${i%"min"}
        value=$( awk "BEGIN {print $i * 60}" )
        ;;
      *"mm")
        i=${i%"mm"}
        value=$( awk "BEGIN {print $i / 1000}" )
        ;;
      *"sm")
        i=${i%"sm"}
        value=$( awk "BEGIN {print $i / 100}" )
        ;;
      *"dm")
        i=${i%"dm"}
        value=$( awk "BEGIN {print $i / 10}" )
        ;;
      *"km")
        i=${i%"km"}
        value=$( awk "BEGIN {print $i * 1000}" )
        ;;
      *"mg")
        i=${i%"mg"}
        value=$( awk "BEGIN {print $i / 1000000}" )
        ;;
      *"kg")
        i=${i%"kg"}
        value=$( awk "BEGIN {print $i}" )
        ;;
      *"t")
        i=${i%"t"}
        value=$( awk "BEGIN {print $i * 1000}" )
        ;;
      *"m")
        i=${i%"m"}
        value=$( awk "BEGIN {print $i}" )
        ;;
      *"h")
        i=${i%"h"}
        value=$( awk "BEGIN {print $i * 3600}" )
        ;;
      *"d")
        i=${i%"d"}
        value=$( awk "BEGIN {print $i * 86400}" )
        ;;
      *"g")
        i=${i%"g"}
        value=$( awk "BEGIN {print $i / 1000}" )
        ;;
      *"s")
        i=${i%"s"}
        value=$( awk "BEGIN {print $i}" )
        ;;
      "-")
        operation="-"
        continue
        ;;
    esac

    if [[ "$operation" = "-" ]];
    then
      sum=$( awk "BEGIN {print $sum - $value}" )
      operation="+"
    else
      sum=$( awk "BEGIN {print $sum + $value}" )
    fi

  done
  echo $key=$sum

done
