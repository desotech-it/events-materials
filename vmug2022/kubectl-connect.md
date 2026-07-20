# Connect to the cluster:

```
kubectl config get-contexts
```

> ```
> CURRENT   NAME   CLUSTER   AUTHINFO   NAMESPACE
> ```

```
APISERVER=https://10.10.7.4:6443
```

```
kubectl config set-cluster \
deso-prd \
--server=$APISERVER 
```

> ```
> Cluster "deso-prd" set.
> ```

```
ClusterCACertificate=DATA+OMITTED
```

```
kubectl config set clusters.deso-prd.certificate-authority-data $ClusterCACertificate
```

> ```
> Property "clusters.deso-prd.certificate-authority-data" set.
> ```


```
kubectl config get-clusters
```

> ```
> NAME
> deso-prd
> ```

```
TOKEN=DATA+OMITTED
```

```
kubectl config set-credentials deso-admin --token=$TOKEN
```

> ```
> User "deso-admin" set.
> ```

```
kubectl config get-users
```

> ```
> NAME
> deso-admin
> ```

```
kubectl config set-context \
deso-prd-context \
--namespace=default \
--cluster=deso-prd \
--user=deso-admin
```

> ```
> Context "deso-prd-context" created.
> ```

```
kubectl config get-contexts
```

> ```
> CURRENT   NAME               CLUSTER    AUTHINFO     NAMESPACE
>           deso-prd-context   deso-prd   deso-admin   default
> ```
> 
```
kubectl config use-context deso-prd-context
```

> ```
> Switched to context "deso-prd-context".
> ```


```
kubectl get nodes
```

> ```
> NAME                                             STATUS   ROLES                  AGE   VERSION
> tkgs-wncr8m1cr9-control-plane-6sttt              Ready    control-plane,master   54m   v1.22.9+vmware.1
> tkgs-wncr8m1cr9-control-plane-7ghtq              Ready    control-plane,master   57m   v1.22.9+vmware.1
> tkgs-wncr8m1cr9-control-plane-dhxc2              Ready    control-plane,master   52m   v1.22.9+vmware.1
> tkgs-wncr8m1cr9-workers-tgrj8-7d7c55b55d-9qbs2   Ready    <none>                 55m   v1.22.9+vmware.1
> tkgs-wncr8m1cr9-workers-tgrj8-7d7c55b55d-n2gq4   Ready    <none>                 55m   v1.22.9+vmware.1
> ```

```
kubectl create deploy whoami --image=r.deso.tech/whoami/whoami:latest
```

> ```
> deployment.apps/whoami created
> ```

```
kubectl get deploy
```

> ```
> NAME     READY   UP-TO-DATE   AVAILABLE   AGE
> whoami   1/1     1            1           8s
> ```

```
kubectl expose deploy whoami --type=LoadBalancer --port=80
```

> ```
> service/whoami exposed
> ```

```
kubectl get svc whoami
```

> ```
> NAME     TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
> whoami   LoadBalancer   10.107.154.114   10.10.7.6     80:30583/TCP   7s
> ```



