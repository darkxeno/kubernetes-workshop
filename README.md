# kubernetes-workshop
A workshop for Kubernetes beginners

## Requirements

- A computer
- Basic knowledge about docker
- Recent [docker](https://store.docker.com/search?type=edition&offering=community) version >= 18.06
(Docker -> Preferences -> Enable Kubernetes -> Apply)
![](/_s/_s/docker-setup.png)

## NodeJS App Image versions

*darkxeno/nodejs-pod:0.9.0* => no healthchecks

*darkxeno/nodejs-pod:1.0.0* => healthchecks without db reconnect

*darkxeno/nodejs-pod:1.1.0* => healthchecks with db reconnect

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
# kubectl apply -f manifest.yaml (creates or updates kubernetes entities)
# kubectl create -f manifest.yaml (creates kubernetes entities)
# kubectl describe resourceType resourceId (gets all the info about an entity / helps on troubleshooting ) ex: kubectl describe pod nodejs-pod-xxxx

kubectl apply -f nodejs-deployment.yaml
kubectl get pods
kubectl logs nodejs-deployment-xxx
```
	
- Scale in / out the deployment, delete / fail one replica pod
```
kubectl scale deployment nodejs-deployment --replicas=0
kubectl scale deployment nodejs-deployment --replicas=6
```
- Delete one pod
```
kubectl delete pod ...
```

## Services
Definition: A way to expose endpoints and make them discoverable (internally / externally, "like" a round robin DNS entry)

[Documentation](https://kubernetes.io/docs/concepts/services-networking/service/)

*TYPES* 

ClusterIP: the port is open through an virtual ip that allows internal k8s access

NodePort: the same static port is open on all the nodes, allows access from k8s or node processes

LoadBalancer: the port is open and balanced to all the nodes to allow external access

Headless: same as clusterIP by without IP, only DNS entry

ExternalName: only a DNS entry is added to the service (CNAME)

- Create a service using the [template](/services/nodejs-service.yaml)
- Check services / endpoints
``` 
kubectl get services
kubectl get endpoints
```
- Consume the service
```
curl -X POST 127.0.0.1:3000 -H "Content-Type:application/json" -d '{"test":true}'
open browser at:  localhost:3000
```
- Fail one pod using the service (end process)
```
curl localhost:3000/exit
```

## Statefulsets

Definition: Stateful ordered pods with persistent storage. (distributed databases)

Usage: state layer

[Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

- Create a statefulset + service with the [template](/statefulsets/mongodb-statefulset.yaml) (Docker image: darkxeno/mongodb-statefulset:4.1.3)
``` 
kubectl get statefulsets
kubectl get pods
```

## Health checks

Definition: A way to verify and control the correct working status of a pod

Types: Readyness and liveness probes

[Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)

- Add a readiness healthcheck [GET /is-ready] (check [template](/deployments/nodejs-deployment-with-health-checks.yaml))
- Add a liveness healthcheck [GET /is-alive]
- Release a new nodejs app version (change image on the template to: docker.io/darkxeno/nodejs-pod:1.0.0)
- See how the rolling update works and the how the state of the pods changes
```
watch -n 1 kubectl get pods
```
- Disconnect one pod from mongodb and see how the status changes
```
curl localhost:3000/disconnect
```

## Fault tolerance

- Release a new nodejs app version (change image on the template to: docker.io/darkxeno/nodejs-pod:1.1.0) supports auto-reconnect
- Simulate a db failure (delete service and delete mongodb pod)
```
kubectl delete service ...
kubectl delete pod ...
```
- See how the state of the pods changes
```
watch -n 1 kubectl get pods
```
- Test service downtime
```
curl localhost:3000
```
- Recover the db service
```
kubectl apply -f [mongodb-xxx.yaml]
```

## [Extra] Statefulset persistent storage

- Have a look on the volumeClaimTemplates and volumeMounts fields on the [template](/statefulsets/mongodb-statefulset-with-persistent-storage.yaml)
- Deploy the template and check the volumes

NOTE: statefulsets needs to be delete in order to be updated
```
kubectl get pvc
kubectl get pv
```

## [Extra] Configmaps and Secrets

Definition: tools to provide additional configuration or credentials to the pods
NOTE: statefulsets needs to be delete in order to be updated
- Create a configmap for DB configuration
```
kubectl apply -f ./configmaps/mongodb-configmap.yaml
```
- Configure the pods to use the configmap [template](/statefulsets/mongodb-with-config-map.yaml)
```
kubectl apply -f ./statefulsets/mongodb-statefulset-with-config-map.yaml
```
- Verify the config on the pod
```
kubectl exec -ti mongodb-0 cat /data/configdb/mongo.conf
```
- [exercise] create a secret for db authentication

## [Extra] Kubernetes dashboard

- Deploy the kubernetes dashboard
```
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
kubectl proxy
```
- Navigate to [dashboard](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/)

- Select the kubeconfig file at `~/.kube/config` or SKIP
