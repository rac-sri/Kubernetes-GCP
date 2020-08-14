### Start Services

```
- kubectl create -f influxdb.yaml  // and so on
- kubectl -n kube-system get pods -o wide
```

### Get Token

```
- kubectl describe sa dashboard-admin
- kubectl get secret <Mountanable Secrets from above>
- kubectl get secret <Mountanable Secrets from above> -n kube-system
- kubectl describe secret <Mountanable Secrets from above> -n kube-system
```
