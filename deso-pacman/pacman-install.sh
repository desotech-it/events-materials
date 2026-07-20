#!/bin/sh

kubectl create namespace pacman
kubectl apply -n pacman -f security/rbac.yaml
kubectl apply -n pacman -f security/secret.yaml
kubectl apply -n pacman -f deployments/pacman-deployment.yaml
kubectl apply -n pacman -f services/pacman-service.yaml
