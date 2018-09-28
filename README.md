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
- Workers: workload placeholders (container runners)

## Pods
Definition: Set of containers running on the same IP (shared network)

Usage: application layer

[Pods Documentation](https://kubernetes.io/docs/concepts/workloads/pods/pod/)

- Create a pod by filling a deployment [template](/deployments/nodejs-deployment.yaml)
	- Docker image: [docker.io/darkxeno/nodejs-pod:0.9.0](https://hub.docker.com/r/darkxeno/nodejs-pod/tags/)
	- [Deployment Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
```
kubectl apply -f nodejs-deployment.yaml
kubectl get pods
```
	
- Scale in / out the deployment, delete / fail one replica pod
```
kubectl scale deployment nodejs-deployment --replicas=0
kubectl scale deployment nodejs-deployment --replicas=6
```


## Services
Definition: A way to expose endpoints and make them discoverable (internally / externally, "like" a round robin DNS entry)

[Documentation](https://kubernetes.io/docs/concepts/services-networking/service/)

Types: ClusterIP, NodePort, LoadBalancer, Headless, ExternalName, ...

- Create a service using the [template](/services/nodejs-service.yaml)
- Check services / endpoints
``` 
kubectl get services
kubectl get endpoints
```
- Consume the service
```
curl -X POST 127.0.0.1:3000 -H "Content-Type:application/json" -d '{"test":true}'
```

## Statefulsets

Definition: Stateful ordered pods with persistent storage. (distributed databases)

Usage: state layer

[Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

- Create a statefulset + service with the [template](/statefulset/mongodb-statefulset.yaml) (Docker image: darkxeno/mongodb-statefulset:4.1.3)
``` 
kubectl get statefulsets
kubectl get pods
```

## Health checks (liveness and readiness)

Definition: A way to verify and control the correct working status of a pod

Types: Readyness and liveness probes

[Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)

- Add a readiness healthcheck (check [template](/deployments/nodejs-deployment-with-health-checks.yaml))
- Add a liveness healthcheck
- Release a new nodejs app version (change image on the template to: docker.io/darkxeno/nodejs-pod:1.0.0)
- See how the rolling update works and the how the state of the pods changes
```
watch -n 1 kubectl get pods
```

## Fault tolerance (cut db services, test reconnection)

- Simulate a db failure (delete service and delete mongodb pod)
```
kubectl delete service ...
kubectl delete pod ...
```
- See how the state of the pods changes
```
watch -n 1 kubectl get pods
```
- Recover the db service
```
kubectl apply -f [service.yaml]
```

## [Extra] Statefulset persistent storage

- Have a look on the volumeClaimTemplates and volumeMounts fields on the [template](/statefulsets/mongodb-statefulset-with-persistent-storage.yaml)
- Deploy the template and check the volumes
```
kubectl get pvc
kubectl get pv
```

## [Extra] Secrets and Configmaps

- Create a configmap for DB configuration
- Configure the pods to use the configmap
- [exercise] create a secret for db authentication

## [Extra] Kubernetes dashboard

- Deploy the kubernetes dashboard
- Navigate...
