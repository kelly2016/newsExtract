#!/usr/bin/env bash
export LANG=zh_CN.UTF-8

PRG_KEY="newrun"
RUN_PATH="/Users/henry/Documents/application/newsExtract/news/"
#/home/student/project-01/nlpBar/news/"

cd $RUN_PATH

case "$1" in
    start)
        nohup python3 -u $RUN_PATH/extractor.py runserver > nohup.log 2>&1 &

        echo "$PRG_KEY started, please check log."

        ;;

    stop)
        pid=$(pgrep -f $PRG_KEY)
        echo "$pid"
        kill -9 $pid
            ##killall python3
        echo "$PRG_KEY stoped!"

        ;;

    restart)
        $0 stop
        sleep 1
        $0 start

        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
esac

exit 0
