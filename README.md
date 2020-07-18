# Kubernetes-GCP

#### Orchestration

In Development (Dev) environments, running containers on a single host for development and testing of applications may be an option. However, when migrating to Quality Assurance (QA) and Production (Prod) environments, that is no longer a viable option because the applications and services need to meet specific requirements:

- Fault-tolerance
- On-demand scalability
- Optimal resource usage
- Auto-discovery to automatically discover and communicate with each other
- Accessibility from the outside world
- Seamless updates/rollbacks without any downtime.

**Container orchestrators** are tools which group systems together to form clusters where containers' deployment and management is automated at scale while meeting the requirements mentioned above.

**Most container orchestrators can**
Group hosts together while creating a cluster
Schedule containers to run on hosts in the cluster based on resources availability
Enable containers in a cluster to communicate with each other regardless of the host they are deployed to in the cluster
Bind containers and storage resources
Group sets of similar containers and bind them to load-balancing constructs to simplify access to containerized applications by creating a level of abstraction between the containers and the user
Manage and optimize resource usage
Allow for implementation of policies to secure access to applications running inside containers.

#### Kubernetes offers a very rich set of features for container orchestration. Some of its fully supported features are:

- Automatic bin packing
- Kubernetes automatically schedules containers based on resource needs and constraints, to maximize utilization without sacrificing availability.
- Self-healing
- Kubernetes automatically replaces and reschedules containers from failed nodes. It kills and restarts containers unresponsive to health checks, based on existing rules/policy. It also prevents traffic from being routed to unresponsive containers.
- Horizontal scaling
- With Kubernetes applications are scaled manually or automatically based on CPU or custom metrics utilization.
- Service discovery and Load balancing
- Containers receive their own IP addresses from Kubernetes, while it assigns a single Domain Name System (DNS) name to a set of containers to aid in load-balancing requests across the containers of the set.
- Automated rollouts and rollbacks
- Kubernetes seamlessly rolls out and rolls back application updates and configuration changes, constantly monitoring the application's health to prevent any downtime.
- Secret and configuration management
- Kubernetes manages secrets and configuration details for an application separately from the container image, in order to avoid a re-build of the respective image. Secrets consist of confidential information passed to the application without revealing the sensitive content to the stack configuration, like on GitHub.
- Storage orchestration
- Kubernetes automatically mounts software-defined storage (SDS) solutions to containers from local storage, external cloud providers, or network storage systems.
- Batch execution
- Kubernetes supports batch execution, long-running jobs, and replaces failed containers.

##### The Cloud Native Computing Foundation (CNCF)

CNCF is one of the projects hosted by the Linux Foundation. CNCF aims to accelerate the adoption of containers, microservices, and cloud-native applications.

CNCF hosts a multitude of projects, with more to be added in the future. CNCF provides resources to each of the projects, but, at the same time, each project continues to operate independently under its pre-existing governance structure and with its existing maintainers. Projects within CNCF are categorized based on achieved status: Sandbox, Incubating, and Graduated. At the time this course was created, there were six projects with Graduated status (Kubernetes) and many more still Incubating and in the Sandbox.

### Kubernetes Architecture

At a very high level, Kubernetes has the following main components:

- One or more master nodes
- One or more worker nodes
- Distributed key-value store, such as etcd.

#### Master Node

The master node provides a running environment for the control plane responsible for managing the state of a Kubernetes cluster, and it is the brain behind all operations inside the cluster. The control plane components are agents with very distinct roles in the cluster's management. In order to communicate with the Kubernetes cluster, users send requests to the master node via a Command Line Interface (CLI) tool, a Web User-Interface (Web UI) Dashboard, or Application Programming Interface (API).

A master node has the following components:

- API server
- Scheduler
- Controller managers
- etcd

**Master: API server**
All the administrative tasks are coordinated by the kube-apiserver, a central control plane component running on the master node. The API server intercepts RESTful calls from users, operators and external agents, then validates and processes them. During processing the API server reads the Kubernetes cluster's current state from the etcd, and after a call's execution, the resulting state of the Kubernetes cluster is saved in the distributed key-value data store for persistence. The API server is the only master plane component to talk to the etcd data store, both to read and to save Kubernetes cluster state information from/to it - acting as a middle-man interface for any other control plane agent requiring to access the cluster's data store.

**Master:Scheduler**
The role of the kube-scheduler is to assign new objects, such as pods, to nodes. During the scheduling process, decisions are made based on current Kubernetes cluster state and new object's requirements. The scheduler obtains from etcd, via the API server, resource usage data for each worker node in the cluster. The scheduler also receives from the API server the new object's requirements which are part of its configuration data. Requirements may include constraints that users and operators set, such as scheduling work on a node labeled with disk==ssd key/value pair. The scheduler also takes into account Quality of Service (QoS) requirements, data locality, affinity, anti-affinity, taints, toleration, etc.

**Master:Controller Managers**
The controller managers are control plane components on the master node running controllers to regulate the state of the Kubernetes cluster. Controllers are watch-loops continuously running and comparing the cluster's desired state (provided by objects' configuration data) with its current state (obtained from etcd data store via the API server). In case of a mismatch corrective action is taken in the cluster until its current state matches the desired state.
The kube-controller-manager runs controllers responsible to act when nodes become unavailable, to ensure pod counts are as expected, to create endpoints, service accounts, and API access tokens.
The cloud-controller-manager runs controllers responsible to interact with the underlying infrastructure of a cloud provider when nodes become unavailable, to manage storage volumes when provided by a cloud service, and to manage load balancing and routing.

**Master:etcd**
etcd is a distributed key-value data store used to persist a Kubernetes cluster's state. New data is written to the data store only by appending to it, data is never replaced in the data store. Obsolete data is compacted periodically to minimize the size of the data store.
Out of all the control plane components, only the API server is able to communicate with the etcd data store.
etcd's CLI management tool provides backup, snapshot, and restore capabilities which come in handy especially for a single etcd instance Kubernetes cluster - common in Development and learning environments. However, in Stage and Production environments, it is extremely important to replicate the data stores in HA mode, for cluster configuration data resiliency.
Besides storing the cluster state, etcd is also used to store configuration details such as subnets, ConfigMaps, Secrets, etc.

#### Worker Node

A worker node provides a running environment for client applications. Though containerized microservices, these applications are encapsulated in Pods, controlled by the cluster control plane agents running on the master node. Pods are scheduled on worker nodes, where they find required compute, memory and storage resources to run, and networking to talk to each other and the outside world.
_A Pod is the smallest scheduling unit in Kubernetes. It is a logical collection of one or more containers scheduled together._
![](images/workernode.png)

A worker node has the following components:

- Container runtime
- kubelet
- kube-proxy
- Addons for DNS, Dashboard, cluster-level monitoring and logging.

**Kubernetes does not have the capability to directly handle containers. In order to run and manage a container's lifecycle, Kubernetes requires a container runtime on the node where a Pod and its containers are to be scheduled.**

**WorkerNode:kubelet**
The kubelet is an agent running on each node and communicates with the control plane components from the master node. It receives Pod definitions, primarily from the API server, and interacts with the container runtime on the node to run containers associated with the Pod. It also monitors the health of the Pod's running containers.
The kubelet connects to the container runtime using Container Runtime Interface (CRI). CRI consists of protocol buffers, gRPC API, and libraries.

![](images/CRI.png)

CRI implements two services: `ImageService` and `RuntimeService`. The ImageService is responsible for all the image-related operations, while the RuntimeService is responsible for all the Pod and container-related operations.
![](images/dockershim.png)

![](images/cri-containerd.png)

![](images/crio.png)

**WorkerNode:kube-proxy**
The kube-proxy is the network agent which runs on each node responsible for dynamic updates and maintenance of all networking rules on the node. It abstracts the details of Pods networking and forwards connection requests to Pods.

**Worker Node Components: Addons**
Addons are cluster features and functionality not yet available in Kubernetes, therefore implemented through 3rd-party pods and services.

- DNS - cluster DNS is a DNS server required to assign DNS records to Kubernetes objects and resources
- Dashboard - a general purposed web-based user interface for cluster management
- Monitoring - collects cluster-level container metrics and saves them to a central data store
- Logging - collects cluster-level container logs and saves them to a central log store for analysis.

_The Kubernetes network model aims to reduce complexity, and it treats Pods as VMs on a network, where each VM receives an IP address - thus each Pod receiving an IP address. This model is called "IP-per-Pod" and ensures Pod-to-Pod communication, just as VMs are able to communicate with each other._

**_Container Network Interface (CNI)_**
![](images/cni.png)

**For a successfully deployed containerized applications running in Pods inside a Kubernetes cluster, it requires accessibility from the outside world. Kubernetes enables external accessibility through services, complex constructs which encapsulate networking rules definitions on cluster nodes. By exposing services to the external world with kube-proxy, applications become accessible from outside the cluster over a virtual IP.**

## Installation

Kubernetes can be installed using different configurations. The four major installation types are briefly presented below:

- **All-in-One Single-Node Installation**
  In this setup, all the master and worker components are installed and running on a single-node. While it is useful for learning, development, and testing, it should not be used in production. Minikube is one such example, and we are going to explore it in future chapters.
- **Single-Node etcd, Single-Master and Multi-Worker Installation**
  In this setup, we have a single-master node, which also runs a single-node etcd instance. Multiple worker nodes are connected to the master node.
- **Single-Node etcd, Multi-Master and Multi-Worker Installation**
  In this setup, we have multiple-master nodes configured in HA mode, but we have a single-node etcd instance. Multiple worker nodes are connected to the master nodes.
- **Multi-Node etcd, Multi-Master and Multi-Worker Installation**
  In this mode, etcd is configured in clustered HA mode, the master nodes are all configured in HA mode, connecting to multiple worker nodes. This is the most advanced and recommended production setup.

#### LocalHost Installation

These are only a few localhost installation options available to deploy single- or multi-node Kubernetes clusters on our workstation/laptop:

- Minikube - single-node local Kubernetes cluster
- Docker Desktop - single-node local Kubernetes cluster for Windows and Mac
- CDK on LXD - multi-node local cluster with LXD containers.
- Minikube is the preferred and recommended way to create an all-in-one Kubernetes setup locally.

#### Some useful tools/resources available:

**kubeadm**

[kubeadm](https://github.com/kubernetes/kubeadm) is a first-class citizen on the Kubernetes ecosystem. It is a secure and recommended way to bootstrap a single- or multi-node Kubernetes cluster. It has a set of building blocks to setup the cluster, but it is easily extendable to add more features. Please note that kubeadm does not support the provisioning of hosts.

**kubespray**
With [kubespray](https://kubernetes.io/docs/setup/production-environment/tools/kubespray/) (formerly known as kargo), we can install Highly Available Kubernetes clusters on AWS, GCE, Azure, OpenStack, or bare metal. Kubespray is based on Ansible, and is available on most Linux distributions. It is a Kubernetes Incubator project.

**kops**

With [kops](https://kubernetes.io/docs/setup/custom-cloud/kops/), we can create, destroy, upgrade, and maintain production-grade, highly-available Kubernetes clusters from the command line. It can provision the machines as well. Currently, AWS is officially supported. Support for GCE is in beta, and VMware vSphere in alpha stage, and other platforms are planned for the future. Explore the kops project for more details.

**kube-aws**

With [kube-aws](https://github.com/kubernetes-incubator/kube-aws) we can create, upgrade and destroy Kubernetes clusters on AWS from the command line. Kube-aws is also a Kubernetes Incubator project.

---

- **kubectl** is a binary used to access and manage any Kubernetes cluster

#### Minikube

##### Installation

```
 - curl -Lo minikube https://storage.googleapis.com/minikube/releases/v1.0.1/minikube-linux-amd64 && - - chmod +x minikube && sudo mv minikube /usr/local/bin/
```

```
- minikube start
- service docker start
- minikube status
- minicube stop
```

> CRI-O is an implementation of the Kubernetes CRI (Container Runtime Interface) to enable using OCI (Open Container Initiative) compatible runtimes.

```
- minikube start --container-runtime=cri-o
- minicube ssh    // login to minicube vm
- sudo docker container ls
- sudo runc list // list the container created by cri-o runtime
```

##### Accessing minicube

- Command Line Interface (CLI) tools and scripts ( kubectl )
- Web-based User Interface (Web UI) from a web browser ([Web ui Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/))
- APIs from CLI or programmatically

![](images/api-server-space.jpg)
**Core Group (/api/v1)**

This group includes objects such as Pods, Services, nodes, namespaces, configmaps, secrets, etc.

**Named Group**

This group includes objects in /apis/$NAME/$VERSION format. These different API versions imply different levels of stability and support:

- Alpha level - it may be dropped at any point in time, without notice. For example, /apis/batch/v2alpha1.
- Beta level - it is well-tested, but the semantics of objects may change in incompatible ways in a subsequent beta or stable release. For example, /apis/certificates.k8s.io/v1beta1.
- Stable level - appears in released software for many subsequent versions. For example, /apis/networking.k8s.io/v1.

**System-wide**
This group consists of system-wide API endpoints, like /healthz, /logs, /metrics, /ui, etc.

---

##### kubectl

###### Installation

```
- curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/
- curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.14.1/bin/linux/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/
```

```
- kubectl config view  or  ~/.kube/config (linux)
- kubectl cluster-info
- minikube dashboard  // web interface
- kubectl proxy // Issuing the kubectl proxy command, kubectl authenticates with the API server on the master node and makes the Dashboard available on a slightly different URL than the one earlier, this time through the proxy port 8001.
- curl http://localhost:8001/
```

##### APIs - without 'kubectl proxy'

When not using the kubectl proxy, we need to authenticate to the API server when sending API requests. We can authenticate by providing a Bearer Token when issuing a curl, or by providing a set of keys and certificates.

_Get the token :_

> TOKEN=$(kubectl describe secret -n kube-system $(kubectl get secrets -n kube-system | grep default | cut -f1 -d ' ') | grep -E '^token' | cut -f2 -d':' | tr -d '\t' | tr -d " ")

_Get the API server endpoint_

> APISERVER=\$(kubectl config view | grep https | cut -f 2- -d ":" | tr -d " ")

_Confirm that the APISERVER stored the same IP as the Kubernetes master IP by issuing the following 2 commands and comparing their outputs:_

> echo \$APISERVER
> kubectl cluster-info

_Access the API server using the curl command_

> curl $APISERVER --header "Authorization: Bearer $TOKEN" --insecure

### Kubernetes Building Blocks

##### Kubernetes Object Model

Kubernetes has a very rich object model, representing different persistent entities in the Kubernetes cluster. Those entities describe:

- What containerized applications we are running and on which node
- Application resource consumption
- Different policies attached to applications, like restart/upgrade policies, fault tolerance, etc.
  With each object, we declare our intent spec section. The Kubernetes system manages the status section for objects, where it records the actual state of the object. At any given point in time, the Kubernetes Control Plane tries to match the object's actual state to the object's desired state.
  Examples of Kubernetes objects are Pods, ReplicaSets, Deployments, Namespaces, etc. We will explore them next.
  When creating an object, the object's configuration data section from below the spec field has to be submitted to the Kubernetes API server. The spec section describes the desired state, along with some basic information, such as the object's name.

[Checkout the example configarion file of deployment.](deployment.yml)

#### PODS

A Pod is the smallest and simplest Kubernetes object. It is the unit of deployment in Kubernetes, which represents a single instance of the application. A Pod is a logical collection of one or more containers, which:

- Are scheduled together on the same host with the Pod
- Share the same network namespace
- Have access to mount the same external storage (volumes).

![](images/Pods.png)

[Checkout the example configarion file of pod.](pods.yml)

---

Controllers use **Label Selectors** to select a subset of objects. Kubernetes supports two types of Selectors:

**Equality-Based Selectors**
Equality-Based Selectors allow filtering of objects based on Label keys and values. Matching is achieved using the =, == (equals, used interchangeably), or != (not equals) operators. For example, with env==dev or env=dev we are selecting the objects where the env Label key is set to value dev.
**Set-Based Selectors**
Set-Based Selectors allow filtering of objects based on a set of values. We can use in, notin operators for Label values, and exist/does not exist operators for Label keys. For example, with env in (dev,qa) we are selecting objects where the env Label is set to either dev or qa; with !app we select objects with no Label key app.

##### ReplicaSets

A ReplicaSet is the next-generation ReplicationController. ReplicaSets support both equality- and set-based selectors, whereas ReplicationControllers only support equality-based Selectors.

Creating a pod to match current and desired state:
![](images/ReplicaSet3.png)

ReplicaSets can be used independently as Pod controllers but they only offer a limited set of features. A set of complementary features are provided by Deployments, the recommended controllers for the orchestration of Pods. Deployments manage the creation, deletion, and updates of Pods. A Deployment automatically creates a ReplicaSet, which then creates a Pod. There is no need to manage ReplicaSets and Pods separately, the Deployment will manage them on our behalf.

#### Deployments

Deployment objects provide declarative updates to Pods and ReplicaSets. The DeploymentController is part of the master node's controller manager, and it ensures that the current state always matches the desired state. It allows for seamless application updates and downgrades through rollouts and rollbacks, and it directly manages its ReplicaSets for application scaling.

![](images/Deployment.png)

> In the Deployment, we change the Pods' Template and we update the container image from nginx:1.7.9 to nginx:1.9.1. The Deployment triggers a new ReplicaSet B for the new container image versioned 1.9.1 and this association represents a new recorded state of the Deployment, Revision 2. The seamless transition between the two ReplicaSets, from ReplicaSet A with 3 Pods versioned 1.7.9 to the new ReplicaSet B with 3 new Pods versioned 1.9.1, or from Revision 1 to Revision 2, is a Deployment rolling update.

![](images/Replika.png)

> The Deployment keeps its prior configuration states saved as Revisions which play a key factor in the rollback capability of the Deployment - returning to a prior known configuration state.

#### Namespaces

If multiple users and teams use the same Kubernetes cluster we can partition the cluster into virtual sub-clusters using Namespaces. The names of the resources/objects created inside a Namespace are unique, but not across Namespaces in the cluster.

> kubectl get namespaces

##### Demo commands for deployment ( nginx example ):

```
1. kubectl create deployment mynginx --image=nginx:1.15-alpine
2. kubectl get deploy,rs,po -l app=mynginx    // po : pod rs: replicas
3. kubectl  scale deploy mynginx --replicas=3
4. kubectl describe deployment
5. kubectl rollout history deploy mynginx  // see rollout history of deploy of my nginx
6. kubectl rollout history deploy mynginx --revision=1
7. kubectl set image deployment mynginx nginx=nginx:1.16-alpine   // update image
8. kubectl rollout undo deployment mynginx --to-revision=1
```

#### Authentication

For authentication, Kubernetes uses different authentication modules:

- Client Certificates
  To enable client certificate authentication, we need to reference a file containing one or more certificate authorities by passing the --client-ca-file=SOMEFILE option to the API server. The certificate authorities mentioned in the file would validate the client certificates presented to the API server. A demonstration video covering this topic is also available at the end of this chapter.
- Static Token File
  We can pass a file containing pre-defined bearer tokens with the --token-auth-file=SOMEFILE option to the API server. Currently, these tokens would last indefinitely, and they cannot be changed without restarting the API server.
- Bootstrap Tokens
  This feature is currently in beta status and is mostly used for bootstrapping a new Kubernetes cluster.
- Static Password File
  It is similar to Static Token File. We can pass a file containing basic authentication details with the --basic-auth-file=SOMEFILE option. These credentials would last indefinitely, and passwords cannot be changed without restarting the API server.
- Service Account Tokens
  This is an automatically enabled authenticator that uses signed bearer tokens to verify the requests. These tokens get attached to Pods using the ServiceAccount Admission Controller, which allows in-cluster processes to talk to the API server.
- OpenID Connect Tokens
  OpenID Connect helps us connect with OAuth2 providers, such as Azure Active Directory, Salesforce, Google, etc., to offload the authentication to external services.
- Webhook Token Authentication
  With Webhook-based authentication, verification of bearer tokens can be offloaded to a remote service.
- Authenticating Proxy
  If we want to program additional authentication logic, we can use an authenticating proxy.

#### Authorisation Module

- Node Authorizer
  Node authorization is a special-purpose authorization mode which specifically authorizes API requests made by kubelets. It authorizes the kubelet's read operations for services, endpoints, nodes, etc., and writes operations for nodes, pods, events, etc. For more details, please review the Kubernetes documentation.

- Attribute-Based Access Control (ABAC) Authorizer
  With the ABAC authorizer, Kubernetes grants access to API requests, which combine policies with attributes. [Example.](auth.json)

  To enable the ABAC authorizer, we would need to start the API server with the `--authorization-mode=ABAC` option. We would also need to specify the authorization policy with `--authorization-policy-file=PolicyFile.json`. For more details, please review the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/node/).

- Webhook Authorizer
  With the Webhook authorizer, Kubernetes can offer authorization decisions to some third-party services, which would return true for successful authorization, and false for failure. In order to enable the Webhook authorizer, we need to start the API server with the `--authorization-webhook-config-file=SOME_FILENAME` option, where SOME_FILENAME is the configuration of the remote authorization service. For more details, please see the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/webhook/).

- Role-Based Access Control (RBAC) Authorizer
  In general, with RBAC we can regulate the access to resources based on the roles of individual users. In Kubernetes, we can have different roles that can be attached to subjects like users, service accounts, etc. While creating the roles, we restrict resource access by specific operations, such as create, get, update, patch, etc. These operations are referred to as verbs.

  [RoleExample](role.yml)

  [RoleBindingExample](roleBinding.yml)

  To enable the **RBAC authorizer**, we would need to start the API server with the `--authorization-mode=RBAC` option. With the RBAC authorizer, we dynamically configure policies. For more details, please review the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

##### Admission Control

Admission control is used to specify granular access control policies, which include allowing privileged containers, checking on resource quota, etc. We force these policies using different admission controllers, like ResourceQuota, DefaultStorageClass, AlwaysPullImages, etc. They come into effect only after API requests are authenticated and authorized.

To use admission controls, we must start the Kubernetes API server with the `--enable-admission-plugins`, which takes a comma-delimited, ordered list of controller names:
`--enable-admission-plugins=NamespaceLifecycle,ResourceQuota,PodSecurityPolicy,DefaultStorageClass`

##### Authorisation and Authentication Implementation

Demo commands:

```
1. minikube start
2. kubectl config view
3. kubectl create namespace lfs158
4. mkdir rbac
5. cd rbac/
6. openssl genrsa -out student.key 2048 /
7. openssl req -new -key student.key -out student.csr -subj "/CN=student/O=learner" /Create a private key for the student user with openssl tool, then create a certificate signing request for the student user with openssl tool.

8. Create a YAML configuration file for a certificate signing request object, and save it with a blank value for the request field.
  - [signing-request.yaml](rbac/signing-request.yaml)

9. View the certificate, encode it in base64, and assign it to the request field in the signing-request.yaml file
- cat student.csr | base64 | tr -d '\n'
Put this in signing-request.yaml

10. Create the certificate signing request object, then list the certificate signing request objects. It shows a pending state:
  - kubectl create -f signing-request.yaml

11. kubectl get csr
12. Approve the certificate signing request object, then list the certificate signing request objects again. It shows both approved and issued states:
  - kubectl certificate approve student-csr

13. kubectl get csr
14. Extract the approved certificate from the certificate signing request, decode it with base64 and save it as a certificate file. Then view the certificate in the newly created certificate file:
  - kubectl get csr student-csr -o jsonpath='{.status.certificate}' | base64 --decode > student.crt
  - cat student.crt

15. Configure the student user's credentials by assigning the key and certificate:
  - kubectl config set-credentials student --client-certificate=student.crt --client-key=student.key

16. Create a new context entry in the kubectl client's configuration file for the student user, associated with the lfs158 namespace in the minikube cluster:
  - kubectl config set-context student-context --cluster=minikube --namespace=lfs158 --user=student

17. kubectl config view
18. While in the default minikube context, create a new deployment in the lfs158 namespace:
  - kubectl -n lfs158 create deployment nginx --image=nginx:alpine

19. From the new context student-context try to list pods. The attempt fails because the student user has no permissions configured for the student-context:
  - kubectl --context=student-context get pods

// Assigning Permissions

20. Create a [YAML configuration file](rbac/role.yaml) for a pod-reader role object, which allows only get, watch, list actions in the lfs158 namespace against pod objects. Then create the role object and list it from the default minikube context, but from the lfs158 namespace.
  - kubectl create -f role.yaml
  - kubectl -n lfs158 get roles

21.  Create a [YAML configuration file](rbac/rolebinding.yaml) for a rolebinding object, which assigns the permissions of the pod-reader role to the student user. Then create the rolebinding object and list it from the default minikube context, but from the lfs158 namespace. Then:
  - kubectl create -f rolebinding.yaml
  - kubectl -n lfs158 get rolebindings
  - kubectl --context=student-context get pods
```

---

### Services

Services are used to group Pods to provide common access points from the external world to the containerized applications.

##### Connecting Users to PODS

To access the application, a user/client needs to connect to the Pods. As Pods are ephemeral in nature, resources like IP addresses allocated to it cannot be static. Pods could be terminated abruptly or be rescheduled based on existing requirements.

![](images/SOE.png)

The user/client now connects to a Service via its ClusterIP, which forwards traffic to one of the Pods attached to it. A Service provides load balancing by default while selecting the Pods for traffic forwarding.

[Example](serviceObject.yml)

> If the targetPort is not defined explicitly, then traffic will be forwarded to Pods on the port on which the Service receives traffic.

##### kube-proxy

All worker nodes run a daemon called kube-proxy, which watches the API server on the master node for the addition and removal of Services and endpoints. In the example below, for each new Service, on each node, kube-proxy configures iptables rules to capture the traffic for its ClusterIP and forwards it to one of the Service's endpoints. Therefore any node can receive the external traffic and then route it internally in the cluster based on the iptables rules. When the Service is removed, kube-proxy removes the corresponding iptables rules on all nodes as well.

![](images/kubeproxy.png)

##### Service Discovery

1. Environment Variables
2. DNS

##### Service Type

Access scope is decided by ServiceType, which can be configured when creating the Service.

**ClusterIP and NodePort**

ClusterIP is the default ServiceType. A Service receives a Virtual IP address, known as its ClusterIP. This Virtual IP address is used for communicating with the Service and is accessible only within the cluster.

With the NodePort ServiceType, in addition to a ClusterIP, a high-port, dynamically picked from the default range 30000-32767, is mapped to the respective Service, from all the worker nodes.

The NodePort ServiceType is useful when we want to make our Services accessible from the external world. The end-user connects to any worker node on the specified high-port, which proxies the request internally to the ClusterIP of the Service, then the request is forwarded to the applications running inside the cluster.

**Load Balance**
With the LoadBalancer ServiceType:

- NodePort and ClusterIP are automatically created, and the external load balancer will route to them
- The Service is exposed externally using the underlying cloud provider's load balancer feature.
- The Service is exposed at a static port on each worker node

**ExternalIP**
A Service can be mapped to an ExternalIP address if it can route to one or more of the worker nodes. Traffic that is ingressed into the cluster with the ExternalIP (as destination IP) on the Service port, gets routed to one of the Service endpoints. This type of service requires an external cloud provider such as Google Cloud Platform or AWS.

![](images/ExternalIP.png)

**ExternalName**

ExternalName is a special ServiceType, that has no Selectors and does not define any endpoints. When accessed within the cluster, it returns a CNAME record of an externally configured Service.

The primary use case of this ServiceType is to make externally configured Services like my-database.example.com available to applications inside the cluster. If the externally defined Service resides within the same Namespace, using just the name my-database would make it available to other applications and Services within that same Namespace.
