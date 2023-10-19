packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string

  default = "ami-06db4d78cb1d3bbf9"

}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string

  default = "subnet-0b5dea5592acc5f26"

}

variable "ami_region_list" {
  type    = list(string)
  default = ["us-east-1"]
}

variable "ami_users_list" {
  type    = list(string)

  default = ["785899790696", "189917391871"]

}

variable "DB_USERNAME" {
  description = "The database username"
  type        = string
}

variable "DB_PASSWORD" {
  description = "The database password"
  type        = string
}

variable "DB_HOST" {
  description = "The database host"
  type        = string
}

variable "DB_DIALECT" {
  description = "The database dialect"
  type        = string
}

variable "DB_PORT" {
  description = "The database port"
  type        = string
}

variable "DB_NAME" {
  description = "The database name"
  type        = string
}

variable "PORT" {
  description = "Port number for the application"
  type        = string
}

variable "ENV_TYPE" {
  description = "Environment type"
  type        = string
}


# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_regions     = "${var.ami_region_list}"
  ami_users       = "${var.ami_users_list}"

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "shell" {
    inline = [
      "sudo mkdir -p /opt",
      "chmod u+w /home/admin",
      "sudo chown admin:admin /opt",
      "sudo chmod 755 /opt",
      "sudo chown -R admin:admin /usr/local/",
      "sudo chmod -R 755 /usr/local/"
    ]
  }

  provisioner "file" {
    destination = "/home/admin/webapp.zip"
    source      = "./webapp.zip"
  }

  provisioner "file" {
    destination = "/opt/users.csv"
    source      = "opt/users.csv"
  }
  provisioner "file" {
    destination = "/opt/start_up.sh"
    source      = "scripts/start.sh"
  }
  provisioner "shell" {
    inline = [
      "sudo chmod +x /opt/start_up.sh"
    ]
  }
  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "aws_region=${var.aws_region}",
      "DB_USERNAME=${var.DB_USERNAME}",
      "DB_PASSWORD=${var.DB_PASSWORD}",
      "DB_HOST=${var.DB_HOST}",
      "DB_DIALECT=${var.DB_DIALECT}",
      "DB_PORT=${var.DB_PORT}",
      "DB_NAME=${var.DB_NAME}",
      "PORT=${var.PORT}",
      "ENV_TYPE=${var.ENV_TYPE}"
    ]
    scripts = ["./scripts/start.sh"]
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }
}