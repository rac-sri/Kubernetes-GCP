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

#### The Cloud Native Computing Foundation (CNCF)

CNCF is one of the projects hosted by the Linux Foundation. CNCF aims to accelerate the adoption of containers, microservices, and cloud-native applications.

CNCF hosts a multitude of projects, with more to be added in the future. CNCF provides resources to each of the projects, but, at the same time, each project continues to operate independently under its pre-existing governance structure and with its existing maintainers. Projects within CNCF are categorized based on achieved status: Sandbox, Incubating, and Graduated. At the time this course was created, there were six projects with Graduated status (Kubernetes) and many more still Incubating and in the Sandbox.

### Table Of Content

1.  [Architecture](1.Architecture.md)
2.  [Installation](2.Installation.md)
3.  [Minikube](3.Minikube.md)
4.  [Kubernetes Building Blocks](4.KubernetesBuildingBlocks.md)
5.  [Authentication](5.Authentication.md)
6.  [Services](6.Services.md)
7.  [Authentication](7.Authentication.md)
8.  [Volume Management](8.VolumeManagement.md)
9.  [Secretes](9.Secrets.md)
