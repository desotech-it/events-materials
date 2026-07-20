#!/bin/bash

kubectl delete -n pacman -f security/rbac.yaml
kubectl delete -n pacman -f security/secret.yaml
kubectl delete -n pacman -f deployments/pacman-deployment.yaml
kubectl delete -n pacman -f services/pacman-service.yaml
kubectl delete namespace pacman
