## To build and Start

```
 docker-compose build
 
 docker-compose up -d

```

## To stop and Remove

```
docker ps -a

docker stop $(docker ps -aq)
docker rm -f $(docker ps -aq)
docker ps -a  # Should show no containers


```


## Access Redis cli in docker 

```
docker exec -it my-redis redis-cli

keys *

flushall

```
