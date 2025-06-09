# 🚀 Redis Docker Cheatsheet

## 🔄 Start Redis Container
```bash
docker run -d --name my-redis -p 6379:6379 redis
```

## 🛠️ Access Redis CLI
```bash
docker exec -it my-redis redis-cli
```

### Example Commands in Redis CLI
#### Get all keys
```redis
keys *
```
#### Set the key
```redis
set key_name "value"
```
#### Get the key value
```redis
get key_name
```

### Exit 
```redis
exit
```

### Remove all the keys
```redis
flushall
```

### Delete one key 
```redis
del your_key_name
```


## 🧼 Stop & Remove Redis Container
```bash
docker stop my-redis
docker rm my-redis
```

## 🧹 Prune All Stopped Containers
```bash
docker container prune
```

## 🧪 Test Redis Connection (from app)
Make sure `.env` has:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD= (if set)
```
