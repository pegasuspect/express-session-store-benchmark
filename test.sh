#!/bin/bash


store=( none memory redis mongo)
concurrency=( 1 10 100 500)

for c in "${concurrency[@]}"
do
	echo "Concurrency: ${c}"
	for s in "${store[@]}"
	do
		echo -n -e "${s}\t"
		node "${s}" &
		PID=$!
		sleep 2 # so the server can settle
		kill $PID
		wait $PID > /dev/null
		docker run --rm jordi/ab -q -k -c $c -n 10000 \
			"http://$HOSTNAME:5000/" | \
			grep "Requests per second" | \
			awk '{ print $4,$5 }'
	done
done