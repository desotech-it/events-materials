terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

resource "aws_dynamodb_table" "highscore" {
  name           = "highscore"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "UUID"
  range_key      = "Score"

  attribute {
    name = "UUID"
    type = "S"
  }

  attribute {
    name = "Score"
    type = "N"
  }
}
