#!/bin/bash
App="/Users/henry/Documents/application/newsExtract/news/extractor.py"
PRG_KEY="newrun"

echo $1
echo $App

function killProsess() {
	NAME=$1
	echo $NAME

    # 获取进程 PID
	PID=$(ps -e | grep  $PRG_KEY | awk '{print $1}')

	echo "PID: $PID"
    #杀死进程
	if [[ $PID != 0 ]]; then
            kill -9 $PID
            ##killall python3
            echo "$PRG_KEY $PID stoped!"
        else
            echo "$PRG_KEY not found, nothing to stop!"
    fi
}

function start() {
	echo "start"
	pid=$(ps -e | grep  $PRG_KEY | awk '{print $1}')
	echo $pid
    if [[ $pid -gt 0 ]] ; then
            echo "$PRG_KEY has started,then exit"
            exit 1
    fi
	nohup python3 -u $App runserver > nohup.log 2>&1 &
	echo "$PRG_KEY started, please check log."
}

function stop() {
	echo "stop"
	echo "----------------"
	killProsess "newrun"
}

function restart() {
	echo "restart"
	echo "----------------"
	stop
	start
}

case "$1" in
	start )
		start
		;;
	stop )
		echo "****************"
		stop
		echo "****************"
		;;
	restart )
		echo "****************"
		restart
		echo "****************"
		;;
	* )
		echo "****************"
		echo "no command"
		echo "****************"
		;;
esac