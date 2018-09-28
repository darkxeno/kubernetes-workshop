# kubernetes-workshop
A workshop for Kubernetes beginners

## Requirements

- A computer
- Recent [docker](https://store.docker.com/search?type=edition&offering=community) version >= 18.06
(Docker -> Preferences -> Enable Kubernetes -> Apply)
![](/_s/_s/images/docker-setup.png)

- Basic knowledge about docker

## Nodes
Definition: machines part of the kubernetes cluster

[Documentation](https://kubernetes.io/docs/concepts/architecture/nodes/)

- Master: kubernetes API server, nodes membership and metrics
- Workers: workload placeholders (pod runners)

## Pods
Definition: Set of containers running on the same IP (shared network)

Usage: application layer

[Documentation](https://kubernetes.io/docs/concepts/workloads/pods/pod/)

- Create a pod by filling a deployment [template](/deployments/nodejs-deployment.yaml)
	- Docker image: docker.io/darkxeno/nodejs-pod:0.9.0
	- [Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
	
- Scale in / out the deployment, delete / fail one replica pod
```
kubectl scale deployment nodejs-deployment --replicas=0
kubectl scale deployment nodejs-deployment --replicas=6
```


## Services (types)
Definition: A way to expose endpoints and make them discoverable (internally / externally, "like" a round robin DNS entry)

[Documentation](https://kubernetes.io/docs/concepts/services-networking/service/)

Types: ClusterIP, NodePort, LoadBalancer, Headless, ExternalName, ...

- Create a service
- Check endpoints
- Consume a service
```
curl -X POST 127.0.0.1:3000 -H "Content-Type:application/json" -d '{"test":true}'
```

## Statefulsets

Definition: Stateful ordered pods with persistent storage. (distributed databases)

Usage: state layer

[Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

- Create a statefulset (Docker image: darkxeno/mongodb-statefulset:4.1.3)
- Add a service for the statefulset

## Health checks (liveness and readiness)

Definition: A way to verify and control the correct working status of a pod

Types: Readyness and liveness probes

[Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)

- Add a readiness healthcheck
- Add a liveness healthcheck
- Release a new version (rolling update to: docker.io/darkxeno/nodejs-pod:1.0.0)

## Fault tolerance (cut db services, test reconnection)

- Simulate a db failure (delete service and delete pod)
- See how the state of the pods changes
- Recover the db

## [Extra] Secrets and Configmaps

- Create a secret for DB authentication
- Configure the pods to use the secret

## [Extra] Kubernetes dashboard

- Deploy the kubernetes dashboard
- Navigate...
