

### Dump from Source DB (Your Cluster)

Open your **terminal** (Command Prompt / Bash / zsh), and run:

```bash
mongodump \
  --uri="mongodb+srv://rohanvinkare2022:TCjyqJjkBWmADA6F@cluster0.4blm2.mongodb.net/Booklio?retryWrites=true&w=majority&appName=Cluster0" \
  --out=./booklio-dump
```

 This creates a local folder `booklio-dump/` with all the data inside.

---

### Restore to Target Cluster

You’ll now upload the same data to your new MongoDB Atlas cluster.

Replace `<target-uri>` below with your **new destination Atlas URI**, like:

```
mongodb+srv://<username>:<password>@<target-cluster>.mongodb.net
```

Run:

```bash
mongorestore \
  --uri="mongodb+srv://<username>:<password>@<target-cluster>.mongodb.net" \
  ./booklio-dump
```

---

