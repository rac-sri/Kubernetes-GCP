```
- minikube start   // --vm-driver=none if nested virtualization not supported
- minikube start --kubernetes-version v1.12.0
- kubectl cluster-info
- kubectl get nodes -o wide
- kubectl get pods --all-namespaces
- kubectl get all -o wide
- kubectl run myshell --rm -it --image busybox -- sh // create a new pod
- minikube dashboard --url
- remote ssh with web traffic transfer: ssh -i <pvt key> -L 8081:localhost:42523 username@domain  // any traffic on 8081 froward it to 43524 on the ssh tunnel, for remote minikube setup

```

### Remove minikube environment completely

```
- sudo rm -r .minikube
- sudo rm -rf /usr/local/bin/minikube
- sudo rm -rf ~/.kube
```
