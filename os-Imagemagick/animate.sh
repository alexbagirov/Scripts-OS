#!/bin/bash

angle=$1
time=$2
input=$3
output=$4

stepAngle=$(( angle / time ))

if [[ "$output" = "" ]]; then
	echo Please specify output file name
	exit 1
fi

if [[ -f $output ]]; then
	echo File with output name already exists
	exit 1
fi

if [[ ! -f $input ]]; then
	echo Input file doesn\'t exist
	exit 1
fi

lol=$input

for (( i=0; i < time; i++ )); do
	convert -rotate $stepAngle $lol $i".jpg"
	lol=$i".jpg"
done