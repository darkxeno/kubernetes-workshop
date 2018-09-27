# kubernetes-workshop
A workshop for Kubernetes beginners

## Requirements

	- A computer
	- Recent docker version >= 18.06 (https://store.docker.com/search?type=edition&offering=community)
	-> Docker -> Preferences -> Enable Kubernetes -> Apply 
	- Basic knowledge about docker

## Nodes
	Definition: machines part of the kubernetes cluster
	Doc: https://kubernetes.io/docs/concepts/architecture/nodes/

	Master: kubernetes API server, nodes membership and metrics
	Workers: workload placeholders (pod runners)

## Pods
	Definition: Set of containers running on the same IP (shared network)
	Usage: application layer
	Doc: https://kubernetes.io/docs/concepts/workloads/pods/pod/

	- Create a pod by filling a deployment template https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
	- Scale in / out the deployment, delete / fail one replica pod
	- Release a new version (rolling updates)

## Services (types)
	Definition: A way to expose endpoints and make them discoverable (internally / externally, "like" a round robin DNS entry)
	Doc: https://kubernetes.io/docs/concepts/services-networking/service/
	Types: ClusterIP, NodePort, LoadBalancer, Headless, ExternalName, ...

	- Create a service
	- Check endpoints
	- Consume service

## Statefulsets

	Definition: Stateful ordered pods with persistent storage. (distributed databases) 
	Usage: state layer
	Doc: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/

	- Create a statefulset
	- Add a service for the statefulset

## Health checks (liveness and readiness)

	Definition: A way to verify and control the correct working status of a pod
	Types: Readyness and liveness probes
	Doc: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/

	- Add a readiness healthcheck
	- Add a liveness healthcheck

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
