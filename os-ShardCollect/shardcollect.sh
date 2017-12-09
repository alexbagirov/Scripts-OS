if [[ -d "$1" ]];
then
  folder=$1
else
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
folders=$folders:

usedFolders="::.::"

for i in $(lsof -Fn +D . | tail -n +2 | cut -c2-);
do
  if [[ "$i" = $folder* ]];
  then
    upperFolder=$(dirname $i)

    until [[ ! "${folders/"::$upperFolder::"}" = "$folders" ]];
    do
      upperFolder=$(dirname $upperFolder)
    done
    usedFolders=$usedFolders::$upperFolder::
  fi
done

for i in $folder/*;
do
  if [[ -d $i ]];
  then
    if [[ "${usedFolders/$i}" = "$usedFolders" ]];
    then
      echo $i
    fi
  fi
done
